import { Callout, Caption, Chip, DimH, DimV, Picture } from "@/components/Visuals";
import type { ShakerBuild, ShakerPlan } from "@/lib/cabinet";
import { formatInches } from "@/lib/measure";

export function ShakerPictures({ plan, build }: { plan: ShakerPlan; build: ShakerBuild }) {
  return (
    <>
      <Assembled plan={plan} build={build} />
      <Exploded plan={plan} build={build} />
      {build === "cope" ? <GrooveCut plan={plan} /> : null}
    </>
  );
}

function Assembled({ plan, build }: { plan: ShakerPlan; build: ShakerBuild }) {
  const s = Math.min(13, 260 / plan.doorW, 320 / plan.doorH);
  const ox = 100;
  const oy = 52;
  const dw = plan.doorW * s;
  const dh = plan.doorH * s;
  const st = plan.stileW * s;
  const ra = plan.railW * s;
  const viewW = Math.max(480, dw + 200);
  const viewH = Math.max(400, dh + 110);
  const mitered = build === "applied-miter";

  const caption = mitered
    ? "This is a slab with a picture-frame glued on. Every corner is a 45° miter — the stile and rail meet on a diagonal, not a butt."
    : "Stiles are the tall sides. Rails are the short top and bottom. The middle is the panel you see. Grain on the stiles runs up and down; grain on the rails runs sideways.";

  return (
    <Picture
      title="The finished door — what hangs on the cabinet"
      caption={caption}
      viewBox={`0 0 ${viewW} ${viewH}`}
      legend={[
        {
          n: 1,
          label: mitered ? "Stile (long point)" : "Stile (you need two)",
          hint: `${formatInches(plan.stileW)} wide × ${formatInches(plan.stileLength)} long${mitered ? " · 45° both ends" : ""}`,
        },
        {
          n: 2,
          label: mitered ? "Rail (long point)" : "Rail (you need two)",
          hint: `${formatInches(plan.railW)} wide × ${formatInches(plan.railLength)} long${mitered ? " · 45° both ends" : ""}`,
        },
        {
          n: 3,
          label: mitered ? "Slab" : "Visible center",
          hint: mitered
            ? `${formatInches(plan.panelW)} × ${formatInches(plan.panelH)} — the door under the frame`
            : `${formatInches(plan.visibleW)} × ${formatInches(plan.visibleH)} — the picture in the middle`,
        },
      ]}
    >
      <rect x={ox} y={oy} width={dw} height={dh} fill="url(#grain-door)" stroke="#24180f" strokeWidth="1.6" filter="url(#lift)" />
      {mitered ? (
        <g>
          <polygon
            points={`${ox},${oy} ${ox + dw},${oy} ${ox + dw - st},${oy + ra} ${ox + st},${oy + ra}`}
            fill="url(#grain-frame)"
            stroke="#6b3a1f"
            strokeWidth="1.15"
          />
          <polygon
            points={`${ox + dw},${oy} ${ox + dw},${oy + dh} ${ox + dw - st},${oy + dh - ra} ${ox + dw - st},${oy + ra}`}
            fill="url(#grain-frame)"
            stroke="#6b3a1f"
            strokeWidth="1.15"
          />
          <polygon
            points={`${ox},${oy + dh} ${ox + dw},${oy + dh} ${ox + dw - st},${oy + dh - ra} ${ox + st},${oy + dh - ra}`}
            fill="url(#grain-frame)"
            stroke="#6b3a1f"
            strokeWidth="1.15"
          />
          <polygon
            points={`${ox},${oy} ${ox},${oy + dh} ${ox + st},${oy + dh - ra} ${ox + st},${oy + ra}`}
            fill="url(#grain-frame)"
            stroke="#6b3a1f"
            strokeWidth="1.15"
          />
          <line x1={ox} y1={oy} x2={ox + st} y2={oy + ra} stroke="#c45c26" strokeWidth="1.2" />
          <line x1={ox + dw} y1={oy} x2={ox + dw - st} y2={oy + ra} stroke="#c45c26" strokeWidth="1.2" />
          <line x1={ox} y1={oy + dh} x2={ox + st} y2={oy + dh - ra} stroke="#c45c26" strokeWidth="1.2" />
          <line x1={ox + dw} y1={oy + dh} x2={ox + dw - st} y2={oy + dh - ra} stroke="#c45c26" strokeWidth="1.2" />
        </g>
      ) : (
        <g>
          <rect x={ox} y={oy} width={st} height={dh} fill="url(#grain-frame)" stroke="#6b3a1f" strokeWidth="1.1" />
          <rect x={ox + dw - st} y={oy} width={st} height={dh} fill="url(#grain-frame)" stroke="#6b3a1f" strokeWidth="1.1" />
          <rect x={ox + st} y={oy} width={dw - st * 2} height={ra} fill="url(#grain-frame)" stroke="#6b3a1f" strokeWidth="1.1" />
          <rect
            x={ox + st}
            y={oy + dh - ra}
            width={dw - st * 2}
            height={ra}
            fill="url(#grain-frame)"
            stroke="#6b3a1f"
            strokeWidth="1.1"
          />
          <rect
            x={ox + st}
            y={oy + ra}
            width={Math.max(0, dw - st * 2)}
            height={Math.max(0, dh - ra * 2)}
            fill="url(#grain-panel)"
            stroke="#8a6a3a"
            strokeWidth="0.9"
          />
        </g>
      )}
      <Callout n={1} x={ox + st / 2} y={oy + dh / 2} />
      <Callout n={2} x={ox + dw / 2} y={oy + ra / 2} />
      <Callout n={3} x={ox + dw / 2} y={oy + dh / 2} />
      <DimH x={ox} y={oy} w={dw} label={formatInches(plan.doorW)} />
      <DimV x={ox} y={oy} h={dh} label={formatInches(plan.doorH)} />
      <Chip
        x={ox + dw / 2}
        y={oy + dh + 28}
        text={mitered ? `slab ${formatInches(plan.panelW)}` : `center ${formatInches(plan.visibleW)}`}
        fill="#c45c26"
      />
      <Chip x={ox + dw + 48} y={oy + ra / 2} text={formatInches(plan.railW)} fill="#6b3a1f" />
      <Caption
        x={ox}
        y={viewH - 14}
        text={
          mitered
            ? "Orange lines are the 45° miters. Stiles do not run through — each corner is a picture-frame joint."
            : "This is the face you see. The next picture takes it apart."
        }
      />
    </Picture>
  );
}

