import { formatInches } from "@/lib/measure";

export type FitStyle = "reveal" | "overlay" | "inset";

export type DoorPlan = {
  openingW: number;
  openingH: number;
  stile: number;
  rail: number;
  overallW: number;
  overallH: number;
  overlayX: number;
  overlayY: number;
  revealX: number;
  revealY: number;
  doorW: number;
  doorH: number;
  doorCount: number;
  midGap: number;
  doors: { width: number; height: number }[];
};

export function overlayFromReveal(frame: number, reveal: number): number {
  return frame - reveal;
}

export function doorPlan(input: {
  openingW: number;
  openingH: number;
  stile: number;
  rail: number;
  fit: FitStyle;
  amount: number;
  doorCount: number;
  midGap: number;
}): DoorPlan | null {
  const { openingW, openingH, stile, rail, fit, amount } = input;
  if ([openingW, openingH, stile, rail, amount].some((n) => !Number.isFinite(n) || n < 0)) {
    return null;
  }
  if (openingW <= 0 || openingH <= 0) return null;

  const overallW = openingW + stile * 2;
  const overallH = openingH + rail * 2;
  const doorCount = input.doorCount <= 1 ? 1 : 2;
  const midGap = doorCount === 2 ? Math.max(0, input.midGap) : 0;

  let overlayX = 0;
  let overlayY = 0;
  let revealX = 0;
  let revealY = 0;
  let coveredW = 0;
  let coveredH = 0;

  if (fit === "inset") {
    overlayX = 0;
    overlayY = 0;
    revealX = amount;
    revealY = amount;
    coveredW = openingW - amount * 2;
    coveredH = openingH - amount * 2;
  } else if (fit === "overlay") {
    overlayX = amount;
    overlayY = amount;
    revealX = Math.max(0, stile - overlayX);
    revealY = Math.max(0, rail - overlayY);
    coveredW = openingW + overlayX * 2;
    coveredH = openingH + overlayY * 2;
  } else {
    revealX = amount;
    revealY = amount;
    overlayX = overlayFromReveal(stile, revealX);
    overlayY = overlayFromReveal(rail, revealY);
    coveredW = overallW - revealX * 2;
    coveredH = overallH - revealY * 2;
  }

  if (coveredW <= 0 || coveredH <= 0 || overlayX < -0.001 || overlayY < -0.001) return null;

  const widthEach = (coveredW - midGap) / doorCount;
  if (widthEach <= 0) return null;

  const doors = Array.from({ length: doorCount }, () => ({
    width: widthEach,
    height: coveredH,
  }));

  return {
    openingW,
    openingH,
    stile,
    rail,
    overallW,
    overallH,
    overlayX,
    overlayY,
    revealX,
    revealY,
    doorW: widthEach,
    doorH: coveredH,
    doorCount,
    midGap,
    doors,
  };
}

export function hingeCount(doorHeight: number): number {
  if (doorHeight <= 36) return 2;
  if (doorHeight <= 60) return 3;
  if (doorHeight <= 80) return 4;
  if (doorHeight <= 90) return 5;
  return 6;
}

export function hingeCenters(doorHeight: number, count: number, inset = 3.5): number[] {
  const n = Math.max(2, count);
  const edge = Math.min(inset, doorHeight / 5);
  if (doorHeight <= edge * 2 + 1) {
    return [doorHeight * 0.22, doorHeight * 0.78];
  }
  const span = doorHeight - edge * 2;
  return Array.from({ length: n }, (_, i) => edge + (span * i) / (n - 1));
}

export type HingeAdvice = {
  count: number;
  centers: number[];
  euro: string;
  traditional: string;
  cup: string;
  tab: string;
  note: string;
};

