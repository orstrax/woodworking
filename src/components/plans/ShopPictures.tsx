import { Callout, Caption, Chip, DimH, Picture } from "@/components/Visuals";
import { formatInches, formatNumber } from "@/lib/measure";

export function SpacingPicture({
  span,
  inset,
  centers,
  oc,
}: {
  span: number;
  inset: number;
  centers: number[];
  oc: number;
}) {
  const s = Math.min(16, 380 / span);
  const y = 88;
  const ox = 50;
  const boardW = span * s;
  return (
    <Picture
      title="Holes on a board, left to right"
      caption="Start at the left edge. The first hole is the inset. Each next hole is one on-center step over. The last hole should land the same inset from the right."
      viewBox={`0 0 ${boardW + 100} 220`}
      legend={[
        { n: 1, label: "End inset", hint: `${formatInches(inset)} from each end` },
        { n: 2, label: "On-center", hint: `${formatInches(oc)} from hole to hole` },
        { n: 3, label: "Holes", hint: `${centers.length} holes, numbered from the left` },
      ]}
    >
      <rect x={ox - 8} y={y + 28} width={boardW + 16} height="10" fill="#c4a06a" opacity="0.35" />
      <rect x={ox} y={y} width={boardW} height="40" fill="url(#grain-door)" stroke="#24180f" strokeWidth="1.4" />
      {centers.map((c, i) => (
        <g key={`${c}-${i}`}>
          <line
            x1={ox + c * s}
            y1={y - 28}
            x2={ox + c * s}
            y2={y}
            stroke="#c45c26"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />
          <circle cx={ox + c * s} cy={y + 20} r="8" fill="#e8d7b5" stroke="#6b3a1f" strokeWidth="1.3" />
          <circle cx={ox + c * s} cy={y + 20} r="2.6" fill="#6b3a1f" />
          <Chip x={ox + c * s} y={y - 22} text={`${i + 1}`} fill="#c45c26" />
        </g>
      ))}
      <Callout n={1} x={ox + (inset * s) / 2} y={y + 20} />
      {centers.length > 1 ? (
        <Callout n={2} x={ox + centers[0] * s + (oc * s) / 2} y={y + 56} />
      ) : null}
      <Callout n={3} x={ox + centers[Math.min(1, centers.length - 1)] * s} y={y + 8} />
      <DimH x={ox} y={y + 40} w={boardW} label={`span ${formatInches(span)}`} side="bottom" />
      <Caption x={ox} y={206} text="Tape the left edge as zero. The chips are the hole numbers, not the inches." />
    </Picture>
  );
}

export function DovetailPicture({
  width,
  marks,
  slope,
}: {
  width: number;
  marks: { kind: "pin" | "tail"; start: number; end: number }[];
  slope: number;
}) {
  const s = Math.min(42, 380 / width);
  const ox = 56;
  const top = 48;
  const h = 88;
  const flare = h / slope;
  const d = marks
    .map((mark) => {
      const x1 = ox + mark.start * s;
      const x2 = ox + mark.end * s;
      if (mark.kind === "tail") {
        return `M ${x1 + flare} ${top} L ${x2 - flare} ${top} L ${x2} ${top + h} L ${x1} ${top + h} Z`;
      }
      return "";
    })
    .join(" ");
  const boardW = width * s;

  return (
    <Picture
      title="Pins and tails across the board"
      caption="Tails are the wide flared shapes (darker wood). Half-pins sit on both ends. The slope triangle shows how much each tail leans — 1:8 means one inch over for every eight inches up."
      viewBox={`0 0 ${boardW + 140} 250`}
      legend={[
        { n: 1, label: "Tail", hint: "The wide shape. This board is the tail board." },
        { n: 2, label: "Pin / half-pin", hint: "Skinny on the ends, and between tails" },
        { n: 3, label: "Slope", hint: `1:${slope} — mark this on a scrap as a gauge` },
      ]}
    >
      <rect x={ox} y={top} width={boardW} height={h} fill="url(#grain-door)" stroke="#24180f" strokeWidth="1.3" />
      <path d={d} fill="#c4a06a" stroke="#6b3a1f" strokeWidth="1.2" />
      {marks.map((mark, i) =>
        mark.kind === "tail" ? (
          <Callout key={i} n={1} x={ox + ((mark.start + mark.end) / 2) * s} y={top + h / 2} />
        ) : i === 0 ? (
          <Callout key={i} n={2} x={ox + ((mark.start + mark.end) / 2) * s} y={top + 22} />
        ) : null,
      )}
      <g>
        <polygon
          points={`${ox + boardW + 28},${top + h} ${ox + boardW + 28},${top} ${ox + boardW + 28 + 88 / slope},${top + h}`}
          fill="#efe0c4"
          stroke="#6b3a1f"
          strokeWidth="1.1"
        />
        <Callout n={3} x={ox + boardW + 48} y={top + 24} />
        <Chip x={ox + boardW + 52} y={top + h + 18} text={`1:${slope}`} fill="#6b3a1f" />
      </g>
      <DimH x={ox} y={top + h} w={boardW} label={formatInches(width)} side="bottom" />
      <Caption x={ox} y={236} text="Mark these lines on the end grain. Saw the tails first, then transfer to the pin board." />
    </Picture>
  );
}

