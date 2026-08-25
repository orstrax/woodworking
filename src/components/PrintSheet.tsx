"use client";

import type { ReactNode } from "react";

export type PrintFact = { label: string; value: string; note?: string };
export type PrintRow = { name: string; qty: number | string; size: string; note?: string };
export type PrintStep = { text: string; detail?: string };
export type PrintSection = { heading: string; rows: PrintRow[] };

export function PrintSheet({
  title,
  facts,
  rows,
  steps,
  sections,
  note,
}: {
  title: string;
  facts?: PrintFact[];
  rows?: PrintRow[];
  steps?: PrintStep[];
  sections?: PrintSection[];
  note?: string;
}) {
  return (
    <article className="print-sheet hidden print:block text-black">
      <div className="mb-3 border-b border-black pb-2">
        <p className="text-[9px] uppercase tracking-[0.2em]">Story Stick · shop copy</p>
        <h1 className="font-display text-2xl leading-tight tracking-tight">{title}</h1>
        {note ? <p className="mt-1 text-xs">{note}</p> : null}
      </div>
      {facts && facts.length > 0 ? (
        <dl className="mb-3 grid grid-cols-2 gap-x-8 gap-y-1.5">
          {facts.map((fact) => (
            <div key={fact.label} className="border-b border-neutral-300 py-1">
              <dt className="text-[9px] uppercase tracking-[0.14em] text-neutral-600">{fact.label}</dt>
              <dd className="font-mono text-sm">{fact.value}</dd>
              {fact.note ? <p className="text-[11px] text-neutral-700">{fact.note}</p> : null}
            </div>
          ))}
        </dl>
      ) : null}
      {rows && rows.length > 0 ? <CutTable heading="Cut list" rows={rows} /> : null}
      {sections?.map((section) => (
        <CutTable key={section.heading} heading={section.heading} rows={section.rows} />
      ))}
      {steps && steps.length > 0 ? (
        <section className="mt-3">
          <h2 className="mb-1 text-[9px] uppercase tracking-[0.16em]">Bench steps</h2>
          <ol className="list-decimal space-y-1 pl-5 text-[12px] leading-5">
            {steps.map((step, index) => (
              <li key={index}>
                {step.text}
                {step.detail ? <span className="block text-[11px] text-neutral-600">{step.detail}</span> : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </article>
  );
}

function CutTable({ heading, rows }: { heading: string; rows: PrintRow[] }) {
  return (
    <section className="mb-3">
      <h2 className="mb-1 text-[9px] uppercase tracking-[0.16em]">{heading}</h2>
      <table className="w-full border-collapse text-[11px]">
        <thead>
          <tr className="border-b border-black text-left">
            <th className="w-4 py-1 pr-2 font-medium"> </th>
            <th className="py-1 pr-2 font-medium">Part</th>
            <th className="py-1 pr-2 font-medium">Qty</th>
            <th className="py-1 pr-2 font-medium">Cut</th>
            <th className="py-1 font-medium">Note</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.name}-${index}`} className="border-b border-neutral-300 align-top">
              <td className="py-1 pr-2">
                <span className="mt-0.5 inline-block h-2.5 w-2.5 border border-black" />
              </td>
              <td className="py-1 pr-2">{row.name}</td>
              <td className="py-1 pr-2 font-mono">{row.qty}</td>
              <td className="py-1 pr-2 font-mono">{row.size}</td>
              <td className="py-1 text-neutral-700">{row.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function PrintButton({
  children = "Print shop copy",
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={
        className ??
        "mt-4 rounded-full bg-paper px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-iron"
      }
      onClick={() => window.print()}
    >
      {children}
    </button>
  );
}

export const paperPrintButtonClass =
  "rounded-full border border-rule bg-paper px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-walnut hover:border-walnut/50";
