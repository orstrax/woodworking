"use client";

import { Field, NumberInput, Result, SelectInput, TextInput, ToolFrame, summaryLabelClass } from "@/components/Fields";
import { DovetailPicture } from "@/components/plans/ShopPictures";
import { BuildSheet } from "@/components/BuildSheet";
import { formatInches, parseInches } from "@/lib/measure";
import { useMemo, useState } from "react";

export function DovetailCalc() {
  const [width, setWidth] = useState("6 1/2");
  const [tails, setTails] = useState(3);
  const [ratio, setRatio] = useState("1:8");

  const result = useMemo(() => {
    const board = parseInches(width);
    const n = Math.max(1, Math.round(tails));
    if (!board) return null;
    const pins = n + 1;
    const units = n * 2 + pins * 1;
    const unit = board / units;
    const tailW = unit * 2;
    const pinW = unit;
    const slope = ratio === "1:6" ? 6 : 8;
    const angle = (Math.atan(1 / slope) * 180) / Math.PI;
    const marks: { kind: "pin" | "tail"; start: number; end: number }[] = [];
    let cursor = 0;
    for (let i = 0; i < pins; i += 1) {
      marks.push({ kind: "pin", start: cursor, end: cursor + pinW });
      cursor += pinW;
      if (i < n) {
        marks.push({ kind: "tail", start: cursor, end: cursor + tailW });
        cursor += tailW;
      }
    }
    return { tailW, pinW, angle, slope, marks };
  }, [width, tails, ratio]);

  return (
    <ToolFrame
      title="Dovetail layout"
      description="Half pins on both ends, even tails in between. Mark from the baseline along the board width. Hardwood often uses 1:8; softwood 1:6."
      results={
        result ? (
          <>
            <Result label="Tail width" value={formatInches(result.tailW)} />
            <Result label="Pin / half-pin" value={formatInches(result.pinW)} />
            <Result
              label="Slope"
              value={`1:${result.slope}`}
              note={`${result.angle.toFixed(1)}° off square.`}
            />
            <div className="pt-3">
              <p className={summaryLabelClass}>
                Marks from edge
              </p>
              <ol className="mt-2 space-y-1 font-mono text-sm">
                {result.marks.map((mark, index) => (
                  <li key={index}>
                    {mark.kind} {formatInches(mark.start)} – {formatInches(mark.end)}
                  </li>
                ))}
              </ol>
            </div>
          </>
        ) : (
          <Result label="Need a width" value="—" />
        )
      }
      printFacts={
        result
          ? [
              { label: "Tail width", value: formatInches(result.tailW) },
              { label: "Pin / half-pin", value: formatInches(result.pinW) },
              { label: "Slope", value: `1:${result.slope}`, note: `${result.angle.toFixed(1)}° off square` },
              {
                label: "Marks from edge",
                value: result.marks.map((mark) => `${mark.kind} ${formatInches(mark.start)}–${formatInches(mark.end)}`).join(" · "),
              },
            ]
          : undefined
      }
      printRows={
        result
          ? result.marks.map((mark, index) => ({
              name: `${mark.kind} ${index + 1}`,
              qty: 1,
              size: `${formatInches(mark.start)} – ${formatInches(mark.end)}`,
              note: mark.kind === "pin" ? "Half-pins sit on both ends." : `Tail about ${formatInches(result.tailW)} wide.`,
            }))
          : undefined
      }
      printSteps={
        result
          ? [
              { text: "Mark the baseline with a gauge. Hardwood often 1:8, softwood 1:6." },
              { text: "Saw the tails first. Stay on the waste side of every line." },
              { text: "Stand the tail board on the pin board and knife the pins from the tails." },
              { text: "Saw and chop the pins. Pare to the knife line — do not sneak past it." },
            ]
          : undefined
      }
      printFigures={
        result ? (
          <DovetailPicture width={parseInches(width) ?? 0} marks={result.marks} slope={result.slope} />
        ) : undefined
      }
      plan={
        result ? (
          <>
            <DovetailPicture width={parseInches(width) ?? 0} marks={result.marks} slope={result.slope} />
            <BuildSheet
              storageKey="storystick-cuts-dovetail"
              rows={result.marks.map((mark, index) => ({
                name: `${mark.kind} ${index + 1}`,
                qty: 1,
                size: `${formatInches(mark.start)} – ${formatInches(mark.end)}`,
                note: mark.kind === "pin" ? "Half-pins sit on both ends." : `Tail about ${formatInches(result.tailW)} wide.`,
                kind: "board",
              }))}
              steps={[
                { id: "gauge", text: "Mark the baseline with a gauge. Hardwood often 1:8, softwood 1:6." },
                { id: "tails", text: "Saw the tails first. Stay on the waste side of every line." },
                { id: "transfer", text: "Stand the tail board on the pin board and knife the pins from the tails." },
                { id: "pins", text: "Saw and chop the pins. Pare to the knife line — do not sneak past it." },
              ]}
            />
          </>
        ) : null
      }
    >
      <Field label="Board width">
        <TextInput value={width} onChange={setWidth} />
      </Field>
      <Field label="Number of tails">
        <NumberInput value={tails} min={1} step="1" onChange={setTails} />
      </Field>
      <Field label="Slope">
        <SelectInput value={ratio} onChange={setRatio}>
          <option value="1:8">1:8 hardwood</option>
          <option value="1:6">1:6 softwood</option>
        </SelectInput>
      </Field>
    </ToolFrame>
  );
}
