export type ToolGroup = {
  id: string;
  title: string;
  blurb: string;
};

export const TOOL_GROUPS: ToolGroup[] = [
  {
    id: "cabinets",
    title: "Cabinets",
    blurb: "Doors, overlays, shaker frames, hinges, and drawers — with picture-book shop drawings.",
  },
  { id: "lumber", title: "Lumber", blurb: "What to buy and what it will weigh, drawn to size." },
  { id: "layout", title: "Layout", blurb: "Tape math, spacing, and circles you can see on the board." },
  { id: "joinery", title: "Joinery", blurb: "Saws, miters, and dovetails with pins and tails labeled." },
  { id: "seasoning", title: "Seasoning", blurb: "How much a panel will move — and where to leave room." },
];

export type Tool = {
  slug: string;
  name: string;
  tag: string;
  group: string;
  summary: string;
  description: string;
};

export const TOOLS: Tool[] = [
  {
    slug: "cabinet-doors",
    name: "Cabinet doors",
    tag: "Cabinets",
    group: "cabinets",
    summary: "Full overlay, 1/16 or 1/8 reveal, inset — door size, hinge plan, and labeled pictures.",
    description:
      "Enter the opening and stile width. Pick how the door sits on the frame. Get door size, overlay, hinge count, and pictures of the front, the overlay, and the cups.",
  },
  {
    slug: "shaker-door",
    name: "Shaker door",
    tag: "Cabinets",
    group: "cabinets",
    summary: "Micro or classic shaker: stile, rail, and center panel — drawn assembled and exploded.",
    description:
      "A 24\" micro shaker with a 3/4\" frame is a 22-1/2\" visible panel — plus groove stock if you cope-and-stick.",
  },
  {
    slug: "drawers",
    name: "Drawer fronts & boxes",
    tag: "Cabinets",
    group: "cabinets",
    summary: "Match door overlay on stacked fronts, then size the box for undermount or side-mount slides.",
    description:
      "Same reveal rules as the doors. Multiple drawers in one opening split the height with even gaps.",
  },
  {
    slug: "board-feet",
    name: "Board feet",
    tag: "Lumber",
    group: "lumber",
    summary: "Price and quantity lumber from thickness, width, and length.",
    description:
      "Board feet is how hardwood is sold. One board foot is 144 cubic inches — a 1\" × 12\" × 12\" piece.",
  },
  {
    slug: "measure",
    name: "Measure converter",
    tag: "Layout",
    group: "layout",
    summary: "Fractions, decimals, millimeters, and the 4/4 lumber scale.",
    description:
      "Shop math without the scratch paper. Convert mixed fractions, decimal inches, and millimeters, including quarter-sawn lumber thicknesses.",
  },
  {
    slug: "spacing",
    name: "Even spacing",
    tag: "Layout",
    group: "layout",
    summary: "Shelf pins, slats, and hole centers that actually land true.",
    description:
      "Divide a span into equal spaces with end insets. Use it for shelf-pin holes, coat hooks, or spindles.",
  },
  {
    slug: "miter",
    name: "Miter & polygons",
    tag: "Joinery",
    group: "joinery",
    summary: "Saw angles for frames, boxes, and N-sided tabletops.",
    description:
      "Closed frames need complementary miters. Get the saw setting and the inside/outside rail lengths.",
  },
  {
    slug: "dovetail",
    name: "Dovetail layout",
    tag: "Joinery",
    group: "joinery",
    summary: "Pin and tail spacing across a board width.",
    description:
      "Lay out half-blind or through dovetails with even tails, half pins on the ends, and a slope you can set.",
  },
  {
    slug: "movement",
    name: "Wood movement",
    tag: "Seasoning",
    group: "seasoning",
    summary: "How much a panel will grow or shrink with humidity.",
    description:
      "Uses USDA Wood Handbook shrinkage numbers. Flat-sawn (tangential) moves more than quarter-sawn (radial).",
  },
  {
    slug: "circle",
    name: "Circle & segments",
    tag: "Layout",
    group: "layout",
    summary: "Circumference, chord, rise, and segmented-ring miters.",
    description:
      "For round tabletops, arched aprons, and glued-up rings. Enter diameter and the number of segments.",
  },
  {
    slug: "weight",
    name: "Weight estimator",
    tag: "Lumber",
    group: "lumber",
    summary: "Rough weight from species density and finished size.",
    description:
      "Helpful for tabletops, shipping, and hardware. Densities are typical air-dry averages, not a scale.",
  },
];

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}
