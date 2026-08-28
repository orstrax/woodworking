import { Callout, Chip, DimH, DimV, Picture } from "@/components/Visuals";
import type { DoorDrawerPlan, HingeAdvice } from "@/lib/cabinet";
import { formatInches } from "@/lib/measure";

export function DoorDrawerPictures({
  plan,
  hinges,
}: {
  plan: DoorDrawerPlan;
  hinges: HingeAdvice;
}) {
  return (
    <>
      <StackFront plan={plan} hinges={hinges} />
      <BoxSide plan={plan} />
    </>
  );
}

function StackFront({ plan, hinges }: { plan: DoorDrawerPlan; hinges: HingeAdvice }) {
  const s = Math.min(13, 260 / Math.max(plan.overallW, 8), 320 / Math.max(plan.overallH, 10));
  const ox = 110;
  const oy = 56;
  const fw = plan.overallW * s;
  const fh = plan.overallH * s;
  const inset = plan.fit === "inset";
  const viewW = Math.max(540, fw + 240);
  const viewH = Math.max(460, fh + 130);

  const faceX = ox + (inset ? plan.stile + plan.revealX : plan.revealX) * s;
  const drawerW = plan.drawer.frontW * s;
  const drawerH = plan.drawer.frontH * s;
  const doorW = plan.door.doorW * s;
  const doorH = plan.door.doorH * s;
  const gap = plan.stackGap * s;
  const coveredTop = oy + (inset ? plan.rail + plan.revealY : plan.revealY) * s;
  const drawerY = coveredTop;
  const doorY = coveredTop + drawerH + gap;

  const pair = plan.door.doorCount === 2;

  return (
    <Picture
      title="Drawer and door on the same cabinet"
      caption="Same overlay on the stiles so the drawer and the door line up. The drawer sits on top. Measure the holes, not the old faces, unless you typed finished sizes."
      viewBox={`0 0 ${viewW} ${viewH}`}
      legend={[
        {
          n: 1,
          label: "Face frame",
          hint: `${formatInches(plan.overallW)} × ${formatInches(plan.overallH)} outside`,
        },
        {
          n: 2,
          label: "Drawer front",
          hint: `${formatInches(plan.drawer.frontW)} × ${formatInches(plan.drawer.frontH)}`,
        },
        {
          n: 3,
          label: plan.door.doorCount === 1 ? "Door" : "Left and right doors",
          hint: `${formatInches(plan.door.doorW)} × ${formatInches(plan.door.doorH)} each`,
        },
        {
          n: 4,
          label: plan.overlap > 0 ? "Faces overlap on the mid-rail" : "Gap between drawer and door",
          hint:
            plan.overlap > 0
              ? `${formatInches(plan.overlap)} overlap — widen the mid-rail or use less overlay`
              : formatInches(Math.max(0, plan.stackGap)),
        },
      ]}
    >
      <rect x={ox - 28} y={oy - 22} width={fw + 56} height={fh + 44} fill="#d8c4a0" stroke="#b08960" />
      <rect x={ox} y={oy} width={fw} height={fh} fill="url(#grain-frame)" stroke="#6b3a1f" strokeWidth="1.7" />
      {plan.split === "two-openings" ? (
        <>
          <rect
            x={ox + plan.stile * s}
            y={oy + plan.rail * s}
            width={plan.openingW * s}
            height={plan.drawerOpeningH * s}
            fill="#6d5a46"
          />
          <rect
            x={ox + plan.stile * s}
            y={oy + (plan.rail + plan.drawerOpeningH + plan.midRail) * s}
            width={plan.openingW * s}
            height={plan.doorOpeningH * s}
            fill="#6d5a46"
          />
        </>
      ) : (
        <rect
          x={ox + plan.stile * s}
          y={oy + plan.rail * s}
          width={plan.openingW * s}
          height={plan.totalOpeningH * s}
          fill="#6d5a46"
        />
      )}

      <g filter="url(#lift)">
        <rect
          x={faceX}
          y={drawerY}
          width={drawerW}
          height={drawerH}
          fill="url(#grain-door)"
          stroke="#24180f"
          strokeWidth="1.3"
        />
        <rect
          x={faceX + drawerW / 2 - 16}
          y={drawerY + drawerH / 2 - 4}
          width="32"
          height="8"
          rx="2"
          fill="#6b3a1f"
        />
        <Callout n={2} x={faceX + drawerW / 2} y={drawerY + drawerH / 2} />
      </g>

      {Array.from({ length: plan.door.doorCount }, (_, i) => {
        const x = faceX + i * (doorW + plan.door.midGap * s);
        return (
          <g key={i} filter="url(#lift)">
            <rect
              x={x}
              y={doorY}
              width={doorW}
              height={doorH}
              fill="url(#grain-door)"
              stroke="#24180f"
              strokeWidth="1.3"
            />
            {hinges.centers.map((center) => (
              <circle
                key={center}
                cx={x + 8}
                cy={doorY + center * s}
                r="4.5"
                fill="#e8d7b5"
                stroke="#6b3a1f"
                strokeWidth="0.8"
              />
            ))}
            <circle cx={x + doorW - 12} cy={doorY + doorH / 2} r="4" fill="#6b3a1f" />
            {pair ? <Chip x={x + doorW / 2} y={doorY + 14} text={i === 0 ? "L" : "R"} fill="#c45c26" /> : null}
          </g>
        );
      })}
      <Callout n={3} x={faceX + (pair ? doorW + (plan.door.midGap * s) / 2 : doorW / 2)} y={doorY + doorH * 0.45} />
      <Callout n={1} x={ox + 14} y={oy + 16} />
      <Callout n={4} x={faceX + drawerW / 2} y={drawerY + drawerH + Math.max(6, gap / 2)} />

      <DimH x={ox} y={oy} w={fw} label={formatInches(plan.overallW)} side="top" />
      <DimH x={faceX} y={drawerY} w={drawerW} label={formatInches(plan.drawer.frontW)} />
      <DimV x={ox} y={oy} h={fh} label={formatInches(plan.overallH)} />
      <DimV x={faceX + drawerW} y={drawerY} h={drawerH} label={formatInches(plan.drawer.frontH)} side="right" />
      <DimV x={faceX + (pair ? doorW * 2 + plan.door.midGap * s : doorW)} y={doorY} h={doorH} label={formatInches(plan.door.doorH)} side="right" />
    </Picture>
  );
}

