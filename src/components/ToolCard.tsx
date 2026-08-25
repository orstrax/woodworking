import Link from "next/link";
import type { Tool } from "@/lib/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex flex-col border border-rule bg-paper/70 p-5 shadow-[3px_3px_0_rgba(36,24,15,0.06)] transition hover:-translate-y-0.5 hover:border-walnut/50 hover:shadow-[5px_5px_0_rgba(107,58,31,0.12)]"
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-shellac">
        {tool.tag}
      </span>
      <h2 className="mt-3 font-display text-2xl tracking-tight">
        {tool.name}
      </h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-ink-soft">{tool.summary}</p>
      <span className="mt-5 font-mono text-xs uppercase tracking-[0.16em] text-walnut">
        Open tool →
      </span>
    </Link>
  );
}
