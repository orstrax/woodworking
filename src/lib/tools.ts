export type Tool = {
  slug: string;
  name: string;
  tag: string;
  summary: string;
  description: string;
};

export const TOOLS: Tool[] = [
  {
    slug: "board-feet",
    name: "Board feet",
    tag: "Lumber",
    summary: "Price and quantity lumber from thickness, width, and length.",
    description:
      "Board feet is how hardwood is sold. One board foot is 144 cubic inches — a 1\" × 12\" × 12\" piece.",
  },
  {
    slug: "measure",
    name: "Measure converter",
    tag: "Layout",
    summary: "Fractions, decimals, millimeters, and the 4/4 lumber scale.",
    description:
      "Shop math without the scratch paper. Convert mixed fractions, decimal inches, and millimeters, including quarter-sawn lumber thicknesses.",
  },
  {
    slug: "spacing",
    name: "Even spacing",
    tag: "Layout",
    summary: "Shelf pins, slats, and hole centers that actually land true.",
    description:
      "Divide a span into equal spaces with end insets. Use it for shelf-pin holes, coat hooks, or spindles.",
  },
  {
    slug: "miter",
    name: "Miter & polygons",
    tag: "Joinery",
    summary: "Saw angles for frames, boxes, and N-sided tabletops.",
    description:
      "Closed frames need complementary miters. Get the saw setting and the inside/outside rail lengths.",
  },
  {
    slug: "dovetail",
    name: "Dovetail layout",
    tag: "Joinery",
    summary: "Pin and tail spacing across a board width.",
    description:
      "Lay out half-blind or through dovetails with even tails, half pins on the ends, and a slope you can set.",
  },
  {
    slug: "movement",
    name: "Wood movement",
    tag: "Seasoning",
    summary: "How much a panel will grow or shrink with humidity.",
    description:
      "Uses USDA Wood Handbook shrinkage numbers. Flat-sawn (tangential) moves more than quarter-sawn (radial).",
  },
  {
    slug: "circle",
    name: "Circle & segments",
    tag: "Layout",
    summary: "Circumference, chord, rise, and segmented-ring miters.",
    description:
      "For round tabletops, arched aprons, and glued-up rings. Enter diameter and the number of segments.",
  },
  {
    slug: "weight",
    name: "Weight estimator",
    tag: "Lumber",
    summary: "Rough weight from species density and finished size.",
    description:
      "Helpful for tabletops, shipping, and hardware. Densities are typical air-dry averages, not a scale.",
  },
];

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}
