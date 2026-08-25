"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

function subscribeMobile(onChange: () => void) {
  const query = window.matchMedia("(max-width: 767px)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function mobileSnapshot() {
  return window.matchMedia("(max-width: 767px)").matches;
}

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
  const mobile = useSyncExternalStore(subscribeMobile, mobileSnapshot, () => false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        const sheet = document.getElementById(tooltipId);
        if (sheet && sheet.contains(event.target as Node)) return;
        setOpen(false);
      }
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
  }, [open, tooltipId]);

  const content = (
    <>
      {picture ? <span className="mb-3 flex h-16 items-center justify-center">{picture}</span> : null}
      <span className="block text-base font-semibold text-ink">{title}</span>
      <span className="mt-1.5 block text-sm leading-6 text-ink-soft">{body}</span>
    </>
  );

  return (
    <span ref={rootRef} className="relative inline-flex align-middle">
      <button
        type="button"
        className="grid h-11 w-11 place-items-center text-walnut sm:h-7 sm:w-7"
        aria-label={`About ${title}`}
        aria-expanded={open}
        aria-controls={open ? tooltipId : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="grid h-6 w-6 place-items-center rounded-full border border-walnut/50 bg-surface text-[11px] font-bold leading-none">
          i
        </span>
      </button>
      {open && mobile
        ? createPortal(
            <div className="fixed inset-0 z-50 print:hidden" role="presentation">
              <button
                type="button"
                className="absolute inset-0 bg-ink/40"
                aria-label="Close definition"
                onClick={() => setOpen(false)}
              />
              <div
                id={tooltipId}
                role="dialog"
                aria-label={title}
                className="absolute inset-x-0 bottom-0 rounded-t-[16px] border border-rule bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[var(--shadow-md)]"
              >
                {content}
                <button
                  type="button"
                  className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-[10px] bg-walnut text-sm font-semibold text-paper"
                  onClick={() => setOpen(false)}
                >
                  Got it
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
      {!mobile ? (
        <span
          id={tooltipId}
          role="tooltip"
          className={`absolute left-0 top-[calc(100%+8px)] z-40 w-72 max-w-[calc(100vw-2.5rem)] rounded-[12px] border border-rule bg-surface p-4 text-left shadow-[var(--shadow-md)] ${
            open ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
          }`}
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}
