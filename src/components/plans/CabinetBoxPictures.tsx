import { Callout, Caption, Chip, DimH, DimV, Picture, WoodDefs, useBlueprint } from "@/components/Visuals";
import type { CabinetBoxPlan, FaceCell } from "@/lib/cabinetBox";
import { formatInches } from "@/lib/measure";

export function CabinetBoxPictures({ plan }: { plan: CabinetBoxPlan }) {
  return (
    <>
      <FaceElevation plan={plan} />
      <ExplodedBox plan={plan} />
    </>
  );
}

export function StickyFace({ plan }: { plan: CabinetBoxPlan }) {
  const drawing = faceMetrics(plan, true);
  return (
    <div className="flex items-center gap-3">
      <svg
        viewBox={drawing.viewBox}
        className="h-[4.75rem] w-auto max-w-[38vw] shrink-0"
        role="img"
        aria-label={`${plan.layout.label} ${formatInches(plan.overallW)} wide`}
      >
        <WoodDefs />
        <FaceDrawing plan={plan} drawing={drawing} compact />
      </svg>
      <div className="min-w-0">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-shellac">Live picture</p>
        <p className="truncate font-display text-lg leading-tight tracking-tight">{plan.layout.label}</p>
        <p className="font-mono text-[13px] text-ink-soft">
          {formatInches(plan.overallW)} × {formatInches(plan.overallH)} × {formatInches(plan.overallD)}
        </p>
      </div>
    </div>
  );
}

export function LiveFace({ plan, compact }: { plan: CabinetBoxPlan; compact?: boolean }) {
  const drawing = faceMetrics(plan, compact);
  return (
    <div className="overflow-hidden rounded-[12px] border border-rule bg-surface shadow-[var(--shadow-sm)]">
      {compact ? null : (
        <div className="px-4 pt-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-shellac">Live picture</p>
          <p className="mt-1 font-display text-2xl tracking-tight">{plan.layout.label}</p>
          <p className="mt-0.5 font-mono text-sm text-ink-soft">
            {formatInches(plan.overallW)} × {formatInches(plan.overallH)} × {formatInches(plan.overallD)}
          </p>
        </div>
      )}
      <svg
        viewBox={drawing.viewBox}
        className={`w-full ${compact ? "max-h-56 px-3 py-2" : "mt-1"}`}
        role="img"
        aria-label={`${plan.layout.label} ${formatInches(plan.overallW)} wide by ${formatInches(plan.overallH)} high`}
      >
        <WoodDefs />
        <FaceDrawing plan={plan} drawing={drawing} compact={compact} />
      </svg>
      {compact ? null : (
        <dl className="grid grid-cols-3 border-t border-rule text-center">
          <LiveDim label="Width" value={formatInches(plan.overallW)} />
          <LiveDim label="Height" value={formatInches(plan.overallH)} />
          <LiveDim label="Depth" value={formatInches(plan.overallD)} />
        </dl>
      )}
    </div>
  );
}

function LiveDim({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-rule px-2 py-3 last:border-r-0">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft">{label}</dt>
      <dd className="mt-0.5 font-mono text-sm font-medium sm:text-base">{value}</dd>
    </div>
  );
}

function faceMetrics(plan: CabinetBoxPlan, compact = false) {
  if (compact) {
    const pad = 3;
    const s = Math.min(9, 32 / plan.overallW, 46 / plan.overallH);
    const w = plan.overallW * s;
    const h = plan.overallH * s;
    return {
      s,
      ox: pad,
      oy: pad,
      w,
      h,
      toe: plan.toeH * s,
      stile: plan.stile * s,
      rail: plan.rail * s,
      viewBox: `0 0 ${w + pad * 2} ${h + pad * 2}`,
    };
  }
  const s = Math.min(12, 280 / plan.overallW, 340 / plan.overallH);
  const ox = 110;
  const oy = 48;
  const w = plan.overallW * s;
  const h = plan.overallH * s;
  const toe = plan.toeH * s;
  const stile = plan.stile * s;
  const rail = plan.rail * s;
  const viewW = Math.max(520, w + 220);
  const viewH = Math.max(400, h + 110);
  return { s, ox, oy, w, h, toe, stile, rail, viewBox: `0 0 ${viewW} ${viewH}` };
}

