"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BuildSheet } from "@/components/BuildSheet";
import { Field, Result, SelectInput, TextInput, ToolFrame } from "@/components/Fields";
import { CabinetBoxPictures } from "@/components/plans/CabinetBoxPictures";
import type { FitStyle, ShakerBuild } from "@/lib/cabinet";
import {
  CABINET_LAYOUTS,
  KIND_DEFAULTS,
  getLayout,
  layoutsFor,
  planCabinetBox,
  type CabinetKind,
  type Construction,
} from "@/lib/cabinetBox";
import { formatInches, parseInches } from "@/lib/measure";

const FIT_OPTIONS: { id: string; label: string; fit: FitStyle; amount: string }[] = [
  { id: "r8", label: '1/8" reveal', fit: "reveal", amount: "1/8" },
  { id: "r16", label: '1/16" reveal', fit: "reveal", amount: "1/16" },
  { id: "full", label: "Full overlay", fit: "reveal", amount: "0" },
  { id: "o12", label: '1/2" overlay', fit: "overlay", amount: "1/2" },
  { id: "in8", label: 'Inset, 1/8" gap', fit: "inset", amount: "1/8" },
];

export function CabinetBoxCalc() {
  return (
    <Suspense fallback={<p className="text-ink-soft">Loading cabinet builder…</p>}>
      <CabinetBoxInner />
    </Suspense>
  );
}

