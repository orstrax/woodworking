"use client";

import { Field, Result, SelectInput, TextInput, ToolFrame } from "@/components/Fields";
import { WeightPicture } from "@/components/plans/ShopPictures";
import { BuildSheet } from "@/components/BuildSheet";
import { boardFeet, formatNumber, parseInches } from "@/lib/measure";
import { SPECIES, weightLb } from "@/lib/species";
import { useMemo, useState } from "react";

export function WeightCalc() {
  const [speciesId, setSpeciesId] = useState("walnut");
  const [thickness, setThickness] = useState("1 3/8");
  const [width, setWidth] = useState("36");
  const [length, setLength] = useState("72");

  const species = SPECIES.find((item) => item.id === speciesId) ?? SPECIES[0];
  const result = useMemo(() => {
    const t = parseInches(thickness);
    const w = parseInches(width);
    const l = parseInches(length);
    if (!t || !w || !l) return null;
    const volumeFt3 = (t * w * l) / 1728;
    const pounds = weightLb(volumeFt3, species);
    return { pounds, volumeFt3, kg: pounds * 0.453592, bf: boardFeet(t, w, l) };
  }, [thickness, width, length, species]);

  return (
    <ToolFrame
      title="Weight estimator"
      description="Air-dry averages from typical published densities. Real boards vary with moisture and heartwood, so treat this as a shipping and hardware estimate."
      results={
        result ? (
          <>
            <Result label="Weight" value={`${formatNumber(result.pounds, 1)} lb`} />
            <Result label="Metric" value={`${formatNumber(result.kg, 1)} kg`} />
            <Result
              label="Volume"
              value={`${formatNumber(result.volumeFt3, 3)} ft³`}
              note={`${formatNumber(result.bf, 2)} board feet of ${species.name.toLowerCase()}.`}
            />
          </>
        ) : (
          <Result label="Need dimensions" value="—" />
        )
      }
      plan={
        result ? (
          <>
            <WeightPicture
              thickness={parseInches(thickness) ?? 0}
              width={parseInches(width) ?? 0}
              length={parseInches(length) ?? 0}
              pounds={result.pounds}
              species={species.name}
            />
            <BuildSheet
              storageKey="storystick-cuts-weight"
              rows={[]}
              steps={[
                { id: "hands", text: `Plan on about ${formatNumber(result.pounds, 0)} lb. Oak is heavy; pine is not.` },
                { id: "hardware", text: "Check tabletop fasteners, casters, and wall cabinets against this number." },
                { id: "lift", text: "A second pair of hands is cheaper than a cracked panel." },
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
              {item.name} ({item.densityLbFt3} lb/ft³)
            </option>
          ))}
        </SelectInput>
      </Field>
      <Field label="Thickness">
        <TextInput value={thickness} onChange={setThickness} />
      </Field>
      <Field label="Width">
        <TextInput value={width} onChange={setWidth} />
      </Field>
      <Field label="Length" hint="inches">
        <TextInput value={length} onChange={setLength} />
      </Field>
    </ToolFrame>
  );
}
