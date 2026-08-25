import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-rule/80 bg-[#efe4cc]/50 print:hidden">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 text-sm text-ink-soft sm:grid-cols-3 sm:px-8">
        <div>
          <p className="font-display text-lg text-ink">Story Stick</p>
          <p className="mt-2 leading-6">
            Figures for the bench, not a substitute for a square. Wood movement follows the USDA Wood
            Handbook.
          </p>
        </div>
        <div className="grid gap-1">
          <Link href="/tools/kitchen-plan" className="hover:text-walnut">
            Kitchen planner
          </Link>
          <Link href="/tools/cabinet-box" className="hover:text-walnut">
            Cabinet box
          </Link>
          <Link href="/#tools" className="hover:text-walnut">
            All tools
          </Link>
          <Link href="/#start" className="hover:text-walnut">
            Start here
          </Link>
          <Link href="/shop-words" className="hover:text-walnut">
            Shop words
          </Link>
        </div>
        <p className="leading-6">
          Beginner through fine furniture: labeled pictures, cut sizes, and the words shops actually use.
        </p>
      </div>
    </footer>
  );
}
