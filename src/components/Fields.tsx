"use client";

import type { ReactNode } from "react";
import { PrintButton, PrintSheet, type PrintFact, type PrintRow, type PrintSection, type PrintStep } from "@/components/PrintSheet";

export const inputClass =
  "h-12 w-full rounded-[10px] border border-rule bg-surface px-3.5 font-mono text-base text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-walnut focus:ring-2 focus:ring-walnut/20";

export const btnPrimary =
  "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-walnut px-4 py-2.5 text-sm font-semibold text-paper transition hover:bg-walnut-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-walnut sm:w-auto";

export const btnSecondary =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border border-rule bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-walnut/50 hover:bg-paper-2/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-walnut";

export const btnGhost =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border border-rule px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-walnut/40 hover:bg-paper-2/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-walnut";

export const kickerClass = "font-mono text-[11px] uppercase tracking-[0.16em] text-shellac";

export const summaryLabelClass = "font-mono text-[11px] uppercase tracking-[0.16em] text-shellac";

export function Field({
  label,
  hint,
  tip,
  children,
}: {
  label: string;
  hint?: string;
  tip?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="block">
      <span className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5">
          <span className="text-[15px] font-semibold text-ink">{label}</span>
          {tip}
        </span>
        {hint ? <span className="font-mono text-xs text-ink-soft">{hint}</span> : null}
      </span>
      <label className="mt-2 block">{children}</label>
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  unit,
  id,
  autoComplete = "off",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  unit?: string;
  id?: string;
  autoComplete?: string;
}) {
  if (unit) {
    return (
      <MeasureInput
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        unit={unit}
      />
    );
  }
  return (
    <input
      id={id}
      className={inputClass}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      spellCheck={false}
    />
  );
}

export function MeasureInput({
  value,
  onChange,
  placeholder,
  unit = "in",
  id,
  "aria-label": ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  unit?: string;
  id?: string;
  "aria-label"?: string;
}) {
  return (
    <div className="flex h-12 overflow-hidden rounded-[10px] border border-rule bg-surface focus-within:border-walnut focus-within:ring-2 focus-within:ring-walnut/20">
      <input
        id={id}
        className="min-w-0 flex-1 bg-transparent px-3.5 font-mono text-lg text-ink outline-none placeholder:text-ink-soft/60"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        inputMode="text"
        enterKeyHint="done"
        aria-label={ariaLabel}
      />
      <span
        className="grid min-w-12 place-items-center border-l border-rule bg-paper-2/80 px-2.5 font-mono text-sm text-ink-soft"
        aria-hidden
      >
        {unit}
      </span>
    </div>
  );
}

export function NumberInput({
  value,
  onChange,
  min,
  step = "any",
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: string;
}) {
  return (
    <input
      className={inputClass}
      type="number"
      min={min}
      step={step}
      inputMode="decimal"
      value={Number.isFinite(value) ? value : ""}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  );
}

export function OptionToggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <label
      className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-[12px] border px-4 py-3.5 transition ${
        checked
          ? "border-walnut bg-[#f3e8df] shadow-[inset_0_0_0_1px_var(--walnut)]"
          : "border-rule bg-surface hover:border-walnut/40"
      }`}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span
        aria-hidden
        className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 ${
          checked ? "border-walnut bg-walnut text-paper" : "border-rule bg-paper"
        }`}
      >
        {checked ? (
          <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" fill="none">
            <path d="M2 6.2 L4.8 9 L10 3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold leading-5">{label}</span>
        {hint ? <span className="mt-1 block text-sm leading-5 text-ink-soft">{hint}</span> : null}
      </span>
    </label>
  );
}

