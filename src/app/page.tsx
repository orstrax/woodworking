import { ToolCard } from "@/components/ToolCard";
import { TOOLS } from "@/lib/tools";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <section className="max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-shellac">
          Digital story stick
        </p>
        <h1 className="mt-3 font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">
          Shop math that stays on the bench.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-ink-soft">
          Board feet, fractions, spacing, miters, and wood movement — the calculators you reach
          for between the tape and the saw.
        </p>
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </section>
    </div>
  );
}
