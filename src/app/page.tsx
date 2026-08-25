import Link from "next/link";
import { HomeHeroPicture } from "@/components/plans/HomeHeroPicture";
import { ToolCard } from "@/components/ToolCard";
import { SHOP_WORDS } from "@/lib/guides";
import { START_HERE, TOOL_GROUPS, TOOLS } from "@/lib/tools";

export default function Home() {
  return (
    <div>
      <div className="print:hidden">
        <section className="mx-auto max-w-6xl px-5 pb-8 pt-8 sm:px-8 sm:pt-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div className="max-w-xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-shellac">
                Digital Story Stick
              </p>
              <h1 className="mt-3 font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
                Modern woody shop math you can see.
              </h1>
              <p className="mt-4 text-lg leading-8 text-ink-soft">
                Visual woodworking calculators, plans, measurements, and references — labeled pictures
                with the words a beginner needs and the fussy bits a furniture maker still double-checks.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="#start"
                  className="inline-flex min-h-12 items-center justify-center rounded-[10px] bg-walnut px-5 text-sm font-semibold text-paper hover:bg-walnut-deep"
                >
                  Start Building
                </Link>
                <Link
                  href="#tools"
                  className="inline-flex min-h-12 items-center justify-center rounded-[10px] border border-rule bg-surface px-5 text-sm font-semibold text-ink hover:border-walnut/50"
                >
                  Browse All Tools
                </Link>
              </div>
            </div>
            <HomeHeroPicture />
          </div>
        </section>

        <section id="start" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-10 sm:px-8 sm:py-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-shellac">If you are new</p>
          <h2 className="mt-1 font-display text-3xl tracking-tight sm:text-4xl">
            If woodworking is new to me, start here.
          </h2>
          <p className="mt-2 max-w-2xl text-base leading-7 text-ink-soft">
            Five tools that teach the rest: hang a door, buy lumber, read a tape, prove a box is square,
            then leave room for the wood to move.
          </p>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {START_HERE.map((tool, index) => (
              <li key={tool.slug} className="relative">
                {index < START_HERE.length - 1 ? (
                  <span
                    className="pointer-events-none absolute left-[1.35rem] top-12 hidden h-[calc(100%-1.5rem)] w-px bg-rule lg:left-auto lg:right-[-0.4rem] lg:top-8 lg:h-px lg:w-[calc(100%+0.8rem)]"
                    aria-hidden
                  />
                ) : null}
                <Link
                  href={`/tools/${tool.slug}`}
                  className="flex min-h-[11rem] flex-col rounded-[12px] border border-rule bg-surface p-4 shadow-[var(--shadow-sm)] transition hover:border-walnut/40"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-walnut text-sm font-semibold text-paper">
                    {index + 1}
                  </span>
                  <h3 className="mt-3 font-display text-xl tracking-tight">{tool.name}</h3>
                  <p className="mt-1 flex-1 text-sm leading-6 text-ink-soft">{tool.summary}</p>
                  <span className="mt-3 text-sm font-semibold text-walnut">Open tool →</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section id="tools" className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-8 sm:px-8">
          {TOOL_GROUPS.map((group) => {
            const tools = TOOLS.filter((tool) => tool.group === group.id);
            if (tools.length === 0) return null;
            return (
              <section key={group.id} className="mt-14 first:mt-0">
                <div className="mb-5 max-w-2xl">
                  <h2 className="font-display text-3xl tracking-tight">{group.title}</h2>
                  <p className="mt-1 text-base leading-7 text-ink-soft">{group.blurb}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {tools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </section>
            );
          })}
        </section>

        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <div className="rounded-[16px] border border-rule bg-surface p-6 shadow-[var(--shadow-sm)] sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-shellac">Shop words</p>
                <h2 className="mt-1 font-display text-3xl tracking-tight">Say it the way the shop does.</h2>
              </div>
              <Link
                href="/shop-words"
                className="inline-flex min-h-11 items-center text-sm font-semibold text-walnut"
              >
                Full glossary →
              </Link>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {SHOP_WORDS.slice(0, 8).map((word) => (
                <div key={word.term}>
                  <p className="font-semibold">{word.term}</p>
                  <p className="mt-1 text-sm leading-6 text-ink-soft">{word.hint}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <article className="print-sheet hidden print:block text-black">
        <div className="mb-3 border-b border-black pb-2">
          <p className="text-[9px] uppercase tracking-[0.2em]">Story Stick · shop copy</p>
          <h1 className="font-display text-2xl leading-tight tracking-tight">Tool directory</h1>
          <p className="mt-1 text-xs">Open a tool on the bench, then print that page for the cut list.</p>
        </div>
        {TOOL_GROUPS.map((group) => {
          const tools = TOOLS.filter((tool) => tool.group === group.id);
          if (tools.length === 0) return null;
          return (
            <section key={group.id} className="mb-3">
              <h2 className="mb-1 text-[9px] uppercase tracking-[0.16em]">{group.title}</h2>
              <table className="w-full border-collapse text-[11px]">
                <tbody>
                  {tools.map((tool) => (
                    <tr key={tool.slug} className="border-b border-neutral-300 align-top">
                      <td className="py-1 pr-3 font-medium">{tool.name}</td>
                      <td className="py-1 text-neutral-700">{tool.summary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          );
        })}
      </article>
    </div>
  );
}
