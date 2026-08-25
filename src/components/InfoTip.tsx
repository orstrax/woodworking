"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

export function InfoTip({
  title,
  body,
  picture,
}: {
  title: string;
  body: string;
  picture?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span ref={rootRef} className="group relative inline-flex align-middle">
      <button
        type="button"
        className="grid h-4 w-4 place-items-center rounded-full border border-walnut/40 bg-paper text-[10px] font-bold leading-none text-walnut hover:border-shellac hover:text-shellac"
        aria-label={`About ${title}`}
        aria-expanded={open}
        aria-describedby={open ? tooltipId : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        i
      </button>
      <span
        id={tooltipId}
        role="tooltip"
        className={`absolute left-0 top-[calc(100%+8px)] z-40 w-64 max-w-[calc(100vw-2.5rem)] rounded-sm border border-rule bg-[#fbf6eb] p-3 text-left shadow-[4px_4px_0_rgba(36,24,15,0.12)] transition-opacity ${
          open
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
        }`}
      >
        {picture ? <span className="mb-2 flex h-14 items-center justify-center">{picture}</span> : null}
        <span className="block text-sm font-medium text-ink">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-ink-soft">{body}</span>
      </span>
    </span>
  );
}
