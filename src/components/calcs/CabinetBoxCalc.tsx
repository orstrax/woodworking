"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BuildSheet } from "@/components/BuildSheet";
import { Field, OptionToggle, Result, SelectInput, TextInput, ToolFrame } from "@/components/Fields";
import { InfoTip } from "@/components/InfoTip";
import { CabinetBoxPictures, StickyFace } from "@/components/plans/CabinetBoxPictures";
import { LayoutThumb } from "@/components/plans/LayoutThumb";
import {
  TipDado,
  TipFaceFrame,
  TipFaces,
  TipFit,
  TipGap,
  TipNailer,
  TipOverhang,
  TipPocket,
  TipRail,
  TipShaker,
  TipSlides,
  TipStile,
  TipToe,
} from "@/components/plans/ShopTips";
import type { FitStyle, ShakerBuild } from "@/lib/cabinet";
import {
  CABINET_LAYOUTS,
  KIND_DEFAULTS,
  getLayout,
  layoutsFor,
  planCabinetBox,
  type AssemblyJoin,
  type CabinetKind,
  type Construction,
} from "@/lib/cabinetBox";
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

const DOOR_STYLES: { id: string; label: string; stile: string; rail: string; shaker: boolean }[] = [
  { id: "slab", label: "Flat slab", stile: "3/4", rail: "3/4", shaker: false },
  { id: "micro", label: 'Micro shaker — 3/4" frame', stile: "3/4", rail: "3/4", shaker: true },
  { id: "narrow", label: 'Narrow — 1" frame', stile: "1", rail: "1", shaker: true },
  { id: "slim", label: 'Slim shaker — 1 1/4" frame', stile: "1 1/4", rail: "1 1/4", shaker: true },
  { id: "classic", label: 'Classic shaker — 2 1/4" frame', stile: "2 1/4", rail: "2 1/4", shaker: true },
  { id: "wide", label: 'Wide shaker — 2 1/2" frame', stile: "2 1/2", rail: "2 1/2", shaker: true },
  { id: "custom", label: "Custom shaker frame", stile: "3/4", rail: "3/4", shaker: true },
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
  const [customFit, setCustomFit] = useState<FitStyle>("reveal");
  const [customAmount, setCustomAmount] = useState("1/8");
  const [midGap, setMidGap] = useState("1/8");
  const [slide, setSlide] = useState<"undermount" | "side">("undermount");
  const [shelves, setShelves] = useState(String(getLayout(search.get("layout") ?? "base-drawers-3")?.shelves ?? KIND_DEFAULTS[startKind].shelves));
  const [doorStyle, setDoorStyle] = useState("micro");
  const [shakerBuild, setShakerBuild] = useState<ShakerBuild>("applied-miter");
  const [shakerStile, setShakerStile] = useState("3/4");
  const [shakerRail, setShakerRail] = useState("3/4");
  const [faceThick, setFaceThick] = useState("3/4");
  const [drawerStock, setDrawerStock] = useState("5/8");
  const [assembly, setAssembly] = useState<AssemblyJoin>("dado");
  const [includeDoorFaces, setIncludeDoorFaces] = useState(true);
  const [includeDrawerFaces, setIncludeDrawerFaces] = useState(true);
  const [includeDrawerBoxes, setIncludeDrawerBoxes] = useState(true);
  const [includeToeSkin, setIncludeToeSkin] = useState(true);
  const [includeNailer, setIncludeNailer] = useState(true);
  const [includeFaceFrame, setIncludeFaceFrame] = useState(true);

  const available = layoutsFor(kind);
  const layout = getLayout(layoutId) ?? available[0] ?? CABINET_LAYOUTS[0];
  const selectedFit = FIT_OPTIONS.find((item) => item.id === fitId) ?? FIT_OPTIONS[2];
  const fit = fitId === "custom" ? customFit : selectedFit.fit;
  const fitAmount = fitId === "custom" ? customAmount : selectedFit.amount;
  const selectedDoor = DOOR_STYLES.find((item) => item.id === doorStyle) ?? DOOR_STYLES[1];
  const makeShaker = selectedDoor.shaker;
  const shakerStileText = doorStyle === "custom" ? shakerStile : selectedDoor.stile;
  const shakerRailText = doorStyle === "custom" ? shakerRail : selectedDoor.rail;
  const hasDoors = layout.cells.some((cell) => cell.kind === "doors");
  const hasDrawerFaces = layout.cells.some((cell) => cell.kind === "drawer" || cell.kind === "false-front");
  const hasDrawerBoxes = layout.cells.some((cell) => cell.kind === "drawer");
  const wantDoorFaces = hasDoors && includeDoorFaces;
  const wantDrawerFaces = hasDrawerFaces && includeDrawerFaces;
  const wantAnyFaces = wantDoorFaces || wantDrawerFaces;

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
          fit,
          amount: parseInches(fitAmount) ?? 0.125,
          midGap: parseInches(midGap) ?? 0.125,
          drawerGap: parseInches(midGap) ?? 0.125,
          slide,
          shelves: Math.max(0, Math.round(Number(shelves) || 0)),
          makeShaker,
          shakerBuild,
          shakerStile: parseInches(shakerStileText) ?? 0.75,
          shakerRail: parseInches(shakerRailText) ?? 0.75,
          faceThick: parseInches(faceThick) ?? 0.75,
          drawerStock: parseInches(drawerStock) ?? 0.625,
          assembly,
          includeDoorFaces: wantDoorFaces,
          includeDrawerFaces: wantDrawerFaces,
          includeDrawerBoxes: hasDrawerBoxes && includeDrawerBoxes,
          includeToeSkin: kind !== "upper" && includeToeSkin,
          includeNailer: kind === "upper" && includeNailer,
          includeFaceFrame: construction === "face-frame" && includeFaceFrame,
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

  const doorOpenings = layout.cells.filter((cell) => cell.kind === "doors").reduce((sum, cell) => sum + cell.count, 0);
  const drawerOpenings = layout.cells.filter((cell) => cell.kind === "drawer").length;
  const laterBits = [
    !wantDoorFaces && hasDoors ? "door faces later" : null,
    !wantDrawerFaces && hasDrawerFaces ? "fronts later" : null,
    !includeDrawerBoxes && hasDrawerBoxes ? "boxes later" : null,
  ].filter(Boolean);

  return (
    <>
      {plan ? (
        <div className="lg:hidden sticky top-[var(--site-header-h)] z-20 -mx-5 mb-4 border-b border-rule bg-[#f6efe4] px-5 py-1.5 print:hidden sm:-mx-8 sm:px-8">
          <StickyFace plan={plan} />
        </div>
      ) : null}
      <ToolFrame
        title="Cabinet box"
        description="Pick a typical layout — a 36″ drawer base, a sink, an upper — then change any measurement. Uncheck the faces if you are only cutting the box today."
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
                label="This layout"
                value={`${doorOpenings} door${doorOpenings === 1 ? "" : "s"} · ${drawerOpenings} drawer${drawerOpenings === 1 ? "" : "s"}`}
                note={laterBits.length ? laterBits.join(" · ") : plan.layout.blurb}
              />
            </>
          ) : (
            <Result label="Need a width, height, and depth" value="—" />
          )
        }
        printFacts={
          plan
            ? [
                {
                  label: "The box",
                  value: `${formatInches(plan.boxW)} × ${formatInches(plan.boxH)} × ${formatInches(plan.boxD)}`,
                  note:
                    plan.construction === "face-frame"
                      ? `Face ${formatInches(plan.overallW)} wide`
                      : "Frameless — box is the overall size",
                },
                {
                  label: "Inside",
                  value: `${formatInches(plan.interiorW)} wide`,
                  note: `Depth ${formatInches(plan.interiorD)} · opening height ${formatInches(plan.faceH)}`,
                },
                {
                  label: "Layout",
                  value: plan.layout.label,
                  note: laterBits.length ? laterBits.join(" · ") : plan.layout.blurb,
                },
                {
                  label: "Joinery",
                  value: plan.assembly === "pocket" ? "Pocket holes" : plan.assembly === "screws" ? "Screws through sides" : "Dados and rabbet",
                },
              ]
            : undefined
        }
        printFigures={plan ? <CabinetBoxPictures plan={plan} /> : undefined}
        printRows={plan?.parts.map(({ name, qty, size, note }) => ({ name, qty, size, note }))}
        printSteps={plan?.steps.map(({ text, detail }) => ({ text, detail }))}
        note={plan ? `${formatInches(plan.overallW)} ${plan.layout.label}` : undefined}
        plan={
          plan ? (
            <>
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
          <Field
            label="Cabinet"
            tip={
              <InfoTip
                title="Where it lives"
                body="Base cabinets sit on the floor with a toe kick. Uppers hang on the wall. Tall / pantry is a full-height box, usually next to a fridge or at the end of a run."
              />
            }
          >
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
                  className={`flex items-center gap-3 rounded-sm border px-3 py-3 text-left ${
                    item.id === layout.id
                      ? "border-walnut bg-paper shadow-[3px_3px_0_rgba(107,58,31,0.15)]"
                      : "border-rule bg-paper/70 hover:border-walnut/40"
                  }`}
                >
                  <LayoutThumb layout={item} className="h-14 w-10 shrink-0" />
                  <span className="min-w-0">
                    <span className="block font-display text-lg tracking-tight">{item.label}</span>
                    <span className="mt-1 block text-sm leading-5 text-ink-soft">{item.blurb}</span>
                  </span>
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
          <Field
            label="Box construction"
            tip={
              <InfoTip
                title="Face-frame or frameless"
                body="Face-frame (American): a 1½″ hardwood picture frame glued onto the box. Frameless (Euro): the doors cover the box edges and there is no frame."
                picture={<TipFaceFrame />}
              />
            }
          >
            <SelectInput value={construction} onChange={(value) => setConstruction(value as Construction)}>
              <option value="face-frame">Face-frame (American)</option>
              <option value="frameless">Frameless (Euro / full overlay)</option>
            </SelectInput>
          </Field>
          <Field
            label="How the box goes together"
            tip={
              <InfoTip
                title="Joinery is a choice"
                body="Dados and a rabbet are traditional and strong. Pocket holes skip the router table. Screws through the sides are the simplest butt joint. The cut list and steps follow what you pick."
                picture={<TipPocket />}
              />
            }
          >
            <SelectInput value={assembly} onChange={(value) => setAssembly(value as AssemblyJoin)}>
              <option value="dado">Dados and a rabbet (traditional)</option>
              <option value="pocket">Pocket holes (no dados)</option>
              <option value="screws">Screws through the sides (butt joints)</option>
            </SelectInput>
          </Field>
          <div>
            <span className="flex items-center gap-1.5">
              <span className="text-sm font-medium">Cut now, or later</span>
              <InfoTip
                title="Skip the pretty parts"
                body="The box can go together without doors, drawer fronts, or even the face frame. Uncheck anything you want to size later — openings stay in the picture as empty holes."
                picture={<TipFaces />}
              />
            </span>
            <p className="mt-1 text-sm text-ink-soft">Uncheck anything you are not building today.</p>
            <div className="mt-3 grid gap-2">
              {construction === "face-frame" ? (
                <OptionToggle
                  checked={includeFaceFrame}
                  onChange={setIncludeFaceFrame}
                  label="Face frame"
                  hint="Stiles and rails. The box is still sized for them if you wait."
                />
              ) : null}
              {hasDoors ? (
                <OptionToggle
                  checked={includeDoorFaces}
                  onChange={setIncludeDoorFaces}
                  label="Door faces"
                  hint="The doors you see from the front. Hinges come with them."
                />
              ) : null}
              {hasDrawerFaces ? (
                <OptionToggle
                  checked={includeDrawerFaces}
                  onChange={setIncludeDrawerFaces}
                  label={layout.cells.some((cell) => cell.kind === "false-front") ? "Drawer / false fronts" : "Drawer fronts"}
                  hint="The pretty faces. You can hang these after the boxes are in."
                />
              ) : null}
              {hasDrawerBoxes ? (
                <OptionToggle
                  checked={includeDrawerBoxes}
                  onChange={setIncludeDrawerBoxes}
                  label="Drawer boxes"
                  hint="The four-sided boxes that ride on the slides."
                />
              ) : null}
              {kind !== "upper" ? (
                <OptionToggle
                  checked={includeToeSkin}
                  onChange={setIncludeToeSkin}
                  label="Toe-kick skin"
                  hint="The board that covers the notch. Often one strip for the whole run."
                />
              ) : null}
              {kind === "upper" ? (
                <OptionToggle
                  checked={includeNailer}
                  onChange={setIncludeNailer}
                  label="Hanging rail"
                  hint="A strip inside the top back. Screws into the studs through the back."
                />
              ) : null}
            </div>
          </div>
          {wantAnyFaces ? (
            <>
              <Field
                label="How the faces sit"
                tip={
                  <InfoTip
                    title="Reveal, overlay, inset"
                    body="Reveal: the door sits on the frame with a little brown line showing. Overlay: the door covers the frame. Inset: the door sits in the opening, flush with the frame."
                    picture={<TipFit />}
                  />
                }
              >
                <SelectInput
                  value={fitId}
                  onChange={(value) => {
                    setFitId(value);
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
              {fitId === "custom" ? (
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
              <Field
                label="Door / front style"
                tip={
                  <InfoTip
                    title="Shaker vs slab"
                    body="Same styles as the cabinet-doors tool. Micro is a ¾″ frame on a slab. Classic is a 2¼″ frame. Slab is one flat piece."
                    picture={<TipShaker />}
                  />
                }
              >
                <SelectInput value={doorStyle} onChange={setDoorStyle}>
                  {DOOR_STYLES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              {makeShaker ? (
                <div className={`grid gap-4 ${doorStyle === "custom" ? "sm:grid-cols-3" : ""}`}>
                  <Field
                    label="Frame joints"
                    tip={
                      <InfoTip
                        title="Miter, butt, or cope"
                        body="Applied miters: 45° corners on a slab, like a picture frame. Applied butt: stiles run through. Cope-and-stick: the traditional grooved joint."
                        picture={<TipShaker />}
                      />
                    }
                  >
                    <SelectInput value={shakerBuild} onChange={(value) => setShakerBuild(value as ShakerBuild)}>
                      <option value="applied-miter">Applied miters (45°)</option>
                      <option value="applied-butt">Applied, stiles through</option>
                      <option value="cope">Cope-and-stick</option>
                    </SelectInput>
                  </Field>
                  {doorStyle === "custom" ? (
                    <>
                      <Field label="Door stile">
                        <TextInput value={shakerStile} onChange={setShakerStile} />
                      </Field>
                      <Field label="Door rail">
                        <TextInput value={shakerRail} onChange={setShakerRail} />
                      </Field>
                    </>
                  ) : null}
                </div>
              ) : null}
            </>
          ) : null}
          <Field
            label="Shelves inside"
            hint="0 is fine"
            tip={
              <InfoTip
                title="Adjustable shelves"
                body="Zero if the cabinet is all drawers. One is typical in a door base. Two in a 30″ upper. They are optional — skip them and you just have an empty box."
              />
            }
          >
            <TextInput value={shelves} onChange={setShelves} />
          </Field>
          <details className="rounded-sm border border-rule bg-paper/60 px-4 py-3">
            <summary className="cursor-pointer font-display text-lg tracking-tight">Shop details</summary>
            <p className="mt-1 text-sm text-ink-soft">Plywood, toe kick, and stock sizes. Defaults are typical kitchen numbers.</p>
            <div className="mt-4 grid gap-4">
              {construction === "face-frame" ? (
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field
                    label="Stile"
                    hint="vertical"
                    tip={
                      <InfoTip
                        title="Stile"
                        body="The vertical members of the face frame — left and right, full height. Typical kitchen stile is 1½″."
                        picture={<TipStile />}
                      />
                    }
                  >
                    <TextInput value={stile} onChange={setStile} />
                  </Field>
                  <Field
                    label="Rail"
                    hint="horizontal"
                    tip={
                      <InfoTip
                        title="Rail"
                        body="The horizontal members: top, bottom, and a divider at each drawer or door split. Same 1½″ as the stiles unless you want a skinny mid-rail."
                        picture={<TipRail />}
                      />
                    }
                  >
                    <TextInput value={rail} onChange={setRail} />
                  </Field>
                  <Field
                    label="Frame overhang"
                    hint="each side"
                    tip={
                      <InfoTip
                        title="Overhang"
                        body="How far the face frame sticks past the plywood box on each side. ¼″ is usual — it hides the box edge and lets you scribe to a wall."
                        picture={<TipOverhang />}
                      />
                    }
                  >
                    <TextInput value={overhang} onChange={setOverhang} />
                  </Field>
                </div>
              ) : null}
              <div className={`grid gap-4 ${assembly === "dado" ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
                <Field label="Side / bottom plywood">
                  <TextInput value={sideThick} onChange={setSideThick} />
                </Field>
                <Field label="Back">
                  <TextInput value={backThick} onChange={setBackThick} />
                </Field>
                {assembly === "dado" ? (
                  <Field
                    label="Dado / rabbet"
                    tip={
                      <InfoTip
                        title="Dado and rabbet"
                        body="A dado is a groove the bottom (and top) sit in. A rabbet is a step on the back edge for the ¼″ back. ⅜″ deep is a solid kitchen default."
                        picture={<TipDado />}
                      />
                    }
                  >
                    <TextInput value={dado} onChange={setDado} />
                  </Field>
                ) : null}
              </div>
              {kind !== "upper" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Toe kick height"
                    tip={
                      <InfoTip
                        title="Toe kick"
                        body="The notch at the floor so your toes fit when you stand at the counter. 4″ high and 3″ deep is the kitchen standard. Set height to 0 for a furniture base."
                        picture={<TipToe />}
                      />
                    }
                  >
                    <TextInput value={toeH} onChange={setToeH} />
                  </Field>
                  <Field label="Toe kick depth">
                    <TextInput value={toeD} onChange={setToeD} />
                  </Field>
                </div>
              ) : (
                <Field
                  label="Hanging rail width"
                  tip={
                    <InfoTip
                      title="Hanging rail"
                      body="A 4″ strip inside the top back of a wall cabinet. You drive screws through the back and this rail into the studs. Uncheck it above if you hang another way."
                      picture={<TipNailer />}
                    />
                  }
                >
                  <p className="rounded-sm border border-dashed border-rule px-3 py-2.5 text-sm text-ink-soft">
                    Uses the same 4″ stretcher width as the top rail inside.
                  </p>
                </Field>
              )}
              {wantAnyFaces ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Pair / drawer gap"
                    tip={
                      <InfoTip
                        title="The gap between faces"
                        body="The air between a pair of doors, or between stacked drawer fronts. ⅛″ is typical. This is not the reveal to the frame — that is the fit setting."
                        picture={<TipGap />}
                      />
                    }
                  >
                    <TextInput value={midGap} onChange={setMidGap} />
                  </Field>
                  {hasDrawerBoxes && includeDrawerBoxes ? (
                    <Field
                      label="Slides"
                      tip={
                        <InfoTip
                          title="Drawer slides"
                          body="Undermount hides under the box and needs a ½″ bottom reveal. Side-mount screws to the sides and steals about ½″ of width on each side."
                          picture={<TipSlides />}
                        />
                      }
                    >
                      <SelectInput value={slide} onChange={(value) => setSlide(value as "undermount" | "side")}>
                        <option value="undermount">Undermount</option>
                        <option value="side">Side-mount</option>
                      </SelectInput>
                    </Field>
                  ) : (
                    <Field label="Face stock" hint="doors & frame">
                      <TextInput value={faceThick} onChange={setFaceThick} />
                    </Field>
                  )}
                </div>
              ) : (
                <Field label="Face stock" hint="frame, if any">
                  <TextInput value={faceThick} onChange={setFaceThick} />
                </Field>
              )}
              {wantAnyFaces && hasDrawerBoxes && includeDrawerBoxes ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Face stock" hint="doors & frame">
                    <TextInput value={faceThick} onChange={setFaceThick} />
                  </Field>
                  <Field label="Drawer-box stock">
                    <TextInput value={drawerStock} onChange={setDrawerStock} />
                  </Field>
                </div>
              ) : hasDrawerBoxes && includeDrawerBoxes ? (
                <Field label="Drawer-box stock">
                  <TextInput value={drawerStock} onChange={setDrawerStock} />
                </Field>
              ) : null}
            </div>
          </details>
        </div>
      </ToolFrame>
    </>
  );
}

function asKind(value: string | null): CabinetKind | null {
  if (value === "base" || value === "upper" || value === "tall") return value;
  return null;
}
