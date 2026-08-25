"use client";

import type { ReactNode } from "react";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium">{label}</span>
        {hint ? <span className="font-mono text-[11px] text-ink-soft">{hint}</span> : null}
      </span>
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

export const inputClass =
  "w-full border border-rule bg-paper px-3 py-2.5 font-mono text-sm outline-none transition focus:border-walnut focus:ring-1 focus:ring-walnut/40";

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      className={inputClass}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
    />
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
      value={Number.isFinite(value) ? value : ""}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  );
}

export function SelectInput({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <select
      className={`${inputClass} appearance-none`}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {children}
    </select>
  );
}

export function Result({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="border-b border-ticket-tan/25 py-3 last:border-b-0">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ticket-tan">{label}</p>
      <p className="mt-1 font-display text-3xl tracking-tight text-paper">{value}</p>
      {note ? <p className="mt-1 text-sm text-ticket-muted">{note}</p> : null}
    </div>
  );
}

export function ToolFrame({
  title,
  description,
  children,
  results,
  plan,
  ticketClassName,
}: {
  title: string;
  description: string;
  children: ReactNode;
  results: ReactNode;
  plan?: ReactNode;
  ticketClassName?: string;
}) {
  return (
    <div className="grid gap-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section>
          <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-ink-soft">{description}</p>
          <div className="mt-8 grid gap-4">{children}</div>
        </section>
        <aside className={`h-fit border border-iron bg-iron text-paper p-6 shadow-[8px_8px_0_rgba(107,58,31,0.25)] ${ticketClassName ?? ""}`}>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ticket-tan">Ticket</p>
          <div className="mt-4">{results}</div>
        </aside>
      </div>
      {plan ? (
        <section className="grid gap-5">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-shellac">Pictures & plans</p>
            <h2 className="mt-1 font-display text-3xl tracking-tight">See it before you cut it.</h2>
            <p className="mt-2 max-w-2xl text-base leading-7 text-ink-soft">
              Orange numbers match the key under each picture. Orange chips are the sizes to cut.
              Change the numbers above and the pictures move with them.
            </p>
          </div>
          {plan}
        </section>
      ) : null}
    </div>
  );
}
