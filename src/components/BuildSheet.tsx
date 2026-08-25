"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { BuildStep, CutItem, PartKind } from "@/lib/cabinetBox";
import { inferKindFromName } from "@/lib/cabinetBox";

const EVENT = "storystick-checks";

type Row = {
  name: string;
  qty: number;
  size: string;
  note?: string;
  kind?: PartKind;
};

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function snapshot(key: string) {
  try {
    return localStorage.getItem(key) ?? "{}";
  } catch {
    return "{}";
  }
}

function parseMap(raw: string): Record<string, boolean> {
  try {
    const parsed = JSON.parse(raw) as Record<string, boolean>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function toggle(key: string, id: string) {
  const map = parseMap(snapshot(key));
  map[id] = !map[id];
  try {
    localStorage.setItem(key, JSON.stringify(map));
  } catch {
    /* private mode */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function BuildSheet({
  storageKey,
  rows,
  steps,
  title = "Cut list",
}: {
  storageKey: string;
  rows: Row[];
  steps?: BuildStep[];
  title?: string;
}) {
  const raw = useSyncExternalStore(subscribe, () => snapshot(storageKey), () => "{}");
  const checks = useMemo(() => parseMap(raw), [raw]);
  const items: CutItem[] = rows.map((row) => ({
    name: row.name,
    qty: row.qty,
    size: row.size,
    note: row.note ?? "",
    kind: row.kind ?? inferKindFromName(row.name),
  }));
  const doneParts = items.filter((row, index) => checks[`p-${index}-${row.name}`]).length;
  const doneSteps = (steps ?? []).filter((step) => checks[`s-${step.id}`]).length;

  return (
    <div className="grid gap-5 print:hidden">
      {items.length > 0 ? (
        <div className="print-break overflow-x-auto border border-rule">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule bg-paper-2/60 px-3 py-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">{title}</p>
            <p className="font-mono text-[11px] text-ink-soft print:hidden">
              {doneParts}/{items.length} parts checked
            </p>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
              <tr>
                <th className="w-10 px-3 py-2 font-medium print:w-8"> </th>
                <th className="w-14 px-1 py-2 font-medium"> </th>
                <th className="px-3 py-2 font-medium">Part</th>
                <th className="px-3 py-2 font-medium">Qty</th>
                <th className="px-3 py-2 font-medium">Cut</th>
                <th className="px-3 py-2 font-medium">Note</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row, index) => {
                const id = `p-${index}-${row.name}`;
                const on = Boolean(checks[id]);
                return (
                  <tr key={id} className={`border-t border-rule/70 ${on ? "bg-paper-2/40 text-ink-soft" : ""}`}>
                    <td className="px-3 py-2 align-middle">
                      <CheckBox
                        checked={on}
                        label={`Mark ${row.name} cut`}
                        onChange={() => toggle(storageKey, id)}
                      />
                    </td>
                    <td className="px-1 py-2 align-middle">
                      <PartThumb kind={row.kind} />
                    </td>
                    <td className={`px-3 py-2 font-medium ${on ? "line-through" : ""}`}>{row.name}</td>
                    <td className="px-3 py-2 font-mono">{row.qty}</td>
                    <td className="px-3 py-2 font-mono">{row.size}</td>
                    <td className="px-3 py-2 text-ink-soft">{row.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
      {steps && steps.length > 0 ? (
        <div className="print-break border border-rule bg-paper/80">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule px-4 py-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-shellac">On the bench</p>
              <h3 className="mt-1 font-display text-xl tracking-tight">Steps — check them off as you go</h3>
            </div>
            <p className="font-mono text-[11px] text-ink-soft print:hidden">
              {doneSteps}/{steps.length} done
            </p>
          </div>
          <ol className="divide-y divide-rule/70">
            {steps.map((step, index) => {
              const id = `s-${step.id}`;
              const on = Boolean(checks[id]);
              return (
                <li key={step.id} className="flex gap-3 px-4 py-3">
                  <CheckBox
                    checked={on}
                    label={`Mark step ${index + 1} done`}
                    onChange={() => toggle(storageKey, id)}
                  />
                  <div className={on ? "text-ink-soft" : ""}>
                    <p className={`text-sm font-medium ${on ? "line-through" : ""}`}>
                      <span className="mr-2 font-mono text-[11px] text-shellac">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {step.text}
                    </p>
                    {step.detail ? <p className="mt-1 text-sm leading-6 text-ink-soft">{step.detail}</p> : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}
    </div>
  );
}

function CheckBox({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-sm border print:border-ink ${
        checked ? "border-walnut bg-walnut text-paper" : "border-walnut/50 bg-paper"
      }`}
    >
      {checked ? (
        <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden>
          <path d="M2 6.2 L4.8 9 L10 3.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ) : null}
    </button>
  );
}

export function PartThumb({ kind }: { kind: PartKind }) {
  return (
    <svg viewBox="0 0 40 28" className="h-7 w-10" aria-hidden>
      {thumb(kind)}
    </svg>
  );
}

function thumb(kind: PartKind) {
  switch (kind) {
    case "side":
      return (
        <>
          <rect x="10" y="2" width="20" height="24" fill="#c4a06a" stroke="#6b3a1f" />
          <path d="M10 22 H18 V26 H10" fill="#f3ead7" stroke="#6b3a1f" />
        </>
      );
    case "bottom":
    case "top":
      return <rect x="4" y="10" width="32" height="8" fill="#c4a06a" stroke="#6b3a1f" />;
    case "back":
      return <rect x="6" y="4" width="28" height="20" fill="#efe0c4" stroke="#8a6a3a" />;
    case "stretcher":
    case "nailer":
      return <rect x="3" y="11" width="34" height="6" fill="#8b5a32" stroke="#6b3a1f" />;
    case "toe":
      return <rect x="4" y="16" width="32" height="8" fill="#6b3a1f" />;
    case "stile":
      return <rect x="16" y="2" width="8" height="24" fill="#c4a06a" stroke="#6b3a1f" />;
    case "rail":
      return <rect x="4" y="10" width="32" height="8" fill="#c4a06a" stroke="#6b3a1f" />;
    case "shelf":
      return <rect x="4" y="12" width="32" height="5" fill="#efe0c4" stroke="#8a6a3a" />;
    case "door":
      return (
        <>
          <rect x="10" y="2" width="20" height="24" fill="#efe0c4" stroke="#6b3a1f" />
          <rect x="13" y="5" width="14" height="18" fill="#f6ecd6" stroke="#8a6a3a" />
        </>
      );
    case "slab":
      return <rect x="10" y="2" width="20" height="24" fill="#efe0c4" stroke="#6b3a1f" />;
    case "panel":
      return <rect x="8" y="5" width="24" height="18" fill="#f6ecd6" stroke="#8a6a3a" />;
    case "drawer-side":
      return <rect x="12" y="6" width="16" height="16" fill="#c4a06a" stroke="#6b3a1f" />;
    case "drawer-fb":
      return (
        <>
          <rect x="6" y="6" width="28" height="16" fill="#efe0c4" stroke="#24180f" />
          <rect x="16" y="12" width="8" height="4" fill="#6b3a1f" />
        </>
      );
    case "drawer-bottom":
      return <rect x="6" y="11" width="28" height="6" fill="#efe0c4" stroke="#8a6a3a" />;
    case "hinge":
      return <circle cx="20" cy="14" r="8" fill="#e8d7b5" stroke="#6b3a1f" />;
    case "board":
    case "strip":
      return <rect x="4" y="8" width="32" height="12" fill="#d4b07a" stroke="#6b3a1f" />;
    case "segment":
      return <polygon points="20,4 34,22 6,22" fill="#c4a06a" stroke="#6b3a1f" />;
    default:
      return <rect x="12" y="8" width="16" height="12" fill="#ead9b4" stroke="#6b3a1f" />;
  }
}
