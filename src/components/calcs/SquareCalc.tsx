"use client";

import { Field, Result, TextInput, ToolFrame } from "@/components/Fields";
import { SquarePicture } from "@/components/plans/ShopPictures";
import { BuildSheet } from "@/components/BuildSheet";
import { formatInches, parseInches } from "@/lib/measure";
import { rectangleDiagonal, squareCheck, threeFourFive } from "@/lib/shop";
import { useMemo, useState } from "react";

export function SquareCalc() {
  const [width, setWidth] = useState("24");
  const [height, setHeight] = useState("30");
  const [diagA, setDiagA] = useState("");
  const [diagB, setDiagB] = useState("");

  const result = useMemo(() => {
    const w = parseInches(width);
    const h = parseInches(height);
    if (!w || !h) return null;
    const expected = rectangleDiagonal(w, h);
    const a = parseInches(diagA);
    const b = parseInches(diagB);
    const measured =
      a !== null && b !== null ? squareCheck(w, h, a, b) : { expected, spread: 0, square: true };
    const short = Math.min(w, h);
    const tff = threeFourFive(short);
    return { w, h, expected, measured, tff, hasDiags: a !== null && b !== null };
  }, [width, height, diagA, diagB]);

  return (
    <ToolFrame
      title="Square check"
      description="A box is square when both diagonals match. Measure corner to opposite corner twice. The 3-4-5 triangle is another way to prove a right angle on the floor or a benchtop."
      results={
        result ? (
          <>
            <Result
              label="Expected diagonal"
              value={formatInches(result.expected)}
              note={`${formatInches(result.w)} × ${formatInches(result.h)}.`}
            />
            {result.hasDiags ? (
              <Result
                label={result.measured.square ? "Square" : "Out of square"}
                value={formatInches(result.measured.spread)}
                note={
                  result.measured.square
                    ? "Diagonals match within 1/32″. Leave it."
                    : "Spread between the two tapes. Pull the long diagonal until they match."
                }
              />
            ) : (
              <Result label="Measured spread" value="—" note="Enter both diagonals to check the glue-up." />
            )}
            <Result
              label="3-4-5 from the short side"
              value={`${formatInches(result.tff.a)} · ${formatInches(result.tff.b)} · ${formatInches(result.tff.c)}`}
              note="Mark 3 units one way, 4 the other. The diagonal should be 5."
            />
          </>
        ) : (
          <Result label="Need a rectangle" value="—" />
        )
      }
      printFacts={
        result
          ? [
              { label: "Expected diagonal", value: formatInches(result.expected), note: `${formatInches(result.w)} × ${formatInches(result.h)}` },
              {
                label: result.hasDiags ? (result.measured.square ? "Square" : "Out of square") : "Measured spread",
                value: result.hasDiags ? formatInches(result.measured.spread) : "—",
              },
              {
                label: "3-4-5 from the short side",
                value: `${formatInches(result.tff.a)} · ${formatInches(result.tff.b)} · ${formatInches(result.tff.c)}`,
              },
            ]
          : undefined
      }
      printSteps={
        result
          ? [
              { text: `Pull both diagonals. They should each read ${formatInches(result.expected)}.` },
              { text: "If they differ, pull the long diagonal until they match." },
              { text: `Or mark a 3-4-5: ${formatInches(result.tff.a)} · ${formatInches(result.tff.b)} · ${formatInches(result.tff.c)}.` },
              { text: "On a cabinet, put the back on while it is still square." },
            ]
          : undefined
      }
      plan={
        result ? (
          <>
            <SquarePicture
              width={result.w}
              height={result.h}
              expected={result.expected}
              status={!result.hasDiags ? "unknown" : result.measured.square ? "square" : "out"}
            />
            <BuildSheet
              storageKey="storystick-cuts-square"
              rows={[]}
              steps={[
                { id: "measure", text: `Pull both diagonals. They should each read ${formatInches(result.expected)}.` },
                { id: "pull", text: "If they differ, pull the long diagonal (clamp or strap) until they match." },
                {
                  id: "345",
                  text: `Or mark a 3-4-5: ${formatInches(result.tff.a)} · ${formatInches(result.tff.b)} · ${formatInches(result.tff.c)}.`,
                },
                { id: "back", text: "On a cabinet, put the back on while it is still square." },
              ]}
            />
          </>
        ) : null
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Width">
          <TextInput value={width} onChange={setWidth} />
        </Field>
        <Field label="Height">
          <TextInput value={height} onChange={setHeight} />
        </Field>
        <Field label="Diagonal A" hint="optional">
          <TextInput value={diagA} onChange={setDiagA} placeholder="measure one corner pair" />
        </Field>
        <Field label="Diagonal B" hint="optional">
          <TextInput value={diagB} onChange={setDiagB} placeholder="the other pair" />
        </Field>
      </div>
      <p className="text-sm leading-6 text-ink-soft">
        Check a cabinet carcass before the glue sets. Doors and drawers will not fit a parallelogram, even
        if every side is the right length.
      </p>
    </ToolFrame>
  );
}