export function hingeAdvice(plan: DoorPlan): HingeAdvice {
  const count = hingeCount(plan.doorH);
  const centers = hingeCenters(plan.doorH, count);
  const overlay = plan.overlayX;

  let euro = "35mm cup, full overlay, 110°";
  let traditional = '1/2" overlay wrap hinges';
  let note = "Bore 35mm cups 3–6mm in from the door edge. Face-frame cabinets want a face-frame plate or COMPACT-style hinge.";

  if (overlay <= 0 && plan.doorW < plan.openingW) {
    euro = "35mm cup, inset (0 overlay)";
    traditional = '2-1/2" or 3" butt hinges (or concealed inset)';
    note = "Inset doors need a 1/16\"–1/8\" gap all around. Butt hinges sit on the face-frame stile; Euro inset hinges bore the door and mount to the cabinet side or a face-frame adapter.";
  } else if (Math.abs(overlay - 0.375) < 0.04) {
    euro = "35mm cup, 3/8\" overlay (or full overlay + 3mm plate)";
    traditional = '3/8" overlay wrap hinges';
  } else if (Math.abs(overlay - 0.5) < 0.04) {
    euro = "35mm cup, 1/2\" overlay / Blum COMPACT or CLIP + face-frame plate";
    traditional = '1/2" overlay wrap hinges';
    note = "The usual American face-frame hinge. 35mm cup, 13.5mm deep, 5mm from the door edge. Two hinges to 36\"; add a third above 36\".";
  } else if (overlay >= 0.75) {
    euro = "35mm cup, full overlay with face-frame plate (wide overlay)";
    traditional = '1-1/4" overlay wrap hinges';
    note = `This is a ${formatInches(overlay)} overlay — a full-coverage door. Use full-overlay Euro hinges on a face-frame mounting plate, or 1-1/4\" wrap hinges. Check that adjacent doors still have a ${formatInches(plan.midGap || 1 / 8)} gap.`;
  } else if (overlay > 0) {
    euro = `35mm cup, full overlay, ${formatInches(overlay)} on the frame`;
    traditional = "Match overlay wrap hinges, or Euro with a mounting-plate adjustment";
  }

  return {
    count,
    centers,
    euro,
    traditional,
    cup: "35mm diameter × 13.5mm deep",
    tab: "5mm from door edge to cup (3–6mm is typical)",
    note,
  };
}

export type ShakerBuild = "cope" | "applied-miter" | "applied-butt";

export type ShakerPlan = {
  doorW: number;
  doorH: number;
  stileW: number;
  railW: number;
  visibleW: number;
  visibleH: number;
  grooveDepth: number;
  float: number;
  panelW: number;
  panelH: number;
  stileLength: number;
  railLength: number;
  railLongPoint?: number;
  parts: { name: string; qty: number; thickness: string; width: number; length: number; note: string }[];
};

export function shakerPlan(input: {
  doorW: number;
  doorH: number;
  stileW: number;
  railW: number;
  build: ShakerBuild;
  grooveDepth: number;
  float: number;
  stockThickness: number;
}): ShakerPlan | null {
  const { doorW, doorH, stileW, railW, build, grooveDepth, float, stockThickness } = input;
  if ([doorW, doorH, stileW, railW].some((n) => !Number.isFinite(n) || n <= 0)) return null;
  if (stileW * 2 >= doorW - 0.25 || railW * 2 >= doorH - 0.25) return null;

  const visibleW = doorW - stileW * 2;
  const visibleH = doorH - railW * 2;
  const thick = Number.isFinite(stockThickness) && stockThickness > 0 ? stockThickness : 0.75;

  if (build === "applied-miter") {
    return {
      doorW,
      doorH,
      stileW,
      railW,
      visibleW,
      visibleH,
      grooveDepth: 0,
      float: 0,
      panelW: doorW,
      panelH: doorH,
      stileLength: doorH,
      railLength: doorW,
      railLongPoint: doorW,
      parts: [
        {
          name: "Slab / panel",
          qty: 1,
          thickness: formatInches(thick),
          width: doorW,
          length: doorH,
          note: "Finished door size. Frame glues onto the face.",
        },
        {
          name: "Stiles (long point)",
          qty: 2,
          thickness: formatInches(thick),
          width: stileW,
          length: doorH,
          note: "45° miters. Long point = door height.",
        },
        {
          name: "Rails (long point)",
          qty: 2,
          thickness: formatInches(thick),
          width: railW,
          length: doorW,
          note: "45° miters. Long point = door width.",
        },
      ],
    };
  }

  if (build === "applied-butt") {
    const railLen = doorW - stileW * 2;
    return {
      doorW,
      doorH,
      stileW,
      railW,
      visibleW,
      visibleH,
      grooveDepth: 0,
      float: 0,
      panelW: doorW,
      panelH: doorH,
      stileLength: doorH,
      railLength: railLen,
      parts: [
        {
          name: "Slab / panel",
          qty: 1,
          thickness: formatInches(thick),
          width: doorW,
          length: doorH,
          note: "Finished door size. Stiles run through.",
        },
        {
          name: "Stiles",
          qty: 2,
          thickness: formatInches(thick),
          width: stileW,
          length: doorH,
          note: "Full height. Rails butt between them.",
        },
        {
          name: "Rails",
          qty: 2,
          thickness: formatInches(thick),
          width: railW,
          length: railLen,
          note: "Fits between the stiles.",
        },
      ],
    };
  }

  const groove = grooveDepth > 0 ? grooveDepth : 0.375;
  const play = float >= 0 ? float : 1 / 16;
  const railLen = doorW - stileW * 2 + groove * 2;
  const panelW = doorW - stileW * 2 + groove * 2 - play * 2;
  const panelH = doorH - railW * 2 + groove * 2 - play * 2;

  return {
    doorW,
    doorH,
    stileW,
    railW,
    visibleW,
    visibleH,
    grooveDepth: groove,
    float: play,
    panelW,
    panelH,
    stileLength: doorH,
    railLength: railLen,
    parts: [
      {
        name: "Stiles",
        qty: 2,
        thickness: formatInches(thick),
        width: stileW,
        length: doorH,
        note: "Full door height. Cope the rails into these.",
      },
      {
        name: "Rails",
        qty: 2,
        thickness: formatInches(thick),
        width: railW,
        length: railLen,
        note: `Includes ${formatInches(groove)} tenon / cope on each end.`,
      },
      {
        name: "Panel",
        qty: 1,
        thickness: '1/4"',
        width: panelW,
        length: panelH,
        note: `Floats ${formatInches(play)} in a ${formatInches(groove)} groove. Visible opening ${formatInches(visibleW)} × ${formatInches(visibleH)}.`,
      },
    ],
  };
}

