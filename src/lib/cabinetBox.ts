import {
  doorPlan,
  drawerBoxParts,
  drawerPlan,
  hingeAdvice,
  shakerPlan,
  type DrawerPlan,
  type FitStyle,
  type ShakerBuild,
} from "@/lib/cabinet";
import { formatInches } from "@/lib/measure";

export type CabinetKind = "base" | "upper" | "tall";
export type Construction = "face-frame" | "frameless";
export type PartKind =
  | "side"
  | "bottom"
  | "top"
  | "back"
  | "stretcher"
  | "toe"
  | "stile"
  | "rail"
  | "shelf"
  | "door"
  | "slab"
  | "panel"
  | "drawer-side"
  | "drawer-fb"
  | "drawer-bottom"
  | "hinge"
  | "nailer"
  | "board"
  | "strip"
  | "segment"
  | "hardware";

export type CutItem = {
  name: string;
  qty: number;
  size: string;
  note: string;
  kind: PartKind;
};

export type BuildStep = {
  id: string;
  text: string;
  detail?: string;
};

export type FaceCell = {
  id: string;
  kind: "doors" | "drawer" | "false-front";
  count: number;
  height: number;
  share: number;
  label: string;
};

export type CabinetLayout = {
  id: string;
  kind: CabinetKind | "any";
  label: string;
  blurb: string;
  cells: { kind: FaceCell["kind"]; count: number; share: number; label: string }[];
  shelves: number;
};

export const KIND_DEFAULTS: Record<CabinetKind, { height: string; depth: string; toe: string; shelves: number }> = {
  base: { height: "34 1/2", depth: "24", toe: "4", shelves: 0 },
  upper: { height: "30", depth: "12", toe: "0", shelves: 2 },
  tall: { height: "84", depth: "24", toe: "4", shelves: 4 },
};

export const CABINET_LAYOUTS: CabinetLayout[] = [
  {
    id: "base-drawers-3",
    kind: "base",
    label: "3 drawers",
    blurb: "The usual 36″ drawer base — three even fronts.",
    cells: [
      { kind: "drawer", count: 1, share: 1, label: "Drawer 1 (top)" },
      { kind: "drawer", count: 1, share: 1, label: "Drawer 2" },
      { kind: "drawer", count: 1, share: 1, label: "Drawer 3" },
    ],
    shelves: 0,
  },
  {
    id: "base-drawers-4",
    kind: "base",
    label: "4 drawers",
    blurb: "Shallower top drawer, then three deeper pots.",
    cells: [
      { kind: "drawer", count: 1, share: 1, label: "Drawer 1 (top)" },
      { kind: "drawer", count: 1, share: 1.35, label: "Drawer 2" },
      { kind: "drawer", count: 1, share: 1.35, label: "Drawer 3" },
      { kind: "drawer", count: 1, share: 1.35, label: "Drawer 4" },
    ],
    shelves: 0,
  },
  {
    id: "base-drawers-3-bank",
    kind: "base",
    label: "Utensil + two deep",
    blurb: "A skinny top drawer over two big ones.",
    cells: [
      { kind: "drawer", count: 1, share: 1, label: "Utensil drawer" },
      { kind: "drawer", count: 1, share: 1.8, label: "Drawer 2" },
      { kind: "drawer", count: 1, share: 1.8, label: "Drawer 3" },
    ],
    shelves: 0,
  },
  {
    id: "base-drawer-over-doors",
    kind: "base",
    label: "Drawer over a pair of doors",
    blurb: "Classic base: one drawer, two doors below.",
    cells: [
      { kind: "drawer", count: 1, share: 1, label: "Top drawer" },
      { kind: "doors", count: 2, share: 2.6, label: "Doors" },
    ],
    shelves: 1,
  },
  {
    id: "base-drawer-over-door",
    kind: "base",
    label: "Drawer over one door",
    blurb: "Narrow base — trash pullout or a single door.",
    cells: [
      { kind: "drawer", count: 1, share: 1, label: "Top drawer" },
      { kind: "doors", count: 1, share: 2.6, label: "Door" },
    ],
    shelves: 1,
  },
  {
    id: "base-doors-2",
    kind: "base",
    label: "Pair of doors",
    blurb: "No drawers. Shelf inside.",
    cells: [{ kind: "doors", count: 2, share: 1, label: "Doors" }],
    shelves: 1,
  },
  {
    id: "base-door-1",
    kind: "base",
    label: "Single door",
    blurb: "A 12–18″ base with one door.",
    cells: [{ kind: "doors", count: 1, share: 1, label: "Door" }],
    shelves: 1,
  },
  {
    id: "base-sink",
    kind: "base",
    label: "Sink base",
    blurb: "False front on top, pair of doors, no shelf.",
    cells: [
      { kind: "false-front", count: 1, share: 1, label: "False front" },
      { kind: "doors", count: 2, share: 2.8, label: "Doors" },
    ],
    shelves: 0,
  },
  {
    id: "upper-doors-2",
    kind: "upper",
    label: "Upper, pair of doors",
    blurb: "Wall cabinet. Two shelves is typical.",
    cells: [{ kind: "doors", count: 2, share: 1, label: "Doors" }],
    shelves: 2,
  },
  {
    id: "upper-door-1",
    kind: "upper",
    label: "Upper, single door",
    blurb: "A 12–18″ wall cabinet.",
    cells: [{ kind: "doors", count: 1, share: 1, label: "Door" }],
    shelves: 2,
  },
  {
    id: "tall-pantry",
    kind: "tall",
    label: "Tall pantry",
    blurb: "Full-height pair of doors and several shelves.",
    cells: [{ kind: "doors", count: 2, share: 1, label: "Doors" }],
    shelves: 4,
  },
];

