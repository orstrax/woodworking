"use client";

import { Field, NumberInput, Result, TextInput, ToolFrame } from "@/components/Fields";
import { KerfPicture } from "@/components/plans/ShopPictures";
import { BuildSheet } from "@/components/BuildSheet";
import { formatInches, parseInches } from "@/lib/measure";
import { crosscutWaste, ripPlan } from "@/lib/shop";
import { useMemo, useState } from "react";

export function KerfCalc() {
  const [stock, setStock] = useState("8");
  const [piece, setPiece] = useState("2");
  const [kerf, setKerf] = useState("1/8");
  const [length, setLength] = useState("18");
  const [pieces, setPieces] = useState(4);

  const rips = useMemo(() => {
    const s = parseInches(stock);
    const p = parseInches(piece);
    const k = parseInches(kerf);
    if (!s || !p || k === null) return null;
    return { ...(ripPlan(s, p, k) ?? { count: 0, leftover: s, rips: 0, used: 0 }), s, p, k };
  }, [stock, piece, kerf]);

  const cross = useMemo(() => {
    const l = parseInches(length);
    const k = parseInches(kerf);
    if (!l || k === null) return null;
    return crosscutWaste(l, pieces, k);
  }, [length, pieces, kerf]);

  return (
    <ToolFrame
      title="Kerf & rips"
      description="The blade eats a little wood every cut. That missing strip is the kerf. Count it or the last piece comes out skinny."
      results={
        rips ? (
          <>
            <Result
              label="Strips from this board"
              value={`${rips.count}`}
              note={`${rips.rips} rip${rips.rips === 1 ? "" : "s"} · leftover ${formatInches(rips.leftover)}.`}
            />
            <Result
              label="Used by strips + kerfs"
              value={formatInches(rips.used)}
              note={`${formatInches(rips.p)} each, ${formatInches(rips.k)} kerf.`}
            />
            {cross ? (
              <Result
                label="Stick for crosscuts"
                value={formatInches(cross.needed)}
                note={`${pieces} @ ${formatInches(parseInches(length) ?? 0)} plus ${formatInches(cross.waste)} of kerf.`}
              />
            ) : null}
          </>
        ) : (
          <Result label="Need sizes" value="—" />
        )
      }
      plan={
        rips && rips.count > 0 ? (
          <>
            <KerfPicture stock={rips.s} piece={rips.p} kerf={rips.k} count={rips.count} />
            <BuildSheet
              storageKey="storystick-cuts-kerf"
              rows={[
                {
                  name: "Rip strips",
                  qty: rips.count,
                  size: formatInches(rips.p),
                  note: `From ${formatInches(rips.s)} stock · leftover ${formatInches(rips.leftover)}.`,
                  kind: "strip",
                },
                ...(cross
                  ? [
                      {
                        name: "Crosscut stick",
                        qty: 1,
                        size: formatInches(cross.needed),
                        note: `${pieces} @ ${formatInches(parseInches(length) ?? 0)} plus ${formatInches(cross.waste)} kerf.`,
                        kind: "board" as const,
                      },
                    ]
                  : []),
              ]}
              steps={[
                { id: "count", text: "Count the rips before you start. Every cut eats a kerf." },
                { id: "rip", text: "Rip the strips. Do not assume the last one equals the first." },
                { id: "cross", text: "For crosscuts, use a stop block. Still add kerf to the stick you buy." },
              ]}
            />
          </>
        ) : null
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Stock width" hint="the board you have">
          <TextInput value={stock} onChange={setStock} />
        </Field>
        <Field label="Strip width" hint="what you want">
          <TextInput value={piece} onChange={setPiece} />
        </Field>
        <Field label="Kerf" hint="⅛″ full-kerf">
          <TextInput value={kerf} onChange={setKerf} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Crosscut length" hint="optional, one stick">
          <TextInput value={length} onChange={setLength} />
        </Field>
        <Field label="How many pieces">
          <NumberInput value={pieces} min={1} step="1" onChange={setPieces} />
        </Field>
      </div>
      <p className="text-sm leading-6 text-ink-soft">
        A typical table-saw full-kerf blade is about ⅛″. Thin-kerf is about ³⁄₃₂″. Measure yours with a
        scrap if it matters.
      </p>
    </ToolFrame>
  );
}