export type DrawerPlan = {
  openingW: number;
  openingH: number;
  openingD: number;
  stile: number;
  overallW: number;
  overallH: number;
  overlayX: number;
  overlayY: number;
  reveal: number;
  fit: FitStyle;
  count: number;
  gap: number;
  frontW: number;
  frontH: number;
  boxW: number;
  boxH: number;
  boxD: number;
  slide: "undermount" | "side";
  fronts: { label: string; width: number; height: number }[];
};

export function drawerPlan(input: {
  openingW: number;
  openingH: number;
  openingD: number;
  stile: number;
  fit: FitStyle;
  amount: number;
  count: number;
  gap: number;
  slide: "undermount" | "side";
}): DrawerPlan | null {
  const { openingW, openingH, openingD, stile, fit, amount, slide } = input;
  if ([openingW, openingH, openingD, stile, amount].some((n) => !Number.isFinite(n) || n < 0)) {
    return null;
  }
  if (openingW <= 0 || openingH <= 0) return null;

  const count = Math.max(1, Math.round(input.count));
  const gap = count > 1 ? Math.max(0, input.gap) : 0;

  let overlayX = 0;
  let overlayY = 0;
  let reveal = 0;
  let coveredW = 0;
  let coveredH = 0;

  if (fit === "inset") {
    reveal = amount;
    coveredW = openingW - amount * 2;
    coveredH = openingH - amount * 2;
  } else if (fit === "overlay") {
    overlayX = amount;
    overlayY = amount;
    reveal = Math.max(0, stile - overlayX);
    coveredW = openingW + overlayX * 2;
    coveredH = openingH + overlayY * 2;
  } else {
    reveal = amount;
    overlayX = overlayFromReveal(stile, reveal);
    overlayY = overlayX;
    const overallW = openingW + stile * 2;
    coveredW = overallW - reveal * 2;
    coveredH = openingH + overlayY * 2;
  }

  const frontH = (coveredH - gap * (count - 1)) / count;
  if (coveredW <= 0 || frontH <= 0) return null;

  const boxW = slide === "side" ? openingW - 1 : openingW - 0.375;
  const boxH = Math.max(1, frontH - (fit === "inset" ? 0.25 : 0.5));
  const boxD = Math.max(1, openingD - 0.125);

  const fronts = Array.from({ length: count }, (_, i) => ({
    label: count === 1 ? "Drawer front" : `Drawer ${i + 1} (top is 1)`,
    width: coveredW,
    height: frontH,
  }));

  return {
    openingW,
    openingH,
    openingD,
    stile,
    overallW: openingW + stile * 2,
    overallH: openingH + stile * 2,
    overlayX,
    overlayY,
    reveal,
    fit,
    count,
    gap,
    frontW: coveredW,
    frontH,
    boxW,
    boxH,
    boxD,
    slide,
    fronts,
  };
}