function Exploded({ plan, build }: { plan: ShakerPlan; build: ShakerBuild }) {
  const s = Math.min(8, 100 / plan.stileW, 170 / plan.doorH, 150 / plan.doorW);
  const stileH = plan.stileLength * s;
  const stileW = plan.stileW * s;
  const railW = plan.railLength * s;
  const railH = plan.railW * s;
  const slab = build !== "cope";
  const panelW = Math.max(48, (slab ? plan.panelW : plan.visibleW) * s * 0.9);
  const panelH = Math.max(70, (slab ? plan.panelH : plan.visibleH) * s * 0.9);
  const gap = 22;
  const left = 50;
  const top = 44;
  const stileN = build === "cope" ? 1 : 2;
  const railN = build === "cope" ? 2 : 3;
  const panelN = build === "cope" ? 3 : 1;
  const panelX = left + stileW + gap;
  const rightX = panelX + panelW + gap;
  const railX = panelX;
  const canvasW = Math.max(520, rightX + stileW + 140);
  const canvasH = top + railH + gap + Math.max(stileH, panelH) + gap + railH + 70;

  return (
    <Picture
      title="Take it apart — the pieces you cut"
      caption={
        build === "cope"
          ? "Five pieces: two stiles, two rails, one panel. Rails are shorter because they fit between the stiles — plus a little extra to sit in the groove."
          : build === "applied-miter"
            ? "The big rectangle is the slab. The four frame pieces are mitered at 45° — long-point length is the full door width or height."
            : "The big rectangle is the slab. The four frame pieces glue onto the face like a picture frame. Stiles run through; rails butt between them."
      }
      viewBox={`0 0 ${canvasW} ${canvasH}`}
      legend={plan.parts.map((part, i) => ({
        n: i + 1,
        label: part.name,
        hint: `${part.qty} pc · ${part.thickness} × ${formatInches(part.width)} × ${formatInches(part.length)}`,
      }))}
    >
      {build === "applied-miter" ? (
        <>
          <polygon
            points={`${railX},${top} ${railX + railW},${top} ${railX + railW - railH},${top + railH} ${railX + railH},${top + railH}`}
            fill="url(#grain-frame)"
            stroke="#6b3a1f"
            strokeWidth="1.2"
          />
          <line
            x1={railX}
            y1={top}
            x2={railX + railH}
            y2={top + railH}
            stroke="#c45c26"
            strokeWidth="1"
          />
          <line
            x1={railX + railW}
            y1={top}
            x2={railX + railW - railH}
            y2={top + railH}
            stroke="#c45c26"
            strokeWidth="1"
          />
        </>
      ) : (
        <rect x={railX} y={top} width={railW} height={railH} fill="url(#grain-frame)" stroke="#6b3a1f" strokeWidth="1.2" />
      )}
      <Callout n={railN} x={railX + railW / 2} y={top + railH / 2} />
      {build === "applied-miter" ? (
        <>
          <polygon
            points={`${left},${top + railH + gap + stileW} ${left + stileW},${top + railH + gap} ${left + stileW},${top + railH + gap + stileH - stileW} ${left},${top + railH + gap + stileH}`}
            fill="url(#grain-frame)"
            stroke="#6b3a1f"
            strokeWidth="1.2"
          />
          <line
            x1={left}
            y1={top + railH + gap + stileW}
            x2={left + stileW}
            y2={top + railH + gap}
            stroke="#c45c26"
            strokeWidth="1"
          />
          <line
            x1={left}
            y1={top + railH + gap + stileH}
            x2={left + stileW}
            y2={top + railH + gap + stileH - stileW}
            stroke="#c45c26"
            strokeWidth="1"
          />
          <polygon
            points={`${rightX},${top + railH + gap} ${rightX + stileW},${top + railH + gap + stileW} ${rightX + stileW},${top + railH + gap + stileH} ${rightX},${top + railH + gap + stileH - stileW}`}
            fill="url(#grain-frame)"
            stroke="#6b3a1f"
            strokeWidth="1.2"
          />
          <line
            x1={rightX + stileW}
            y1={top + railH + gap + stileW}
            x2={rightX}
            y2={top + railH + gap}
            stroke="#c45c26"
            strokeWidth="1"
          />
          <line
            x1={rightX + stileW}
            y1={top + railH + gap + stileH}
            x2={rightX}
            y2={top + railH + gap + stileH - stileW}
            stroke="#c45c26"
            strokeWidth="1"
          />
        </>
      ) : (
        <>
          <rect
            x={left}
            y={top + railH + gap}
            width={stileW}
            height={stileH}
            fill="url(#grain-frame)"
            stroke="#6b3a1f"
            strokeWidth="1.2"
          />
          <rect
            x={rightX}
            y={top + railH + gap}
            width={stileW}
            height={stileH}
            fill="url(#grain-frame)"
            stroke="#6b3a1f"
            strokeWidth="1.2"
          />
        </>
      )}
      <Callout n={stileN} x={left + stileW / 2} y={top + railH + gap + stileH / 2} />
      <rect
        x={panelX}
        y={top + railH + gap + (stileH - panelH) / 2}
        width={panelW}
        height={panelH}
        fill="url(#grain-panel)"
        stroke="#8a6a3a"
        strokeWidth="1.2"
      />
      <Callout n={panelN} x={panelX + panelW / 2} y={top + railH + gap + stileH / 2} />
      {build === "applied-miter" ? (
        <>
          <polygon
            points={`${railX + railH},${top + railH + gap + Math.max(stileH, panelH) + gap} ${railX + railW - railH},${top + railH + gap + Math.max(stileH, panelH) + gap} ${railX + railW},${top + railH + gap + Math.max(stileH, panelH) + gap + railH} ${railX},${top + railH + gap + Math.max(stileH, panelH) + gap + railH}`}
            fill="url(#grain-frame)"
            stroke="#6b3a1f"
            strokeWidth="1.2"
          />
          <line
            x1={railX}
            y1={top + railH + gap + Math.max(stileH, panelH) + gap + railH}
            x2={railX + railH}
            y2={top + railH + gap + Math.max(stileH, panelH) + gap}
            stroke="#c45c26"
            strokeWidth="1"
          />
          <line
            x1={railX + railW}
            y1={top + railH + gap + Math.max(stileH, panelH) + gap + railH}
            x2={railX + railW - railH}
            y2={top + railH + gap + Math.max(stileH, panelH) + gap}
            stroke="#c45c26"
            strokeWidth="1"
          />
        </>
      ) : (
        <rect
          x={railX}
          y={top + railH + gap + Math.max(stileH, panelH) + gap}
          width={railW}
          height={railH}
          fill="url(#grain-frame)"
          stroke="#6b3a1f"
          strokeWidth="1.2"
        />
      )}
      <Chip x={left + stileW / 2} y={top + railH + gap + stileH + 18} text={formatInches(plan.stileLength)} />
      <Chip
        x={panelX + panelW / 2}
        y={top + railH + gap + (stileH - panelH) / 2 - 16}
        text={formatInches(plan.panelW)}
        fill="#c45c26"
      />
      <Chip x={railX + railW / 2} y={top - 16} text={formatInches(plan.railLength)} fill="#6b3a1f" />
      <Caption x={left} y={canvasH - 16} text="Lay the parts on the bench in this shape, then glue." />
    </Picture>
  );
}