export function MiterPicture({
  sides,
  miter,
  outside,
  inside,
}: {
  sides: number;
  miter: number;
  outside: number;
  inside: number;
}) {
  const n = sides;
  const cx = 170;
  const cy = 150;
  const r = 96;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const;
  });
  const innerR = 50;
  const inner = Array.from({ length: n }, (_, i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(a) * innerR, cy + Math.sin(a) * innerR] as const;
  });
  return (
    <Picture
      title="The frame and the saw angle"
      caption="Each corner is two matching cuts. Set the saw to the miter number — not the corner number. A square picture frame is 45°, not 90°."
      viewBox="0 0 460 320"
      legend={[
        { n: 1, label: "Outside", hint: formatInches(outside) },
        { n: 2, label: "Inside opening", hint: formatInches(inside) },
        { n: 3, label: "Saw miter", hint: `${formatNumber(miter, 1)}° on each end of every rail` },
      ]}
    >
      <polygon
        points={pts.map((p) => p.join(",")).join(" ")}
        fill="url(#grain-frame)"
        stroke="#6b3a1f"
        strokeWidth="1.5"
      />
      <polygon
        points={inner.map((p) => p.join(",")).join(" ")}
        fill="#f3ead7"
        stroke="#8a6a3a"
        strokeWidth="1.1"
      />
      <Callout n={1} x={pts[0][0]} y={pts[0][1] - 10} />
      <Callout n={2} x={cx} y={cy} />
      <Callout n={3} x={(pts[0][0] + pts[1][0]) / 2} y={(pts[0][1] + pts[1][1]) / 2} />
      <g>
        <rect x={320} y={48} width={110} height="70" fill="#efe0c4" stroke="#6b3a1f" strokeWidth="1.2" />
        <line x1={320} y1={118} x2={430} y2={48} stroke="#c45c26" strokeWidth="2" />
        <Chip x={375} y={150} text={`${formatNumber(miter, 1)}°`} fill="#c45c26" />
        <Caption x={375} y={172} text="Blade angle" anchor="middle" />
      </g>
      <Chip x={cx} y={22} text={`${n} sides`} fill="#c45c26" />
      <Caption x={40} y={304} text="Think of a pizza. The miter is half of one slice of the corner." />
    </Picture>
  );
}

export function CirclePicture({
  diameter,
  segments,
  chord,
  miter,
}: {
  diameter: number;
  segments: number;
  chord: number;
  miter: number;
}) {
  const cx = 170;
  const cy = 150;
  const r = 88;
  const n = segments;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
  });
  const a0 = -Math.PI / 2;
  const a1 = a0 + (Math.PI * 2) / n;
  return (
    <Picture
      title="A ring made of straight boards"
      caption="Each slice is one board. The chord is how long to cut the inside face. Miter both ends of every piece to the same angle, then glue them into a ring."
      viewBox="0 0 460 310"
      legend={[
        { n: 1, label: "Diameter", hint: formatInches(diameter) },
        { n: 2, label: "One segment", hint: `${formatInches(chord)} along the inside face` },
        { n: 3, label: "Miter", hint: `${formatNumber(miter, 1)}° on each end` },
      ]}
    >
      <polygon points={pts.join(" ")} fill="url(#grain-door)" stroke="#6b3a1f" strokeWidth="1.5" />
      <polygon
        points={`${cx},${cy} ${cx + Math.cos(a0) * r},${cy + Math.sin(a0) * r} ${cx + Math.cos(a1) * r},${cy + Math.sin(a1) * r}`}
        fill="#c45c26"
        fillOpacity="0.28"
        stroke="#c45c26"
        strokeWidth="1.3"
      />
      <circle cx={cx} cy={cy} r="6" fill="#c45c26" />
      <line x1={cx} y1={cy} x2={cx} y2={cy - r} stroke="#c45c26" strokeWidth="1.4" />
      <Callout n={1} x={cx + 16} y={cy - r / 2} />
      <Callout n={2} x={cx + r * 0.55} y={cy - r * 0.55} />
      <Callout n={3} x={cx + 8} y={cy - r + 8} />
      <Chip x={cx} y={24} text={`${n} pieces`} fill="#c45c26" />
      <Caption x={36} y={292} text="The orange slice is one board. Cut that many, all the same." />
    </Picture>
  );
}

