import type { ReactNode } from "react";

function fills(slug: string) {
  return {
    oak: `url(#${slug}-oak)`,
    maple: `url(#${slug}-maple)`,
    panel: `url(#${slug}-panel)`,
  };
}

function Frame({ slug, label, children }: { slug: string; label: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 320 180" className="block h-full w-full" role="img" aria-label={label}>
      <defs>
        <pattern id={`${slug}-oak`} width="14" height="10" patternUnits="userSpaceOnUse">
          <rect width="14" height="10" fill="#c9a06a" />
          <path d="M0 3 Q7 1 14 4 M0 8 Q7 9 14 7" stroke="#a07840" strokeWidth="0.6" fill="none" />
        </pattern>
        <pattern id={`${slug}-maple`} width="12" height="16" patternUnits="userSpaceOnUse">
          <rect width="12" height="16" fill="#efe0c4" />
          <path d="M3 0 C4 6 2 11 4 16 M9 0 C8 8 11 12 8 16" stroke="#d4b889" strokeWidth="0.7" fill="none" />
        </pattern>
        <pattern id={`${slug}-panel`} width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill="#f6ecd6" />
          <path d="M0 8 Q8 6 16 9" stroke="#e2d0a8" strokeWidth="0.6" fill="none" />
        </pattern>
      </defs>
      <rect width="320" height="180" fill="#efe4cc" />
      {children}
    </svg>
  );
}

export function ToolThumb({ slug, className }: { slug: string; className?: string }) {
  return <div className={className}>{renderThumb(slug)}</div>;
}

