import { Callout, Caption, Chip, Picture } from "@/components/Visuals";
import type { OpeningResult } from "@/lib/kitchen";
import { formatInches } from "@/lib/measure";

function cabinetWidth(row: OpeningResult) {
  return Math.max(row.doors[0]?.width ?? row.drawers[0]?.width ?? 18, 12);
}

function partNote(row: OpeningResult) {
  const doors =
    row.doors.length > 0
      ? row.doors.map((door) => `${door.label} ${formatInches(door.width)} × ${formatInches(door.height)}`).join(" · ")
      : "";
  const drawers =
    row.drawers.length > 0
      ? row.drawers
          .map((drawer) => `${drawer.label} ${formatInches(drawer.width)} × ${formatInches(drawer.height)}`)
          .join(" · ")
      : "";
  return [doors, drawers].filter(Boolean).join(" · ") || row.row;
}

export function KitchenPictures({ results }: { results: OpeningResult[] }) {
  const ok = results.filter((row) => !row.error);
  if (ok.length === 0) return null;

  const numbered = ok.map((row, index) => ({ row, n: index + 1 }));
  const uppers = numbered.filter((item) => item.row.row === "upper");
  const lowers = numbered.filter((item) => item.row.row !== "upper");
  const bands = [uppers, lowers].filter((band) => band.length > 0);
  const maxW = Math.max(
    ...bands.map((band) => band.reduce((sum, item) => sum + cabinetWidth(item.row), 0)),
    36,
  );
  const scale = Math.min(14, 640 / maxW);
  const pad = 40;
  const bandGap = 52;
  const upperH = 26 * scale * 0.35;
  const lowerH = 34 * scale * 0.35;
  const viewH = pad + bands.reduce((sum, band, index) => {
    const h = index === 0 && uppers.length > 0 ? upperH : lowerH;
    return sum + h + bandGap;
  }, 0) + 12;
  const viewW = Math.max(520, pad * 2 + maxW * scale + 80);

  const laidOut = bands.flatMap((band, bandIndex) => {
    const h = bandIndex === 0 && uppers.length > 0 ? upperH : lowerH;
    const y =
      pad +
      bands.slice(0, bandIndex).reduce((sum, earlier, earlierIndex) => {
        const earlierH = earlierIndex === 0 && uppers.length > 0 ? upperH : lowerH;
        return sum + earlierH + bandGap;
      }, 0);
    return band.map((item, index) => {
      const w = cabinetWidth(item.row) * scale;
      const x =
        pad +
        band.slice(0, index).reduce((sum, earlier) => sum + cabinetWidth(earlier.row) * scale + 10, 0);
      return { ...item, x, y, w, h };
    });
  });

  return (
    <Picture
      title="The run — every opening in the kitchen"
      caption="Each box is one cabinet you measured. Orange numbers match the lists below, so you can see which doors go with which hole."
      viewBox={`0 0 ${viewW} ${viewH}`}
      legend={numbered.map((item) => ({
        n: item.n,
        label: item.row.name,
        hint: partNote(item.row),
      }))}
    >
      {laidOut.map((cab) => (
        <g key={`${cab.row.id}-${cab.n}`}>
          <rect
            x={cab.x}
            y={cab.y}
            width={cab.w}
            height={cab.h}
            fill="url(#grain-frame)"
            stroke="#6b3a1f"
            strokeWidth="1.4"
          />
          <rect
            x={cab.x + 8}
            y={cab.y + 8}
            width={Math.max(12, cab.w - 16)}
            height={Math.max(12, cab.h - 16)}
            fill={cab.row.drawers.length && !cab.row.doors.length ? "url(#grain-door)" : "url(#grain-panel)"}
            stroke="#8a6a3a"
          />
          {cab.row.doors.length === 2 ? (
            <line
              x1={cab.x + cab.w / 2}
              y1={cab.y + 8}
              x2={cab.x + cab.w / 2}
              y2={cab.y + cab.h - 8}
              stroke="#6b3a1f"
              strokeWidth="1"
            />
          ) : null}
          {cab.row.drawers.length > 1 && cab.row.doors.length === 0
            ? cab.row.drawers.slice(1).map((_, i) => (
                <line
                  key={i}
                  x1={cab.x + 8}
                  y1={cab.y + 8 + ((i + 1) * (cab.h - 16)) / cab.row.drawers.length}
                  x2={cab.x + cab.w - 8}
                  y2={cab.y + 8 + ((i + 1) * (cab.h - 16)) / cab.row.drawers.length}
                  stroke="#6b3a1f"
                  strokeWidth="0.8"
                />
              ))
            : null}
          <Callout n={cab.n} x={cab.x + cab.w / 2} y={cab.y + cab.h / 2} />
          <Chip x={cab.x + cab.w / 2} y={cab.y + cab.h + 16} text={cab.row.name} />
        </g>
      ))}
      <Caption x={pad} y={viewH - 14} text="Uppers sit on the top row. Bases and talls sit below." />
    </Picture>
  );
}
