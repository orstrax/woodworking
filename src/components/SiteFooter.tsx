import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-rule/80 bg-paper-2/40 print:hidden">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 text-sm text-ink-soft sm:grid-cols-3 sm:px-8">
        <div>
          <p className="font-display text-xl text-ink">Story Stick</p>
          <p className="mt-2 leading-6">
            Figures for the bench, not a substitute for a square. Wood movement follows the USDA Wood
            Handbook.
          </p>
        </div>
        <div className="grid gap-1 text-base">
          <Link href="/#start" className="min-h-11 py-2 hover:text-ink">
            Start Here
          </Link>
          <Link href="/tools/kitchen-plan" className="min-h-11 py-2 hover:text-ink">
            Kitchen Planner
          </Link>
          <Link href="/#tools" className="min-h-11 py-2 hover:text-ink">
            All Tools
          </Link>
          <Link href="/shop-words" className="min-h-11 py-2 hover:text-ink">
            Shop Words
          </Link>
        </div>
        <p className="leading-6">
          Beginner through fine furniture: labeled pictures, cut sizes, and the words shops actually use.
        </p>
      </div>
    </footer>
  );
}