function renderThumb(slug: string) {
  const f = fills(slug);
  switch (slug) {
    case "kitchen-plan":
      return (
        <Frame slug={slug} label="A kitchen of cabinets">
          <rect x="36" y="28" width="70" height="52" fill={f.oak} stroke="#6b3a1f" />
          <rect x="112" y="28" width="96" height="52" fill={f.oak} stroke="#6b3a1f" />
          <rect x="214" y="28" width="70" height="52" fill={f.oak} stroke="#6b3a1f" />
          <rect x="36" y="92" width="90" height="64" fill={f.maple} stroke="#24180f" />
          <rect x="132" y="92" width="70" height="64" fill={f.maple} stroke="#24180f" />
          <rect x="208" y="92" width="76" height="64" fill={f.oak} stroke="#6b3a1f" />
          <line x1="81" y1="100" x2="81" y2="148" stroke="#6b3a1f" />
          <line x1="246" y1="100" x2="246" y2="148" stroke="#6b3a1f" />
        </Frame>
      );
    case "shaker-door":
      return (
        <Frame slug={slug} label="Shaker door">
          <rect x="96" y="18" width="128" height="144" fill={f.oak} stroke="#6b3a1f" strokeWidth="1.8" />
          <rect x="118" y="40" width="84" height="100" fill={f.panel} stroke="#8a6a3a" />
          <rect x="96" y="18" width="22" height="144" fill={f.oak} stroke="#6b3a1f" />
          <rect x="202" y="18" width="22" height="144" fill={f.oak} stroke="#6b3a1f" />
        </Frame>
      );
    case "drawers":
      return (
        <Frame slug={slug} label="Drawer fronts">
          <rect x="84" y="24" width="152" height="132" fill={f.oak} stroke="#6b3a1f" strokeWidth="1.8" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x="96" y={36 + i * 38} width="128" height="32" fill={f.maple} stroke="#24180f" strokeWidth="1.1" />
              <rect x="148" y={48 + i * 38} width="24" height="6" rx="1" fill="#6b3a1f" />
            </g>
          ))}
        </Frame>
      );
    case "board-feet":
      return (
        <Frame slug={slug} label="A hardwood board">
          <polygon points="70,86 230,86 268,52 108,52" fill="#d4b07a" stroke="#6b3a1f" />
          <polygon points="230,86 268,52 268,108 230,142" fill="#b88955" stroke="#6b3a1f" />
          <polygon points="70,86 230,86 230,142 70,142" fill={f.maple} stroke="#24180f" />
        </Frame>
      );
    case "measure":
      return (
        <Frame slug={slug} label="Tape measure">
          <rect x="36" y="70" width="248" height="40" rx="4" fill="#c45c26" />
          <rect x="48" y="82" width="224" height="22" fill="#efe3cc" />
          {Array.from({ length: 8 }, (_, i) => (
            <line key={i} x1={48 + i * 28} y1="82" x2={48 + i * 28} y2="100" stroke="#24180f" strokeWidth="1.2" />
          ))}
          <rect x="48" y="82" width="70" height="22" fill="#c45c26" opacity="0.35" />
        </Frame>
      );
    case "spacing":
      return (
        <Frame slug={slug} label="Evenly spaced holes">
          <rect x="36" y="74" width="248" height="32" fill={f.maple} stroke="#24180f" />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <circle cx={60 + i * 50} cy="90" r="8" fill="#e8d7b5" stroke="#6b3a1f" />
              <circle cx={60 + i * 50} cy="90" r="2.4" fill="#6b3a1f" />
            </g>
          ))}
        </Frame>
      );
    case "miter":
      return (
        <Frame slug={slug} label="Mitered frame">
          <polygon points="160,28 252,78 210,150 68,150 28,78" fill={f.oak} stroke="#6b3a1f" strokeWidth="1.5" />
          <polygon points="160,62 210,90 186,128 134,128 110,90" fill="#f3ead7" stroke="#8a6a3a" />
        </Frame>
      );
    case "dovetail":
      return (
        <Frame slug={slug} label="Dovetails">
          <rect x="50" y="50" width="220" height="80" fill={f.maple} stroke="#24180f" />
          <path
            d="M70 50 L100 50 L112 130 L58 130 Z M130 50 L190 50 L202 130 L118 130 Z M220 50 L250 50 L262 130 L208 130 Z"
            fill="#c4a06a"
            stroke="#6b3a1f"
          />
        </Frame>
      );
    case "movement":
      return (
        <Frame slug={slug} label="Wood movement">
          <rect x="50" y="48" width="220" height="84" fill={f.oak} stroke="#6b3a1f" strokeWidth="1.6" />
          <rect x="68" y="62" width="184" height="56" fill={f.panel} stroke="#8a6a3a" />
          <path d="M40 90 L22 90 M22 90 L30 84 M22 90 L30 96" stroke="#c45c26" strokeWidth="2.2" fill="none" />
          <path d="M280 90 L298 90 M298 90 L290 84 M298 90 L290 96" stroke="#c45c26" strokeWidth="2.2" fill="none" />
        </Frame>
      );
    case "circle":
      return (
        <Frame slug={slug} label="Segmented ring">
          <polygon
            points="160,30 230,70 230,130 160,170 90,130 90,70"
            fill={f.maple}
            stroke="#6b3a1f"
            strokeWidth="1.5"
          />
          <polygon points="160,90 160,30 230,70" fill="#c45c26" opacity="0.35" stroke="#c45c26" />
        </Frame>
      );
    case "weight":
      return (
        <Frame slug={slug} label="A heavy slab">
          <polygon points="60,90 210,90 250,56 100,56" fill="#d4b07a" stroke="#6b3a1f" />
          <polygon points="210,90 250,56 250,100 210,140" fill="#8b5a32" stroke="#6b3a1f" />
          <polygon points="60,90 210,90 210,140 60,140" fill="#8b5a32" stroke="#24180f" />
        </Frame>
      );
    case "square":
      return (
        <Frame slug={slug} label="Matching diagonals">
          <rect x="84" y="36" width="152" height="108" fill={f.oak} stroke="#6b3a1f" strokeWidth="1.8" />
          <line x1="84" y1="36" x2="236" y2="144" stroke="#c45c26" strokeWidth="1.6" />
          <line x1="236" y1="36" x2="84" y2="144" stroke="#c45c26" strokeWidth="1.6" strokeDasharray="4 3" />
        </Frame>
      );
    case "glue-up":
      return (
        <Frame slug={slug} label="Glued panel">
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={52 + i * 54}
              y="44"
              width="50"
              height="92"
              fill={i % 2 ? f.oak : f.maple}
              stroke="#6b3a1f"
            />
          ))}
        </Frame>
      );
    case "kerf":
      return (
        <Frame slug={slug} label="Saw kerf">
          <rect x="40" y="58" width="240" height="64" fill={f.maple} stroke="#24180f" />
          <rect x="152" y="58" width="10" height="64" fill="#f3ead7" stroke="#c45c26" />
        </Frame>
      );
    default:
      return (
        <Frame slug={slug} label="Cabinet door on a face frame">
          <rect x="78" y="28" width="164" height="128" fill={f.oak} stroke="#6b3a1f" strokeWidth="2" />
          <rect x="96" y="42" width="128" height="100" fill="#6d5a46" />
          <rect x="90" y="36" width="118" height="110" fill={f.maple} stroke="#24180f" strokeWidth="1.4" />
          <circle cx="102" cy="58" r="5" fill="#e8d7b5" stroke="#6b3a1f" />
          <circle cx="102" cy="118" r="5" fill="#e8d7b5" stroke="#6b3a1f" />
          <circle cx="186" cy="90" r="4" fill="#6b3a1f" />
        </Frame>
      );
  }
}
