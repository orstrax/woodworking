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
    <header className="sticky top-0 z-30 border-b border-rule/70 bg-[#f6efe4]/90 print:hidden backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-3.5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
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
        <nav className="hidden items-center gap-5 font-mono text-[11px] uppercase tracking-[0.16em] text-walnut md:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-shellac">
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-walnut/25 bg-paper/80 px-2 py-1 md:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <LogMenuIcon open={open} />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-walnut">
            {open ? "Close" : "Menu"}
          </span>
        </button>
      </div>
      {open ? (
        <div id={menuId} className="border-t border-rule/70 bg-[#f6efe4] px-5 py-4 md:hidden">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-shellac">Menu</p>
          <nav className="mt-3 grid gap-1 font-mono text-sm uppercase tracking-[0.14em] text-walnut">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-2 py-2.5 hover:bg-paper"
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

function LogMenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-11 w-11">
      <svg viewBox="0 0 44 44" className="h-11 w-11" aria-hidden>
        <ellipse cx="22" cy="12" rx="14" ry="6" fill="#6b3a1f" />
        <rect x="8" y="12" width="28" height="20" fill="#8b5a32" />
        <ellipse cx="22" cy="32" rx="14" ry="6" fill="#c4a06a" stroke="#6b3a1f" strokeWidth="1" />
        <ellipse cx="22" cy="12" rx="14" ry="6" fill="#b88955" stroke="#6b3a1f" strokeWidth="1" />
        <ellipse cx="22" cy="12" rx="8" ry="3.2" fill="#efe0c4" opacity="0.55" />
        <ellipse cx="22" cy="12" rx="3" ry="1.2" fill="#6b3a1f" opacity="0.35" />
        {open ? (
          <>
            <path d="M14 18 L30 30" stroke="#24180f" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M30 18 L14 30" stroke="#24180f" strokeWidth="2.4" strokeLinecap="round" />
          </>
        ) : (
          <>
            <line x1="13" y1="18" x2="31" y2="18" stroke="#24180f" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="13" y1="23.5" x2="31" y2="23.5" stroke="#24180f" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="13" y1="29" x2="31" y2="29" stroke="#24180f" strokeWidth="2.4" strokeLinecap="round" />
          </>
        )}
      </svg>
    </span>
  );
}
