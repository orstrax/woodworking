function inferArt(id: string | undefined, text: string) {
  const t = text.toLowerCase();
  if (t.includes("pocket")) return "pocket";
  if (t.includes("screw through") || t.includes("screws through")) return "screws";
  if (id) return id;
  if (t.includes("dado") || t.includes("rabbet")) return "dados";
  if (t.includes("dry-fit") || t.includes("diagonals")) return "dry-fit";
  if (t.includes("face frame") || t.includes("stiles run")) return "face-frame";
  if (t.includes("hinge") || t.includes("35mm") || t.includes("cups")) return "cups";
  if (t.includes("drawer")) return "drawers";
  if (t.includes("door")) return "doors";
  if (t.includes("shelf")) return "shelves";
  if (t.includes("glue") || t.includes("clamp")) return "glue-box";
  if (t.includes("finish") || t.includes("sand")) return "finish";
  if (t.includes("measure") || t.includes("tape")) return "measure";
  if (t.includes("cut")) return "cut-panels";
  if (t.includes("miter")) return "slab";
  if (t.includes("gang") || t.includes("label")) return "label";
  return "generic";
}

export function StepArt({ id, text }: { id?: string; text: string }) {
  const kind = inferArt(id, text);
  return (
    <svg viewBox="0 0 160 112" className="h-[5.6rem] w-[8rem] shrink-0" aria-hidden>
      <g fill="#fff" stroke="#000" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        {drawing(kind)}
      </g>
    </svg>
  );
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const hx = x2 - Math.cos(angle) * 8;
  const hy = y2 - Math.sin(angle) * 8;
  return (
    <g fill="#000" stroke="#000" strokeWidth="1.5">
      <line x1={x1} y1={y1} x2={hx} y2={hy} />
      <polygon
        points={`${x2},${y2} ${hx - Math.sin(angle) * 3.4},${hy + Math.cos(angle) * 3.4} ${hx + Math.sin(angle) * 3.4},${hy - Math.cos(angle) * 3.4}`}
      />
    </g>
  );
}

