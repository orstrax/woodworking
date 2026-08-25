export function rectangleDiagonal(width: number, height: number): number {
  return Math.sqrt(width * width + height * height);
}

export function squareCheck(width: number, height: number, diagA: number, diagB: number) {
  const expected = rectangleDiagonal(width, height);
  const spread = Math.abs(diagA - diagB);
  const errorA = Math.abs(diagA - expected);
  const errorB = Math.abs(diagB - expected);
  return { expected, spread, errorA, errorB, square: spread <= 1 / 32 };
}

export function threeFourFive(shortSide: number) {
  const unit = shortSide / 3;
  return { unit, a: shortSide, b: unit * 4, c: unit * 5 };
}

export function glueUp(finishedWidth: number, boardWidth: number) {
  if (finishedWidth <= 0 || boardWidth <= 0) return null;
  const count = Math.max(1, Math.ceil(finishedWidth / boardWidth - 1e-9));
  const panel = count * boardWidth;
  const extra = panel - finishedWidth;
  return { count, panel, extra, joints: Math.max(0, count - 1) };
}

export function ripPlan(stockWidth: number, pieceWidth: number, kerf: number) {
  if (stockWidth <= 0 || pieceWidth <= 0 || kerf < 0) return null;
  if (pieceWidth > stockWidth) return { count: 0, leftover: stockWidth, rips: 0, used: 0 };
  const count = Math.floor((stockWidth + kerf) / (pieceWidth + kerf));
  const used = count * pieceWidth + Math.max(0, count - 1) * kerf;
  const leftover = Math.max(0, stockWidth - used);
  return { count, leftover, rips: Math.max(0, count - 1), used };
}

export function crosscutWaste(length: number, pieces: number, kerf: number) {
  if (length <= 0 || pieces < 1 || kerf < 0) return null;
  const waste = Math.max(0, pieces - 1) * kerf;
  const needed = pieces * length + waste;
  return { waste, needed };
}