export function ChoiceCard({
  selected,
  onSelect,
  title,
  hint,
  visual,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  hint?: ReactNode;
  visual?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex min-h-11 w-full items-center gap-3 rounded-[12px] border px-3 py-3 text-left transition ${
        selected
          ? "border-walnut bg-[#f3e8df] shadow-[inset_0_0_0_1px_var(--walnut)]"
          : "border-rule bg-surface hover:border-walnut/40"
      }`}
    >
      {visual}
      <span className="min-w-0 flex-1">
        <span className="block font-semibold leading-5">{title}</span>
        {hint ? <span className="mt-0.5 block text-sm leading-5 text-ink-soft">{hint}</span> : null}
      </span>
      <span
        aria-hidden
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${
          selected ? "border-walnut bg-walnut text-paper" : "border-rule bg-paper"
        }`}
      >
        {selected ? (
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
            <path d="M2 6.2 L4.8 9 L10 3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : null}
      </span>
    </button>
  );
}

export function SelectInput({
  value,
  onChange,
  children,
  id,
  "aria-label": ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  id?: string;
  "aria-label"?: string;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        aria-label={ariaLabel}
        className={`${inputClass} appearance-none pr-10`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {children}
      </select>
      <svg
        viewBox="0 0 16 16"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
        aria-hidden
        fill="none"
      >
        <path d="M4 6 L8 10 L12 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function Result({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="border-b border-rule/80 py-3.5 last:border-b-0">
      <p className={summaryLabelClass}>{label}</p>
      <p className="mt-1 font-display text-[1.85rem] leading-tight tracking-tight text-ink">{value}</p>
      {note ? <p className="mt-1 text-sm leading-6 text-ink-soft">{note}</p> : null}
    </div>
  );
}

export function SectionCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-[12px] border border-rule bg-surface p-4 shadow-[var(--shadow-sm)] sm:p-5 ${className}`}>
      {children}
    </section>
  );
}

export function AccordionSection({
  title,
  summary,
  children,
}: {
  title: string;
  summary?: string;
  children: ReactNode;
}) {
  return (
    <details className="rounded-[12px] border border-rule bg-surface shadow-[var(--shadow-sm)]">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <span>
          <span className="block font-display text-xl tracking-tight">{title}</span>
          {summary ? <span className="mt-0.5 block text-sm leading-5 text-ink-soft">{summary}</span> : null}
        </span>
        <span className="shrink-0 rounded-[8px] border border-rule px-2.5 py-1 text-sm font-semibold text-walnut">
          Customize
        </span>
      </summary>
      <div className="border-t border-rule px-4 py-4 sm:px-5">{children}</div>
    </details>
  );
}

export function ToolFrame({
  title,
  description,
  children,
  results,
  plan,
  preview,
  mobileSummary,
  ticketClassName,
  printFacts,
  printRows,
  printSteps,
  printSections,
  printFigures,
  note,
}: {
  title: string;
  description: string;
  children: ReactNode;
  results: ReactNode;
  plan?: ReactNode;
  preview?: ReactNode;
  mobileSummary?: ReactNode;
  ticketClassName?: string;
  printFacts?: PrintFact[];
  printRows?: PrintRow[];
  printSteps?: PrintStep[];
  printSections?: PrintSection[];
  printFigures?: ReactNode;
  note?: string;
}) {
  const canPrint = Boolean(
    (printFacts && printFacts.length) ||
      (printRows && printRows.length) ||
      (printSteps && printSteps.length) ||
      (printSections && printSections.length) ||
      printFigures,
  );

  const summaryCard = (
    <div className={`rounded-[12px] border border-rule bg-surface p-5 shadow-[var(--shadow-sm)] ${ticketClassName ?? ""}`}>
      <p className={kickerClass}>Build summary</p>
      <div className="mt-2">{results}</div>
      <div className="mt-4">
        <PrintButton />
      </div>
    </div>
  );

  return (
    <>
      <div className="grid gap-6 pb-24 print:hidden lg:gap-8 lg:pb-0">
        <header className="max-w-2xl">
          <h1 className="font-display text-4xl tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-3 text-base leading-7 text-ink-soft">{description}</p>
        </header>

        {mobileSummary ? <div className="lg:hidden">{mobileSummary}</div> : null}

        <div
          className={`grid items-start gap-6 lg:gap-8 ${
            preview ? "lg:grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)]" : "lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,22rem)]"
          }`}
        >
          <section className="grid gap-4">{children}</section>
          <aside className="hidden lg:block">
            <div className="grid gap-4 lg:sticky lg:top-[calc(var(--site-header-h)+1rem)]">
              {preview}
              {summaryCard}
            </div>
          </aside>
        </div>

        <div className="grid gap-4 lg:hidden">
          {preview && !mobileSummary ? preview : null}
          {summaryCard}
        </div>

        {plan ? (
          <section className="grid gap-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className={kickerClass}>Pictures & plans</p>
                <h2 className="mt-1 font-display text-3xl tracking-tight">See it before you cut it.</h2>
                <p className="mt-2 max-w-2xl text-base leading-7 text-ink-soft">
                  Orange numbers match the key under each picture. Orange chips are the sizes to cut.
                  Change the numbers above and the pictures move with them.
                </p>
              </div>
              <div className="w-full shrink-0 sm:w-auto">
                <PrintButton />
              </div>
            </div>
            {plan}
          </section>
        ) : null}
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-paper px-5 py-3 print:hidden lg:hidden sm:px-8">
        <PrintButton />
      </div>
      {canPrint ? (
        <PrintSheet
          title={title}
          facts={printFacts}
          rows={printRows}
          steps={printSteps}
          sections={printSections}
          figures={printFigures}
          note={note}
        />
      ) : (
        <PrintSheet
          title={title}
          facts={[{ label: "Ticket", value: "Fill the numbers on screen, then print." }]}
        />
      )}
    </>
  );
}
