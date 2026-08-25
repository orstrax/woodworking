"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

const LINKS = [
  { href: "/tools/kitchen-plan", label: "Kitchen planner" },
  { href: "/tools/cabinet-box", label: "Box builder" },
  { href: "/#tools", label: "Tools" },
  { href: "/#start", label: "Start here" },
  { href: "/shop-words", label: "Shop words" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-30 bg-[#f6efe4]/95 print:hidden">
      <div className="mx-auto flex h-[var(--site-header-h)] max-w-6xl items-center justify-between gap-3 border-b border-rule/70 px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span
            aria-hidden
            className="grid h-6 w-6 place-items-center rounded-md border border-walnut/30 bg-iron text-paper"
          >
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M2 14.5h14" stroke="currentColor" strokeWidth="1.4" />
              <path d="M3 14.5V4.5h2.2v10" stroke="currentColor" strokeWidth="1.4" />
              <path d="M8 14.5V7h2.2v7.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M13 14.5V5.5h2.2V14.5" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </span>
          <span className="font-display text-base leading-none tracking-tight">Story Stick</span>
        </Link>
        <nav className="hidden items-center gap-4 font-mono text-[11px] uppercase tracking-[0.16em] text-walnut md:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-shellac">
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="grid h-8 w-8 place-items-center text-walnut md:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <MenuIcon open={open} />
        </button>
      </div>
      {open ? (
        <div id={menuId} className="border-b border-rule/70 bg-[#f6efe4] px-5 py-3 md:hidden">
          <nav className="grid gap-0.5 font-mono text-sm uppercase tracking-[0.14em] text-walnut">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-2 py-2 hover:bg-paper"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden>
      {open ? (
        <>
          <path d="M5 5 L15 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M15 5 L5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M4 6 H16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M4 10 H16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M4 14 H16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
