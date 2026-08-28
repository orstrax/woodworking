export type ToolGroup = {
  id: string;
  title: string;
  blurb: string;
};

export const TOOL_GROUPS: ToolGroup[] = [
  {
    id: "cabinets",
    title: "Cabinets",
    blurb: "The whole cabinet: box, face, doors, drawers, and a kitchen of them.",
  },
  {
    id: "lumber",
    title: "Lumber",
    blurb: "What to buy, how to glue it up, and what it will weigh.",
  },
  {
    id: "layout",
    title: "Layout",
    blurb: "Tape, spacing, kerf, and circles — marks you can trust.",
  },
  {
    id: "joinery",
    title: "Joinery",
    blurb: "Square, miters, and dovetails with the parts labeled.",
  },
  {
    id: "seasoning",
    title: "Seasoning",
    blurb: "How much a panel will move — and where to leave room.",
  },
];

export type Tool = {
  slug: string;
  name: string;
  tag: string;
  group: string;
  summary: string;
  description: string;
  startHere?: boolean;
};

export const TOOLS: Tool[] = [
  {
    slug: "kitchen-plan",
    name: "Kitchen planner",
    tag: "Cabinets",
    group: "cabinets",
    summary: "Place typical cabinets on a kitchen wall, then print a cut list grouped by cabinet and rolled up for the shop.",
    description:
      "Plan the kitchen visually: tap standard bases, uppers, and pantries onto a run. Each cabinet keeps its own parts, then a summary gangs matching sizes.",
  },
  {
    slug: "cabinet-box",
    name: "Cabinet box",
    tag: "Cabinets",
    group: "cabinets",
    summary: "A whole cabinet: plywood box, face frame, and the doors or drawers that hang on it.",
    description:
      "Pick a typical layout — 36″ drawer base, sink, upper — then change any measurement. Cut list, pictures, and bench steps.",
  },
  {
    slug: "cabinet-doors",
    name: "Cabinet doors",
    tag: "Cabinets",
    group: "cabinets",
    startHere: true,
    summary: "Opening to finished door: overlay, hinges, and shaker stiles and rails if you want them.",
    description:
      "Measure the hole. Pick how the door sits. Get the size, the hinges, and — if it is a shaker — the frame and panel cut list.",
  },
  {
    slug: "door-drawer",
    name: "Door + drawer",
    tag: "Cabinets",
    group: "cabinets",
    summary: "Replace a drawer and door together so they share overlay, line up, and stack with the right gap.",
    description:
      "Measure the drawer hole and the door hole — or one opening and the drawer-front height. Same overlay on both faces, then the drawer box and hinges.",
  },
  {
    slug: "drawers",
    name: "Drawer fronts & boxes",
    tag: "Cabinets",
    group: "cabinets",
    summary: "Pretty fronts that match the doors, then a box sized for the slides.",
    description:
      "Same overlay rules as the doors. The box is smaller on purpose so the slides have room.",
  },
  {
    slug: "board-feet",
    name: "Board feet",
    tag: "Lumber",
    group: "lumber",
    startHere: true,
    summary: "How hardwood is sold — thickness × width × length, plus waste and cost.",
    description:
      "One board foot is 1″ × 12″ × 12″. 4/4 is one inch rough. Add waste before you pay.",
  },
  {
    slug: "glue-up",
    name: "Panel glue-up",
    tag: "Lumber",
    group: "lumber",
    summary: "How many boards make a tabletop, and how much extra to leave for flattening.",
    description:
      "Finished width in, board width after jointing out. Alternate grain so the panel stays flat.",
  },
  {
    slug: "weight",
    name: "Weight estimator",
    tag: "Lumber",
    group: "lumber",
    summary: "A shipping and hardware estimate from species and size.",
    description:
      "Oak is heavy. Pine is light. Use this for tabletops, bases, and whether you need a second pair of hands.",
  },
  {
    slug: "measure",
    name: "Measure converter",
    tag: "Layout",
    group: "layout",
    startHere: true,
    summary: "Fractions, decimals, millimeters, and the 4/4 lumber scale — what the tape is saying.",
    description:
      "Type 1 7/16, 0.4375, or 19mm. Mixed fractions need a space. 4/4 is one inch rough.",
  },
  {
    slug: "spacing",
    name: "Even spacing",
    tag: "Layout",
    group: "layout",
    summary: "Holes, slats, and pegs that land true, with matching leftovers on each end.",
    description:
      "The leftover is the inset. The step is on-center. Measure from the left edge as zero.",
  },
  {
    slug: "kerf",
    name: "Kerf & rips",
    tag: "Layout",
    group: "layout",
    summary: "The blade eats wood. Count the cuts so the last strip is not skinny.",
    description:
      "A full-kerf table-saw blade is about ⅛″. Every rip steals that much. Plan the stock.",
  },
  {
    slug: "circle",
    name: "Circle & segments",
    tag: "Layout",
    group: "layout",
    summary: "A round table from straight boards — chord, miter, and how many pieces.",
    description:
      "Each slice is one board. The chord is the inside face. Cut that many, all the same.",
  },
  {
    slug: "square",
    name: "Square check",
    tag: "Joinery",
    group: "joinery",
    startHere: true,
    summary: "Matching diagonals and the 3-4-5 trick — prove a box is actually square.",
    description:
      "If the two diagonals match, the corners are 90°. Pull the long one until they do.",
  },
  {
    slug: "miter",
    name: "Miter & polygons",
    tag: "Joinery",
    group: "joinery",
    summary: "Saw angles for frames, boxes, and N-sided tops. 45° for a square, not 90°.",
    description:
      "The miter is the saw setting. The included angle is the corner of the finished frame.",
  },
  {
    slug: "dovetail",
    name: "Dovetail layout",
    tag: "Joinery",
    group: "joinery",
    summary: "Even tails, half-pins on the ends, and a slope you can mark.",
    description:
      "Hardwood often 1:8, softwood 1:6. Saw tails first, then transfer to the pin board.",
  },
  {
    slug: "movement",
    name: "Wood movement",
    tag: "Seasoning",
    group: "seasoning",
    startHere: true,
    summary: "How much a panel grows or shrinks across the grain when the house dries out.",
    description:
      "Leave this much play in frames, breadboards, and tabletop fasteners. Quarter-sawn moves less.",
  },
];

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}

export const START_HERE = TOOLS.filter((tool) => tool.startHere);