export function BoardPicture({
  thickness,
  width,
  lengthFt,
  bf,
  qty,
}: {
  thickness: number;
  width: number;
  lengthFt: number;
  bf: number;
  qty: number;
}) {
  return (
    <Picture
      title="One board, three numbers"
      caption="A board foot is a chunk 1″ thick × 12″ wide × 12″ long. Your board is that cube, stretched. Thickness × width × length (in inches) ÷ 144."
      viewBox="0 0 520 260"
      legend={[
        { n: 1, label: "Thickness", hint: formatInches(thickness) },
        { n: 2, label: "Width", hint: formatInches(width) },
        { n: 3, label: "Length", hint: `${formatNumber(lengthFt, 1)} ft` },
      ]}
    >
      <polygon points="70,90 280,90 328,48 118,48" fill="#d4b07a" stroke="#6b3a1f" strokeWidth="1.1" />
      <polygon points="280,90 328,48 328,118 280,168" fill="#b88955" stroke="#6b3a1f" strokeWidth="1.1" />
      <polygon points="70,90 280,90 280,168 70,168" fill="url(#grain-door)" stroke="#24180f" strokeWidth="1.3" />
      <Callout n={1} x={292} y={124} />
      <Callout n={2} x={58} y={130} />
      <Callout n={3} x={175} y={186} />
      <g>
        <polygon points="380,70 430,70 448,54 398,54" fill="#d4b07a" stroke="#6b3a1f" strokeWidth="1" />
        <polygon points="430,70 448,54 448,84 430,100" fill="#b88955" stroke="#6b3a1f" strokeWidth="1" />
        <polygon points="380,70 430,70 430,100 380,100" fill="#efe0c4" stroke="#24180f" strokeWidth="1.1" />
        <Chip x={414} y={122} text="1 board foot" />
      </g>
      <Chip
        x={175}
        y={28}
        text={`${formatNumber(bf, 2)} BF${qty > 1 ? ` × ${qty}` : ""}`}
        fill="#c45c26"
      />
      <Caption x={70} y={240} text="The little cube on the right is one board foot. Your board is several of those." />
    </Picture>
  );
}

export function MovementPicture({
  width,
  change,
}: {
  width: number;
  change: number;
}) {
  const grow = change >= 0;
  const gap = 18;
  return (
    <Picture
      title="The panel gets wider or narrower"
      caption="Wood moves across the grain — left and right here, not along the length. Leave that much play in the frame, breadboard, or tabletop fasteners so it does not split."
      viewBox="0 0 480 240"
      legend={[
        { n: 1, label: "Panel width today", hint: formatInches(width) },
        {
          n: 2,
          label: grow ? "It swells this much" : "It shrinks this much",
          hint: formatInches(Math.abs(change), 64),
        },
      ]}
    >
      <rect x={40} y={48} width={400} height="110" fill="url(#grain-frame)" stroke="#6b3a1f" strokeWidth="1.5" />
      <rect
        x={40 + gap}
        y={64}
        width={400 - gap * 2}
        height="78"
        fill="url(#grain-panel)"
        stroke="#8a6a3a"
        strokeWidth="1.1"
      />
      <rect x={40 + 8} y={64} width={gap - 8} height="78" fill="#c45c26" fillOpacity="0.25" />
      <rect x={440 - gap} y={64} width={gap - 8} height="78" fill="#c45c26" fillOpacity="0.25" />
      <path d="M52 103 L28 103 M28 103 L36 96 M28 103 L36 110" stroke="#c45c26" strokeWidth="2.2" fill="none" />
      <path d="M428 103 L452 103 M452 103 L444 96 M452 103 L444 110" stroke="#c45c26" strokeWidth="2.2" fill="none" />
      <Callout n={1} x={240} y={103} />
      <Callout n={2} x={452} y={70} />
      <Chip x={240} y={188} text={`${grow ? "+" : "−"}${formatInches(Math.abs(change), 64)}`} fill="#c45c26" />
      <Caption x={40} y={222} text="Orange strips are the room you leave. The arrows are the direction the panel moves." />
    </Picture>
  );
}