export type DrawerBoxParts = {
  stock: number;
  bottom: number;
  parts: { name: string; qty: number; thickness: string; width: number; length: number; note: string }[];
};

/** Opening height that makes doorPlan / drawerPlan cover exactly `coveredH`. */
function openingForCoveredHeight(
  coveredH: number,
  fit: FitStyle,
  amount: number,
  frame: number,
): number | null {
  if (!Number.isFinite(coveredH) || coveredH <= 0) return null;
  let openingH: number;
  if (fit === "inset") {
    openingH = coveredH + amount * 2;
  } else if (fit === "overlay") {
    openingH = coveredH - amount * 2;
  } else {
    openingH = coveredH - frame * 2 + amount * 2;
  }
  if (!Number.isFinite(openingH) || openingH <= 0) return null;
  return openingH;
}

export type DoorDrawerSplit = "two-openings" | "one-opening";

export type DoorDrawerPlan = {
  split: DoorDrawerSplit;
  fit: FitStyle;
  openingW: number;
  totalOpeningH: number;
  drawerOpeningH: number;
  doorOpeningH: number;
  stile: number;
  rail: number;
  midRail: number;
  overallW: number;
  overallH: number;
  overlayX: number;
  overlayY: number;
  revealX: number;
  revealY: number;
  stackGap: number;
  overlap: number;
  door: DoorPlan;
  drawer: DrawerPlan;
};

/**
 * Drawer over door(s) on one cabinet face. Reuses doorPlan and drawerPlan so overlay,
 * pair-gap, hinges, and box clearance match the standalone door and drawer tools.
 */
