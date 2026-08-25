import type { ComponentType } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CabinetDoorCalc } from "@/components/calcs/CabinetDoorCalc";
import { CircleCalc } from "@/components/calcs/CircleCalc";
import { DovetailCalc } from "@/components/calcs/DovetailCalc";
import { DrawerCalc } from "@/components/calcs/DrawerCalc";
import { MeasureCalc } from "@/components/calcs/MeasureCalc";
import { MiterCalc } from "@/components/calcs/MiterCalc";
import { MovementCalc } from "@/components/calcs/MovementCalc";
import { ShakerDoorCalc } from "@/components/calcs/ShakerDoorCalc";
import { SpacingCalc } from "@/components/calcs/SpacingCalc";
import { WeightCalc } from "@/components/calcs/WeightCalc";
import { BoardFeetCalc } from "@/components/calcs/BoardFeetCalc";
import { getTool, TOOLS } from "@/lib/tools";

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tools/[slug]">) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return {
    title: tool.name,
    description: tool.summary,
  };
}

const CALCS: Record<string, ComponentType> = {
  "cabinet-doors": CabinetDoorCalc,
  "shaker-door": ShakerDoorCalc,
  drawers: DrawerCalc,
  "board-feet": BoardFeetCalc,
  measure: MeasureCalc,
  spacing: SpacingCalc,
  miter: MiterCalc,
  dovetail: DovetailCalc,
  movement: MovementCalc,
  circle: CircleCalc,
  weight: WeightCalc,
};

export default async function ToolPage({ params }: PageProps<"/tools/[slug]">) {
  const { slug } = await params;
  const tool = getTool(slug);
  const Calc = CALCS[slug];
  if (!tool || !Calc) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        href="/"
        className="font-mono text-[11px] uppercase tracking-[0.18em] text-walnut hover:text-shellac"
      >
        ← All tools
      </Link>
      <div className="mt-6">
        <Calc />
      </div>
    </div>
  );
}
