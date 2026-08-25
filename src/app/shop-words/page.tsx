import type { Metadata } from "next";
import Link from "next/link";
import { PrintButton, paperPrintButtonClass } from "@/components/PrintSheet";
import { SHOP_WORDS } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Shop words",
  description: "Stile, rail, overlay, kerf, board foot — the words Story Stick uses, said plainly.",
};

export default function ShopWordsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16 print:max-w-none print:p-0">
      <div className="print:hidden">
      <Link href="/" className="inline-flex min-h-11 items-center text-sm font-semibold text-walnut hover:text-ink">
        ← Home
      </Link>
      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-shellac">Glossary</p>
      <h1 className="mt-2 font-display text-5xl tracking-tight">Shop words</h1>
      <p className="mt-4 max-w-xl text-lg leading-8 text-ink-soft">
        Nothing here is a secret handshake. These are the names on the pictures, said the way a
        patient shop teacher would say them.
      </p>
      <div className="mt-6">
        <PrintButton className={paperPrintButtonClass} />
      </div>
      <dl className="mt-10 grid gap-8">
        {SHOP_WORDS.map((word) => (
          <div key={word.term} className="border-t border-rule/80 pt-6">
            <dt className="font-display text-2xl tracking-tight">{word.term}</dt>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-shellac">
              {word.say}
            </p>
            <dd className="mt-3 text-base leading-7 text-ink-soft">{word.meaning}</dd>
            <p className="mt-2 text-sm leading-6 text-ink">{word.hint}</p>
          </div>
        ))}
      </dl>

      <section className="mt-16 border-t border-rule pt-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-shellac">Bench habits</p>
        <h2 className="mt-2 font-display text-3xl tracking-tight">Things that are not a calculator.</h2>
        <div className="mt-8 grid gap-8 text-base leading-7 text-ink-soft">
          <div>
            <h3 className="font-display text-xl text-ink">Sanding grit</h3>
            <p className="mt-2">
              Start coarse enough to erase mill marks, then skip no more than one grit: 80 → 120 → 180
              for paint, 120 → 180 → 220 for a clear finish. Do not jump 80 to 220 — the 80 scratches
              stay.
            </p>
          </div>
          <div>
            <h3 className="font-display text-xl text-ink">Glue</h3>
            <p className="mt-2">
              Yellow PVA (Titebond-style) for most indoor joints. Wipe squeeze-out with a damp rag
              before it skins, or scrape it after it rubberizes. Do not sand wet glue — it fills the
              grain and shows as a blotch under finish.
            </p>
          </div>
          <div>
            <h3 className="font-display text-xl text-ink">Measure once, mark once</h3>
            <p className="mt-2">
              A story stick beats repeating a tape reading. Mark from the same edge every time. Cut a
              hair long and sneak up. A square that disagrees with the diagonals is lying — trust the
              diagonals.
            </p>
          </div>
          <div>
            <h3 className="font-display text-xl text-ink">Grain</h3>
            <p className="mt-2">
              Plane and sand with the grain, the way the fibers lie down. Across the grain tears.
              On a door, stiles run up and down, rails run sideways, the panel can run either way
              but usually up and down.
            </p>
          </div>
        </div>
      </section>
      </div>
      <article className="print-sheet hidden print:block text-black">
        <div className="mb-3 border-b border-black pb-2">
          <p className="text-[9px] uppercase tracking-[0.2em]">Story Stick · shop copy</p>
          <h1 className="font-display text-2xl leading-tight tracking-tight">Shop words</h1>
        </div>
        <dl>
          {SHOP_WORDS.map((word) => (
            <div key={word.term} className="border-b border-neutral-300 py-1.5">
              <dt className="font-medium">
                {word.term}{" "}
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-600">{word.say}</span>
              </dt>
              <dd className="text-[12px] leading-5">{word.meaning}</dd>
            </div>
          ))}
        </dl>
        <section className="mt-4">
          <h2 className="mb-1 text-[9px] uppercase tracking-[0.16em]">Bench habits</h2>
          <p className="text-[12px] leading-5">
            Sand through grits without skipping more than one. Wipe glue before it skins. Mark from the
            same edge every time. Trust matching diagonals over a square that disagrees.
          </p>
        </section>
      </article>
    </div>
  );
}
