"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BuildSheet } from "@/components/BuildSheet";
import { Field, Result, SelectInput, TextInput, ToolFrame } from "@/components/Fields";
import { CabinetPictures } from "@/components/plans/CabinetPictures";
import { ShakerPictures } from "@/components/plans/ShakerPictures";
import { doorPlan, hingeAdvice, shakerPlan, type FitStyle, type ShakerBuild } from "@/lib/cabinet";
import { formatInches, parseInches } from "@/lib/measure";

const FIT_OPTIONS: { id: string; label: string; fit: FitStyle; amount: string }[] = [
  { id: "full", label: "Full overlay (covers the face frame)", fit: "reveal", amount: "0" },
  { id: "r16", label: '1/16" reveal', fit: "reveal", amount: "1/16" },
  { id: "r8", label: '1/8" reveal', fit: "reveal", amount: "1/8" },
  { id: "r4", label: '1/4" reveal', fit: "reveal", amount: "1/4" },
  { id: "o12", label: '1/2" overlay (standard face-frame)', fit: "overlay", amount: "1/2" },
  { id: "o38", label: '3/8" overlay', fit: "overlay", amount: "3/8" },
  { id: "in16", label: 'Inset, 1/16" gap', fit: "inset", amount: "1/16" },
  { id: "in8", label: 'Inset, 1/8" gap', fit: "inset", amount: "1/8" },
  { id: "custom", label: "Custom amount", fit: "reveal", amount: "1/8" },
];

const STYLES: { id: string; label: string; stile: string; rail: string; shaker: boolean }[] = [
  { id: "slab", label: "Flat slab (no frame)", stile: "3/4", rail: "3/4", shaker: false },
  { id: "micro", label: 'Micro shaker — 3/4" frame', stile: "3/4", rail: "3/4", shaker: true },
  { id: "narrow", label: 'Narrow — 1" frame', stile: "1", rail: "1", shaker: true },
  { id: "slim", label: 'Slim shaker — 1 1/4" frame', stile: "1 1/4", rail: "1 1/4", shaker: true },
  { id: "classic", label: 'Classic shaker — 2 1/4" frame', stile: "2 1/4", rail: "2 1/4", shaker: true },
  { id: "wide", label: 'Wide shaker — 2 1/2" frame', stile: "2 1/2", rail: "2 1/2", shaker: true },
  { id: "custom", label: "Custom shaker frame", stile: "3/4", rail: "3/4", shaker: true },
];

export function CabinetDoorCalc() {
  return (
    <Suspense fallback={<p className="text-ink-soft">Loading door planner…</p>}>
      <CabinetDoorInner />
    </Suspense>
  );
}

