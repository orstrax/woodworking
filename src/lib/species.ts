export type Species = {
  id: string;
  name: string;
  densityLbFt3: number;
  radialShrink: number;
  tangentialShrink: number;
};

export const SPECIES: Species[] = [
  { id: "white-oak", name: "White oak", densityLbFt3: 47, radialShrink: 5.6, tangentialShrink: 10.5 },
  { id: "red-oak", name: "Red oak", densityLbFt3: 44, radialShrink: 4.0, tangentialShrink: 8.6 },
  { id: "hard-maple", name: "Hard maple", densityLbFt3: 44, radialShrink: 4.8, tangentialShrink: 9.9 },
  { id: "walnut", name: "Black walnut", densityLbFt3: 38, radialShrink: 5.5, tangentialShrink: 7.8 },
  { id: "cherry", name: "Black cherry", densityLbFt3: 35, radialShrink: 3.7, tangentialShrink: 7.1 },
  { id: "ash", name: "White ash", densityLbFt3: 41, radialShrink: 4.9, tangentialShrink: 7.8 },
  { id: "poplar", name: "Yellow poplar", densityLbFt3: 28, radialShrink: 4.6, tangentialShrink: 8.2 },
  { id: "pine", name: "Eastern white pine", densityLbFt3: 25, radialShrink: 2.1, tangentialShrink: 6.1 },
  { id: "cedar", name: "Western red cedar", densityLbFt3: 23, radialShrink: 2.4, tangentialShrink: 5.0 },
  { id: "mahogany", name: "Honduras mahogany", densityLbFt3: 32, radialShrink: 3.0, tangentialShrink: 4.1 },
];

const GREEN_TO_OVEN_DRY_MC = 30;

export function movementInches(
  widthIn: number,
  deltaMc: number,
  species: Species,
  grain: "flat" | "quarter",
): number {
  const shrink = grain === "flat" ? species.tangentialShrink : species.radialShrink;
  return widthIn * (shrink / 100) * (deltaMc / GREEN_TO_OVEN_DRY_MC);
}

export function weightLb(volumeFt3: number, species: Species): number {
  return volumeFt3 * species.densityLbFt3;
}
