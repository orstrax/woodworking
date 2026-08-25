"use client";

import { Field, NumberInput, Result, TextInput, ToolFrame } from "@/components/Fields";
import { CirclePicture } from "@/components/plans/ShopPictures";
import { BuildSheet } from "@/components/BuildSheet";
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
      printFacts={
        result
          ? [
              { label: "Circumference", value: formatInches(result.circ) },
              { label: "Radius", value: formatInches(result.r) },
              {
                label: "Segment miter",
                value: `${formatNumber(result.miter, 2)}°`,
                note: `${segments} pieces. Chord ${formatInches(result.chord)}.`,
              },
              { label: "Arc per segment", value: formatInches(result.outerArc) },
            ]
          : undefined
      }
      printRows={
        result
          ? [
              {
                name: "Ring segments",
                qty: Math.max(3, Math.round(segments)),
                size: `Chord ${formatInches(result.chord)} · miter ${formatNumber(result.miter, 2)}°`,
                note: "The chord is the inside face of each board before the miters.",
              },
            ]
          : undefined
      }
      printSteps={
        result
          ? [
              { text: "Cut every segment to the same chord. A stop block matters more than a tape here." },
              { text: `Miter ${formatNumber(result.miter, 2)}° on both ends of each piece.` },
              { text: "Dry-fit the ring. Glue in halves if it is large, then join the halves." },
            ]
          : undefined
      }
      plan={
        result ? (
          <>
            <CirclePicture
              diameter={parseInches(diameter) ?? 0}
              segments={Math.max(3, Math.round(segments))}
              chord={result.chord}
              miter={result.miter}
            />
            <BuildSheet
              storageKey="storystick-cuts-circle"
              rows={[
                {
                  name: "Ring segments",
                  qty: Math.max(3, Math.round(segments)),
                  size: `Chord ${formatInches(result.chord)} · miter ${formatNumber(result.miter, 2)}°`,
                  note: "The chord is the inside face of each board before the miters.",
                  kind: "segment",
                },
              ]}
              steps={[
                { id: "cut", text: "Cut every segment to the same chord. A stop block matters more than a tape here." },
                { id: "miter", text: `Miter ${formatNumber(result.miter, 2)}° on both ends of each piece.` },
                { id: "glue", text: "Dry-fit the ring. Glue in halves if it is large, then join the halves." },
              ]}
            />
          </>
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