function FaceDrawing({
  plan,
  drawing,
  compact,
}: {
  plan: CabinetBoxPlan;
  drawing: ReturnType<typeof faceMetrics>;
  compact?: boolean;
}) {
  const blueprint = useBlueprint();
  const { ox, oy, w, h, toe, stile, rail, s } = drawing;
  return (
    <>
      {!compact ? <rect width="100%" height="100%" fill={blueprint ? "url(#bp-grid)" : "url(#paper-grid)"} /> : (
        <rect width="100%" height="100%" fill={blueprint ? "#fff" : "#f7eedc"} />
      )}
      <rect x={ox} y={oy} width={w} height={h} fill={blueprint ? "#fff" : "url(#grain-frame)"} stroke={blueprint ? "#000" : "#24180f"} strokeWidth="1.6" />
      {toe > 0 ? (
        <rect
          x={ox}
          y={oy + h - toe}
          width={w}
          height={toe}
          fill={blueprint ? "#fff" : "#6b3a1f"}
          stroke={blueprint ? "#000" : "none"}
          strokeWidth={blueprint ? 1 : 0}
          opacity={blueprint ? 1 : 0.85}
        />
      ) : null}
      {plan.cells.map((cell, index) => {
        const y =
          oy +
          (index + 1) * rail +
          plan.cells.slice(0, index).reduce((sum, earlier) => sum + earlier.height, 0) * s;
        const showFace =
          cell.kind === "doors" ? plan.includeDoorFaces : plan.includeDrawerFaces;
        return cellFace(cell, index + 1, ox + stile, y, w - stile * 2, cell.height * s, showFace, compact, blueprint);
      })}
      {compact ? null : (
        <>
          <DimH x={ox} y={oy} w={w} label={formatInches(plan.overallW)} />
          <DimV x={ox} y={oy} h={h} label={formatInches(plan.overallH)} />
          <Chip x={ox + w / 2} y={oy + h + 28} text={plan.layout.label} fill="#c45c26" />
          {toe > 0 ? <Chip x={ox + w + 44} y={oy + h - toe / 2} text={`toe ${formatInches(plan.toeH)}`} /> : null}
          <Caption x={ox} y={Number(drawing.viewBox.split(" ")[3]) - 14} text={`${formatInches(plan.boxW)} box behind a ${formatInches(plan.overallW)} face.`} />
        </>
      )}
    </>
  );
}

function faceCaption(plan: CabinetBoxPlan) {
  const base =
    plan.construction === "face-frame"
      ? "The brown border is the face frame. Orange numbers are the openings — drawers, doors, or a false front. The box sits a little behind the frame."
      : "Frameless: the doors and fronts cover the box edges. Orange numbers are the openings inside.";
  const skipped = plan.cells.some((cell) =>
    cell.kind === "doors" ? !plan.includeDoorFaces : !plan.includeDrawerFaces,
  );
  return skipped ? `${base} Dark openings are faces you skipped — cut those later.` : base;
}

function FaceElevation({ plan }: { plan: CabinetBoxPlan }) {
  const drawing = faceMetrics(plan);
  const legend = plan.cells.map((cell, i) => ({
    n: i + 1,
    label: cell.label,
    hint:
      cell.kind === "doors"
        ? `${cell.count === 1 ? "One door" : "Pair"} · opening ${formatInches(cell.height)} high`
        : `${formatInches(cell.height)} opening`,
  }));

  return (
    <Picture
      title="The finished cabinet — what you see from the front"
      caption={faceCaption(plan)}
      viewBox={drawing.viewBox}
      legend={legend}
    >
      <FaceDrawing plan={plan} drawing={drawing} />
    </Picture>
  );
}

function cellFace(
  cell: FaceCell,
  n: number,
  x: number,
  y: number,
  w: number,
  h: number,
  showFace: boolean,
  compact?: boolean,
  blueprint?: boolean,
) {
  const gap = 4;
  const stroke = blueprint ? "#000" : "#24180f";
  const doorFill = blueprint ? "#fff" : "url(#grain-door)";
  if (!showFace) {
    return (
      <g key={cell.id}>
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          fill={blueprint ? "#fff" : "#6d5a46"}
          stroke={blueprint ? "#000" : "#4a3424"}
          strokeWidth="0.9"
          strokeDasharray={blueprint ? "3 2" : undefined}
        />
        {compact ? null : <Callout n={n} x={x + w / 2} y={y + h / 2} />}
      </g>
    );
  }
  if (cell.kind === "doors") {
    const count = cell.count <= 1 ? 1 : 2;
    const dw = (w - (count - 1) * gap) / count;
    return (
      <g key={cell.id}>
        {Array.from({ length: count }, (_, i) => (
          <rect
            key={i}
            x={x + i * (dw + gap)}
            y={y}
            width={dw}
            height={h}
            fill={doorFill}
            stroke={stroke}
            strokeWidth="1.1"
          />
        ))}
        {compact ? null : <Callout n={n} x={x + w / 2} y={y + h / 2} />}
      </g>
    );
  }
  return (
    <g key={cell.id}>
      <rect x={x} y={y} width={w} height={h} fill={doorFill} stroke={stroke} strokeWidth="1.1" />
      {cell.kind === "drawer" ? (
        <rect
          x={x + w / 2 - 12}
          y={y + h / 2 - 3}
          width="24"
          height="6"
          rx="1"
          fill={blueprint ? "#fff" : "#6b3a1f"}
          stroke={blueprint ? "#000" : "none"}
        />
      ) : (
        <rect x={x + 8} y={y + h / 2 - 1} width={w - 16} height="2" fill={blueprint ? "#000" : "#c45c26"} opacity={blueprint ? 1 : 0.7} />
      )}
      {compact ? null : <Callout n={n} x={x + w / 2} y={y + h / 2} />}
    </g>
  );
}

