"use client";

import { Field, Result, SelectInput, TextInput, ToolFrame } from "@/components/Fields";
import { DrawerPictures } from "@/components/plans/DrawerPictures";
import { BuildSheet } from "@/components/BuildSheet";
import { drawerBoxParts, drawerPlan, type FitStyle } from "@/lib/cabinet";
import { formatInches, parseInches } from "@/lib/measure";
import { useMemo, useState } from "react";

export function DrawerCalc() {
  const [openingW, setOpeningW] = useState("21");
  const [openingH, setOpeningH] = useState("10");
  const [openingD, setOpeningD] = useState("21");
  const [stile, setStile] = useState("1 1/2");
  const [fit, setFit] = useState<FitStyle>("reveal");
  const [amount, setAmount] = useState("1/8");
  const [count, setCount] = useState("1");
  const [gap, setGap] = useState("1/8");
  const [slide, setSlide] = useState<"undermount" | "side">("undermount");

  const plan = useMemo(() => {
    const w = parseInches(openingW);
    const h = parseInches(openingH);
    const d = parseInches(openingD);
    const st = parseInches(stile);
    const amt = parseInches(amount);
    const g = parseInches(gap) ?? 1 / 8;
    if (w === null || h === null || d === null || st === null || amt === null) return null;
    return drawerPlan({
      openingW: w,
      openingH: h,
      openingD: d,
      stile: st,
      fit,
      amount: amt,
      count: Number(count),
      gap: g,
      slide,
    });
  }, [openingW, openingH, openingD, stile, fit, amount, count, gap, slide]);

  return (
    <ToolFrame
      title="Drawer fronts & boxes"
      description="Same overlay rules as the doors, stacked if you have more than one drawer in the opening. Box size follows undermount or side-mount slides."
      results={
        plan ? (
          <>
            <Result
              label="Drawer front"
              value={`${formatInches(plan.frontW)} × ${formatInches(plan.frontH)}`}
              note={plan.count > 1 ? `${plan.count} fronts with ${formatInches(plan.gap)} gaps.` : "Single front."}
            />
            <Result
              label="Box width"
              value={formatInches(plan.boxW)}
              note={slide === "side" ? "Opening minus 1/2\" each side." : "Opening minus 3/8\" for typical undermount."}
            />
            <Result
              label="Box depth × height"
              value={`${formatInches(plan.boxD)} × ${formatInches(plan.boxH)}`}
              note="Height leaves room under the front. Confirm with your slide brand."
            />
          </>
        ) : (
          <Result label="Need an opening" value="—" />
        )
      }
      printFacts={
        plan
          ? [
              {
                label: "Drawer front",
                value: `${formatInches(plan.frontW)} × ${formatInches(plan.frontH)}`,
                note: plan.count > 1 ? `${plan.count} fronts with ${formatInches(plan.gap)} gaps` : "Single front",
              },
              { label: "Box width", value: formatInches(plan.boxW) },
              { label: "Box depth × height", value: `${formatInches(plan.boxD)} × ${formatInches(plan.boxH)}` },
            ]
          : undefined
      }
      printRows={
        plan
          ? [
              ...plan.fronts.map((front) => ({
                name: front.label,
                qty: 1,
                size: `${formatInches(front.width)} × ${formatInches(front.height)} × 3/4"`,
                note: `${formatInches(plan.overlayX)} overlay`,
              })),
              ...(drawerBoxParts(plan)?.parts.map((part) => ({
                name: part.name,
                qty: part.qty,
                size: `${part.thickness} × ${formatInches(part.width)} × ${formatInches(part.length)}`,
                note: part.note,
              })) ?? []),
            ]
          : undefined
      }
      printSteps={
        plan
          ? [
              { text: "Cut the pretty fronts first so they match the doors in the same run.", id: "drawers" },
              { text: "Build the boxes smaller than the fronts. Groove the bottom so it can float.", id: "cut-panels" },
              {
                id: "hang",
                text: "Install slides in the cabinet, then the boxes, then overlay the fronts last.",
                detail: slide === "side" ? "Side-mount: 1/2″ each side." : "Undermount: opening minus about 3/8″.",
              },
              { text: "Number from the top. Drawer 1 is the highest front.", id: "label" },
            ]
          : undefined
      }
      printFigures={plan ? <DrawerPictures plan={plan} /> : undefined}
      plan={
        plan ? (
          <>
            <DrawerPictures plan={plan} />
            <BuildSheet
              storageKey="storystick-cuts-drawers"
              rows={[
                ...plan.fronts.map((front) => ({
                  name: front.label,
                  qty: 1,
                  size: `${formatInches(front.width)} × ${formatInches(front.height)} × 3/4"`,
                  note: `${formatInches(plan.overlayX)} overlay`,
                  kind: "drawer-fb" as const,
                })),
                ...(drawerBoxParts(plan)?.parts.map((part) => ({
                  name: part.name,
                  qty: part.qty,
                  size: `${part.thickness} × ${formatInches(part.width)} × ${formatInches(part.length)}`,
                  note: part.note,
                })) ?? []),
              ]}
              steps={[
                { id: "fronts", text: "Cut the pretty fronts first so they match the doors in the same run." },
                { id: "boxes", text: "Build the boxes smaller than the fronts. Groove the bottom so it can float." },
                { id: "slides", text: "Install slides in the cabinet, then the boxes, then overlay the fronts last.", detail: slide === "side" ? "Side-mount: 1/2″ each side." : "Undermount: opening minus about 3/8″. Check the brand sheet." },
                { id: "number", text: "Number from the top. Drawer 1 is the highest front." },
              ]}
            />
          </>
        ) : null
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Opening width">
          <TextInput value={openingW} onChange={setOpeningW} />
        </Field>
        <Field label="Opening height">
          <TextInput value={openingH} onChange={setOpeningH} />
        </Field>
        <Field label="Opening depth">
          <TextInput value={openingD} onChange={setOpeningD} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Face-frame stile" hint="for overlay/reveal">
          <TextInput value={stile} onChange={setStile} />
        </Field>
        <Field label="Fit">
          <SelectInput value={fit} onChange={(value) => setFit(value as FitStyle)}>
            <option value="reveal">Reveal of face frame</option>
            <option value="overlay">Overlay onto frame</option>
            <option value="inset">Inset gap</option>
          </SelectInput>
        </Field>
        <Field label={fit === "overlay" ? "Overlay" : fit === "inset" ? "Gap" : "Reveal"}>
          <TextInput value={amount} onChange={setAmount} />
        </Field>
        <Field label="Drawers in this opening">
          <SelectInput value={count} onChange={setCount}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </SelectInput>
        </Field>
        {count !== "1" ? (
          <Field label="Gap between fronts">
            <TextInput value={gap} onChange={setGap} />
          </Field>
        ) : null}
        <Field label="Slides">
          <SelectInput value={slide} onChange={(value) => setSlide(value as "undermount" | "side")}>
            <option value="undermount">Undermount (Blum Tandem-style)</option>
            <option value="side">Side-mount / epoxy</option>
          </SelectInput>
        </Field>
      </div>
    </ToolFrame>
  );
}
