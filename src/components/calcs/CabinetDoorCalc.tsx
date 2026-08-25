"use client";

import Link from "next/link";
import { CabinetPictures } from "@/components/plans/CabinetPictures";
import { Field, Result, SelectInput, TextInput, ToolFrame } from "@/components/Fields";
import { CutList } from "@/components/ShopDrawing";
import { doorPlan, hingeAdvice, type FitStyle } from "@/lib/cabinet";
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

export function CabinetDoorCalc() {
  const [measure, setMeasure] = useState<"opening" | "overall">("opening");
  const [openingW, setOpeningW] = useState("21");
  const [openingH, setOpeningH] = useState("30");
  const [stile, setStile] = useState("1 1/2");
  const [rail, setRail] = useState("1 1/2");
  const [preset, setPreset] = useState("r8");
  const [customFit, setCustomFit] = useState<FitStyle>("reveal");
  const [customAmount, setCustomAmount] = useState("1/8");
  const [doors, setDoors] = useState("1");
  const [midGap, setMidGap] = useState("1/8");

  const selected = FIT_OPTIONS.find((item) => item.id === preset) ?? FIT_OPTIONS[2];
  const fit = preset === "custom" ? customFit : selected.fit;
  const amountText = preset === "custom" ? customAmount : selected.amount;

  const plan = useMemo(() => {
    const rawW = parseInches(openingW);
    const rawH = parseInches(openingH);
    const st = parseInches(stile);
    const ra = parseInches(rail);
    const amt = parseInches(amountText);
    const gap = parseInches(midGap) ?? 1 / 8;
    if (rawW === null || rawH === null || st === null || ra === null || amt === null) return null;
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
  const shakerHref = plan
    ? `/tools/shaker-door?w=${encodeURIComponent(formatInches(plan.doorW).replace(/"/g, ""))}&h=${encodeURIComponent(formatInches(plan.doorH).replace(/"/g, ""))}`
    : "/tools/shaker-door";

  return (
    <ToolFrame
      title="Cabinet doors"
      description="Face-frame openings to finished door size. Pick a full overlay, a reveal, or an inset gap — then read the door, the overlay, and which hinges to buy."
      results={
        plan && hinges ? (
          <>
            <Result
              label={plan.doorCount === 2 ? "Each door" : "Door size"}
              value={`${formatInches(plan.doorW)} × ${formatInches(plan.doorH)}`}
              note={plan.doorCount === 2 ? `${formatInches(plan.midGap)} gap between the pair.` : "Single door."}
            />
            <Result
              label={fit === "inset" ? "Gap around door" : "Overlay on the frame"}
              value={formatInches(fit === "inset" ? plan.revealX : plan.overlayX)}
              note={
                fit === "inset"
                  ? "Door sits inside the opening."
                  : `${formatInches(plan.revealX)} of stile stays visible on each side.`
              }
            />
            <Result
              label="Hinges"
              value={`${hinges.count} × 35mm`}
              note={hinges.euro}
            />
            <p className="pt-4">
              <Link href={shakerHref} className="font-mono text-[11px] uppercase tracking-[0.16em] text-ticket-tan underline decoration-ticket-tan/50 underline-offset-4">
                Build this as a shaker door →
              </Link>
            </p>
          </>
        ) : (
          <Result label="Need an opening" value="—" note="Use fractions like 21 or 1 1/2." />
        )
      }
      plan={
        plan && hinges ? (
          <>
            <CabinetPictures plan={plan} hinges={hinges} />
            <CutList
              rows={[
                ...plan.doors.map((door, index) => ({
                  name: plan.doorCount === 1 ? "Door" : `Door ${index === 0 ? "left" : "right"}`,
                  qty: 1,
                  size: `${formatInches(door.width)} × ${formatInches(door.height)} × 3/4"`,
                  note: `${formatInches(plan.overlayX)} overlay · ${formatInches(plan.revealX)} reveal`,
                })),
                {
                  name: "Hinges",
                  qty: hinges.count * plan.doorCount,
                  size: hinges.cup,
                  note: `${hinges.tab}. ${hinges.traditional}.`,
                },
              ]}
            />
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
        <SelectInput value={measure} onChange={(value) => setMeasure(value as "opening" | "overall")}>
          <option value="opening">Inside opening (between the face frame)</option>
          <option value="overall">Outside of the face frame</option>
        </SelectInput>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={measure === "overall" ? "Face-frame width" : "Opening width"} hint={measure === "overall" ? "outside to outside" : "inside the face frame"}>
          <TextInput value={openingW} onChange={setOpeningW} />
        </Field>
        <Field label={measure === "overall" ? "Face-frame height" : "Opening height"}>
          <TextInput value={openingH} onChange={setOpeningH} />
        </Field>
        <Field label="Stile width" hint="left / right frame">
          <TextInput value={stile} onChange={setStile} />
        </Field>
        <Field label="Rail width" hint="top / bottom frame">
          <TextInput value={rail} onChange={setRail} />
        </Field>
      </div>
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
    </ToolFrame>
  );
}
