"use client";

import { Field, NumberInput, Result, TextInput, ToolFrame } from "@/components/Fields";
import { BoardPicture } from "@/components/plans/ShopPictures";
import { BuildSheet } from "@/components/BuildSheet";
import { boardFeet, formatNumber, parseInches } from "@/lib/measure";
import { useMemo, useState } from "react";

export function BoardFeetCalc() {
  const [thickness, setThickness] = useState("4/4");
  const [width, setWidth] = useState("7 1/4");
  const [length, setLength] = useState("8");
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(8.5);
  const [waste, setWaste] = useState(15);

  const result = useMemo(() => {
    const t = parseInches(thickness);
    const w = parseInches(width);
    const lengthFeet = Number(length);
    if (!t || !w || !lengthFeet) return null;
    const lengthIn = lengthFeet * 12;
    const bf = boardFeet(t, w, lengthIn, qty);
    const withWaste = bf * (1 + waste / 100);
    return { bf, withWaste, cost: withWaste * price, t, w };
  }, [thickness, width, length, qty, price, waste]);

  return (
    <ToolFrame
      title="Board feet"
      description="Hardwood is sold by the board foot. Thickness uses the rough-sawn scale: 4/4 is one inch, 5/4 is 1¼″, 8/4 is two inches."
      results={
        result ? (
          <>
            <Result label="Net board feet" value={formatNumber(result.bf, 2)} />
            <Result
              label="With waste"
              value={formatNumber(result.withWaste, 2)}
              note={`${waste}% extra for kerf, defects, and milling.`}
            />
            <Result label="Estimated cost" value={`$${formatNumber(result.cost, 2)}`} />
          </>
        ) : (
          <Result label="Need dimensions" value="—" note="Use fractions like 4/4 or 7 1/4." />
        )
      }
      printFacts={
        result
          ? [
              { label: "Net board feet", value: formatNumber(result.bf, 2) },
              { label: "With waste", value: formatNumber(result.withWaste, 2), note: `${waste}% extra` },
              { label: "Estimated cost", value: `$${formatNumber(result.cost, 2)}` },
            ]
          : undefined
      }
      printRows={
        result
          ? [
              {
                name: "Boards to buy",
                qty,
                size: `${thickness} × ${width} × ${length}′`,
                note: `${formatNumber(result.withWaste, 2)} BF with ${waste}% waste · about $${formatNumber(result.cost, 2)}.`,
              },
            ]
          : undefined
      }
      printSteps={[
        { text: "Buy the waste number, not the net. Defects and milling eat the extra." },
        { text: "Pay for rough thickness. 4/4 that finishes 13/16″ is still billed as 1″." },
        { text: "Pick grain and color at the rack. The calculator cannot see the board." },
      ]}
      printFigures={
        result ? (
          <BoardPicture
            thickness={result.t}
            width={result.w}
            lengthFt={Number(length)}
            bf={result.bf}
            qty={qty}
          />
        ) : undefined
      }
      plan={
        result ? (
          <>
            <BoardPicture
              thickness={result.t}
              width={result.w}
              lengthFt={Number(length)}
              bf={result.bf}
              qty={qty}
            />
            <BuildSheet
              storageKey="storystick-cuts-board-feet"
              rows={[
                {
                  name: "Boards to buy",
                  qty,
                  size: `${thickness} × ${width} × ${length}′`,
                  note: `${formatNumber(result.withWaste, 2)} BF with ${waste}% waste · about $${formatNumber(result.cost, 2)}.`,
                  kind: "board",
                },
              ]}
              steps={[
                { id: "list", text: "Buy the waste number, not the net. Defects and milling eat the extra." },
                { id: "scale", text: "Pay for rough thickness. 4/4 that finishes 13/16″ is still billed as 1″." },
                { id: "pick", text: "Pick grain and color at the rack. The calculator cannot see the board." },
              ]}
            />
          </>
        ) : null
      }
    >
      <Field label="Thickness" hint='4/4, 5/4, or inches'>
        <TextInput value={thickness} onChange={setThickness} placeholder="4/4" />
      </Field>
      <Field label="Width" hint="inches">
        <TextInput value={width} onChange={setWidth} placeholder="7 1/4" />
      </Field>
      <Field label="Length" hint="feet">
        <TextInput value={length} onChange={setLength} placeholder="8" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Quantity">
          <NumberInput value={qty} min={1} step="1" onChange={setQty} />
        </Field>
        <Field label="Price / BF" hint="$">
          <NumberInput value={price} min={0} onChange={setPrice} />
        </Field>
        <Field label="Waste" hint="%">
          <NumberInput value={waste} min={0} onChange={setWaste} />
        </Field>
      </div>
    </ToolFrame>
  );
}