function CabinetBoxInner() {
  const search = useSearchParams();
  const startKind: CabinetKind = (() => {
    const fromQuery = asKind(search.get("kind"));
    if (fromQuery) return fromQuery;
    const layoutKind = getLayout(search.get("layout") ?? "")?.kind;
    return layoutKind === "upper" || layoutKind === "tall" || layoutKind === "base" ? layoutKind : "base";
  })();
  const [kind, setKind] = useState<CabinetKind>(startKind);
  const [layoutId, setLayoutId] = useState(search.get("layout") ?? "base-drawers-3");
  const [width, setWidth] = useState(search.get("w") ?? "36");
  const [height, setHeight] = useState(search.get("h") ?? KIND_DEFAULTS[startKind].height);
  const [depth, setDepth] = useState(search.get("d") ?? KIND_DEFAULTS[startKind].depth);
  const [construction, setConstruction] = useState<Construction>("face-frame");
  const [stile, setStile] = useState("1 1/2");
  const [rail, setRail] = useState("1 1/2");
  const [overhang, setOverhang] = useState("1/4");
  const [sideThick, setSideThick] = useState("3/4");
  const [backThick, setBackThick] = useState("1/4");
  const [dado, setDado] = useState("3/8");
  const [toeH, setToeH] = useState(KIND_DEFAULTS[startKind].toe);
  const [toeD, setToeD] = useState("3");
  const [fitId, setFitId] = useState("r8");
  const [midGap, setMidGap] = useState("1/8");
  const [slide, setSlide] = useState<"undermount" | "side">("undermount");
  const [shelves, setShelves] = useState(String(getLayout(search.get("layout") ?? "base-drawers-3")?.shelves ?? KIND_DEFAULTS[startKind].shelves));
  const [makeShaker, setMakeShaker] = useState("shaker");
  const [shakerBuild, setShakerBuild] = useState<ShakerBuild>("applied-miter");
  const [shakerStile, setShakerStile] = useState("3/4");
  const [shakerRail, setShakerRail] = useState("3/4");
  const [faceThick, setFaceThick] = useState("3/4");
  const [drawerStock, setDrawerStock] = useState("5/8");

  const available = layoutsFor(kind);
  const layout = getLayout(layoutId) ?? available[0] ?? CABINET_LAYOUTS[0];
  const fit = FIT_OPTIONS.find((item) => item.id === fitId) ?? FIT_OPTIONS[0];

  const overallW = parseInches(width);
  const overallH = parseInches(height);
  const overallD = parseInches(depth);
  const plan =
    overallW && overallH && overallD
      ? planCabinetBox({
          overallW,
          overallH,
          overallD,
          kind,
          construction,
          layout,
          stile: parseInches(stile) ?? 1.5,
          rail: parseInches(rail) ?? 1.5,
          overhang: parseInches(overhang) ?? 0.25,
          sideThick: parseInches(sideThick) ?? 0.75,
          backThick: parseInches(backThick) ?? 0.25,
          dado: parseInches(dado) ?? 0.375,
          toeH: parseInches(toeH) ?? 0,
          toeD: parseInches(toeD) ?? 3,
          stretcherW: 4,
          fit: fit.fit,
          amount: parseInches(fit.amount) ?? 0.125,
          midGap: parseInches(midGap) ?? 0.125,
          drawerGap: parseInches(midGap) ?? 0.125,
          slide,
          shelves: Math.max(0, Math.round(Number(shelves) || layout.shelves)),
          makeShaker: makeShaker === "shaker",
          shakerBuild,
          shakerStile: parseInches(shakerStile) ?? 0.75,
          shakerRail: parseInches(shakerRail) ?? 0.75,
          faceThick: parseInches(faceThick) ?? 0.75,
          drawerStock: parseInches(drawerStock) ?? 0.625,
        })
      : null;

  function changeKind(next: CabinetKind) {
    setKind(next);
    const defaults = KIND_DEFAULTS[next];
    setHeight(defaults.height);
    setDepth(defaults.depth);
    setToeH(defaults.toe);
    setShelves(String(defaults.shelves));
    const nextLayouts = layoutsFor(next);
    if (!nextLayouts.some((item) => item.id === layoutId)) {
      setLayoutId(nextLayouts[0]?.id ?? "base-drawers-3");
    }
  }

  function pickLayout(id: string) {
    const next = getLayout(id);
    if (!next) return;
    if (next.kind !== "any" && next.kind !== kind) {
      const defaults = KIND_DEFAULTS[next.kind];
      setKind(next.kind);
      setHeight(defaults.height);
      setDepth(defaults.depth);
      setToeH(defaults.toe);
    }
    setLayoutId(id);
    setShelves(String(next.shelves));
  }

  return (
    <ToolFrame
      title="Cabinet box"
      description="Pick a typical layout — a 36″ drawer base, a sink, an upper — then change any measurement. You get the plywood box, the face frame, doors or drawer boxes, a picture of the face, and a cut list you can check off."
      ticketClassName="print:hidden"
      results={
        plan ? (
          <>
            <Result
              label="The box"
              value={`${formatInches(plan.boxW)} × ${formatInches(plan.boxH)} × ${formatInches(plan.boxD)}`}
              note={
                plan.construction === "face-frame"
                  ? `Face is ${formatInches(plan.overallW)} wide. Box sits ${formatInches((plan.overallW - plan.boxW) / 2)} in from each stile.`
                  : "Frameless: the box is the overall size."
              }
            />
            <Result
              label="Inside"
              value={`${formatInches(plan.interiorW)} wide`}
              note={`Useful depth ${formatInches(plan.interiorD)}. Face opening height ${formatInches(plan.faceH)}.`}
            />
            <Result
              label="Faces"
              value={`${plan.doors.length} door${plan.doors.length === 1 ? "" : "s"} · ${plan.drawers.length} drawer${plan.drawers.length === 1 ? "" : "s"}`}
              note={plan.layout.blurb}
            />
            <button
              type="button"
              className="mt-4 rounded-full bg-paper px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-iron"
              onClick={() => window.print()}
            >
              Print cut list
            </button>
          </>
        ) : (
          <Result label="Need a width, height, and depth" value="—" />
        )
      }
      plan={
        plan ? (
          <>
            <div className="hidden print:block">
              <h2 className="font-display text-3xl tracking-tight">
                {formatInches(plan.overallW)} {plan.layout.label}
              </h2>
            </div>
            <CabinetBoxPictures plan={plan} />
            <BuildSheet
              storageKey="storystick-cuts-cabinet-box"
              rows={plan.parts}
              steps={plan.steps}
              title="Box, frame, and faces"
            />
          </>
        ) : null
      }
    >
      <div className="grid gap-4 print:hidden">
        <Field label="Cabinet">
          <SelectInput value={kind} onChange={(value) => changeKind(value as CabinetKind)}>
            <option value="base">Base (sits on the floor)</option>
            <option value="upper">Upper (hangs on the wall)</option>
            <option value="tall">Tall / pantry</option>
          </SelectInput>
        </Field>
        <div>
          <p className="text-sm font-medium">Typical layout</p>
          <p className="mt-1 text-sm text-ink-soft">Start here, then change any number below.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {available.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => pickLayout(item.id)}
                className={`rounded-sm border px-3 py-3 text-left ${
                  item.id === layout.id
                    ? "border-walnut bg-paper shadow-[3px_3px_0_rgba(107,58,31,0.15)]"
                    : "border-rule bg-paper/70 hover:border-walnut/40"
                }`}
              >
                <p className="font-display text-lg tracking-tight">{item.label}</p>
                <p className="mt-1 text-sm leading-5 text-ink-soft">{item.blurb}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Overall width">
            <TextInput value={width} onChange={setWidth} />
          </Field>
          <Field label="Overall height">
            <TextInput value={height} onChange={setHeight} />
          </Field>
          <Field label="Overall depth">
            <TextInput value={depth} onChange={setDepth} />
          </Field>
        </div>
        <Field label="Box construction">
          <SelectInput value={construction} onChange={(value) => setConstruction(value as Construction)}>
            <option value="face-frame">Face-frame (American)</option>
            <option value="frameless">Frameless (Euro / full overlay)</option>
          </SelectInput>
        </Field>
        {construction === "face-frame" ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Stile" hint="vertical">
              <TextInput value={stile} onChange={setStile} />
            </Field>
            <Field label="Rail" hint="horizontal">
              <TextInput value={rail} onChange={setRail} />
            </Field>
            <Field label="Frame overhang" hint="each side">
              <TextInput value={overhang} onChange={setOverhang} />
            </Field>
          </div>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Side / bottom plywood">
            <TextInput value={sideThick} onChange={setSideThick} />
          </Field>
          <Field label="Back">
            <TextInput value={backThick} onChange={setBackThick} />
          </Field>
          <Field label="Dado / rabbet">
            <TextInput value={dado} onChange={setDado} />
          </Field>
        </div>
        {kind !== "upper" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Toe kick height">
              <TextInput value={toeH} onChange={setToeH} />
            </Field>
            <Field label="Toe kick depth">
              <TextInput value={toeD} onChange={setToeD} />
            </Field>
          </div>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="How the faces sit">
            <SelectInput value={fitId} onChange={setFitId}>
              {FIT_OPTIONS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Pair / drawer gap">
            <TextInput value={midGap} onChange={setMidGap} />
          </Field>
          <Field label="Slides">
            <SelectInput value={slide} onChange={(value) => setSlide(value as "undermount" | "side")}>
              <option value="undermount">Undermount</option>
              <option value="side">Side-mount</option>
            </SelectInput>
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Shelves inside">
            <TextInput value={shelves} onChange={setShelves} />
          </Field>
          <Field label="Faces">
            <SelectInput value={makeShaker} onChange={setMakeShaker}>
              <option value="shaker">Shaker / applied frame</option>
              <option value="slab">Flat slabs only</option>
            </SelectInput>
          </Field>
        </div>
        {makeShaker === "shaker" ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Frame joints">
              <SelectInput value={shakerBuild} onChange={(value) => setShakerBuild(value as ShakerBuild)}>
                <option value="applied-miter">Applied miters (45°)</option>
                <option value="applied-butt">Applied, stiles through</option>
                <option value="cope">Cope-and-stick</option>
              </SelectInput>
            </Field>
            <Field label="Door stile">
              <TextInput value={shakerStile} onChange={setShakerStile} />
            </Field>
            <Field label="Door rail">
              <TextInput value={shakerRail} onChange={setShakerRail} />
            </Field>
          </div>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Face stock" hint="doors & frame">
            <TextInput value={faceThick} onChange={setFaceThick} />
          </Field>
          <Field label="Drawer-box stock">
            <TextInput value={drawerStock} onChange={setDrawerStock} />
          </Field>
        </div>
      </div>
    </ToolFrame>
  );
}

function asKind(value: string | null): CabinetKind | null {
  if (value === "base" || value === "upper" || value === "tall") return value;
  return null;
}
