import type { CabinetLayout, FaceCell } from "@/lib/cabinetBox";

export function LayoutThumb({
  layout,
  className,
}: {
  layout: Pick<CabinetLayout, "cells" | "kind">;
  className?: string;
}) {
  const toe = layout.kind === "upper" ? 0 : 8;
  const frame = 3.2;
  const innerTop = 3 + frame;
  const innerH = 53 - innerTop - toe - 1;
  const shareSum = layout.cells.reduce((sum, cell) => sum + cell.share, 0) || 1;
  const gap = 1.2;
  const usable = innerH - gap * Math.max(0, layout.cells.length - 1);

  return (
    <svg viewBox="0 0 40 56" className={className} aria-hidden>
      <rect x="4" y="3" width="32" height="50" fill="#c4a06a" stroke="#6b3a1f" strokeWidth="1.2" />
      {layout.cells.map((cell, index) => {
        const h = (usable * cell.share) / shareSum;
        const y =
          innerTop +
          layout.cells.slice(0, index).reduce((sum, earlier) => sum + (usable * earlier.share) / shareSum + gap, 0);
        return cellIcon(cell, 4 + frame, y, 32 - frame * 2, h);
      })}
      {toe > 0 ? <rect x="4" y={53 - toe} width="32" height={toe} fill="#6b3a1f" /> : null}
    </svg>
  );
}

function cellIcon(cell: FaceCell | CabinetLayout["cells"][number], x: number, y: number, w: number, h: number) {
  if (cell.kind === "doors") {
    const count = cell.count <= 1 ? 1 : 2;
    const dw = (w - (count - 1) * 1.1) / count;
    return (
      <g key={`${cell.label}-${y}`}>
        {Array.from({ length: count }, (_, i) => (
          <rect
            key={i}
            x={x + i * (dw + 1.1)}
            y={y}
            width={dw}
            height={h}
            fill="#efe0c4"
            stroke="#24180f"
            strokeWidth="0.7"
          />
        ))}
      </g>
    );
  }
  return (
    <g key={`${cell.label}-${y}`}>
      <rect x={x} y={y} width={w} height={h} fill="#efe0c4" stroke="#24180f" strokeWidth="0.7" />
      {cell.kind === "drawer" ? (
        <rect x={x + w / 2 - 4} y={y + h / 2 - 1} width="8" height="2" rx="0.4" fill="#6b3a1f" />
      ) : (
        <line x1={x + 2} y1={y + h / 2} x2={x + w - 2} y2={y + h / 2} stroke="#c45c26" strokeWidth="0.8" />
      )}
    </g>
  );
}
