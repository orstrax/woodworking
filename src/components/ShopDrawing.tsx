import type { ReactNode } from "react";

export function ShopDrawing({
  title,
  children,
  viewBox,
}: {
  title: string;
  children: ReactNode;
  viewBox: string;
}) {
  return (
    <figure className="border border-rule bg-paper-2/40">
      <figcaption className="flex items-baseline justify-between border-b border-rule px-4 py-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-shellac">
          Shop drawing
        </span>
        <span className="text-sm text-ink-soft">{title}</span>
      </figcaption>
      <div className="overflow-x-auto px-2 py-4">
        <svg
          viewBox={viewBox}
          className="mx-auto h-auto w-full max-w-3xl"
          role="img"
          aria-label={title}
        >
          {children}
        </svg>
      </div>
    </figure>
  );
}

export function HDim({
  x,
  y,
  w,
  label,
  side = "top",
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  side?: "top" | "bottom";
}) {
  const dir = side === "top" ? -1 : 1;
  const ly = y + dir * 16;
  return (
    <g fill="none" stroke="#5c4633" strokeWidth="0.7">
      <line x1={x} y1={y} x2={x} y2={ly} />
      <line x1={x + w} y1={y} x2={x + w} y2={ly} />
      <line x1={x} y1={ly} x2={x + w} y2={ly} markerStart="url(#tick)" />
      <polygon points={`${x},${ly} ${x + 3},${ly - 1.6} ${x + 3},${ly + 1.6}`} fill="#5c4633" stroke="none" />
      <polygon
        points={`${x + w},${ly} ${x + w - 3},${ly - 1.6} ${x + w - 3},${ly + 1.6}`}
        fill="#5c4633"
        stroke="none"
      />
      <text
        x={x + w / 2}
        y={ly + dir * 10}
        textAnchor="middle"
        fill="#24180f"
        stroke="none"
        fontSize="9"
        fontFamily="ui-monospace, 'IBM Plex Mono', monospace"
      >
        {label}
      </text>
    </g>
  );
}

export function VDim({
  x,
  y,
  h,
  label,
  side = "left",
}: {
  x: number;
  y: number;
  h: number;
  label: string;
  side?: "left" | "right";
}) {
  const dir = side === "left" ? -1 : 1;
  const lx = x + dir * 16;
  return (
    <g fill="none" stroke="#5c4633" strokeWidth="0.7">
      <line x1={x} y1={y} x2={lx} y2={y} />
      <line x1={x} y1={y + h} x2={lx} y2={y + h} />
      <line x1={lx} y1={y} x2={lx} y2={y + h} />
      <polygon points={`${lx},${y} ${lx - 1.6},${y + 3} ${lx + 1.6},${y + 3}`} fill="#5c4633" stroke="none" />
      <polygon
        points={`${lx},${y + h} ${lx - 1.6},${y + h - 3} ${lx + 1.6},${y + h - 3}`}
        fill="#5c4633"
        stroke="none"
      />
      <text
        x={lx + dir * 8}
        y={y + h / 2 + 3}
        textAnchor={side === "left" ? "end" : "start"}
        fill="#24180f"
        stroke="none"
        fontSize="9"
        fontFamily="ui-monospace, 'IBM Plex Mono', monospace"
      >
        {label}
      </text>
    </g>
  );
}

export function CutList({
  rows,
}: {
  rows: { name: string; qty: number; size: string; note?: string }[];
}) {
  return (
    <div className="overflow-x-auto border border-rule">
      <table className="w-full text-left text-sm">
        <thead className="bg-paper-2/60 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
          <tr>
            <th className="px-3 py-2 font-medium">Part</th>
            <th className="px-3 py-2 font-medium">Qty</th>
            <th className="px-3 py-2 font-medium">Cut</th>
            <th className="px-3 py-2 font-medium">Note</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-t border-rule/70">
              <td className="px-3 py-2 font-medium">{row.name}</td>
              <td className="px-3 py-2 font-mono">{row.qty}</td>
              <td className="px-3 py-2 font-mono">{row.size}</td>
              <td className="px-3 py-2 text-ink-soft">{row.note ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
