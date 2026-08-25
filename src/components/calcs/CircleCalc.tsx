"use client";

import { Field, NumberInput, Result, TextInput, ToolFrame } from "@/components/Fields";
import { CirclePicture } from "@/components/plans/ShopPictures";
import { formatInches, formatNumber, parseInches } from "@/lib/measure";
import { useMemo, useState } from "react";

export function CircleCalc() {
  const [diameter, setDiameter] = useState("36");
  const [segments, setSegments] = useState(8);
  const [rise, setRise] = useState("3");

  const result = useMemo(() => {
    const d = parseInches(diameter);
    const h = parseInches(rise);
    const n = Math.max(3, Math.round(segments));
    if (!d) return null;
    const r = d / 2;
    const circ = Math.PI * d;
    const miter = 180 / n;
    const chord = d * Math.sin(Math.PI / n);
    const outerArc = circ / n;
    const radiusFromRise = h && h < r ? (r * r) / (2 * h) + h / 2 : null;
    return { r, circ, miter, chord, outerArc, radiusFromRise, h };
  }, [diameter, segments, rise]);

  return (
    <ToolFrame
      title="Circle & segments"
      description="Round tables, arched aprons, and glued-up rings. Chord length is the inside face of each segment before you cut the miters."
      results={
        result ? (
          <>
            <Result label="Circumference" value={formatInches(result.circ)} />
            <Result label="Radius" value={formatInches(result.r)} />
            <Result
              label="Segment miter"
              value={`${formatNumber(result.miter, 2)}°`}
              note={`${segments} pieces. Chord ${formatInches(result.chord)}.`}
            />
            <Result label="Arc per segment" value={formatInches(result.outerArc)} />
            {result.radiusFromRise ? (
              <Result
                label="Radius from rise"
                value={formatInches(result.radiusFromRise)}
                note={`Chord = diameter, rise ${formatInches(result.h ?? 0)}.`}
              />
            ) : null}
          </>
        ) : (
          <Result label="Need a diameter" value="—" />
        )
      }
      plan={
        result ? (
          <CirclePicture
            diameter={parseInches(diameter) ?? 0}
            segments={Math.max(3, Math.round(segments))}
            chord={result.chord}
            miter={result.miter}
          />
        ) : null
      }
    >
      <Field label="Diameter">
        <TextInput value={diameter} onChange={setDiameter} />
      </Field>
      <Field label="Ring segments">
        <NumberInput value={segments} min={3} step="1" onChange={setSegments} />
      </Field>
      <Field label="Arch rise" hint="optional, for radius">
        <TextInput value={rise} onChange={setRise} />
      </Field>
    </ToolFrame>
  );
}