function drawing(kind: string) {
  switch (kind) {
    case "cut-sides":
      return (
        <>
          <polygon points="22,18 58,10 58,86 22,94" />
          <polygon points="102,18 138,10 138,86 102,94" />
          <path d="M22,70 L58,62" strokeDasharray="3 2" fill="none" />
          <path d="M102,70 L138,62" strokeDasharray="3 2" fill="none" />
          <path d="M70,40 L86,32 L86,48 Z" fill="#000" stroke="none" />
        </>
      );
    case "dados":
      return (
        <>
          <polygon points="28,14 72,6 72,96 28,104" />
          <path d="M28,40 L72,32" fill="none" />
          <path d="M28,44 L72,36" fill="none" />
          <path d="M28,78 L72,70" fill="none" />
          <rect x="90" y="28" width="44" height="10" />
          <Arrow x1={112} y1={38} x2={68} y2={42} />
        </>
      );
    case "pocket":
      return (
        <>
          <polygon points="24,20 70,12 70,92 24,100" />
          <rect x="88" y="48" width="48" height="12" />
          <path d="M70,54 L88,54" fill="none" />
          <circle cx="64" cy="54" r="3" />
          <circle cx="64" cy="70" r="3" />
          <Arrow x1={112} y1={48} x2={74} y2={52} />
        </>
      );
    case "screws":
      return (
        <>
          <polygon points="22,18 64,10 64,90 22,98" />
          <rect x="86" y="42" width="50" height="14" />
          <path d="M64,49 L86,49" fill="none" />
          <path d="M118,36 L118,42 M114,39 L122,39" fill="none" />
          <Arrow x1={108} y1={42} x2={68} y2={48} />
        </>
      );
    case "cut-panels":
      return (
        <>
          <rect x="14" y="18" width="70" height="16" />
          <rect x="14" y="42" width="70" height="12" />
          <rect x="14" y="62" width="70" height="12" />
          <polygon points="102,16 142,22 142,96 102,90" />
          <path d="M88,26 L100,26" fill="none" />
        </>
      );
    case "dry-fit":
      return (
        <>
          <polygon points="18,28 40,20 40,84 18,92" />
          <polygon points="120,28 142,20 142,84 120,92" />
          <rect x="52" y="78" width="56" height="14" />
          <rect x="58" y="22" width="44" height="10" />
          <Arrow x1={44} y1={52} x2={56} y2={52} />
          <Arrow x1={116} y1={52} x2={104} y2={52} />
          <Arrow x1={80} y1={74} x2={80} y2={62} />
        </>
      );
    case "glue-box":
      return (
        <>
          <polygon points="28,30 70,18 128,30 128,86 70,98 28,86" />
          <path d="M70,18 L70,98" fill="none" />
          <path d="M28,30 L70,42 L128,30" fill="none" />
          <rect x="48" y="44" width="52" height="36" fill="#fff" />
          <Arrow x1={74} y1={8} x2={74} y2={24} />
        </>
      );
    case "face-frame":
    case "face-later":
      return (
        <>
          <polygon points="18,34 86,22 138,36 138,92 86,104 18,90" />
          <rect x="44" y="14" width="14" height="78" />
          <rect x="108" y="18" width="14" height="78" />
          <rect x="58" y="14" width="50" height="12" />
          <rect x="58" y="80" width="50" height="12" />
          <Arrow x1={72} y1={48} x2={56} y2={48} />
        </>
      );
    case "doors":
      return (
        <>
          <polygon points="22,24 92,14 92,98 22,88" />
          <rect x="102" y="22" width="36" height="70" />
          <path d="M92,36 A18,18 0 0 1 102,50" fill="none" />
          <circle cx="86" cy="40" r="3.2" />
          <Arrow x1={118} y1={56} x2={96} y2={56} />
        </>
      );
    case "drawers":
    case "fronts-later":
      return (
        <>
          <polygon points="18,22 86,12 86,96 18,86" />
          <rect x="40" y="30" width="78" height="22" />
          <rect x="48" y="36" width="18" height="6" />
          <Arrow x1={132} y1={42} x2={118} y2={42} />
        </>
      );
    case "shelves":
      return (
        <>
          <polygon points="22,20 70,10 128,24 128,92 70,102 22,82" />
          <path d="M22,48 L70,58 L128,52" fill="none" />
          <rect x="40" y="44" width="72" height="10" />
          <circle cx="36" cy="50" r="2.4" fill="#000" stroke="none" />
          <circle cx="112" cy="54" r="2.4" fill="#000" stroke="none" />
          <Arrow x1={80} y1={28} x2={80} y2={42} />
        </>
      );
    case "finish":
      return (
        <>
          <polygon points="24,28 78,16 130,30 130,88 78,100 24,86" />
          <path d="M78,16 L78,100" fill="none" />
          <rect x="118" y="40" width="10" height="28" />
          <path d="M118,40 L138,28" fill="none" />
        </>
      );
    case "measure":
      return (
        <>
          <rect x="18" y="36" width="124" height="16" />
          <path d="M34,36 V28 M58,36 V24 M82,36 V28 M106,36 V24 M130,36 V28" fill="none" />
          <path d="M40,70 H90 V82 H40 Z" />
        </>
      );
    case "cut":
      return (
        <>
          <rect x="16" y="48" width="128" height="16" />
          <path d="M86,18 L104,48 L92,48 L112,84" fill="#fff" />
        </>
      );
    case "slab":
    case "frame":
    case "glue":
    case "cope":
      return (
        <>
          <rect x="44" y="10" width="72" height="92" />
          <rect x="56" y="26" width="48" height="60" />
          <path d="M44,10 L56,26 M116,10 L104,26 M44,102 L56,86 M116,102 L104,86" fill="none" />
          <Arrow x1={28} y1={56} x2={42} y2={56} />
        </>
      );
    case "cups":
    case "hang":
      return (
        <>
          <rect x="22" y="12" width="54" height="88" />
          <circle cx="40" cy="32" r="8" />
          <circle cx="40" cy="32" r="3" fill="#000" stroke="none" />
          <circle cx="40" cy="74" r="8" />
          <circle cx="40" cy="74" r="3" fill="#000" stroke="none" />
          <rect x="96" y="28" width="40" height="56" />
          <Arrow x1={88} y1={56} x2={76} y2={56} />
        </>
      );
    case "label":
    case "gang":
    case "check":
      return (
        <>
          <rect x="16" y="24" width="36" height="64" />
          <rect x="58" y="24" width="36" height="64" />
          <rect x="100" y="24" width="36" height="64" />
          <path d="M24,16 H44 M108,16 H128" fill="none" />
        </>
      );
    default:
      return (
        <>
          <polygon points="20,30 52,18 52,86 20,98" />
          <rect x="72" y="40" width="56" height="16" />
          <Arrow x1={68} y1={48} x2={54} y2={48} />
        </>
      );
  }
}