function ExplodedBox({ plan }: { plan: CabinetBoxPlan }) {
  const viewW = 560;
  const viewH = 420;
  const joinHint =
    plan.assembly === "pocket"
      ? "Pocket-screw the bottom and stretchers between the sides. Screw the back on last."
      : plan.assembly === "screws"
        ? "Screw through the sides into the bottom and stretchers. Screw the back on last."
        : "Dados hold the bottom. A rabbet holds the back.";
  return (
    <Picture
      title="Take the box apart — the plywood and the frame"
      caption={`Two sides, a bottom, stretchers or a top, and a thin back. ${joinHint} The face frame glues on last. Orange numbers match the cut list.`}
      viewBox={`0 0 ${viewW} ${viewH}`}
      legend={[
        { n: 1, label: "Sides", hint: `2 pc · ${formatInches(plan.boxD)} × ${formatInches(plan.boxH)}` },
        {
          n: 2,
          label: "Bottom",
          hint:
            plan.assembly === "dado"
              ? "Sits in dados, at the top of the toe kick on a base."
              : plan.assembly === "pocket"
                ? "Butt between the sides. Pocket screws from underneath."
                : "Butt between the sides. Screws through the sides.",
        },
        {
          n: 3,
          label: "Back",
          hint:
            plan.assembly === "dado"
              ? "¼″ plywood. This is what squares the cabinet."
              : "¼″ plywood, screwed on. This is still what squares the cabinet.",
        },
        {
          n: 4,
          label: plan.kind === "upper" || plan.kind === "tall" ? "Top" : "Stretchers",
          hint: plan.kind === "upper" || plan.kind === "tall" ? "Same as the bottom." : "Front and back at the top.",
        },
      ]}
    >
      <polygon points="86,70 132,48 132,250 86,272" fill="url(#grain-frame)" stroke="#6b3a1f" strokeWidth="1.2" />
      <polygon points="348,70 394,48 394,250 348,272" fill="url(#grain-frame)" stroke="#6b3a1f" strokeWidth="1.2" />
      <Callout n={1} x={109} y={160} />
      <rect x="150" y="258" width="180" height="28" fill="url(#grain-frame)" stroke="#6b3a1f" strokeWidth="1.2" />
      <Callout n={2} x={240} y={272} />
      <rect x="168" y="96" width="146" height="148" fill="url(#grain-panel)" stroke="#8a6a3a" strokeWidth="1.1" />
      <Callout n={3} x={241} y={170} />
      {plan.kind === "upper" || plan.kind === "tall" ? (
        <rect x="150" y="58" width="180" height="24" fill="url(#grain-frame)" stroke="#6b3a1f" strokeWidth="1.2" />
      ) : (
        <>
          <rect x="150" y="62" width="180" height="14" fill="#8b5a32" stroke="#6b3a1f" />
          <rect x="150" y="80" width="180" height="14" fill="#8b5a32" stroke="#6b3a1f" />
        </>
      )}
      <Callout n={4} x={240} y={70} />
      {plan.construction === "face-frame" ? (
        <>
          <rect x="430" y="70" width="18" height="200" fill="url(#grain-frame)" stroke="#6b3a1f" />
          <rect x="500" y="70" width="18" height="200" fill="url(#grain-frame)" stroke="#6b3a1f" />
          <rect x="448" y="70" width="52" height="16" fill="url(#grain-frame)" stroke="#6b3a1f" />
          <rect x="448" y="254" width="52" height="16" fill="url(#grain-frame)" stroke="#6b3a1f" />
          <Chip x={474} y={320} text="face frame" fill="#6b3a1f" />
        </>
      ) : (
        <Chip x={474} y={160} text="no face frame" fill="#6b3a1f" />
      )}
      <Chip x={240} y={330} text={`inside ${formatInches(plan.interiorW)} wide`} fill="#c45c26" />
      <Caption x={70} y={400} text="Glue the box square, then the back, then the face frame." />
    </Picture>
  );
}