function CabinetDoorInner() {
  const search = useSearchParams();
  const fromShaker = Boolean(search.get("w") && search.get("h"));
  const [measure, setMeasure] = useState<"opening" | "overall" | "finished">(fromShaker ? "finished" : "opening");
  const [openingW, setOpeningW] = useState(search.get("w") ?? "21");
  const [openingH, setOpeningH] = useState(search.get("h") ?? "30");
  const [stile, setStile] = useState("1 1/2");
  const [rail, setRail] = useState("1 1/2");
  const [preset, setPreset] = useState("r8");
  const [customFit, setCustomFit] = useState<FitStyle>("reveal");
  const [customAmount, setCustomAmount] = useState("1/8");
  const [doors, setDoors] = useState("1");
  const [midGap, setMidGap] = useState("1/8");
  const [style, setStyle] = useState(fromShaker ? "micro" : "slab");
  const [customStile, setCustomStile] = useState("3/4");
  const [customRail, setCustomRail] = useState("3/4");
  const [build, setBuild] = useState<ShakerBuild>("applied-miter");
  const [groove, setGroove] = useState("3/8");
  const [float, setFloat] = useState("1/16");
  const [thickness, setThickness] = useState("3/4");

  const selected = FIT_OPTIONS.find((item) => item.id === preset) ?? FIT_OPTIONS[2];
  const fit = preset === "custom" ? customFit : selected.fit;
  const amountText = preset === "custom" ? customAmount : selected.amount;
  const doorStyle = STYLES.find((item) => item.id === style) ?? STYLES[0];
  const frameStile = style === "custom" ? customStile : doorStyle.stile;
  const frameRail = style === "custom" ? customRail : doorStyle.rail;

  const plan = useMemo(() => {
    const rawW = parseInches(openingW);
    const rawH = parseInches(openingH);
    const st = parseInches(stile);
    const ra = parseInches(rail);
    const amt = parseInches(amountText);
    const gap = parseInches(midGap) ?? 1 / 8;
    if (rawW === null || rawH === null || st === null || ra === null || amt === null) return null;
    if (measure === "finished") {
      const doorCount = doors === "2" ? 2 : 1;
      return {
        openingW: rawW,
        openingH: rawH,
        stile: st,
        rail: ra,
        overallW: rawW,
        overallH: rawH,
        overlayX: 0,
        overlayY: 0,
        revealX: 0,
        revealY: 0,
        doorW: rawW,
        doorH: rawH,
        doorCount,
        midGap: doorCount === 2 ? gap : 0,
        doors: Array.from({ length: doorCount }, () => ({ width: rawW, height: rawH })),
      };
    }
    const ow = measure === "overall" ? rawW - st * 2 : rawW;
    const oh = measure === "overall" ? rawH - ra * 2 : rawH;
    return doorPlan({
      openingW: ow,
      openingH: oh,
      stile: st,
      rail: ra,
      fit,
      amount: amt,
      doorCount: doors === "2" ? 2 : 1,
      midGap: gap,
    });
  }, [openingW, openingH, stile, rail, fit, amountText, doors, midGap, measure]);

  const hinges = plan ? hingeAdvice(plan) : null;
  const finishedW = measure === "finished" ? parseInches(openingW) : plan?.doorW;
  const finishedH = measure === "finished" ? parseInches(openingH) : plan?.doorH;

  const shaker = useMemo(() => {
    if (!doorStyle.shaker || finishedW == null || finishedH == null) return null;
    return shakerPlan({
      doorW: finishedW,
      doorH: finishedH,
      stileW: parseInches(frameStile) ?? 0.75,
      railW: parseInches(frameRail) ?? 0.75,
      build,
      grooveDepth: parseInches(groove) ?? 0.375,
      float: parseInches(float) ?? 1 / 16,
      stockThickness: parseInches(thickness) ?? 0.75,
    });
  }, [doorStyle.shaker, finishedW, finishedH, frameStile, frameRail, build, groove, float, thickness]);

  const cutRows = plan
    ? [
        ...(shaker
          ? shaker.parts.map((part) => ({
              name: part.name,
              qty: part.qty,
              size: `${part.thickness} × ${formatInches(part.width)} × ${formatInches(part.length)}`,
              note: part.note,
            }))
          : plan.doors.map((door, index) => ({
              name: plan.doorCount === 1 ? "Door" : `Door ${index === 0 ? "left" : "right"}`,
              qty: 1,
              size: `${formatInches(door.width)} × ${formatInches(door.height)} × 3/4"`,
              note: `${formatInches(plan.overlayX)} overlay · ${formatInches(plan.revealX)} reveal`,
              kind: "door" as const,
            }))),
        ...(hinges
          ? [
              {
                name: "Hinges",
                qty: hinges.count * plan.doorCount,
                size: hinges.cup,
                note: `${hinges.tab}. ${hinges.traditional}.`,
                kind: "hinge" as const,
              },
            ]
          : []),
      ]
    : [];

  const steps = [
    { id: "measure", text: "Measure the opening twice. Write it on a story stick or painter’s tape." },
    { id: "cut", text: "Cut the door(s). Leave the mid-gap on a pair — do not sneak up on it later." },
    ...(shaker
      ? build === "applied-miter"
        ? [
            { id: "slab", text: "The door size is the slab. Rip stiles and rails and cut 45° miters — long point is the full door width or height." },
            { id: "glue", text: "Glue the frame onto the slab. Tape or pin the corners. Check the diagonals." },
          ]
        : build === "applied-butt"
          ? [
              { id: "frame", text: "Stiles run the full height. Rails fit between them. Glue the frame onto the face." },
            ]
          : [
              { id: "cope", text: "Stick the stiles, cope the rails, cut the panel with groove + float. Glue only the frame joints." },
            ]
      : []),
    ...(hinges
      ? [
          {
            id: "cups",
            text: "Bore 35mm cups 3–6mm from the hinge edge, 13.5mm deep.",
            detail: `Centers from the top: ${hinges.centers.map((y) => formatInches(y)).join(" · ")}`,
          },
          { id: "hang", text: "Hang on the face-frame plate. Split the overlay evenly, then set the mid-gap." },
        ]
      : []),
  ];

  return (
    <ToolFrame
      title="Cabinet doors"
      description="Opening to finished door, then the shaker frame if you want one. Overlay, reveal, or inset — plus which hinges to buy and the stile/rail/panel cuts."
      results={
        plan && hinges ? (
          <>
            <Result
              label={plan.doorCount === 2 ? "Each door" : "Door size"}
              value={`${formatInches(measure === "finished" ? finishedW ?? plan.doorW : plan.doorW)} × ${formatInches(measure === "finished" ? finishedH ?? plan.doorH : plan.doorH)}`}
              note={plan.doorCount === 2 ? `${formatInches(plan.midGap)} gap between the pair.` : "Single door."}
            />
            <Result
              label={fit === "inset" ? "Gap around door" : "Overlay on the frame"}
              value={formatInches(fit === "inset" ? plan.revealX : plan.overlayX)}
              note={
                measure === "finished"
                  ? "You typed the finished door. Overlay below is from the face-frame sizes."
                  : fit === "inset"
                    ? "Door sits inside the opening."
                    : `${formatInches(plan.revealX)} of stile stays visible on each side.`
              }
            />
            <Result label="Hinges" value={`${hinges.count} × 35mm`} note={hinges.euro} />
            {shaker ? (
              <Result
                label="Shaker panel"
                value={`${formatInches(shaker.panelW)} × ${formatInches(shaker.panelH)}`}
                note={`Stiles 2 @ ${formatInches(shaker.stileW)} × ${formatInches(shaker.stileLength)}. Rails 2 @ ${formatInches(shaker.railW)} × ${formatInches(shaker.railLength)}.`}
              />
            ) : null}
          </>
        ) : (
          <Result label="Need an opening" value="—" note="Use fractions like 21 or 1 1/2." />
        )
      }
      printFacts={
        plan && hinges
          ? [
              {
                label: plan.doorCount === 2 ? "Each door" : "Door size",
                value: `${formatInches(measure === "finished" ? finishedW ?? plan.doorW : plan.doorW)} × ${formatInches(measure === "finished" ? finishedH ?? plan.doorH : plan.doorH)}`,
                note: plan.doorCount === 2 ? `${formatInches(plan.midGap)} pair gap` : undefined,
              },
              {
                label: fit === "inset" ? "Gap" : "Overlay",
                value: formatInches(fit === "inset" ? plan.revealX : plan.overlayX),
                note: `${formatInches(plan.revealX)} reveal`,
              },
              { label: "Hinges", value: `${hinges.count * plan.doorCount} × 35mm`, note: hinges.euro },
              ...(shaker
                ? [
                    {
                      label: "Panel",
                      value: `${formatInches(shaker.panelW)} × ${formatInches(shaker.panelH)}`,
                    },
                  ]
                : []),
            ]
          : undefined
      }
      printRows={cutRows}
      printSteps={steps.map(({ text, detail }) => ({ text, detail }))}
      plan={
        plan && hinges ? (
          <>
            {measure !== "finished" ? <CabinetPictures plan={plan} hinges={hinges} /> : null}
            {shaker ? <ShakerPictures plan={shaker} build={build} /> : null}
            <BuildSheet storageKey="storystick-cuts-cabinet-doors" rows={cutRows} steps={steps} />
            <div className="border border-rule px-4 py-3 text-sm leading-6 text-ink-soft">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-shellac">Hinge plan</p>
              <p className="mt-2">{hinges.note}</p>
              <p className="mt-2 font-mono text-ink">
                Cup centers from top of door: {hinges.centers.map((y) => formatInches(y)).join(" · ")}
              </p>
            </div>
          </>
        ) : null
      }
    >
      <Field label="What you measured">
        <SelectInput value={measure} onChange={(value) => setMeasure(value as "opening" | "overall" | "finished")}>
          <option value="opening">Inside opening (between the face frame)</option>
          <option value="overall">Outside of the face frame</option>
          <option value="finished">Finished door size (skip overlay math)</option>
        </SelectInput>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={measure === "overall" ? "Face-frame width" : measure === "finished" ? "Door width" : "Opening width"}
          hint={measure === "overall" ? "outside to outside" : measure === "finished" ? "finished" : "inside the face frame"}
        >
          <TextInput value={openingW} onChange={setOpeningW} />
        </Field>
        <Field label={measure === "overall" ? "Face-frame height" : measure === "finished" ? "Door height" : "Opening height"}>
          <TextInput value={openingH} onChange={setOpeningH} />
        </Field>
        {measure !== "finished" ? (
          <>
            <Field label="Stile width" hint="left / right frame">
              <TextInput value={stile} onChange={setStile} />
            </Field>
            <Field label="Rail width" hint="top / bottom frame">
              <TextInput value={rail} onChange={setRail} />
            </Field>
          </>
        ) : null}
      </div>
      {measure !== "finished" ? (
        <>
          <Field label="How the door sits">
            <SelectInput
              value={preset}
              onChange={(value) => {
                setPreset(value);
                const next = FIT_OPTIONS.find((item) => item.id === value);
                if (next && value !== "custom") {
                  setCustomFit(next.fit);
                  setCustomAmount(next.amount);
                }
              }}
            >
              {FIT_OPTIONS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </SelectInput>
          </Field>
          {preset === "custom" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Measure">
                <SelectInput value={customFit} onChange={(value) => setCustomFit(value as FitStyle)}>
                  <option value="reveal">Reveal of face frame</option>
                  <option value="overlay">Overlay onto frame</option>
                  <option value="inset">Inset gap</option>
                </SelectInput>
              </Field>
              <Field label="Amount">
                <TextInput value={customAmount} onChange={setCustomAmount} />
              </Field>
            </div>
          ) : null}
        </>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Doors on this opening">
          <SelectInput value={doors} onChange={setDoors}>
            <option value="1">Single door</option>
            <option value="2">Pair of doors</option>
          </SelectInput>
        </Field>
        {doors === "2" ? (
          <Field label="Gap between doors">
            <TextInput value={midGap} onChange={setMidGap} />
          </Field>
        ) : null}
      </div>
      <Field label="Door style">
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
      {doorStyle.shaker ? (
        <>
          {style === "custom" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Door stile" hint="vertical">
                <TextInput value={customStile} onChange={setCustomStile} />
              </Field>
              <Field label="Door rail" hint="horizontal">
                <TextInput value={customRail} onChange={setCustomRail} />
              </Field>
            </div>
          ) : null}
          <Field label="How you build the frame">
            <SelectInput value={build} onChange={(value) => setBuild(value as ShakerBuild)}>
              <option value="applied-miter">Applied mitered frame on a slab</option>
              <option value="applied-butt">Applied frame, stiles through / rails butt</option>
              <option value="cope">Cope-and-stick 5-piece (panel floats in a groove)</option>
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
        </>
      ) : null}
    </ToolFrame>
  );
}
