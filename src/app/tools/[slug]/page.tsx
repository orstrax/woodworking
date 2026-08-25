import type { ComponentType } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShopGuide } from "@/components/ShopGuide";
import { BoardFeetCalc } from "@/components/calcs/BoardFeetCalc";
import { CabinetBoxCalc } from "@/components/calcs/CabinetBoxCalc";
import { CabinetDoorCalc } from "@/components/calcs/CabinetDoorCalc";
import { CircleCalc } from "@/components/calcs/CircleCalc";
import { DovetailCalc } from "@/components/calcs/DovetailCalc";
import { DrawerCalc } from "@/components/calcs/DrawerCalc";
import { GlueUpCalc } from "@/components/calcs/GlueUpCalc";
import { KerfCalc } from "@/components/calcs/KerfCalc";
import { KitchenPlanner } from "@/components/calcs/KitchenPlanner";
import { MeasureCalc } from "@/components/calcs/MeasureCalc";
import { MiterCalc } from "@/components/calcs/MiterCalc";
import { MovementCalc } from "@/components/calcs/MovementCalc";
import { ShakerDoorCalc } from "@/components/calcs/ShakerDoorCalc";
import { SpacingCalc } from "@/components/calcs/SpacingCalc";
import { SquareCalc } from "@/components/calcs/SquareCalc";
import { WeightCalc } from "@/components/calcs/WeightCalc";
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
  "kitchen-plan": KitchenPlanner,
  "cabinet-box": CabinetBoxCalc,
  "cabinet-doors": CabinetDoorCalc,
  "shaker-door": ShakerDoorCalc,
  drawers: DrawerCalc,
  "board-feet": BoardFeetCalc,
  "glue-up": GlueUpCalc,
  measure: MeasureCalc,
  spacing: SpacingCalc,
  kerf: KerfCalc,
  miter: MiterCalc,
  dovetail: DovetailCalc,
  movement: MovementCalc,
  circle: CircleCalc,
  weight: WeightCalc,
  square: SquareCalc,
};

export default async function ToolPage({ params }: PageProps<"/tools/[slug]">) {
  const { slug } = await params;
  const tool = getTool(slug);
  const Calc = CALCS[slug];
  if (!tool || !Calc) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex flex-wrap items-center gap-4 print:hidden">
        <Link
          href="/#tools"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-walnut hover:text-shellac"
        >
          ← All tools
        </Link>
        <Link
          href="/shop-words"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft hover:text-shellac"
        >
          Shop words
        </Link>
      </div>
      <div className="mt-6">
        <Calc />
      </div>
      <ShopGuide slug={slug} />
    </div>
  );
}
