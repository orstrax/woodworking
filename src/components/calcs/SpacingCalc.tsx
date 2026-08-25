"use client";

import { Field, NumberInput, Result, TextInput, ToolFrame } from "@/components/Fields";
import { SpacingPicture } from "@/components/plans/ShopPictures";
import { formatInches, formatNumber, parseInches } from "@/lib/measure";
import { useMemo, useState } from "react";

export function SpacingCalc() {
  const [span, setSpan] = useState("32");
  const [count, setCount] = useState(5);
  const [inset, setInset] = useState("1 1/2");

  const result = useMemo(() => {
    const spanIn = parseInches(span);
    const insetIn = parseInches(inset) ?? 0;
    if (!spanIn || count < 2) return null;
    const usable = spanIn - insetIn * 2;
    if (usable <= 0) return null;
    const spaces = count - 1;
    const oc = usable / spaces;
    const centers = Array.from({ length: count }, (_, i) => insetIn + i * oc);
    return { oc, centers, usable };
  }, [span, count, inset]);

  return (
    <ToolFrame
      title="Even spacing"
      description="Put N holes, slats, or pegs across a span with matching insets at each end. Centers are measured from the left edge."
      results={
        result ? (
          <>
            <Result label="On-center spacing" value={formatInches(result.oc)} />
            <Result
              label="Usable span"
              value={formatInches(result.usable)}
              note={`${formatNumber(result.usable, 3)}″ between the insets.`}
            />
            <div className="pt-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ticket-tan">
                Centers from left
              </p>
              <ol className="mt-2 space-y-1 font-mono text-sm">
                {result.centers.map((center, index) => (
                  <li key={index}>
                    {index + 1}. {formatInches(center)}
                  </li>
                ))}
              </ol>
            </div>
          </>
        ) : (
          <Result label="Need a span" value="—" />
        )
      }
      plan={
        result ? (
          <SpacingPicture span={parseInches(span) ?? 0} inset={parseInches(inset) ?? 0} centers={result.centers} oc={result.oc} />
        ) : null
      }
    >
      <Field label="Overall span" hint="outside to outside">
        <TextInput value={span} onChange={setSpan} />
      </Field>
      <Field label="Number of holes / parts">
        <NumberInput value={count} min={2} step="1" onChange={setCount} />
      </Field>
      <Field label="End inset" hint="each side">
        <TextInput value={inset} onChange={setInset} />
      </Field>
    </ToolFrame>
  );
}
