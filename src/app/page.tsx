import Link from "next/link";
import { HomeHeroPicture } from "@/components/plans/HomeHeroPicture";
import { ToolCard } from "@/components/ToolCard";
import { SHOP_WORDS } from "@/lib/guides";
import { START_HERE, TOOL_GROUPS, TOOLS } from "@/lib/tools";

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 pb-6 pt-10 sm:px-8 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-shellac">
              Digital story stick
            </p>
            <h1 className="mt-3 font-display text-5xl leading-[1.04] tracking-tight sm:text-6xl">
              Modern woody shop math you can see.
            </h1>
            <p className="mt-5 text-lg leading-8 text-ink-soft">
              Labeled pictures of doors, lumber, and joints — with the words a beginner needs and the
              fussy bits a furniture maker still double-checks.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="#start"
                className="rounded-full bg-iron px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ticket-tan"
              >
                Start here
              </Link>
              <Link
                href="/tools/kitchen-plan"
                className="rounded-full border border-rule bg-paper/80 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-walnut"
              >
                Kitchen planner
              </Link>
              <Link
                href="/tools/cabinet-box"
                className="rounded-full border border-rule bg-paper/80 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-walnut"
              >
                Box builder
              </Link>
              <Link
                href="#tools"
                className="rounded-full border border-rule bg-paper/80 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-walnut"
              >
                All tools
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3 text-sm">
              <Stat kicker="New to this" label="Pictures + shop words" />
              <Stat kicker="Weekend shop" label="Cut lists that match" />
              <Stat kicker="Fine work" label="Hinges, float, slope" />
            </div>
          </div>
          <HomeHeroPicture />
        </div>
      </section>

      <section id="start" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-12 sm:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-shellac">If you are new</p>
        <h2 className="mt-1 font-display text-3xl tracking-tight sm:text-4xl">Five tools that teach the rest.</h2>
        <p className="mt-2 max-w-2xl text-base leading-7 text-ink-soft">
          Read a tape, buy lumber, prove a box is square, hang a door, then leave room for the wood to
          move. After that, the other tools are variations.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {START_HERE.map((tool, index) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="rounded-xl border border-rule bg-paper/80 p-4 transition hover:border-walnut/40"
            >
              <p className="font-mono text-[11px] text-shellac">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 font-display text-xl tracking-tight">{tool.name}</h3>
              <p className="mt-1 text-sm leading-6 text-ink-soft">{tool.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-8 sm:px-8">
        {TOOL_GROUPS.map((group) => {
          const tools = TOOLS.filter((tool) => tool.group === group.id);
          if (tools.length === 0) return null;
          return (
            <section key={group.id} className="mt-12 first:mt-0">
              <div className="mb-5 max-w-2xl">
                <h2 className="font-display text-3xl tracking-tight">{group.title}</h2>
                <p className="mt-1 text-sm leading-6 text-ink-soft">{group.blurb}</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          );
        })}
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="rounded-2xl border border-rule bg-[#fbf6eb] p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-shellac">Shop words</p>
              <h2 className="mt-1 font-display text-3xl tracking-tight">Say it the way the shop does.</h2>
            </div>
            <Link href="/shop-words" className="font-mono text-[11px] uppercase tracking-[0.16em] text-walnut">
              Full glossary →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SHOP_WORDS.slice(0, 8).map((word) => (
              <div key={word.term}>
                <p className="font-medium">{word.term}</p>
                <p className="mt-1 text-sm leading-6 text-ink-soft">{word.hint}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ kicker, label }: { kicker: string; label: string }) {
  return (
    <div className="rounded-xl border border-rule/80 bg-paper/60 px-3 py-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-shellac">{kicker}</p>
      <p className="mt-1 text-sm leading-5">{label}</p>
    </div>
  );
}