function GrooveCut({ plan }: { plan: ShakerPlan }) {
  return (
    <Picture
      title="Why the panel is bigger than what you see"
      caption="The panel slides into a groove in the frame, like a picture in a picture-frame slot. You cut it larger so the edges tuck in — plus a little slack so the wood can move."
      viewBox="0 0 520 240"
      legend={[
        { n: 1, label: "Frame", hint: `${formatInches(plan.stileW)} stile, looking at the end grain` },
        { n: 2, label: "Groove", hint: `${formatInches(plan.grooveDepth)} deep — the slot the panel sits in` },
        { n: 3, label: "Hidden part of the panel", hint: `${formatInches(plan.float)} slack on each edge so it can swell` },
        { n: 4, label: "What you see", hint: formatInches(plan.visibleW) },
      ]}
    >
      <rect x={36} y={58} width={78} height={100} fill="url(#grain-frame)" stroke="#6b3a1f" strokeWidth="1.4" />
      <rect x={406} y={58} width={78} height={100} fill="url(#grain-frame)" stroke="#6b3a1f" strokeWidth="1.4" />
      <rect x={98} y={88} width={40} height={40} fill="#4a3424" />
      <rect x={382} y={88} width={40} height={40} fill="#4a3424" />
      <rect x={104} y={94} width={312} height={28} fill="url(#grain-panel)" stroke="#8a6a3a" strokeWidth="1.2" />
      <rect x={118} y={48} width={284} height={10} fill="#c45c26" opacity="0.35" />
      <Callout n={1} x={60} y={72} />
      <Callout n={2} x={116} y={80} />
      <Callout n={3} x={260} y={80} />
      <Callout n={4} x={260} y={42} />
      <Chip x={260} y={178} text={`cut panel ${formatInches(plan.panelW)}`} fill="#c45c26" />
      <Chip x={260} y={202} text={`you see ${formatInches(plan.visibleW)}`} />
      <Caption x={36} y={228} text="The dark pockets are the grooves. The orange bar is the opening you actually see." />
    </Picture>
  );
}
