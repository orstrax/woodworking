"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Field, Result, SelectInput, TextInput, ToolFrame } from "@/components/Fields";
import { ShakerPictures } from "@/components/plans/ShakerPictures";
import { CutList } from "@/components/ShopDrawing";
import { shakerPlan, type ShakerBuild } from "@/lib/cabinet";
import { formatInches, parseInches } from "@/lib/measure";

const STYLES: { id: string; label: string; stile: string; rail: string }[] = [
  { id: "micro", label: 'Micro shaker — 3/4" frame', stile: "3/4", rail: "3/4" },
  { id: "narrow", label: 'Narrow — 1" frame', stile: "1", rail: "1" },
  { id: "slim", label: 'Slim shaker — 1 1/4" frame', stile: "1 1/4", rail: "1 1/4" },
  { id: "classic", label: 'Classic shaker — 2 1/4" frame', stile: "2 1/4", rail: "2 1/4" },
  { id: "wide", label: 'Wide shaker — 2 1/2" frame', stile: "2 1/2", rail: "2 1/2" },
  { id: "custom", label: "Custom frame widths", stile: "3/4", rail: "3/4" },
];

export function ShakerDoorCalc() {
  return (
    <Suspense fallback={<p className="text-ink-soft">Loading shaker planner…</p>}>
      <ShakerDoorInner />
    </Suspense>
  );
}

function ShakerDoorInner() {
  const search = useSearchParams();
  const [doorW, setDoorW] = useState(search.get("w") ?? "24");
  const [doorH, setDoorH] = useState(search.get("h") ?? "30");
  const [style, setStyle] = useState("micro");
  const [customStile, setCustomStile] = useState("3/4");
  const [customRail, setCustomRail] = useState("3/4");
  const [build, setBuild] = useState<ShakerBuild>("cope");
  const [groove, setGroove] = useState("3/8");
  const [float, setFloat] = useState("1/16");
  const [thickness, setThickness] = useState("3/4");

  const preset = STYLES.find((item) => item.id === style) ?? STYLES[0];
  const stileText = style === "custom" ? customStile : preset.stile;
  const railText = style === "custom" ? customRail : preset.rail;

  const plan = useMemo(() => {
    const w = parseInches(doorW);
    const h = parseInches(doorH);
    const st = parseInches(stileText);
    const ra = parseInches(railText);
    const g = parseInches(groove) ?? 0.375;
    const f = parseInches(float) ?? 1 / 16;
    const t = parseInches(thickness) ?? 0.75;
    if (w === null || h === null || st === null || ra === null) return null;
    return shakerPlan({
      doorW: w,
      doorH: h,
      stileW: st,
      railW: ra,
      build,
      grooveDepth: g,
      float: f,
      stockThickness: t,
    });
  }, [doorW, doorH, stileText, railText, build, groove, float, thickness]);

  return (
    <ToolFrame
      title="Shaker door"
      description="Finished door size in, frame and panel out. Micro shaker, classic shaker, cope-and-stick, or an applied frame — with a cut list and a measured elevation."
      results={
        plan ? (
          <>
            <Result
              label="Visible center"
              value={`${formatInches(plan.visibleW)} × ${formatInches(plan.visibleH)}`}
              note="The slab you see inside the frame."
            />
            <Result
              label="Panel to cut"
              value={`${formatInches(plan.panelW)} × ${formatInches(plan.panelH)}`}
              note={
                build === "cope"
                  ? `Includes groove. ${formatInches(plan.float)} float each edge.`
                  : "Same as the finished door if the frame is applied on the face."
              }
            />
            <Result
              label="Stiles"
              value={`2 @ ${formatInches(plan.stileW)} × ${formatInches(plan.stileLength)}`}
            />
            <Result
              label="Rails"
              value={`2 @ ${formatInches(plan.railW)} × ${formatInches(plan.railLength)}`}
              note={build === "applied-miter" ? "Long-point length, 45° miters." : undefined}
            />
          </>
        ) : (
          <Result label="Need a door size" value="—" note="Frame is too wide for this door, or a field is empty." />
        )
      }
      plan={
        plan ? (
          <>
            <ShakerPictures plan={plan} build={build} />
            <CutList
              rows={plan.parts.map((part) => ({
                name: part.name,
                qty: part.qty,
                size: `${part.thickness} × ${formatInches(part.width)} × ${formatInches(part.length)}`,
                note: part.note,
              }))}
            />
          </>
        ) : null
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Finished door width">
          <TextInput value={doorW} onChange={setDoorW} />
        </Field>
        <Field label="Finished door height">
          <TextInput value={doorH} onChange={setDoorH} />
        </Field>
      </div>
      <Field label="Frame style">
        <SelectInput
          value={style}
          onChange={(value) => {
            setStyle(value);
            const next = STYLES.find((item) => item.id === value);
            if (next && value !== "custom") {
              setCustomStile(next.stile);
              setCustomRail(next.rail);
            }
          }}
        >
          {STYLES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </SelectInput>
      </Field>
      {style === "custom" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Stile width" hint="vertical">
            <TextInput value={customStile} onChange={setCustomStile} />
          </Field>
          <Field label="Rail width" hint="horizontal">
            <TextInput value={customRail} onChange={setCustomRail} />
          </Field>
        </div>
      ) : null}
      <Field label="How you build it">
        <SelectInput value={build} onChange={(value) => setBuild(value as ShakerBuild)}>
          <option value="cope">Cope-and-stick 5-piece (panel floats in a groove)</option>
          <option value="applied-miter">Applied mitered frame on a slab</option>
          <option value="applied-butt">Applied frame, stiles through / rails butt</option>
        </SelectInput>
      </Field>
      {build === "cope" ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Groove / tenon depth">
            <TextInput value={groove} onChange={setGroove} />
          </Field>
          <Field label="Panel float" hint="each edge">
            <TextInput value={float} onChange={setFloat} />
          </Field>
          <Field label="Frame thickness">
            <TextInput value={thickness} onChange={setThickness} />
          </Field>
        </div>
      ) : (
        <Field label="Stock thickness">
          <TextInput value={thickness} onChange={setThickness} />
        </Field>
      )}
    </ToolFrame>
  );
}
