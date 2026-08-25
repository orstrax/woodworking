import Link from "next/link";
import { getGuide, getWord } from "@/lib/guides";
import { getTool } from "@/lib/tools";

export function ShopGuide({ slug }: { slug: string }) {
  const guide = getGuide(slug);
  if (!guide) return null;
  const related = guide.related.map((id) => getTool(id)).filter(Boolean);
  const words = guide.words.map((term) => getWord(term)).filter(Boolean);

  return (
    <section className="mt-14 grid gap-8 print:hidden">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-shellac">Shop notes</p>
        <h2 className="mt-1 font-display text-3xl tracking-tight">From first project to fine furniture.</h2>
        <p className="mt-2 max-w-2xl text-base leading-7 text-ink-soft">
          Same numbers. Three ways to read them — if you are new, if you already have a shop, or if you
          want the fussy bit.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <NoteCard kicker="First time" title="Beginner" body={guide.firstTime} />
        <NoteCard kicker="On the bench" title="Everyday shop" body={guide.shopHabit} />
        <NoteCard kicker="The fussy bit" title="Experienced" body={guide.finePoint} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[12px] border border-rule bg-surface p-5 shadow-[var(--shadow-sm)]">
          <h3 className="font-display text-xl tracking-tight">Easy to get wrong</h3>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-ink-soft">
            {guide.mistakes.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-shellac" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[12px] border border-rule bg-surface p-5 shadow-[var(--shadow-sm)]">
          <h3 className="font-display text-xl tracking-tight">Words on this page</h3>
          <ul className="mt-3 grid gap-3">
            {words.map((word) =>
              word ? (
                <li key={word.term}>
                  <p className="text-sm font-medium">{word.term}</p>
                  <p className="text-sm leading-6 text-ink-soft">{word.meaning}</p>
                </li>
              ) : null,
            )}
          </ul>
          <p className="mt-4">
            <Link href="/shop-words" className="text-sm font-semibold text-walnut">
              All shop words →
            </Link>
          </p>
        </div>
      </div>
      {related.length > 0 ? (
        <div>
          <h3 className="font-display text-xl tracking-tight">Next</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {related.map((tool) =>
              tool ? (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="inline-flex min-h-11 items-center rounded-[10px] border border-rule bg-surface px-3 text-sm font-semibold text-ink hover:border-walnut/50"
                >
                  {tool.name}
                </Link>
              ) : null,
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function NoteCard({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return (
    <article className="rounded-[12px] border border-rule bg-surface p-5 shadow-[var(--shadow-sm)]">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-shellac">{kicker}</p>
      <h3 className="mt-1 font-display text-2xl tracking-tight">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-ink-soft">{body}</p>
    </article>
  );
}