export function layoutsFor(kind: CabinetKind): CabinetLayout[] {
  return CABINET_LAYOUTS.filter((item) => item.kind === kind || item.kind === "any");
}

export function getLayout(id: string): CabinetLayout | undefined {
  return CABINET_LAYOUTS.find((item) => item.id === id);
}

export function layoutFromOpening(
  row: "upper" | "base" | "tall",
  doorCount: string,
  drawerCount: string,
): string {
  if (row === "upper") return doorCount === "1" ? "upper-door-1" : "upper-doors-2";
  if (row === "tall") return "tall-pantry";
  if (drawerCount !== "0" && doorCount === "0") {
    return drawerCount === "4" ? "base-drawers-4" : "base-drawers-3";
  }
  if (drawerCount !== "0" && doorCount === "2") return "base-drawer-over-doors";
  if (drawerCount !== "0" && doorCount === "1") return "base-drawer-over-door";
  if (doorCount === "1") return "base-door-1";
  return "base-doors-2";
}

export type CabinetBoxInput = {
  overallW: number;
  overallH: number;
  overallD: number;
  kind: CabinetKind;
  construction: Construction;
  layout: CabinetLayout;
  stile: number;
  rail: number;
  overhang: number;
  sideThick: number;
  backThick: number;
  dado: number;
  toeH: number;
  toeD: number;
  stretcherW: number;
  fit: FitStyle;
  amount: number;
  midGap: number;
  drawerGap: number;
  slide: "undermount" | "side";
  shelves: number;
  makeShaker: boolean;
  shakerBuild: ShakerBuild;
  shakerStile: number;
  shakerRail: number;
  faceThick: number;
  drawerStock: number;
  includeDoorFaces: boolean;
  includeDrawerFaces: boolean;
  includeDrawerBoxes: boolean;
  includeToeSkin: boolean;
  includeNailer?: boolean;
  includeFaceFrame?: boolean;
};

