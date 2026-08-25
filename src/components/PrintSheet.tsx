"use client";

import { StepArt } from "@/components/StepArt";
import { Blueprint } from "@/components/Visuals";
import type { ReactNode } from "react";

export type PrintFact = { label: string; value: string; note?: string };
export type PrintRow = { name: string; qty: number | string; size: string; note?: string };
export type PrintStep = { id?: string; text: string; detail?: string };
export type PrintSection = { heading: string; rows: PrintRow[] };

export function PrintSheet({
  title,
  facts,
  rows,
  steps,
  sections,
  figures,
  note,
}: {
  title: string;
  facts?: PrintFact[];
  rows?: PrintRow[];
  steps?: PrintStep[];
  sections?: PrintSection[];
  figures?: ReactNode;
  note?: string;
}) {
  const hasCuts = Boolean((rows && rows.length) || (sections && sections.length));
  return (
    <article className="print-sheet hidden print:block text-black">
      <section className="print-page">
        <p className="text-[9px] uppercase tracking-[0.2em]">Story Stick · shop copy · overview</p>
        <h1 className="font-display text-2xl leading-tight tracking-tight">{title}</h1>
        {note ? <p className="mt-1 text-xs">{note}</p> : null}
        {facts && facts.length > 0 ? (
          <dl className="mt-3 grid grid-cols-2 gap-x-8 gap-y-1.5">
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
        {!hasCuts && !(facts && facts.length) ? (
          <p className="mt-3 text-xs">Fill the numbers on screen, then print.</p>
        ) : null}
      </section>
      {figures ? (
        <section className="print-page blueprint-art">
          <p className="text-[9px] uppercase tracking-[0.2em]">Story Stick · {title} · assembly</p>
          <h2 className="mb-2 font-display text-xl leading-tight tracking-tight">Line art — how it goes together</h2>
          <Blueprint>{figures}</Blueprint>
        </section>
      ) : null}
      {steps && steps.length > 0 ? (
        <section className="print-page">
          <p className="text-[9px] uppercase tracking-[0.2em]">Story Stick · {title} · bench steps</p>
          <h2 className="mb-2 font-display text-xl leading-tight tracking-tight">Put it together</h2>
          <ol className="m-0 list-none p-0">
            {steps.map((step, index) => (
              <li
                key={`${step.id ?? step.text}-${index}`}
                className="print-step grid grid-cols-[9rem_1fr] items-center gap-4 border-b border-neutral-300 py-3"
              >
                <div className="flex items-start gap-2">
                  <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-black font-mono text-[11px]">
                    {index + 1}
                  </span>
                  <StepArt id={step.id} text={step.text} />
                </div>
                <div className="text-[13px] leading-5">
                  <p>{step.text}</p>
                  {step.detail ? <p className="mt-1 text-[11px] text-neutral-600">{step.detail}</p> : null}
                </div>
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
    <section className="mt-3">
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
