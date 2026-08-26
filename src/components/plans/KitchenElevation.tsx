"use client";

import { LayoutThumb } from "@/components/plans/LayoutThumb";
import { getLayout, layoutFromOpening } from "@/lib/cabinetBox";
import {
  overallWidthInches,
  type KitchenOpeningInput,
  type OpeningResult,
} from "@/lib/kitchen";
import { formatInches } from "@/lib/measure";

const PX = 7.2;
const UPPER_H = 118;
const BASE_H = 148;
const TALL_H = 292;
const COUNTER_H = 14;

function layoutOf(opening: KitchenOpeningInput) {
  return getLayout(layoutFromOpening(opening.row, opening.doorCount, opening.drawerCount));
}

export function KitchenElevation({
  openings,
  results,
  stile,
  selectedId,
  onSelect,
}: {
  openings: KitchenOpeningInput[];
  results: OpeningResult[];
  stile: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const uppers = openings.filter((item) => item.row === "upper");
  const lowers = openings.filter((item) => item.row !== "upper");
  const upperW = Math.max(runWidth(uppers, stile), 36);
  const lowerW = Math.max(runWidth(lowers, stile), 36);
  const canvasW = Math.max(upperW, lowerW) * PX + 48;
  const canvasH = 24 + UPPER_H + 18 + COUNTER_H + BASE_H + 36;

  const upperIn = runWidth(uppers, stile);
  const lowerIn = runWidth(lowers, stile);

  return (
    <div className="overflow-hidden rounded-[16px] border border-rule bg-[#e8d7b8] shadow-[var(--shadow-sm)]">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#d4c09a] bg-[#f4e6cc] px-4 py-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-shellac">Kitchen wall</p>
          <p className="font-display text-xl tracking-tight">Tap a cabinet. Add from the catalog.</p>
        </div>
        <p className="font-mono text-sm text-ink-soft">
          Uppers {formatInches(upperIn)} · Bases {formatInches(lowerIn)}
        </p>
      </div>
      <div className="overflow-x-auto">
        <div className="relative min-w-full" style={{ width: canvasW, height: canvasH }}>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#efe0c4_0%,#e4d0a8_55%,#d9c194_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-8 bg-[#c4a06a]" />
          <div className="absolute inset-x-0 bottom-8 h-1.5 bg-[#8a6a3a]" />

          <RunRow
            label="Uppers"
            top={20}
            height={UPPER_H}
            openings={uppers}
            results={results}
            stile={stile}
            selectedId={selectedId}
            onSelect={onSelect}
            empty="Tap an upper in the catalog"
          />

          <div
            className="absolute left-4 right-4 rounded-[2px] bg-[#8b5a32] shadow-[0_2px_0_#6b3a1f]"
            style={{ top: 20 + UPPER_H + 10, height: COUNTER_H }}
            aria-hidden
          />

          <RunRow
            label="Bases"
            top={20 + UPPER_H + 10 + COUNTER_H + 6}
            height={BASE_H}
            openings={lowers}
            results={results}
            stile={stile}
            selectedId={selectedId}
            onSelect={onSelect}
            empty="Tap a base or pantry in the catalog"
            tallHeight={TALL_H}
            tallBottom={20 + UPPER_H + 10 + COUNTER_H + 6 + BASE_H}
          />
        </div>
      </div>
    </div>
  );
}

function RunRow({
  label,
  top,
  height,
  openings,
  results,
  stile,
  selectedId,
  onSelect,
  empty,
  tallHeight,
  tallBottom,
}: {
  label: string;
  top: number;
  height: number;
  openings: KitchenOpeningInput[];
  results: OpeningResult[];
  stile: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
  empty: string;
  tallHeight?: number;
  tallBottom?: number;
}) {
  if (openings.length === 0) {
    return (
      <div
        className="absolute left-4 flex items-center rounded-[10px] border border-dashed border-[#8a6a3a]/60 px-4 text-sm text-[#6b5344]"
        style={{ top, height, width: 220 }}
      >
        {empty}
      </div>
    );
  }

  const placed = openings.map((opening, index) => {
    const overall = overallWidthInches(opening, stile) ?? 18;
    const w = Math.max(44, overall * PX);
    const left =
      16 +
      openings.slice(0, index).reduce((sum, earlier) => {
        return sum + Math.max(44, (overallWidthInches(earlier, stile) ?? 18) * PX) + 4;
      }, 0);
    const isTall = opening.row === "tall";
    const h = isTall && tallHeight ? tallHeight : height;
    const y = isTall && tallBottom ? tallBottom - h : top;
    return { opening, overall, w, left, h, y };
  });

  return (
    <>
      {placed.map(({ opening, overall, w, left, h, y }) => {
        const result = results.find((item) => item.id === opening.id);
        const selected = opening.id === selectedId;
        const layout = layoutOf(opening);
        return (
          <button
            key={opening.id}
            type="button"
            onClick={() => onSelect(opening.id)}
            aria-pressed={selected}
            aria-label={`${opening.name}, ${formatInches(overall)} wide`}
            className={`absolute overflow-hidden rounded-[4px] text-left transition ${
              selected
                ? "z-10 ring-2 ring-walnut ring-offset-2 ring-offset-[#e8d7b8]"
                : "hover:ring-2 hover:ring-walnut/40"
            }`}
            style={{ left, top: y, width: w, height: h }}
          >
            <CabinetFace
              opening={opening}
              layout={layout}
              error={Boolean(result?.error)}
              sink={opening.name.toLowerCase().includes("sink")}
            />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-[#24180f]/70 px-1 py-0.5 text-center text-[10px] font-semibold leading-tight text-[#f6edd8]">
              {formatInches(overall).replace(/"/g, "")}″
            </span>
            <span className="sr-only">{label}</span>
          </button>
        );
      })}
    </>
  );
}

function CabinetFace({
  opening,
  layout,
  error,
  sink,
}: {
  opening: KitchenOpeningInput;
  layout: ReturnType<typeof getLayout>;
  error: boolean;
  sink: boolean;
}) {
  return (
    <span className="relative block h-full w-full bg-[#c4a06a]">
      {layout ? (
        <LayoutThumb layout={layout} className="h-full w-full" />
      ) : (
        <span className="grid h-full place-items-center text-xs">{opening.name}</span>
      )}
      {sink ? (
        <span className="pointer-events-none absolute left-1/2 top-[18%] h-[22%] w-[56%] -translate-x-1/2 rounded-[40%] border-2 border-[#6b3a1f] bg-[#d8e4ee]/80" />
      ) : null}
      {error ? (
        <span className="pointer-events-none absolute inset-0 bg-shellac/20" />
      ) : null}
    </span>
  );
}

function runWidth(openings: KitchenOpeningInput[], stile: string) {
  return openings.reduce((sum, opening) => sum + (overallWidthInches(opening, stile) ?? 18), 0);
}