export type CabinetBoxPlan = {
  kind: CabinetKind;
  construction: Construction;
  layout: CabinetLayout;
  overallW: number;
  overallH: number;
  overallD: number;
  boxW: number;
  boxH: number;
  boxD: number;
  interiorW: number;
  interiorH: number;
  interiorD: number;
  faceH: number;
  toeH: number;
  toeD: number;
  stile: number;
  rail: number;
  cells: FaceCell[];
  parts: CutItem[];
  doors: { label: string; width: number; height: number; hinges: number }[];
  drawers: { label: string; width: number; height: number; box: DrawerPlan }[];
  steps: BuildStep[];
  includeDoorFaces: boolean;
  includeDrawerFaces: boolean;
  includeDrawerBoxes: boolean;
};

function cut(
  name: string,
  qty: number,
  thick: string,
  width: number,
  length: number,
  note: string,
  kind: PartKind,
): CutItem {
  return {
    name,
    qty,
    size: `${thick} × ${formatInches(width)} × ${formatInches(length)}`,
    note,
    kind,
  };
}

export function planCabinetBox(input: CabinetBoxInput): CabinetBoxPlan | null {
  const {
    overallW,
    overallH,
    overallD,
    kind,
    construction,
    layout,
    stile,
    rail,
    overhang,
    sideThick,
    backThick,
    dado,
    stretcherW,
    fit,
    amount,
    midGap,
    drawerGap,
    slide,
    makeShaker,
    shakerBuild,
    shakerStile,
    shakerRail,
    faceThick,
    drawerStock,
    includeDoorFaces,
    includeDrawerFaces,
    includeDrawerBoxes,
    includeToeSkin,
  } = input;
  if ([overallW, overallH, overallD, sideThick, stile, rail].some((n) => !Number.isFinite(n) || n <= 0)) {
    return null;
  }

  const toeH = kind === "upper" ? 0 : Math.max(0, input.toeH);
  const toeD = toeH > 0 ? Math.max(0, input.toeD) : 0;
  const faceFrame = construction === "face-frame";
  const includeFaceFrame = faceFrame && input.includeFaceFrame !== false;
  const boxW = faceFrame ? Math.max(overallW - overhang * 2, sideThick * 2 + 2) : overallW;
  const boxH = overallH;
  const boxD = overallD;
  const interiorW = boxW - sideThick * 2 + dado * 2;
  const interiorD = Math.max(1, boxD - backThick - 0.125);
  const faceH = Math.max(2, boxH - toeH);
  const interiorH = Math.max(1, faceH - (faceFrame ? rail : 0) - 0.75);

  const template = layout.cells;
  const railCount = template.length + 1;
  const divider = faceFrame ? rail : Math.max(0.125, drawerGap);
  const edge = faceFrame ? rail : Math.max(0, amount);
  const openingBand = faceH - edge * 2 - divider * Math.max(0, template.length - 1);
  if (openingBand <= 0.5) return null;
  const shareSum = template.reduce((sum, cell) => sum + cell.share, 0);
  const cells: FaceCell[] = template.map((cell, index) => ({
    id: `c${index}`,
    kind: cell.kind,
    count: cell.count,
    share: cell.share,
    label: cell.label,
    height: (openingBand * cell.share) / shareSum,
  }));

  const parts: CutItem[] = [];
  const tSide = formatInches(sideThick);
  const tBack = formatInches(backThick);
  const tFace = formatInches(faceThick);

  parts.push(
    cut(
      "Ends / sides",
      2,
      tSide,
      boxD,
      boxH,
      toeH > 0
        ? `Notch a ${formatInches(toeH)} × ${formatInches(toeD)} toe kick on the front bottom of each side.`
        : "Full height. Grain runs up and down.",
      "side",
    ),
  );

  const bottomW = boxW - sideThick * 2 + dado * 2;
  const bottomD = boxD - backThick;
  if (layout.id !== "base-sink") {
    parts.push(
      cut(
        kind === "upper" || kind === "tall" ? "Bottom" : "Bottom (at the toe)",
        1,
        tSide,
        bottomD,
        bottomW,
        `Sits in a ${formatInches(dado)} dado. Width includes the dados.`,
        "bottom",
      ),
    );
  } else {
    parts.push(
      cut(
        "Sink floor / bottom",
        1,
        tSide,
        bottomD,
        bottomW,
        "Still cut a bottom. Plumbing goes through the back, not this panel.",
        "bottom",
      ),
    );
  }

  if (kind === "upper" || kind === "tall") {
    parts.push(
      cut("Top", 1, tSide, bottomD, bottomW, "Same size as the bottom. Dados in the sides.", "top"),
    );
  } else {
    parts.push(
      cut(
        "Front stretcher",
        1,
        tSide,
        stretcherW,
        boxW - sideThick * 2,
        "Fits between the sides at the top front. Counter screws down into this.",
        "stretcher",
      ),
      cut(
        "Back stretcher",
        1,
        tSide,
        stretcherW,
        boxW - sideThick * 2,
        "Top back. Pairs with the front stretcher so the box cannot rack.",
        "stretcher",
      ),
    );
  }

  const backH = boxH - toeH;
  const backW = boxW - 2 * Math.max(0, sideThick - dado);
  parts.push(
    cut(
      "Back",
      1,
      tBack,
      backH,
      backW,
      `¼″ plywood in a ${formatInches(dado)} rabbet. Squares the box.`,
      "back",
    ),
  );

  if (toeH > 0 && includeToeSkin) {
    parts.push(
      cut(
        "Toe kick skin",
        1,
        tFace,
        toeH,
        overallW,
        "Covers the notch. Can run the whole kitchen later as one strip.",
        "toe",
      ),
    );
  }

  if (kind === "upper" && input.includeNailer !== false) {
    parts.push(
      cut(
        "Hanging rail",
        1,
        tSide,
        stretcherW,
        boxW - sideThick * 2,
        "Inside, at the top back. Screws into the studs through the back.",
        "nailer",
      ),
    );
  }

  const shelfCount = Math.max(0, input.shelves);
  if (shelfCount > 0) {
    parts.push(
      cut(
        "Shelf",
        shelfCount,
        tSide,
        interiorD,
        interiorW - 0.125,
        "Cut a hair shy of the interior so it can be adjusted. 3/4″ plywood.",
        "shelf",
      ),
    );
  }

  if (includeFaceFrame) {
    parts.push(
      cut(
        "Face-frame stiles",
        2,
        tFace,
        stile,
        faceH,
        `Full face height. Box sides sit ${formatInches(overhang)} in from each stile.`,
        "stile",
      ),
    );
    parts.push(
      cut(
        "Face-frame rails",
        railCount,
        tFace,
        rail,
        overallW - stile * 2,
        `${railCount} rails: top, bottom, and a divider at each drawer/door split.`,
        "rail",
      ),
    );
  }

  const openingW = faceFrame ? overallW - stile * 2 : Math.max(1, boxW - sideThick * 2);
  const doorFit: FitStyle = faceFrame ? fit : "overlay";
  const doorAmount = faceFrame ? amount : sideThick;
  const doorStile = faceFrame ? stile : sideThick;
  const doors: CabinetBoxPlan["doors"] = [];
  const drawers: CabinetBoxPlan["drawers"] = [];

  function addShaker(doorW: number, doorH: number, label: string) {
    if (!makeShaker) {
      parts.push(
        cut(label, 1, tFace, doorW, doorH, "Finished face size.", doorH > doorW * 0.8 ? "door" : "slab"),
      );
      return;
    }
    const shaker = shakerPlan({
      doorW,
      doorH,
      stileW: shakerStile,
      railW: shakerRail,
      build: shakerBuild,
      grooveDepth: 0.375,
      float: 1 / 16,
      stockThickness: faceThick,
    });
    if (!shaker) {
      parts.push(cut(label, 1, tFace, doorW, doorH, "Finished face size (frame too wide for shaker).", "door"));
      return;
    }
    shaker.parts.forEach((part) => {
      const kind: PartKind = part.name.toLowerCase().includes("stile")
        ? "stile"
        : part.name.toLowerCase().includes("rail")
          ? "rail"
          : part.name.toLowerCase().includes("slab")
            ? "slab"
            : "panel";
      parts.push({
        name: `${label} · ${part.name}`,
        qty: part.qty,
        size: `${part.thickness} × ${formatInches(part.width)} × ${formatInches(part.length)}`,
        note: part.note,
        kind,
      });
    });
  }

  for (const cell of cells) {
    if (cell.kind === "doors") {
      const plan = doorPlan({
        openingW,
        openingH: cell.height,
        stile: doorStile,
        rail,
        fit: doorFit,
        amount: doorAmount,
        doorCount: cell.count <= 1 ? 1 : 2,
        midGap,
      });
      if (!plan) continue;
      const hinges = hingeAdvice(plan);
      plan.doors.forEach((door, i) => {
        const label =
          plan.doorCount === 1 ? `${cell.label}` : `${cell.label} · ${i === 0 ? "left" : "right"}`;
        doors.push({ label, width: door.width, height: door.height, hinges: hinges.count });
        if (includeDoorFaces) addShaker(door.width, door.height, label);
      });
      if (includeDoorFaces) {
        parts.push({
          name: "Hinges",
          qty: hinges.count * plan.doorCount,
          size: hinges.cup,
          note: hinges.euro,
          kind: "hinge",
        });
      }
    } else if (cell.kind === "drawer" || cell.kind === "false-front") {
      const plan = drawerPlan({
        openingW,
        openingH: cell.height,
        openingD: interiorD,
        stile: doorStile,
        fit: doorFit,
        amount: doorAmount,
        count: 1,
        gap: drawerGap,
        slide,
      });
      if (!plan) continue;
      const front = plan.fronts[0];
      const label = cell.label;
      if (cell.kind === "drawer") {
        drawers.push({ label, width: front.width, height: front.height, box: plan });
      }
      if (includeDrawerFaces) addShaker(front.width, front.height, label);
      if (cell.kind === "drawer" && includeDrawerBoxes) {
        const box = drawerBoxParts(plan, drawerStock);
        if (box) {
          box.parts.forEach((part) => {
            const kind: PartKind = part.name.includes("bottom")
              ? "drawer-bottom"
              : part.name.includes("side")
                ? "drawer-side"
                : "drawer-fb";
            parts.push({
              name: `${label} · ${part.name}`,
              qty: part.qty,
              size: `${part.thickness} × ${formatInches(part.width)} × ${formatInches(part.length)}`,
              note: part.note,
              kind,
            });
          });
        }
      }
    }
  }

  const steps = buildSteps({
    faceFrame,
    kind,
    toeH,
    layout,
    doors: includeDoorFaces ? doors : [],
    drawers: includeDrawerBoxes || includeDrawerFaces ? drawers : [],
    shelfCount,
    makeShaker,
    includeDoorFaces,
    includeDrawerFaces,
    includeDrawerBoxes,
    includeFaceFrame,
  });

  return {
    kind,
    construction,
    layout,
    overallW,
    overallH,
    overallD,
    boxW,
    boxH,
    boxD,
    interiorW,
    interiorH,
    interiorD,
    faceH,
    toeH,
    toeD,
    stile: faceFrame ? stile : 0.375,
    rail: faceFrame ? rail : divider,
    cells,
    parts,
    doors,
    drawers,
    steps,
    includeDoorFaces,
    includeDrawerFaces,
    includeDrawerBoxes,
  };
}

