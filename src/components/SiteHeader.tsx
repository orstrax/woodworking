import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-rule/70 bg-[#f6efe4]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-3.5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-lg border border-walnut/30 bg-iron text-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 14.5h14" stroke="currentColor" strokeWidth="1.4" />
              <path d="M3 14.5V4.5h2.2v10" stroke="currentColor" strokeWidth="1.4" />
              <path d="M8 14.5V7h2.2v7.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M13 14.5V5.5h2.2V14.5" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg tracking-tight">Story Stick</span>
            <span className="block text-[11px] uppercase tracking-[0.22em] text-ink-soft">
              Modern woody shop math
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.16em] text-walnut">
          <Link href="/#tools" className="hover:text-shellac">
            Tools
          </Link>
          <Link href="/#start" className="hover:text-shellac">
            Start here
          </Link>
          <Link href="/shop-words" className="hover:text-shellac">
            Shop words
          </Link>
        </nav>
      </div>
    </header>
  );
}
