export function HomeHeroPicture() {
  return (
    <figure className="overflow-hidden rounded-[16px] border border-rule bg-surface shadow-[var(--shadow-sm)]">
      <svg viewBox="0 0 560 380" className="block w-full" role="img" aria-label="A labeled kitchen cabinet wall">
        <defs>
          <pattern id="hero-oak" width="18" height="12" patternUnits="userSpaceOnUse">
            <rect width="18" height="12" fill="#c4a06a" />
            <path d="M0 3 Q9 1 18 4 M0 8 Q9 10 18 7" stroke="#9a7040" strokeWidth="0.7" fill="none" />
          </pattern>
          <pattern id="hero-maple" width="14" height="22" patternUnits="userSpaceOnUse">
            <rect width="14" height="22" fill="#efe0c4" />
            <path d="M3 0 C4 8 2 14 5 22 M10 0 C9 9 12 15 8 22" stroke="#d4b889" strokeWidth="0.8" fill="none" />
          </pattern>
          <pattern id="hero-panel" width="16" height="16" patternUnits="userSpaceOnUse">
            <rect width="16" height="16" fill="#f6ecd6" />
            <path d="M0 8 Q8 6 16 9" stroke="#e2d0a8" strokeWidth="0.7" fill="none" />
          </pattern>
          <linearGradient id="hero-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e7d7b8" />
            <stop offset="100%" stopColor="#dcc6a0" />
          </linearGradient>
        </defs>
        <rect width="560" height="380" fill="url(#hero-wall)" />
        <rect x="0" y="292" width="560" height="88" fill="#c9ae80" />
        <rect x="0" y="292" width="560" height="10" fill="#b08960" />
        <rect x="36" y="40" width="210" height="252" fill="url(#hero-oak)" stroke="#6b3a1f" strokeWidth="2.2" />
        <rect x="54" y="56" width="174" height="140" fill="#6d5a46" />
        <rect x="48" y="50" width="108" height="152" fill="url(#hero-maple)" stroke="#24180f" strokeWidth="1.4" />
        <rect x="70" y="70" width="64" height="112" fill="url(#hero-panel)" stroke="#8a6a3a" />
        <rect x="162" y="50" width="78" height="152" fill="url(#hero-maple)" stroke="#24180f" strokeWidth="1.4" />
        <circle cx="60" cy="72" r="5" fill="#e8d7b5" stroke="#6b3a1f" />
        <circle cx="60" cy="168" r="5" fill="#e8d7b5" stroke="#6b3a1f" />
        <circle cx="228" cy="72" r="5" fill="#e8d7b5" stroke="#6b3a1f" />
        <circle cx="228" cy="168" r="5" fill="#e8d7b5" stroke="#6b3a1f" />
        <rect x="54" y="210" width="174" height="64" fill="url(#hero-maple)" stroke="#24180f" strokeWidth="1.3" />
        <rect x="128" y="236" width="28" height="8" rx="1" fill="#6b3a1f" />
        <rect x="270" y="88" width="250" height="204" fill="url(#hero-oak)" stroke="#6b3a1f" strokeWidth="2.2" />
        <rect x="288" y="108" width="214" height="72" fill="url(#hero-maple)" stroke="#24180f" />
        <rect x="288" y="188" width="214" height="84" fill="url(#hero-maple)" stroke="#24180f" />
        <rect x="382" y="138" width="26" height="8" rx="1" fill="#6b3a1f" />
        <rect x="382" y="224" width="26" height="8" rx="1" fill="#6b3a1f" />
        <circle cx="92" cy="64" r="9" fill="#c45c26" stroke="#24180f" strokeWidth="0.7" />
        <text x="92" y="68" textAnchor="middle" fill="#f3ead7" fontSize="11" fontWeight="700">
          1
        </text>
        <circle cx="118" cy="248" r="9" fill="#c45c26" stroke="#24180f" strokeWidth="0.7" />
        <text x="118" y="252" textAnchor="middle" fill="#f3ead7" fontSize="11" fontWeight="700">
          2
        </text>
        <circle cx="394" cy="124" r="9" fill="#c45c26" stroke="#24180f" strokeWidth="0.7" />
        <text x="394" y="128" textAnchor="middle" fill="#f3ead7" fontSize="11" fontWeight="700">
          3
        </text>
        <g fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="12" fill="#24180f">
          <text x="36" y="328">1 Door on a face frame</text>
          <text x="36" y="348">2 Drawer front</text>
          <text x="270" y="328">3 Stacked drawers — same overlay as the doors</text>
        </g>
      </svg>
    </figure>
  );
}
