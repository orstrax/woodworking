import type { ReactNode } from "react";

export function WoodDefs() {
  return (
    <defs>
      <pattern id="grain-frame" width="18" height="12" patternUnits="userSpaceOnUse">
        <rect width="18" height="12" fill="#c4a06a" />
        <path
          d="M0 3 Q9 1 18 4 M0 8 Q9 10 18 7"
          stroke="#9a7040"
          strokeWidth="0.7"
          fill="none"
        />
      </pattern>
      <pattern id="grain-door" width="14" height="22" patternUnits="userSpaceOnUse">
        <rect width="14" height="22" fill="#efe0c4" />
        <path
          d="M3 0 C4 8 2 14 5 22 M10 0 C9 9 12 15 8 22"
          stroke="#d4b889"
          strokeWidth="0.8"
          fill="none"
        />
      </pattern>
      <pattern id="grain-panel" width="16" height="16" patternUnits="userSpaceOnUse">
        <rect width="16" height="16" fill="#f6ecd6" />
        <path d="M0 8 Q8 6 16 9" stroke="#e2d0a8" strokeWidth="0.7" fill="none" />
      </pattern>
      <pattern id="grain-dark" width="12" height="18" patternUnits="userSpaceOnUse">
        <rect width="12" height="18" fill="#8b5a32" />
        <path
          d="M2 0 C4 6 1 12 3 18 M8 0 C7 8 10 12 7 18"
          stroke="#6a4020"
          strokeWidth="0.7"
          fill="none"
        />
      </pattern>
      <pattern id="hatch-box" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="#ece4d4" />
        <path d="M0 6 L6 0" stroke="#cbb896" strokeWidth="0.6" />
      </pattern>
      <pattern id="paper-grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <rect width="20" height="20" fill="#f7eedc" />
        <path d="M20 0 L20 20 M0 20 L20 20" stroke="#e4d4b6" strokeWidth="0.6" />
      </pattern>
      <linearGradient id="wood-shine" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
        <stop offset="50%" stopColor="#fff" stopOpacity="0" />
        <stop offset="100%" stopColor="#3a2414" stopOpacity="0.08" />
      </linearGradient>
      <filter id="lift" x="-12%" y="-12%" width="124%" height="124%">
        <feDropShadow dx="1.4" dy="2.2" stdDeviation="1.4" floodColor="#24180f" floodOpacity="0.2" />
      </filter>
    </defs>
  );
}

export function Chip({
  x,
  y,
  text,
  fill = "#24180f",
  color = "#f3ead7",
}: {
  x: number;
  y: number;
  text: string;
  fill?: string;
  color?: string;
}) {
  const width = Math.max(44, text.length * 6.5 + 14);
  return (
    <g>
      <rect x={x - width / 2} y={y - 10} width={width} height={20} rx="10" fill={fill} />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        fill={color}
        stroke="none"
        fontSize="10.5"
        fontFamily="ui-monospace, 'IBM Plex Mono', monospace"
      >
        {text}
      </text>
    </g>
  );
}

export function Callout({
  n,
  x,
  y,
}: {
  n: number;
  x: number;
  y: number;
}) {
  return (
    <g>
      <circle cx={x} cy={y} r="9" fill="#c45c26" stroke="#24180f" strokeWidth="0.9" />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        fill="#f3ead7"
        stroke="none"
        fontSize="11"
        fontWeight="700"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        {n}
      </text>
    </g>
  );
}

export function Arrow({
  x1,
  y1,
  x2,
  y2,
  color = "#c45c26",
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
}) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const hx = x2 - Math.cos(angle) * 7;
  const hy = y2 - Math.sin(angle) * 7;
  return (
    <g fill={color} stroke={color} strokeWidth="1.5">
      <line x1={x1} y1={y1} x2={hx} y2={hy} />
      <polygon
        points={`${x2},${y2} ${hx - Math.sin(angle) * 3.2},${hy + Math.cos(angle) * 3.2} ${hx + Math.sin(angle) * 3.2},${hy - Math.cos(angle) * 3.2}`}
      />
    </g>
  );
}

