"use client";

import { Field, Result, TextInput, ToolFrame } from "@/components/Fields";
import { MeasurePicture } from "@/components/plans/ShopPictures";
import { formatInches, formatNumber, parseInches, toFraction } from "@/lib/measure";
import { useMemo, useState } from "react";

export function MeasureCalc() {
  const [input, setInput] = useState("1 7/16");

  const inches = useMemo(() => parseInches(input), [input]);

  return (
    <ToolFrame
      title="Measure converter"
      description="Paste a tape reading, a decimal, or millimeters. Lumber thicknesses like 4/4 and 8/4 are treated as inches."
      results={
        inches === null ? (
          <Result label="Waiting" value="—" note="Try 1 7/16, 0.4375, or 19mm." />
        ) : (
          <>
            <Result label="Decimal inches" value={`${formatNumber(inches, 4)}"`} />
            <Result label="Nearest 32nd" value={formatInches(inches, 32)} />
            <Result label="Nearest 16th" value={formatInches(inches, 16)} />
            <Result label="Millimeters" value={`${formatNumber(inches * 25.4, 2)} mm`} />
            <Result
              label="Quarter scale"
              value={`${toFraction(inches, 4)}`}
              note="4/4 = 1″ rough. Useful when buying lumber."
            />
          </>
        )
      }
      printFacts={
        inches === null
          ? undefined
          : [
              { label: "Decimal inches", value: `${formatNumber(inches, 4)}"` },
              { label: "Nearest 32nd", value: formatInches(inches, 32) },
              { label: "Nearest 16th", value: formatInches(inches, 16) },
              { label: "Millimeters", value: `${formatNumber(inches * 25.4, 2)} mm` },
              { label: "Quarter scale", value: `${toFraction(inches, 4)}`, note: "4/4 = 1″ rough" },
            ]
      }
      plan={inches !== null && inches > 0 ? <MeasurePicture inches={inches} /> : null}
    >
      <Field label="Measurement" hint='1 7/16, 19mm, 5/4'>
        <TextInput
          value={input}
          onChange={setInput}
          placeholder='1 7/16" or 36.5 mm'
        />
      </Field>
      <p className="text-sm leading-6 text-ink-soft">
        Add <span className="font-mono">mm</span> for millimeters. Mixed fractions need a space:
        <span className="font-mono"> 3 1/2</span>.
      </p>
    </ToolFrame>
  );
}