function BoxSide({ plan }: { plan: DoorDrawerPlan }) {
  const d = plan.drawer;
  const s = Math.min(11, 220 / Math.max(d.boxD + 4, 8), 180 / Math.max(d.boxH + d.frontH, 6));
  const ox = 90;
  const oy = 48;
  const boxD = d.boxD * s;
  const boxH = d.boxH * s;
  const frontH = d.frontH * s;
  const frontT = 0.75 * s;
  const viewW = Math.max(480, boxD + 220);
  const viewH = Math.max(280, Math.max(boxH, frontH) + 110);

  return (
    <Picture
      title="Drawer box behind the front"
      caption="The pretty front is bigger than the box on purpose. The box is what the slides carry. Confirm the slide brand before you cut."
      viewBox={`0 0 ${viewW} ${viewH}`}
      legend={[
        { n: 1, label: "Drawer front", hint: `${formatInches(d.frontW)} × ${formatInches(d.frontH)}` },
        { n: 2, label: "Box", hint: `${formatInches(d.boxW)} W × ${formatInches(d.boxD)} D × ${formatInches(d.boxH)} H` },
      ]}
    >
      <rect
        x={ox + frontT}
        y={oy + (frontH - boxH) / 2}
        width={boxD}
        height={boxH}
        fill="url(#hatch-box)"
        stroke="#6b3a1f"
        strokeWidth="1.3"
      />
      <rect x={ox} y={oy} width={frontT} height={frontH} fill="url(#grain-door)" stroke="#24180f" strokeWidth="1.3" />
      <Callout n={1} x={ox + frontT / 2} y={oy + 12} />
      <Callout n={2} x={ox + frontT + boxD / 2} y={oy + (frontH - boxH) / 2 + boxH / 2} />
      <DimH x={ox + frontT} y={oy + (frontH - boxH) / 2} w={boxD} label={formatInches(d.boxD)} side="top" />
      <DimV x={ox + frontT + boxD} y={oy + (frontH - boxH) / 2} h={boxH} label={formatInches(d.boxH)} side="right" />
    </Picture>
  );
}