export function DimH({
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
  const mid = x + w / 2;
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={ly} stroke="#5c4633" strokeWidth="0.8" />
      <line x1={x + w} y1={y} x2={x + w} y2={ly} stroke="#5c4633" strokeWidth="0.8" />
      <line x1={x} y1={ly} x2={x + w} y2={ly} stroke="#5c4633" strokeWidth="0.9" />
      <polygon points={`${x},${ly} ${x + 4},${ly - 2} ${x + 4},${ly + 2}`} fill="#5c4633" />
      <polygon
        points={`${x + w},${ly} ${x + w - 4},${ly - 2} ${x + w - 4},${ly + 2}`}
        fill="#5c4633"
      />
      <text
        x={mid}
        y={ly + dir * 12}
        textAnchor="middle"
        fill="#24180f"
        stroke="none"
        fontSize="11"
        fontFamily="ui-monospace, 'IBM Plex Mono', monospace"
      >
        {label}
      </text>
    </g>
  );
}

export function DimV({
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
  const mid = y + h / 2;
  return (
    <g>
      <line x1={x} y1={y} x2={lx} y2={y} stroke="#5c4633" strokeWidth="0.8" />
      <line x1={x} y1={y + h} x2={lx} y2={y + h} stroke="#5c4633" strokeWidth="0.8" />
      <line x1={lx} y1={y} x2={lx} y2={y + h} stroke="#5c4633" strokeWidth="0.9" />
      <polygon points={`${lx},${y} ${lx - 2},${y + 4} ${lx + 2},${y + 4}`} fill="#5c4633" />
      <polygon
        points={`${lx},${y + h} ${lx - 2},${y + h - 4} ${lx + 2},${y + h - 4}`}
        fill="#5c4633"
      />
      <text
        x={lx + dir * 10}
        y={mid + 4}
        textAnchor={side === "left" ? "end" : "start"}
        fill="#24180f"
        stroke="none"
        fontSize="11"
        fontFamily="ui-monospace, 'IBM Plex Mono', monospace"
      >
        {label}
      </text>
    </g>
  );
}

export function Caption({
  x,
  y,
  text,
  anchor = "start",
}: {
  x: number;
  y: number;
  text: string;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill="#5c4633"
      stroke="none"
      fontSize="11"
      fontFamily="ui-sans-serif, system-ui, sans-serif"
    >
      {text}
    </text>
  );
}

export function Legend({ items }: { items: { n: number; label: string; hint?: string }[] }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.n} className="flex gap-3 text-sm leading-5">
          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-shellac text-xs font-bold text-paper">
            {item.n}
          </span>
          <span>
            <span className="font-medium text-ink">{item.label}</span>
            {item.hint ? <span className="block text-ink-soft">{item.hint}</span> : null}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function Picture({
  title,
  caption,
  viewBox,
  children,
  legend,
}: {
  title: string;
  caption: string;
  viewBox: string;
  children: ReactNode;
  legend?: { n: number; label: string; hint?: string }[];
}) {
  return (
    <figure className="print-break overflow-hidden rounded-sm border border-rule bg-[#fbf6eb] shadow-[4px_4px_0_rgba(36,24,15,0.06)] print:overflow-visible print:shadow-none">
      <figcaption className="border-b border-rule px-4 py-4 sm:px-6 print:px-3 print:py-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-shellac">Picture</p>
        <h3 className="mt-1 font-display text-2xl tracking-tight sm:text-3xl print:text-xl">{title}</h3>
        <p className="mt-2 max-w-2xl text-base leading-7 text-ink-soft print:mt-1 print:text-sm print:leading-5">{caption}</p>
      </figcaption>
      <div className="px-2 py-6 sm:px-5 print:px-1 print:py-2">
        <svg viewBox={viewBox} className="mx-auto h-auto w-full max-w-4xl print:max-h-[3.4in]" role="img" aria-label={title}>
          <WoodDefs />
          <rect width="100%" height="100%" fill="url(#paper-grid)" />
          {children}
        </svg>
      </div>
      {legend ? (
        <div className="border-t border-rule bg-paper/90 px-4 py-5 sm:px-6">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
            Match the orange numbers
          </p>
          <Legend items={legend} />
        </div>
      ) : null}
    </figure>
  );
}
