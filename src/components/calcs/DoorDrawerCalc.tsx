"use client";

import { BuildSheet } from "@/components/BuildSheet";
import { ChoiceCard, Field, Result, SelectInput, TextInput, ToolFrame } from "@/components/Fields";
import { DoorDrawerPictures } from "@/components/plans/DoorDrawerPictures";
import { ShakerPictures } from "@/components/plans/ShakerPictures";
import {
  doorDrawerPlan,
  drawerBoxParts,
  hingeAdvice,
  shakerPlan,
  type FitStyle,
  type ShakerBuild,
} from "@/lib/cabinet";
import { formatInches, parseInches } from "@/lib/measure";
import { useMemo, useState } from "react";

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

export function DoorDrawerCalc() {
  const [split, setSplit] = useState<"two-openings" | "one-opening">("two-openings");
  const [measure, setMeasure] = useState<"opening" | "overall">("opening");
  const [openingW, setOpeningW] = useState("21");
  const [drawerOpeningH, setDrawerOpeningH] = useState("5");
  const [doorOpeningH, setDoorOpeningH] = useState("22");
  const [midRail, setMidRail] = useState("1 1/2");
  const [totalOpeningH, setTotalOpeningH] = useState("28");
  const [drawerFrontH, setDrawerFrontH] = useState("6");
  const [stackGap, setStackGap] = useState("1/8");
  const [openingD, setOpeningD] = useState("21");
  const [stile, setStile] = useState("1 1/2");
  const [rail, setRail] = useState("1 1/2");
  const [preset, setPreset] = useState("r8");
  const [customFit, setCustomFit] = useState<FitStyle>("reveal");
  const [customAmount, setCustomAmount] = useState("1/8");
  const [doors, setDoors] = useState("1");
  const [midGap, setMidGap] = useState("1/8");
  const [slide, setSlide] = useState<"undermount" | "side">("undermount");
  const [style, setStyle] = useState("slab");
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
    const st = parseInches(stile);
    const ra = parseInches(rail);
    const amt = parseInches(amountText);
    const depth = parseInches(openingD);
    const gap = parseInches(midGap) ?? 1 / 8;
    if (rawW === null || st === null || ra === null || amt === null || depth === null) return null;
    const ow = measure === "overall" ? rawW - st * 2 : rawW;
    if (split === "two-openings") {
      const drawerH = parseInches(drawerOpeningH);
      const doorH = parseInches(doorOpeningH);
      const mid = parseInches(midRail);
      const between = parseInches(stackGap);
      if (drawerH === null || doorH === null || mid === null) return null;
      return doorDrawerPlan({
        openingW: ow,
        stile: st,
        rail: ra,
        fit,
        amount: amt,
        doorCount: doors === "2" ? 2 : 1,
        midGap: gap,
        openingD: depth,
        slide,
        split: "two-openings",
        drawerOpeningH: drawerH,
        doorOpeningH: doorH,
        midRail: mid,
        stackGap: between ?? undefined,
      });
    }
    const totalH = parseInches(totalOpeningH);
    const frontH = parseInches(drawerFrontH);
    const between = parseInches(stackGap) ?? 1 / 8;
    if (totalH === null || frontH === null) return null;
    const oh = measure === "overall" ? totalH - ra * 2 : totalH;
    return doorDrawerPlan({
      openingW: ow,
      stile: st,
      rail: ra,
      fit,
      amount: amt,
      doorCount: doors === "2" ? 2 : 1,
      midGap: gap,
      openingD: depth,
      slide,
      split: "one-opening",
      totalOpeningH: oh,
      drawerFrontH: frontH,
      stackGap: between,
    });
  }, [
    openingW,
    stile,
    rail,
    fit,
    amountText,
    openingD,
    midGap,
    measure,
    split,
    drawerOpeningH,
    doorOpeningH,
    midRail,
    doors,
    slide,
    totalOpeningH,
    drawerFrontH,
    stackGap,
  ]);

  const hinges = plan ? hingeAdvice(plan.door) : null;
  const shakerDoor = useMemo(() => {
    if (!doorStyle.shaker || !plan) return null;
    return shakerPlan({
      doorW: plan.door.doorW,
      doorH: plan.door.doorH,
      stileW: parseInches(frameStile) ?? 0.75,
      railW: parseInches(frameRail) ?? 0.75,
      build,
      grooveDepth: parseInches(groove) ?? 0.375,
      float: parseInches(float) ?? 1 / 16,
      stockThickness: parseInches(thickness) ?? 0.75,
    });
  }, [doorStyle.shaker, plan, frameStile, frameRail, build, groove, float, thickness]);

  const shakerDrawer = useMemo(() => {
    if (!doorStyle.shaker || !plan) return null;
    return shakerPlan({
      doorW: plan.drawer.frontW,
      doorH: plan.drawer.frontH,
      stileW: parseInches(frameStile) ?? 0.75,
      railW: parseInches(frameRail) ?? 0.75,
      build,
      grooveDepth: parseInches(groove) ?? 0.375,
      float: parseInches(float) ?? 1 / 16,
      stockThickness: parseInches(thickness) ?? 0.75,
    });
  }, [doorStyle.shaker, plan, frameStile, frameRail, build, groove, float, thickness]);

  const box = plan ? drawerBoxParts(plan.drawer) : null;

  const cutRows = plan
    ? [
        ...(shakerDrawer
          ? shakerDrawer.parts.map((part) => ({
              name: `Drawer · ${part.name}`,
              qty: part.qty,
              size: `${part.thickness} × ${formatInches(part.width)} × ${formatInches(part.length)}`,
              note: part.note,
            }))
          : [
              {
                name: "Drawer front",
                qty: 1,
                size: `${formatInches(plan.drawer.frontW)} × ${formatInches(plan.drawer.frontH)} × 3/4"`,
                note: `${formatInches(plan.overlayX)} overlay · same as the door`,
                kind: "drawer-fb" as const,
              },
            ]),
        ...(shakerDoor
          ? shakerDoor.parts.map((part) => ({
              name: plan.door.doorCount === 2 ? `Each door · ${part.name}` : `Door · ${part.name}`,
              qty: part.qty * plan.door.doorCount,
              size: `${part.thickness} × ${formatInches(part.width)} × ${formatInches(part.length)}`,
              note: plan.door.doorCount === 2 ? `${part.note} · pair` : part.note,
            }))
          : plan.door.doors.map((door, index) => ({
              name: plan.door.doorCount === 1 ? "Door" : `Door ${index === 0 ? "left" : "right"}`,
              qty: 1,
              size: `${formatInches(door.width)} × ${formatInches(door.height)} × 3/4"`,
              note: `${formatInches(plan.overlayX)} overlay · ${formatInches(plan.revealX)} reveal`,
              kind: "door" as const,
            }))),
        ...(hinges
          ? [
              {
                name: "Hinges",
                qty: hinges.count * plan.door.doorCount,
                size: hinges.cup,
                note: `${hinges.tab}. ${hinges.traditional}.`,
                kind: "hinge" as const,
              },
            ]
          : []),
        ...(box
          ? box.parts.map((part) => ({
              name: part.name,
              qty: part.qty,
              size: `${part.thickness} × ${formatInches(part.width)} × ${formatInches(part.length)}`,
              note: part.note,
            }))
          : []),
      ]
    : [];

  const steps = plan
    ? [
        {
          id: "measure",
          text:
            split === "two-openings"
              ? "Measure both holes — drawer opening and door opening — plus the mid-rail between them. Write the width once; it is shared."
              : "Measure the one opening. Decide how tall the drawer front should be, then leave the rest for the door(s).",
        },
        { id: "fit", text: "Use the same overlay on the drawer and the door so the stiles line up." },
        { id: "cut-fronts", text: "Cut the drawer front and the door(s) together. Check the gap between them before you hang anything." },
        ...(shakerDoor || shakerDrawer
          ? build === "applied-miter"
            ? [
                {
                  id: "slab",
                  text: "Each face size is a slab. Rip matching stiles and rails. Long point is that face’s width or height.",
                },
              ]
            : build === "applied-butt"
              ? [{ id: "frame", text: "Stiles run the full height of each face. Rails fit between them. Same frame width on drawer and door." }]
              : [{ id: "cope", text: "Stick the stiles, cope the rails, cut each panel with groove + float. Glue only the frame joints." }]
          : []),
        ...(hinges
          ? [
              {
                id: "cups",
                text: "Bore 35mm cups 3–6mm from the hinge edge, 13.5mm deep.",
                detail: `Centers from the top of each door: ${hinges.centers.map((y) => formatInches(y)).join(" · ")}`,
              },
            ]
          : []),
        {
          id: "box",
          text: "Build the drawer box smaller than the front. Groove the bottom so it can float.",
          detail: slide === "side" ? "Side-mount: 1/2″ each side of the opening." : "Undermount: opening minus about 3/8″. Check the brand sheet.",
        },
        { id: "hang", text: "Hang the door(s), install the slides and box, then overlay the drawer front last so the gap matches." },
      ]
    : [];

  const overlapNote =
    plan && plan.overlap > 0
      ? `Drawer and door overlap the mid-rail by ${formatInches(plan.overlap)}. A ½″ overlay on a 1½″ rail leaves a ½″ gap. Full overlay on a skinny mid-rail will crash.`
      : undefined;

  return (
    <ToolFrame
      title="Door + drawer"
      description="Replace a cabinet’s drawer and door together. Same overlay, shared width, heights that stack — then the drawer box and hinges."
      results={
        plan && hinges ? (
          <>
            <Result
              label="Drawer front"
              value={`${formatInches(plan.drawer.frontW)} × ${formatInches(plan.drawer.frontH)}`}
              note="Same overlay as the door so the edges line up."
            />
            <Result
              label={plan.door.doorCount === 2 ? "Each door" : "Door size"}
              value={`${formatInches(plan.door.doorW)} × ${formatInches(plan.door.doorH)}`}
              note={
                plan.door.doorCount === 2
                  ? `${formatInches(plan.door.midGap)} gap between the pair.`
                  : "Single door under the drawer."
              }
            />
            <Result
              label={plan.overlap > 0 ? "Overlap on mid-rail" : "Gap between drawer and door"}
              value={formatInches(plan.overlap > 0 ? plan.overlap : Math.max(0, plan.stackGap))}
              note={overlapNote ?? (fit === "inset" ? "Inset gap plus the mid-rail." : "What you will see between the two faces.")}
            />
            <Result
              label="Drawer box"
              value={`${formatInches(plan.drawer.boxW)} × ${formatInches(plan.drawer.boxD)} × ${formatInches(plan.drawer.boxH)}`}
              note={slide === "side" ? "Opening minus 1/2″ each side." : "Opening minus 3/8″ for typical undermount."}
            />
            <Result label="Hinges" value={`${hinges.count * plan.door.doorCount} × 35mm`} note={hinges.euro} />
            {shakerDoor ? (
              <Result
                label="Door shaker panel"
                value={`${formatInches(shakerDoor.panelW)} × ${formatInches(shakerDoor.panelH)}`}
                note={`Stiles 2 @ ${formatInches(shakerDoor.stileW)} × ${formatInches(shakerDoor.stileLength)}.`}
              />
            ) : null}
            {doorStyle.shaker && !shakerDrawer ? (
              <Result
                label="Drawer frame"
                value="Too short for this shaker"
                note="The drawer front is too short for that stile width. Cut it as a slab, or pick a narrower frame."
              />
            ) : null}
          </>
        ) : (
          <Result label="Need the openings" value="—" note="Use fractions like 21 or 1 1/2." />
        )
      }
      printFacts={
        plan && hinges
          ? [
              {
                label: "Drawer front",
                value: `${formatInches(plan.drawer.frontW)} × ${formatInches(plan.drawer.frontH)}`,
              },
              {
                label: plan.door.doorCount === 2 ? "Each door" : "Door size",
                value: `${formatInches(plan.door.doorW)} × ${formatInches(plan.door.doorH)}`,
                note: plan.door.doorCount === 2 ? `${formatInches(plan.door.midGap)} pair gap` : undefined,
              },
              {
                label: plan.overlap > 0 ? "Overlap" : "Face gap",
                value: formatInches(plan.overlap > 0 ? plan.overlap : Math.max(0, plan.stackGap)),
              },
              {
                label: "Drawer box",
                value: `${formatInches(plan.drawer.boxW)} W × ${formatInches(plan.drawer.boxD)} D × ${formatInches(plan.drawer.boxH)} H`,
              },
              { label: "Hinges", value: `${hinges.count * plan.door.doorCount} × 35mm`, note: hinges.euro },
            ]
          : undefined
      }
      printRows={cutRows}
      printSteps={steps.map(({ id, text, detail }) => ({ id, text, detail }))}
      printFigures={
        plan && hinges ? (
          <>
            <DoorDrawerPictures plan={plan} hinges={hinges} />
            {shakerDoor ? <ShakerPictures plan={shakerDoor} build={build} /> : null}
          </>
        ) : undefined
      }
      plan={
        plan && hinges ? (
          <>
            <DoorDrawerPictures plan={plan} hinges={hinges} />
            {shakerDoor ? <ShakerPictures plan={shakerDoor} build={build} /> : null}
            <BuildSheet storageKey="storystick-cuts-door-drawer" rows={cutRows} steps={steps} />
            <div className="border border-rule px-4 py-3 text-sm leading-6 text-ink-soft">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-shellac">Hinge plan</p>
              <p className="mt-2">{hinges.note}</p>
              <p className="mt-2 font-mono text-ink">
                Cup centers from top of door: {hinges.centers.map((y) => formatInches(y)).join(" · ")}
              </p>
              {overlapNote ? <p className="mt-2 text-shellac">{overlapNote}</p> : null}
            </div>
          </>
        ) : null
      }
    >
      <Field label="How the cabinet is built">
        <div className="grid gap-2">
          <ChoiceCard
            selected={split === "two-openings"}
            onSelect={() => setSplit("two-openings")}
            title="Two holes — drawer opening and door opening"
            hint="Face frame with a mid-rail. Measure each hole."
          />
          <ChoiceCard
            selected={split === "one-opening"}
            onSelect={() => setSplit("one-opening")}
            title="One hole — drawer stacked on the door"
            hint="No mid-rail. Type the opening, then how tall the drawer front should be."
          />
        </div>
      </Field>
      <Field label="What you measured">
        <SelectInput value={measure} onChange={(value) => setMeasure(value as "opening" | "overall")}>
          <option value="opening">Inside opening (between the face frame)</option>
          <option value="overall">Outside of the face frame (width{split === "one-opening" ? " and height" : ""})</option>
        </SelectInput>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={measure === "overall" ? "Face-frame width" : "Opening width"}
          hint={measure === "overall" ? "outside to outside" : "same for drawer and door"}
        >
          <TextInput value={openingW} onChange={setOpeningW} />
        </Field>
        <Field label="Opening depth" hint="for the drawer box">
          <TextInput value={openingD} onChange={setOpeningD} />
        </Field>
        {split === "two-openings" ? (
          <>
            <Field label="Drawer opening height" hint="the top hole">
              <TextInput value={drawerOpeningH} onChange={setDrawerOpeningH} />
            </Field>
            <Field label="Door opening height" hint="the bottom hole">
              <TextInput value={doorOpeningH} onChange={setDoorOpeningH} />
            </Field>
            <Field label="Mid-rail" hint="between the two holes">
              <TextInput value={midRail} onChange={setMidRail} />
            </Field>
            <Field label="Gap between drawer and door" hint="on the mid-rail">
              <TextInput value={stackGap} onChange={setStackGap} />
            </Field>
          </>
        ) : (
          <>
            <Field
              label={measure === "overall" ? "Face-frame height" : "Opening height"}
              hint={measure === "overall" ? "outside to outside" : "the one hole"}
            >
              <TextInput value={totalOpeningH} onChange={setTotalOpeningH} />
            </Field>
            <Field label="Drawer front height" hint="finished face">
              <TextInput value={drawerFrontH} onChange={setDrawerFrontH} />
            </Field>
            <Field label="Gap between drawer and door">
              <TextInput value={stackGap} onChange={setStackGap} />
            </Field>
          </>
        )}
        <Field label="Stile width" hint="left / right frame">
          <TextInput value={stile} onChange={setStile} />
        </Field>
        <Field label="Rail width" hint="top / bottom frame">
          <TextInput value={rail} onChange={setRail} />
        </Field>
      </div>
      <Field label="How the faces sit">
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
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Doors under the drawer">
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
        <Field label="Slides">
          <SelectInput value={slide} onChange={(value) => setSlide(value as "undermount" | "side")}>
            <option value="undermount">Undermount (Blum Tandem-style)</option>
            <option value="side">Side-mount / epoxy</option>
          </SelectInput>
        </Field>
      </div>
      <Field label="Face style">
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
