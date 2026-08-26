import {
  doorPlan,
  drawerPlan,
  hingeAdvice,
  shakerPlan,
  type FitStyle,
  type ShakerBuild,
  type ShakerPlan,
} from "@/lib/cabinet";
import { formatInches, parseInches } from "@/lib/measure";

export type KitchenRow = "upper" | "base" | "tall";

export type KitchenOpeningInput = {
  id: string;
  name: string;
  row: KitchenRow;
  openingW: string;
  openingH: string;
  openingD: string;
  drawerH: string;
  doorCount: "0" | "1" | "2";
  drawerCount: "0" | "1" | "2" | "3" | "4";
};

export type KitchenDefaults = {
  name: string;
  stile: string;
  rail: string;
  fit: FitStyle;
  amount: string;
  midGap: string;
  drawerGap: string;
  slide: "undermount" | "side";
  makeShaker: boolean;
  shakerBuild: ShakerBuild;
  shakerStile: string;
  shakerRail: string;
  thickness: string;
};

export type KitchenState = {
  defaults: KitchenDefaults;
  openings: KitchenOpeningInput[];
};

export type CutRow = {
  name: string;
  qty: number;
  size: string;
  note: string;
  opening: string;
};

export type OpeningResult = {
  id: string;
  name: string;
  row: KitchenRow;
  error?: string;
  doors: { width: number; height: number; hinges: number; label: string }[];
  drawers: { width: number; height: number; label: string }[];
  box?: { width: number; depth: number; height: number; qty: number };
  shaker?: ShakerPlan;
  parts: CutRow[];
};

export function newOpening(partial?: Partial<KitchenOpeningInput>): KitchenOpeningInput {
  const { id, ...rest } = partial ?? {};
  return {
    id:
      id ??
      (typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `o-${Date.now()}-${Math.random().toString(16).slice(2)}`),
    name: rest.name ?? "Cabinet",
    row: rest.row ?? "base",
    openingW: rest.openingW ?? "21",
    openingH: rest.openingH ?? "30",
    openingD: rest.openingD ?? "21",
    drawerH: rest.drawerH ?? "",
    doorCount: rest.doorCount ?? "1",
    drawerCount: rest.drawerCount ?? "0",
  };
}

export const defaultKitchen = (): KitchenState => ({
  defaults: {
    name: "Kitchen",
    stile: "1 1/2",
    rail: "1 1/2",
    fit: "reveal",
    amount: "1/8",
    midGap: "1/8",
    drawerGap: "1/8",
    slide: "undermount",
    makeShaker: true,
    shakerBuild: "applied-miter",
    shakerStile: "3/4",
    shakerRail: "3/4",
    thickness: "3/4",
  },
  openings: [
    newOpening({
      id: "sample-sink",
      name: "Sink base",
      row: "base",
      openingW: "33",
      openingH: "22",
      doorCount: "2",
    }),
    newOpening({
      id: "sample-upper",
      name: "Upper L1",
      row: "upper",
      openingW: "30",
      openingH: "30",
      openingD: "12",
      doorCount: "2",
    }),
    newOpening({
      id: "sample-drawers",
      name: "Drawer base",
      row: "base",
      openingW: "18",
      openingH: "22",
      doorCount: "0",
      drawerCount: "3",
    }),
  ],
});