export function doorDrawerPlan(input: {
  openingW: number;
  stile: number;
  rail: number;
  fit: FitStyle;
  amount: number;
  doorCount: number;
  midGap: number;
  openingD: number;
  slide: "undermount" | "side";
  split: DoorDrawerSplit;
  drawerOpeningH?: number;
  doorOpeningH?: number;
  midRail?: number;
  totalOpeningH?: number;
  drawerFrontH?: number;
  stackGap?: number;
}): DoorDrawerPlan | null {
  const { openingW, stile, rail, fit, amount, openingD, slide, split } = input;
  if ([openingW, stile, rail, amount, openingD].some((n) => !Number.isFinite(n) || n < 0)) {
    return null;
  }
  if (openingW <= 0) return null;

  const doorCount = input.doorCount <= 1 ? 1 : 2;
  const midGap = doorCount === 2 ? Math.max(0, input.midGap) : 0;

  if (split === "two-openings") {
    const drawerOpeningH = input.drawerOpeningH ?? 0;
    const doorOpeningH = input.doorOpeningH ?? 0;
    const midRail = Math.max(0, input.midRail ?? rail);
    if (drawerOpeningH <= 0 || doorOpeningH <= 0) return null;

    const drawer = drawerPlan({
      openingW,
      openingH: drawerOpeningH,
      openingD,
      stile,
      fit,
      amount,
      count: 1,
      gap: 0,
      slide,
    });
    const door = doorPlan({
      openingW,
      openingH: doorOpeningH,
      stile,
      rail,
      fit,
      amount,
      doorCount,
      midGap,
    });
    if (!drawer || !door) return null;

    const overallW = openingW + stile * 2;
    const overallH = rail * 2 + drawerOpeningH + midRail + doorOpeningH;
    const naturalGap =
      fit === "inset" ? midRail + drawer.reveal + door.revealY : midRail - drawer.overlayY - door.overlayY;

    // Same overlay on the stiles (from doorPlan / drawerPlan). On the mid-rail, split
    // the leftover so the faces meet at the gap you typed instead of overlapping.
    const wantedGap = input.stackGap;
    const useGap = wantedGap != null && Number.isFinite(wantedGap) && wantedGap >= 0 && fit !== "inset";
    const stackGap = useGap ? wantedGap : naturalGap;
    const ontoMid = midRail - stackGap;
    let stackedDrawer = drawer;
    let stackedDoor = door;
    if (useGap && ontoMid >= 0) {
      const drawerH = drawerOpeningH + drawer.overlayY + ontoMid / 2;
      const doorH = doorOpeningH + ontoMid / 2 + door.overlayY;
      if (drawerH > 0 && doorH > 0) {
        stackedDrawer = {
          ...drawer,
          frontH: drawerH,
          fronts: drawer.fronts.map((front) => ({ ...front, height: drawerH })),
          boxH: Math.max(1, drawerH - 0.5),
        };
        stackedDoor = {
          ...door,
          doorH,
          doors: door.doors.map((leaf) => ({ ...leaf, height: doorH })),
        };
      }
    }

    return {
      split,
      fit,
      openingW,
      totalOpeningH: drawerOpeningH + midRail + doorOpeningH,
      drawerOpeningH,
      doorOpeningH,
      stile,
      rail,
      midRail,
      overallW,
      overallH,
      overlayX: door.overlayX,
      overlayY: door.overlayY,
      revealX: door.revealX,
      revealY: door.revealY,
      stackGap,
      overlap: Math.max(0, -stackGap),
      door: stackedDoor,
      drawer: stackedDrawer,
    };
  }

  const totalOpeningH = input.totalOpeningH ?? 0;
  const drawerFrontH = input.drawerFrontH ?? 0;
  const stackGap = Math.max(0, input.stackGap ?? 1 / 8);
  if (totalOpeningH <= 0 || drawerFrontH <= 0) return null;

  const envelope = doorPlan({
    openingW,
    openingH: totalOpeningH,
    stile,
    rail,
    fit,
    amount,
    doorCount: 1,
    midGap: 0,
  });
  if (!envelope) return null;

  const doorH = envelope.doorH - drawerFrontH - stackGap;
  if (doorH <= 0) return null;

  const drawerOpeningH = openingForCoveredHeight(drawerFrontH, fit, amount, stile);
  const doorOpeningH = openingForCoveredHeight(doorH, fit, amount, rail);
  if (drawerOpeningH === null || doorOpeningH === null) return null;

  const drawer = drawerPlan({
    openingW,
    openingH: drawerOpeningH,
    openingD,
    stile,
    fit,
    amount,
    count: 1,
    gap: 0,
    slide,
  });
  const door = doorPlan({
    openingW,
    openingH: doorOpeningH,
    stile,
    rail,
    fit,
    amount,
    doorCount,
    midGap,
  });
  if (!drawer || !door) return null;

  return {
    split,
    fit,
    openingW,
    totalOpeningH,
    drawerOpeningH,
    doorOpeningH,
    stile,
    rail,
    midRail: 0,
    overallW: envelope.overallW,
    overallH: envelope.overallH,
    overlayX: envelope.overlayX,
    overlayY: envelope.overlayY,
    revealX: envelope.revealX,
    revealY: envelope.revealY,
    stackGap,
    overlap: 0,
    door,
    drawer,
  };
}

export function drawerBoxParts(
  plan: DrawerPlan,
  stock = 0.625,
  bottom = 0.25,
): DrawerBoxParts | null {
  if (stock <= 0 || plan.boxW <= stock * 2 || plan.boxH <= 0 || plan.boxD <= 0) return null;
  const innerW = plan.boxW - stock * 2;
  const groove = Math.min(0.25, stock / 2);
  return {
    stock,
    bottom,
    parts: [
      {
        name: "Drawer sides",
        qty: 2 * plan.count,
        thickness: formatInches(stock),
        width: plan.boxH,
        length: plan.boxD,
        note: `${plan.count === 1 ? "One box" : `${plan.count} boxes`} · groove ${formatInches(groove)} for the bottom.`,
      },
      {
        name: "Drawer front & back",
        qty: 2 * plan.count,
        thickness: formatInches(stock),
        width: plan.boxH,
        length: innerW,
        note: "Fits between the sides. Same groove as the sides.",
      },
      {
        name: "Drawer bottom",
        qty: plan.count,
        thickness: formatInches(bottom),
        width: innerW + groove * 2 - 1 / 16,
        length: plan.boxD - stock * 2 + groove * 2 - 1 / 16,
        note: "¼″ plywood in a groove. Cut shy so it can float.",
      },
    ],
  };
}
