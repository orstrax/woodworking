import Link from "next/link";
import { ToolThumb } from "@/components/ToolThumb";
import type { Tool } from "@/lib/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex flex-col overflow-hidden rounded-[12px] border border-rule bg-surface shadow-[var(--shadow-sm)] transition hover:border-walnut/40"
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-rule/80 bg-paper-2/40">
        <ToolThumb slug={tool.slug} className="h-full w-full" />
        {tool.startHere ? (
          <span className="absolute left-3 top-3 rounded-[8px] bg-walnut px-2.5 py-1 text-[11px] font-semibold text-paper">
            Start here
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-shellac">{tool.tag}</span>
        <h2 className="mt-1.5 font-display text-2xl tracking-tight">{tool.name}</h2>
        <p className="mt-2 flex-1 text-sm leading-6 text-ink-soft">{tool.summary}</p>
        <span className="mt-4 text-sm font-semibold text-walnut">Open tool →</span>
      </div>
    </Link>
  );
}