export function planKitchen(state: KitchenState): OpeningResult[] {
  const d = state.defaults;
  const stile = parseInches(d.stile) ?? 1.5;
  const rail = parseInches(d.rail) ?? 1.5;
  const amount = parseInches(d.amount) ?? 0.125;
  const midGap = parseInches(d.midGap) ?? 0.125;
  const drawerGap = parseInches(d.drawerGap) ?? 0.125;
  const shakerStile = parseInches(d.shakerStile) ?? 0.75;
  const shakerRail = parseInches(d.shakerRail) ?? 0.75;
  const thickness = parseInches(d.thickness) ?? 0.75;
  const makeShaker = d.makeShaker !== false;
  const shakerBuild: ShakerBuild = d.shakerBuild ?? "applied-miter";

  return state.openings.map((opening, index) => {
    const name = opening.name.trim() || `Opening ${index + 1}`;
    const ow = parseInches(opening.openingW);
    const oh = parseInches(opening.openingH);
    const od = parseInches(opening.openingD) ?? 21;
    if (!ow || !oh) {
      return { id: opening.id, name, row: opening.row, error: "Need opening width and height.", doors: [], drawers: [], parts: [] };
    }

    const parts: CutRow[] = [];
    const doors: OpeningResult["doors"] = [];
    const drawers: OpeningResult["drawers"] = [];
    let box: OpeningResult["box"];
    let shaker: ShakerPlan | undefined;

    const doorCount = opening.doorCount === "2" ? 2 : opening.doorCount === "1" ? 1 : 0;
    const drawerCount = Number(opening.drawerCount);
    const drawerOh = parseInches(opening.drawerH) || oh;

    if (doorCount > 0) {
      const plan = doorPlan({
        openingW: ow,
        openingH: oh,
        stile,
        rail,
        fit: d.fit,
        amount,
        doorCount,
        midGap,
      });
      if (!plan) {
        return { id: opening.id, name, row: opening.row, error: "Door math failed — check overlay vs stile.", doors: [], drawers: [], parts: [] };
      }
      const hinges = hingeAdvice(plan);
      shaker = makeShaker
        ? shakerPlan({
            doorW: plan.doorW,
            doorH: plan.doorH,
            stileW: shakerStile,
            railW: shakerRail,
            build: shakerBuild,
            grooveDepth: 0.375,
            float: 1 / 16,
            stockThickness: thickness,
          }) ?? undefined
        : undefined;

      plan.doors.forEach((door, i) => {
        const label = plan.doorCount === 1 ? "Door" : i === 0 ? "Left door" : "Right door";
        doors.push({ width: door.width, height: door.height, hinges: hinges.count, label });
        if (!shaker) {
          parts.push({
            name: `${name} · ${label}`,
            qty: 1,
            size: `${formatInches(door.width)} × ${formatInches(door.height)} × ${formatInches(thickness)}`,
            note: `${formatInches(plan.overlayX)} overlay · ${hinges.count} × 35mm cups`,
            opening: name,
          });
        }
      });
      parts.push({
        name: `${name} · Hinges`,
        qty: hinges.count * plan.doorCount,
        size: hinges.cup,
        note: hinges.euro,
        opening: name,
      });
      if (shaker) {
        shaker.parts.forEach((part) => {
          parts.push({
            name: `${name} · ${part.name}`,
            qty: part.qty * plan.doorCount,
            size: `${part.thickness} × ${formatInches(part.width)} × ${formatInches(part.length)}`,
            note: plan.doorCount === 2 ? `${part.note} · pair` : part.note,
            opening: name,
          });
        });
      }
    }

    if (drawerCount > 0) {
      const plan = drawerPlan({
        openingW: ow,
        openingH: drawerOh,
        openingD: od,
        stile,
        fit: d.fit,
        amount,
        count: drawerCount,
        gap: drawerGap,
        slide: d.slide,
      });
      if (!plan) {
        return { id: opening.id, name, row: opening.row, error: "Drawer math failed.", doors, drawers: [], parts };
      }
      plan.fronts.forEach((front) => {
        drawers.push({ width: front.width, height: front.height, label: front.label });
        const frontFrame = makeShaker
          ? shakerPlan({
              doorW: front.width,
              doorH: front.height,
              stileW: shakerStile,
              railW: shakerRail,
              build: shakerBuild,
              grooveDepth: 0.375,
              float: 1 / 16,
              stockThickness: thickness,
            })
          : null;
        if (frontFrame) {
          frontFrame.parts.forEach((part) => {
            parts.push({
              name: `${name} · ${front.label} · ${part.name}`,
              qty: part.qty,
              size: `${part.thickness} × ${formatInches(part.width)} × ${formatInches(part.length)}`,
              note: part.note,
              opening: name,
            });
          });
        } else {
          parts.push({
            name: `${name} · ${front.label}`,
            qty: 1,
            size: `${formatInches(front.width)} × ${formatInches(front.height)} × ${formatInches(thickness)}`,
            note: `${formatInches(plan.overlayX)} overlay`,
            opening: name,
          });
        }
      });
      box = { width: plan.boxW, depth: plan.boxD, height: plan.boxH, qty: plan.count };
      parts.push({
        name: `${name} · Drawer box`,
        qty: plan.count,
        size: `${formatInches(plan.boxW)} W × ${formatInches(plan.boxD)} D × ${formatInches(plan.boxH)} H`,
        note: d.slide === "side" ? "Side-mount slides" : "Undermount slides",
        opening: name,
      });
    }

    if (doorCount === 0 && drawerCount === 0) {
      return { id: opening.id, name, row: opening.row, error: "Pick at least one door or drawer.", doors: [], drawers: [], parts: [] };
    }

    return { id: opening.id, name, row: opening.row, doors, drawers, box, shaker, parts };
  });
}

export function summarizeCuts(results: OpeningResult[]): { name: string; qty: number; size: string; note: string }[] {
  const map = new Map<string, { name: string; qty: number; size: string; openings: Set<string> }>();
  for (const result of results) {
    for (const part of result.parts) {
      const shopName = part.name.includes(" · ") ? part.name.split(" · ").slice(1).join(" · ") : part.name;
      const key = `${shopName}|${part.size}`;
      const existing = map.get(key);
      if (existing) {
        existing.qty += part.qty;
        existing.openings.add(result.name);
      } else {
        map.set(key, { name: shopName, qty: part.qty, size: part.size, openings: new Set([result.name]) });
      }
    }
  }
  return [...map.values()].map((row) => ({
    name: row.name,
    qty: row.qty,
    size: row.size,
    note: [...row.openings].join(", "),
  }));
}