function buildSteps(input: {
  faceFrame: boolean;
  kind: CabinetKind;
  toeH: number;
  layout: CabinetLayout;
  doors: CabinetBoxPlan["doors"];
  drawers: CabinetBoxPlan["drawers"];
  shelfCount: number;
  makeShaker: boolean;
  includeDoorFaces: boolean;
  includeDrawerFaces: boolean;
  includeDrawerBoxes: boolean;
  includeFaceFrame: boolean;
}): BuildStep[] {
  const steps: BuildStep[] = [
    {
      id: "cut-sides",
      text: "Cut the two sides. Keep the factory edge for the front if you can.",
      detail: input.toeH > 0 ? "Notch the toe kick on the front bottom of each side — same corner, mirrored." : undefined,
    },
    {
      id: "dados",
      text: "Cut matching dados for the bottom (and top, on uppers) and a rabbet for the back.",
      detail: "Both sides must be mirrored. Stack them and mark with a square so the dados line up.",
    },
    {
      id: "cut-panels",
      text: "Cut the bottom, stretchers or top, and the ¼″ back.",
    },
    {
      id: "dry-fit",
      text: "Dry-fit the box. Check the diagonals before glue — they must match.",
    },
    {
      id: "glue-box",
      text: "Glue and clamp the carcass. Pin or screw the stretchers. Square it, then add the back.",
      detail: "The back is what keeps the box from turning into a parallelogram.",
    },
  ];
  if (input.includeFaceFrame) {
    steps.push({
      id: "face-frame",
      text: "Cut and glue the face frame. Stiles run through; rails fit between them.",
      detail: "Sand the joints flush on the face. Then glue and clamp the frame to the box, overhanging each side equally.",
    });
  } else if (input.faceFrame) {
    steps.push({
      id: "face-later",
      text: "The box is sized for a face frame. Cut the stiles and rails when you are ready to glue them on.",
    });
  }
  if (input.includeDoorFaces && input.doors.length > 0) {
    steps.push({
      id: "doors",
      text: input.makeShaker
        ? "Cut the door slabs and frame parts. Hang with 35mm cups after the finish is on."
        : "Cut the door(s). Bore 35mm cups and hang them after finishing.",
    });
  }
  if (input.includeDrawerBoxes && input.drawers.length > 0) {
    steps.push({
      id: "drawers",
      text: input.includeDrawerFaces
        ? "Build each drawer box, then cut the pretty fronts. Install slides and overlay the fronts last."
        : "Build each drawer box and install the slides. Fronts can wait.",
      detail: "Number the boxes from the top. Front 1 is the top drawer.",
    });
  } else if (input.includeDrawerFaces && input.drawers.length > 0) {
    steps.push({
      id: "fronts-later",
      text: "Cut the drawer fronts when you are ready to hang them. The openings are already sized.",
    });
  }
  if (input.shelfCount > 0) {
    steps.push({
      id: "shelves",
      text: "Drill shelf-pin holes before the box goes together if you can reach, or after with a jig.",
    });
  }
  steps.push({
    id: "finish",
    text: "Sand, finish, then install hardware. Check the diagonals one more time on the floor.",
  });
  return steps;
}

export function inferKindFromName(name: string): PartKind {
  const n = name.toLowerCase();
  if (n.includes("hinge")) return "hinge";
  if (n.includes("stile")) return "stile";
  if (n.includes("rail")) return "rail";
  if (n.includes("slab")) return "slab";
  if (n.includes("panel")) return "panel";
  if (n.includes("drawer") && n.includes("bottom")) return "drawer-bottom";
  if (n.includes("drawer") && n.includes("side")) return "drawer-side";
  if (n.includes("drawer box") || n.includes("drawer front")) return "drawer-fb";
  if (n.includes("door")) return "door";
  if (n.includes("shelf")) return "shelf";
  if (n.includes("back")) return "back";
  if (n.includes("side") || n.includes("end")) return "side";
  if (n.includes("bottom")) return "bottom";
  if (n.includes("board") || n.includes("strip")) return "board";
  if (n.includes("segment")) return "segment";
  return "hardware";
}
