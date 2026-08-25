export function HomeHeroPicture() {
  return (
    <figure className="overflow-hidden rounded-sm border border-rule bg-[#fbf6eb] shadow-[6px_6px_0_rgba(36,24,15,0.08)]">
      <figcaption className="border-b border-rule px-4 py-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-shellac">How every tool looks</p>
        <h2 className="mt-1 font-display text-2xl tracking-tight">A labeled picture, not a spreadsheet.</h2>
      </figcaption>
      <svg viewBox="0 0 420 340" className="block w-full" role="img" aria-label="Labeled shaker cabinet door">
        <defs>
          <pattern id="hero-frame" width="18" height="12" patternUnits="userSpaceOnUse">
            <rect width="18" height="12" fill="#c4a06a" />
            <path d="M0 3 Q9 1 18 4 M0 8 Q9 10 18 7" stroke="#9a7040" strokeWidth="0.7" fill="none" />
          </pattern>
          <pattern id="hero-panel" width="16" height="16" patternUnits="userSpaceOnUse">
            <rect width="16" height="16" fill="#f6ecd6" />
            <path d="M0 8 Q8 6 16 9" stroke="#e2d0a8" strokeWidth="0.7" fill="none" />
          </pattern>
          <filter id="hero-lift" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="1.4" dy="2" stdDeviation="1.4" floodColor="#24180f" floodOpacity="0.18" />
          </filter>
        </defs>
        <rect width="420" height="340" fill="#f7eedc" />
        <rect x="88" y="36" width="200" height="250" fill="url(#hero-frame)" stroke="#6b3a1f" strokeWidth="2" filter="url(#hero-lift)" />
        <rect x="88" y="36" width="36" height="250" fill="url(#hero-frame)" stroke="#6b3a1f" strokeWidth="1.1" />
        <rect x="252" y="36" width="36" height="250" fill="url(#hero-frame)" stroke="#6b3a1f" strokeWidth="1.1" />
        <rect x="124" y="36" width="128" height="36" fill="url(#hero-frame)" stroke="#6b3a1f" strokeWidth="1.1" />
        <rect x="124" y="250" width="128" height="36" fill="url(#hero-frame)" stroke="#6b3a1f" strokeWidth="1.1" />
        <rect x="124" y="72" width="128" height="178" fill="url(#hero-panel)" stroke="#8a6a3a" strokeWidth="1" />
        <circle cx="106" cy="70" r="9" fill="#c45c26" stroke="#24180f" strokeWidth="0.8" />
        <text x="106" y="74" textAnchor="middle" fill="#f3ead7" fontSize="11" fontWeight="700">1</text>
        <circle cx="188" cy="54" r="9" fill="#c45c26" stroke="#24180f" strokeWidth="0.8" />
        <text x="188" y="58" textAnchor="middle" fill="#f3ead7" fontSize="11" fontWeight="700">2</text>
        <circle cx="188" cy="160" r="9" fill="#c45c26" stroke="#24180f" strokeWidth="0.8" />
        <text x="188" y="164" textAnchor="middle" fill="#f3ead7" fontSize="11" fontWeight="700">3</text>
        <rect x="148" y="12" width="80" height="18" rx="9" fill="#24180f" />
        <text x="188" y="25" textAnchor="middle" fill="#f3ead7" fontSize="10" fontFamily="ui-monospace, monospace">24″</text>
        <rect x="28" y="148" width="48" height="18" rx="9" fill="#24180f" />
        <text x="52" y="161" textAnchor="middle" fill="#f3ead7" fontSize="10" fontFamily="ui-monospace, monospace">30″</text>
        <rect x="148" y="300" width="124" height="18" rx="9" fill="#c45c26" />
        <text x="210" y="313" textAnchor="middle" fill="#f3ead7" fontSize="10" fontFamily="ui-monospace, monospace">center 22½″</text>
        <g fontSize="12" fill="#24180f" fontFamily="ui-sans-serif, system-ui, sans-serif">
          <circle cx="318" cy="78" r="8" fill="#c45c26" />
          <text x="318" y="82" textAnchor="middle" fill="#f3ead7" fontSize="10" fontWeight="700">1</text>
          <text x="332" y="82">Stile</text>
          <circle cx="318" cy="112" r="8" fill="#c45c26" />
          <text x="318" y="116" textAnchor="middle" fill="#f3ead7" fontSize="10" fontWeight="700">2</text>
          <text x="332" y="116">Rail</text>
          <circle cx="318" cy="146" r="8" fill="#c45c26" />
          <text x="318" y="150" textAnchor="middle" fill="#f3ead7" fontSize="10" fontWeight="700">3</text>
          <text x="332" y="150">Panel</text>
        </g>
      </svg>
    </figure>
  );
}