export function kitchenTotals(results: OpeningResult[]) {
  return {
    openings: results.length,
    doors: results.reduce((n, row) => n + row.doors.length, 0),
    drawers: results.reduce((n, row) => n + row.drawers.length, 0),
    errors: results.filter((row) => row.error).length,
  };
}

export function stileInches(stile: string) {
  return parseInches(stile) ?? 1.5;
}

/** Face-frame overall width — the size a kitchen planner thinks in. */
export function overallWidthInches(opening: KitchenOpeningInput, stile: string) {
  const ow = parseInches(opening.openingW);
  if (!ow) return null;
  return ow + stileInches(stile) * 2;
}

export function openingWidthFromOverall(overall: number, stile: string) {
  return formatInches(Math.max(0.5, overall - stileInches(stile) * 2)).replace(/"/g, "");
}

export const STANDARD_CAB_WIDTHS = [12, 15, 18, 21, 24, 27, 30, 33, 36] as const;

export type KitchenCatalogItem = {
  id: string;
  label: string;
  blurb: string;
  row: KitchenRow;
  overallW: number;
  openingH: string;
  openingD: string;
  doorCount: KitchenOpeningInput["doorCount"];
  drawerCount: KitchenOpeningInput["drawerCount"];
  name: string;
};

export const KITCHEN_CATALOG: KitchenCatalogItem[] = [
  {
    id: "base-36-doors",
    label: "36″ doors",
    blurb: "Pair of doors",
    row: "base",
    overallW: 36,
    openingH: "22",
    openingD: "21",
    doorCount: "2",
    drawerCount: "0",
    name: "36″ base",
  },
  {
    id: "base-36-drawers",
    label: "36″ drawers",
    blurb: "Three even fronts",
    row: "base",
    overallW: 36,
    openingH: "22",
    openingD: "21",
    doorCount: "0",
    drawerCount: "3",
    name: "36″ drawers",
  },
  {
    id: "base-sink",
    label: "Sink base",
    blurb: "Pair of doors, 36″",
    row: "base",
    overallW: 36,
    openingH: "22",
    openingD: "21",
    doorCount: "2",
    drawerCount: "0",
    name: "Sink base",
  },
  {
    id: "base-24-mix",
    label: "24″ drawer + doors",
    blurb: "Drawer over a pair",
    row: "base",
    overallW: 24,
    openingH: "18",
    openingD: "21",
    doorCount: "2",
    drawerCount: "1",
    name: "24″ base",
  },
  {
    id: "base-18-drawers",
    label: "18″ drawers",
    blurb: "Three drawers",
    row: "base",
    overallW: 18,
    openingH: "22",
    openingD: "21",
    doorCount: "0",
    drawerCount: "3",
    name: "18″ drawers",
  },
  {
    id: "base-15-door",
    label: "15″ door",
    blurb: "Narrow single door",
    row: "base",
    overallW: 15,
    openingH: "22",
    openingD: "21",
    doorCount: "1",
    drawerCount: "0",
    name: "15″ base",
  },
  {
    id: "upper-36",
    label: "36″ upper",
    blurb: "Pair of doors",
    row: "upper",
    overallW: 36,
    openingH: "30",
    openingD: "12",
    doorCount: "2",
    drawerCount: "0",
    name: "36″ upper",
  },
  {
    id: "upper-30",
    label: "30″ upper",
    blurb: "Pair of doors",
    row: "upper",
    overallW: 30,
    openingH: "30",
    openingD: "12",
    doorCount: "2",
    drawerCount: "0",
    name: "30″ upper",
  },
  {
    id: "upper-18",
    label: "18″ upper",
    blurb: "Single door",
    row: "upper",
    overallW: 18,
    openingH: "30",
    openingD: "12",
    doorCount: "1",
    drawerCount: "0",
    name: "18″ upper",
  },
  {
    id: "tall-24",
    label: "24″ pantry",
    blurb: "Full-height pair",
    row: "tall",
    overallW: 24,
    openingH: "70",
    openingD: "21",
    doorCount: "2",
    drawerCount: "0",
    name: "Pantry",
  },
];

export function openingFromCatalog(item: KitchenCatalogItem, stile: string): KitchenOpeningInput {
  return newOpening({
    name: item.name,
    row: item.row,
    openingW: openingWidthFromOverall(item.overallW, stile),
    openingH: item.openingH,
    openingD: item.openingD,
    doorCount: item.doorCount,
    drawerCount: item.drawerCount,
  });
}
