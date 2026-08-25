"use client";

import { Field, NumberInput, Result, TextInput, ToolFrame } from "@/components/Fields";
import { MiterPicture } from "@/components/plans/ShopPictures";
import { BuildSheet } from "@/components/BuildSheet";
import { formatInches, formatNumber, parseInches } from "@/lib/measure";
import { useMemo, useState } from "react";

export function MiterCalc() {
  const [sides, setSides] = useState(4);
  const [outside, setOutside] = useState("18");
  const [width, setWidth] = useState("2 1/4");

  const result = useMemo(() => {
    const n = Math.max(3, Math.round(sides));
    const out = parseInches(outside);
    const rail = parseInches(width);
    if (!out || !rail) return null;
    const included = 360 / n;
    const miter = included / 2;
    const bevel = 90 - miter;
    const inside = out - 2 * rail;
    return { n, included, miter, bevel, inside };
  }, [sides, outside, width]);

  return (
    <ToolFrame
      title="Miter & polygons"
      description="Closed frames, boxes, and segmented tops. The miter is the saw setting for a blade at 90° to the table; the included angle is the corner of the polygon."
      results={
        result ? (
          <>
            <Result label="Miter (saw setting)" value={`${formatNumber(result.miter, 2)}°`} />
            <Result label="Included corner" value={`${formatNumber(result.included, 2)}°`} />
            <Result
              label="Bevel complement"
              value={`${formatNumber(result.bevel, 2)}°`}
              note="Use this if you cut the angle as a bevel instead of a miter."
            />
            <Result
              label="Inside opening"
              value={formatInches(result.inside)}
              note={`${result.n} sides.`}
            />
          </>
        ) : (
          <Result label="Need sizes" value="—" />
        )
      }
      plan={
        result ? (
          <>
            <MiterPicture
              sides={result.n}
              miter={result.miter}
              outside={parseInches(outside) ?? 0}
              inside={result.inside}
            />
            <BuildSheet
              storageKey="storystick-cuts-miter"
              rows={[
                {
                  name: "Frame parts",
                  qty: result.n,
                  size: `${formatInches(parseInches(width) ?? 0)} wide · long point ${formatInches(parseInches(outside) ?? 0)}`,
                  note: `Saw at ${formatNumber(result.miter, 2)}°. Inside ${formatInches(result.inside)}.`,
                  kind: "rail",
                },
              ]}
              steps={[
                { id: "set", text: `Set the saw to ${formatNumber(result.miter, 2)}° — that is the miter, not the corner.` },
                { id: "stop", text: "Cut one piece, then use a stop so every long point matches." },
                { id: "dry", text: "Dry-fit the whole frame. Gaps at a corner mean the saw is off, not the length." },
                { id: "glue", text: "Glue and strap. Check diagonals before the glue sets." },
              ]}
            />
          </>
        ) : null
      }
    >
      <Field label="Number of sides">
        <NumberInput value={sides} min={3} step="1" onChange={setSides} />
      </Field>
      <Field label="Outside dimension" hint="across flats / overall">
        <TextInput value={outside} onChange={setOutside} />
      </Field>
      <Field label="Stock width" hint="rail or rim">
        <TextInput value={width} onChange={setWidth} />
      </Field>
    </ToolFrame>
  );
}
