"use client";

import { Field, Result, TextInput, ToolFrame } from "@/components/Fields";
import { GluePicture } from "@/components/plans/ShopPictures";
import { formatInches, parseInches } from "@/lib/measure";
import { glueUp } from "@/lib/shop";
import { useMemo, useState } from "react";

export function GlueUpCalc() {
  const [finished, setFinished] = useState("24");
  const [board, setBoard] = useState("5 1/2");

  const result = useMemo(() => {
    const f = parseInches(finished);
    const b = parseInches(board);
    if (!f || !b) return null;
    return glueUp(f, b);
  }, [finished, board]);

  const finishedIn = parseInches(finished);
  const boardIn = parseInches(board);

  return (
    <ToolFrame
      title="Panel glue-up"
      description="A wide top is several boards glued edge to edge. Joint first, then count how many you need, and leave extra width to flatten and trim."
      results={
        result && finishedIn && boardIn ? (
          <>
            <Result
              label="Boards"
              value={`${result.count}`}
              note={`${result.joints} glue line${result.joints === 1 ? "" : "s"}.`}
            />
            <Result
              label="Panel before trim"
              value={formatInches(result.panel)}
              note={`${formatInches(result.extra)} extra to flatten and cut to ${formatInches(finishedIn)}.`}
            />
            <Result
              label="Each board"
              value={formatInches(boardIn)}
              note="After jointing both edges. Alternate the grain so the panel stays flat."
            />
          </>
        ) : (
          <Result label="Need widths" value="—" />
        )
      }
      plan={
        result && finishedIn && boardIn ? (
          <GluePicture
            count={result.count}
            boardWidth={boardIn}
            finished={finishedIn}
            extra={result.extra}
          />
        ) : null
      }
    >
      <Field label="Finished width" hint="the top you want">
        <TextInput value={finished} onChange={setFinished} />
      </Field>
      <Field label="Board width" hint="after jointing">
        <TextInput value={board} onChange={setBoard} />
      </Field>
      <p className="text-sm leading-6 text-ink-soft">
        Boards 3–5″ wide after jointing are a friendly size — calm grain, less cupping. Do not cut to
        finished width until the panel is flat.
      </p>
    </ToolFrame>
  );
}
