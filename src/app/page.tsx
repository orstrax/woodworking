import { ToolCard } from "@/components/ToolCard";
import { TOOL_GROUPS, TOOLS } from "@/lib/tools";

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
          Cabinet doors, shaker frames, board feet, and layout math — the calculators you reach
          for between the tape and the saw.
        </p>
      </section>

      {TOOL_GROUPS.map((group) => {
        const tools = TOOLS.filter((tool) => tool.group === group.id);
        if (tools.length === 0) return null;
        return (
          <section key={group.id} className="mt-14">
            <div className="mb-5 max-w-2xl">
              <h2 className="font-display text-3xl tracking-tight">{group.title}</h2>
              <p className="mt-1 text-sm leading-6 text-ink-soft">{group.blurb}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