export function MeasurePicture({ inches }: { inches: number }) {
  const shown = Math.min(8, Math.max(2, Math.ceil(inches + 0.4)));
  const s = 52;
  return (
    <Picture
      title="On a tape measure"
      caption="The shaded part is your length. Read it three ways: a fraction, a decimal, and millimeters. The long marks are inches."
      viewBox={`0 0 ${shown * s + 80} 170`}
    >
      <rect x={30} y={36} width={shown * s + 20} height="44" rx="4" fill="#c45c26" />
      <rect x={36} y={50} width={shown * s} height="30" fill="#efe3cc" stroke="#24180f" strokeWidth="1.2" />
      {Array.from({ length: shown * 16 + 1 }, (_, i) => {
        const x = 36 + (i / 16) * s;
        const major = i % 16 === 0;
        const half = i % 8 === 0;
        const h = major ? 24 : half ? 16 : 9;
        return (
          <g key={i}>
            <line x1={x} y1={50} x2={x} y2={50 + h} stroke="#24180f" strokeWidth={major ? 1.3 : 0.6} />
            {major ? (
              <text
                x={x + 4}
                y={72}
                fill="#24180f"
                stroke="none"
                fontSize="9"
                fontFamily="ui-monospace, monospace"
              >
                {i / 16}
              </text>
            ) : null}
          </g>
        );
      })}
      <rect x={36} y={50} width={Math.min(inches, shown) * s} height="30" fill="#c45c26" fillOpacity="0.32" />
      <Chip x={36 + Math.min(inches, shown) * s} y={108} text={formatInches(inches)} fill="#c45c26" />
      <Caption x={36} y={148} text="Orange fill starts at zero and stops at your measurement." />
    </Picture>
  );
}

export function WeightPicture({
  thickness,
  width,
  length,
  pounds,
  species,
}: {
  thickness: number;
  width: number;
  length: number;
  pounds: number;
  species: string;
}) {
  return (
    <Picture
      title="A slab on the bench"
      caption="Weight is volume times how heavy that species is. Treat this as a shipping and hardware estimate — real boards vary with moisture."
      viewBox="0 0 480 240"
      legend={[
        { n: 1, label: "Thickness", hint: formatInches(thickness) },
        { n: 2, label: "Width", hint: formatInches(width) },
        { n: 3, label: "Length", hint: formatInches(length) },
      ]}
    >
      <polygon points="70,100 300,100 360,52 130,52" fill="#d4b07a" stroke="#6b3a1f" strokeWidth="1.1" />
      <polygon points="300,100 360,52 360,110 300,168" fill="#b88955" stroke="#6b3a1f" strokeWidth="1.1" />
      <polygon points="70,100 300,100 300,168 70,168" fill="url(#grain-dark)" stroke="#24180f" strokeWidth="1.3" />
      <Callout n={1} x={318} y={128} />
      <Callout n={2} x={58} y={136} />
      <Callout n={3} x={185} y={186} />
      <g>
        <ellipse cx={410} cy={150} rx="36" ry="10" fill="#6b3a1f" opacity="0.2" />
        <rect x={392} y={70} width="36" height="70" rx="4" fill="#2f2a26" />
        <rect x={398} y={78} width="24" height="18" fill="#f3ead7" />
        <text
          x={410}
          y={91}
          textAnchor="middle"
          fill="#24180f"
          stroke="none"
          fontSize="8"
          fontFamily="ui-monospace, monospace"
        >
          lb
        </text>
        <Chip x={410} y={50} text={`${formatNumber(pounds, 1)} lb`} fill="#c45c26" />
      </g>
      <Caption x={70} y={222} text={`${species}. Heavier species (oak) sink; lighter ones (pine, cedar) float.`} />
    </Picture>
  );
}

export function SquarePicture({
  width,
  height,
  expected,
  status,
}: {
  width: number;
  height: number;
  expected: number;
  status: "unknown" | "square" | "out";
}) {
  const s = Math.min(10, 220 / width, 140 / height);
  const w = width * s;
  const h = height * s;
  const ox = (480 - w) / 2;
  const oy = 48;
  return (
    <Picture
      title="Both diagonals should match"
      caption="Tape from corner to opposite corner, then the other pair. If the two numbers are the same, the box is square — even if you never use a try square."
      viewBox="0 0 480 260"
      legend={[
        { n: 1, label: "Width", hint: formatInches(width) },
        { n: 2, label: "Height", hint: formatInches(height) },
        { n: 3, label: "Diagonal", hint: formatInches(expected) },
      ]}
    >
      <rect x={ox} y={oy} width={w} height={h} fill="url(#grain-frame)" stroke="#6b3a1f" strokeWidth="1.6" />
      <line x1={ox} y1={oy} x2={ox + w} y2={oy + h} stroke="#c45c26" strokeWidth="1.6" />
      <line
        x1={ox + w}
        y1={oy}
        x2={ox}
        y2={oy + h}
        stroke="#c45c26"
        strokeWidth="1.6"
        strokeDasharray="4 3"
      />
      <Callout n={1} x={ox + w / 2} y={oy - 6} />
      <Callout n={2} x={ox - 10} y={oy + h / 2} />
      <Callout n={3} x={ox + w * 0.62} y={oy + h * 0.38} />
      <Chip
        x={240}
        y={oy + h + 28}
        text={
          status === "square"
            ? "diagonals match — square"
            : status === "out"
              ? "pull the long diagonal"
              : `diagonal should be ${formatInches(expected)}`
        }
        fill="#c45c26"
      />
      <Caption x={40} y={246} text="The solid orange line and the dashed line should be the same length." />
    </Picture>
  );
}

