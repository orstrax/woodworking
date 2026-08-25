function inferArt(id: string | undefined, text: string) {
  if (id) return id;
  const t = text.toLowerCase();
  if (t.includes("pocket") || t.includes("dado") || t.includes("rabbet") || t.includes("screw through")) return "dados";
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
    <svg viewBox="0 0 80 64" className="h-[3.4rem] w-[4.25rem] shrink-0" aria-hidden>
      <rect x="0.5" y="0.5" width="79" height="63" fill="#fff" stroke="#000" strokeWidth="0.6" />
      <g fill="none" stroke="#000" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round">
        {drawing(kind)}
      </g>
    </svg>
  );
}

function drawing(kind: string) {
  switch (kind) {
    case "cut-sides":
      return (
        <>
          <rect x="14" y="10" width="18" height="44" />
          <rect x="48" y="10" width="18" height="44" />
          <path d="M8 40 H26" />
          <path d="M54 40 H72" />
        </>
      );
    case "dados":
      return (
        <>
          <rect x="18" y="8" width="22" height="48" />
          <path d="M18 22 H40 M18 38 H40 M40 14 H58 V50 H40" />
          <path d="M46 18 L54 22 L46 26" />
        </>
      );
    case "cut-panels":
      return (
        <>
          <rect x="10" y="14" width="36" height="10" />
          <rect x="10" y="28" width="36" height="10" />
          <rect x="52" y="14" width="18" height="36" />
        </>
      );
    case "dry-fit":
      return (
        <>
          <rect x="28" y="18" width="24" height="28" />
          <path d="M12 20 L26 26 M12 44 L26 38 M66 20 L54 26 M66 44 L54 38" />
        </>
      );
    case "glue-box":
      return (
        <>
          <path d="M22 18 H58 L66 26 V50 H22 Z" />
          <path d="M22 18 L30 12 H66 L58 18" />
          <path d="M66 26 L74 20 V44 L66 50" />
          <path d="M34 8 V18 M48 8 V18" />
        </>
      );
    case "face-frame":
    case "face-later":
      return (
        <>
          <rect x="18" y="12" width="44" height="40" />
          <rect x="26" y="20" width="28" height="24" />
        </>
      );
    case "doors":
      return (
        <>
          <rect x="16" y="10" width="48" height="44" />
          <rect x="22" y="16" width="18" height="32" />
          <rect x="42" y="16" width="16" height="32" />
          <circle cx="38" cy="32" r="1.6" fill="#000" stroke="none" />
        </>
      );
    case "drawers":
    case "fronts-later":
      return (
        <>
          <rect x="16" y="10" width="48" height="44" />
          <rect x="22" y="16" width="28" height="10" />
          <rect x="22" y="28" width="36" height="10" />
          <rect x="22" y="40" width="28" height="8" />
        </>
      );
    case "shelves":
      return (
        <>
          <rect x="18" y="10" width="44" height="44" />
          <path d="M22 24 H58 M22 36 H58 M22 48 H58" />
          <circle cx="26" cy="24" r="1.4" fill="#000" stroke="none" />
          <circle cx="26" cy="36" r="1.4" fill="#000" stroke="none" />
        </>
      );
    case "finish":
      return (
        <>
          <rect x="16" y="14" width="32" height="36" />
          <path d="M52 18 L64 30 M58 14 L70 26" />
          <rect x="60" y="28" width="8" height="18" />
        </>
      );
    case "measure":
      return (
        <>
          <rect x="10" y="28" width="60" height="10" />
          <path d="M18 28 V24 M30 28 V22 M42 28 V24 M54 28 V22" />
          <path d="M22 16 H42 V20" />
        </>
      );
    case "cut":
    case "cut-panels-alt":
      return (
        <>
          <rect x="12" y="26" width="56" height="12" />
          <path d="M40 12 L52 26 L44 26 L56 42" />
        </>
      );
    case "slab":
    case "frame":
    case "glue":
    case "cope":
      return (
        <>
          <rect x="22" y="8" width="36" height="48" />
          <rect x="28" y="16" width="24" height="32" />
          <path d="M22 8 L28 16 M58 8 L52 16 M22 56 L28 48 M58 56 L52 48" />
        </>
      );
    case "cups":
    case "hang":
      return (
        <>
          <rect x="18" y="10" width="28" height="44" />
          <circle cx="28" cy="22" r="5" />
          <circle cx="28" cy="42" r="5" />
          <rect x="50" y="20" width="16" height="24" />
        </>
      );
    case "label":
    case "gang":
    case "check":
      return (
        <>
          <rect x="12" y="16" width="22" height="32" />
          <rect x="30" y="16" width="22" height="32" />
          <rect x="48" y="16" width="20" height="32" />
          <path d="M18 12 H26 M54 12 H62" />
        </>
      );
    default:
      return (
        <>
          <rect x="16" y="18" width="20" height="28" />
          <rect x="44" y="18" width="20" height="28" />
          <path d="M36 32 H44" />
        </>
      );
  }
}
