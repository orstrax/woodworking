import Link from "next/link";
import { ToolThumb } from "@/components/ToolThumb";
import type { Tool } from "@/lib/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-rule/80 bg-paper/80 shadow-[0_10px_30px_-18px_rgba(36,24,15,0.45)] transition duration-200 hover:-translate-y-0.5 hover:border-walnut/40 hover:shadow-[0_16px_36px_-16px_rgba(107,58,31,0.35)]"
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-rule/70">
        <ToolThumb slug={tool.slug} className="h-full w-full" />
        {tool.startHere ? (
          <span className="absolute left-3 top-3 rounded-full bg-iron/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ticket-tan">
            Start here
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-shellac">{tool.tag}</span>
        <h2 className="mt-1.5 font-display text-2xl tracking-tight">{tool.name}</h2>
        <p className="mt-2 flex-1 text-sm leading-6 text-ink-soft">{tool.summary}</p>
        <span className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-walnut">
          Open tool →
        </span>
      </div>
    </Link>
  );
}