export function GluePicture({
  count,
  boardWidth,
  finished,
  extra,
}: {
  count: number;
  boardWidth: number;
  finished: number;
  extra: number;
}) {
  const n = Math.min(8, Math.max(2, count));
  const bw = Math.min(64, 360 / n);
  const ox = (480 - n * bw) / 2;
  return (
    <Picture
      title="Boards side by side make the top"
      caption="Joint the edges straight. Glue them into a panel a little wider than you need, flatten, then cut to the finished width."
      viewBox="0 0 480 240"
      legend={[
        { n: 1, label: "Each board", hint: formatInches(boardWidth) + " after jointing" },
        { n: 2, label: "How many", hint: `${count} boards · ${count - 1} glue lines` },
        { n: 3, label: "Extra to leave", hint: formatInches(extra) + " to flatten and trim" },
      ]}
    >
      {Array.from({ length: n }, (_, i) => (
        <rect
          key={i}
          x={ox + i * bw}
          y={44}
          width={bw - 3}
          height={120}
          fill={i % 2 ? "url(#grain-frame)" : "url(#grain-door)"}
          stroke="#6b3a1f"
          strokeWidth="1.2"
        />
      ))}
      <Callout n={1} x={ox + bw / 2} y={70} />
      <Callout n={2} x={240} y={36} />
      <Callout n={3} x={ox + n * bw - 8} y={164} />
      <Chip x={240} y={186} text={`${count} @ ${formatInches(boardWidth)} → ${formatInches(finished)}`} fill="#c45c26" />
      <Caption x={40} y={222} text="Alternate the end-grain smile and frown so the panel does not cup as one." />
    </Picture>
  );
}

export function KerfPicture({
  stock,
  piece,
  kerf,
  count,
}: {
  stock: number;
  piece: number;
  kerf: number;
  count: number;
}) {
  const s = Math.min(16, 380 / stock);
  const ox = 50;
  const y = 70;
  let cursor = 0;
  const bands: { x: number; w: number; kind: "piece" | "kerf" }[] = [];
  for (let i = 0; i < count; i += 1) {
    bands.push({ x: cursor, w: piece, kind: "piece" });
    cursor += piece;
    if (i < count - 1) {
      bands.push({ x: cursor, w: kerf, kind: "kerf" });
      cursor += kerf;
    }
  }
  return (
    <Picture
      title="The blade eats a strip between pieces"
      caption="Each orange slot is a kerf — wood that becomes sawdust. Count the rips, not just the strips, or the last piece comes out skinny."
      viewBox={`0 0 ${stock * s + 100} 220`}
      legend={[
        { n: 1, label: "Stock", hint: formatInches(stock) + " wide" },
        { n: 2, label: "Each strip", hint: formatInches(piece) },
        { n: 3, label: "Kerf", hint: formatInches(kerf) + " per rip" },
      ]}
    >
      <rect x={ox} y={y} width={stock * s} height="48" fill="url(#grain-door)" stroke="#24180f" strokeWidth="1.4" />
      {bands.map((band, i) =>
        band.kind === "kerf" ? (
          <rect
            key={i}
            x={ox + band.x * s}
            y={y}
            width={Math.max(3, band.w * s)}
            height="48"
            fill="#c45c26"
            fillOpacity="0.45"
          />
        ) : null,
      )}
      <Callout n={1} x={ox + 12} y={y - 12} />
      <Callout n={2} x={ox + (piece * s) / 2} y={y + 24} />
      {count > 1 ? <Callout n={3} x={ox + piece * s + Math.max(4, (kerf * s) / 2)} y={y + 24} /> : null}
      <Chip x={ox + (stock * s) / 2} y={y + 78} text={`${count} strips`} fill="#c45c26" />
      <Caption x={ox} y={200} text="Orange is gone. Do not count it as a strip." />
    </Picture>
  );
}
