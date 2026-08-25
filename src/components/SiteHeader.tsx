import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-rule/80 bg-paper/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-sm border border-walnut/40 bg-iron text-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 14.5h14" stroke="currentColor" strokeWidth="1.4" />
              <path d="M3 14.5V4.5h2.2v10" stroke="currentColor" strokeWidth="1.4" />
              <path d="M8 14.5V7h2.2v7.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M13 14.5V5.5h2.2V14.5" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg tracking-tight">
              Story Stick
            </span>
            <span className="block text-[11px] uppercase tracking-[0.22em] text-ink-soft">
              Shop calculators
            </span>
          </span>
        </Link>
        <p className="hidden max-w-xs text-right text-sm text-ink-soft sm:block">
          Fractions, board feet, and layout math — kept next to the bench.
        </p>
      </div>
    </header>
  );
}
