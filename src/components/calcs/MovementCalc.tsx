"use client";

import { Field, NumberInput, Result, SelectInput, TextInput, ToolFrame } from "@/components/Fields";
import { MovementPicture } from "@/components/plans/ShopPictures";
import { BuildSheet } from "@/components/BuildSheet";
import { formatInches, formatNumber, parseInches } from "@/lib/measure";
import { movementInches, SPECIES } from "@/lib/species";
import { useMemo, useState } from "react";

export function MovementCalc() {
  const [speciesId, setSpeciesId] = useState("walnut");
  const [grain, setGrain] = useState<"flat" | "quarter">("flat");
  const [width, setWidth] = useState("18");
  const [fromMc, setFromMc] = useState(12);
  const [toMc, setToMc] = useState(7);

  const species = SPECIES.find((item) => item.id === speciesId) ?? SPECIES[0];
  const result = useMemo(() => {
    const w = parseInches(width);
    if (!w) return null;
    const delta = toMc - fromMc;
    const change = movementInches(w, delta, species, grain);
    return { change, delta, abs: Math.abs(change) };
  }, [width, fromMc, toMc, species, grain]);

  return (
    <ToolFrame
      title="Wood movement"
      description="Panels grow across the grain as moisture rises, and shrink as it falls. Leave room in frames, breadboard ends, and tabletop fasteners."
      results={
        result ? (
          <>
            <Result
              label={result.delta >= 0 ? "Expected swell" : "Expected shrink"}
              value={formatInches(result.abs, 64)}
            />
            <Result
              label="Change"
              value={`${result.change >= 0 ? "+" : "−"}${formatNumber(result.abs, 3)}"`}
              note={`${species.name}, ${grain === "flat" ? "flat-sawn" : "quarter-sawn"}. ΔMC ${result.delta > 0 ? "+" : ""}${result.delta}%.`}
            />
            <p className="pt-3 text-sm leading-6 text-ticket-muted">
              Rule of thumb: allow this much play on each wide panel. Quarter-sawn stock moves less.
            </p>
          </>
        ) : (
          <Result label="Need a width" value="—" />
        )
      }
      printFacts={
        result
          ? [
              {
                label: result.delta >= 0 ? "Expected swell" : "Expected shrink",
                value: formatInches(result.abs, 64),
              },
              {
                label: "Change",
                value: `${result.change >= 0 ? "+" : "−"}${formatNumber(result.abs, 3)}"`,
                note: `${species.name}, ${grain === "flat" ? "flat-sawn" : "quarter-sawn"}. ΔMC ${result.delta > 0 ? "+" : ""}${result.delta}%.`,
              },
            ]
          : undefined
      }
      printSteps={
        result
          ? [
              {
                text: `Leave about ${formatInches(result.abs, 64)} of play across this ${width}″ panel.`,
                detail: "In a frame, that is float in the groove. On a tabletop, that is slotted fasteners or figure-8s.",
              },
              { text: "Do not glue a wide panel into a groove. Glue the frame joints only." },
              { text: "Finish all faces, including the underside, so the panel moves evenly." },
            ]
          : undefined
      }
      plan={
        result ? (
          <>
            <MovementPicture width={parseInches(width) ?? 0} change={result.change} />
            <BuildSheet
              storageKey="storystick-cuts-movement"
              rows={[]}
              steps={[
                {
                  id: "room",
                  text: `Leave about ${formatInches(result.abs, 64)} of play across this ${width}″ panel.`,
                  detail: "In a frame, that is float in the groove. On a tabletop, that is slotted fasteners or figure-8s.",
                },
                { id: "glue", text: "Do not glue a wide panel into a groove. Glue the frame joints only." },
                { id: "finish", text: "Finish all faces, including the underside, so the panel moves evenly." },
              ]}
            />
          </>
        ) : null
      }
    >
      <Field label="Species">
        <SelectInput value={speciesId} onChange={setSpeciesId}>
          {SPECIES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </SelectInput>
      </Field>
      <Field label="Grain">
        <SelectInput value={grain} onChange={(value) => setGrain(value as "flat" | "quarter")}>
          <option value="flat">Flat-sawn (tangential)</option>
          <option value="quarter">Quarter-sawn (radial)</option>
        </SelectInput>
      </Field>
      <Field label="Width across the grain">
        <TextInput value={width} onChange={setWidth} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="From moisture" hint="% MC">
          <NumberInput value={fromMc} min={0} onChange={setFromMc} />
        </Field>
        <Field label="To moisture" hint="% MC">
          <NumberInput value={toMc} min={0} onChange={setToMc} />
        </Field>
      </div>
    </ToolFrame>
  );
}
