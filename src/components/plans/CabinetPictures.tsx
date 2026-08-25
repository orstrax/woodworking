import { Callout, Caption, Chip, DimH, DimV, Picture, useBlueprint } from "@/components/Visuals";
import type { DoorPlan, HingeAdvice } from "@/lib/cabinet";
import { formatInches } from "@/lib/measure";

export function CabinetPictures({ plan, hinges }: { plan: DoorPlan; hinges: HingeAdvice }) {
  return (
    <>
      <CabinetFront plan={plan} hinges={hinges} />
      <OverlayCutaway plan={plan} />
      <HingePicture plan={plan} hinges={hinges} />
    </>
  );
}

function CabinetFront({ plan, hinges }: { plan: DoorPlan; hinges: HingeAdvice }) {
  const s = Math.min(14, 280 / plan.overallW, 340 / plan.overallH);
  const ox = 110;
  const oy = 56;
  const fw = plan.overallW * s;
  const fh = plan.overallH * s;
  const inset = plan.doorW < plan.openingW;
  const doorY = oy + (inset ? plan.rail + plan.revealY : plan.revealY) * s;
  const leftDoorX = ox + (inset ? plan.stile + plan.revealX : plan.revealX) * s;
  const openingX = ox + plan.stile * s;
  const openingY = oy + plan.rail * s;
  const viewW = Math.max(520, fw + 230);
  const viewH = Math.max(420, fh + 130);

  return (
    <Picture
      title="Standing in front of the cabinet"
      caption="The dark brown border is the face frame you already built. The lighter rectangle is the door you will hang on it. Orange dots are hinge cups — they go on the back of the door."
      viewBox={`0 0 ${viewW} ${viewH}`}
      legend={[
        {
          n: 1,
          label: "Face frame",
          hint: `${formatInches(plan.overallW)} wide × ${formatInches(plan.overallH)} high, outside to outside`,
        },
        {
          n: 2,
          label: plan.doorCount === 1 ? "Door" : "Left and right doors",
          hint: `${formatInches(plan.doorW)} × ${formatInches(plan.doorH)} each`,
        },
        {
          n: 3,
          label: inset ? "Gap all around (inset)" : "Reveal — leftover frame",
          hint: inset
            ? `${formatInches(plan.revealX)} of empty space so the door can swing`
            : `${formatInches(plan.revealX)} of frame still showing around the door`,
        },
        {
          n: 4,
          label: "Hinge cups",
          hint: `${hinges.count} cups. First one is ${formatInches(hinges.centers[0] ?? 3.5)} down from the top of the door.`,
        },
        ...(plan.doorCount === 2
          ? [{ n: 5, label: "Gap between doors", hint: formatInches(plan.midGap) }]
          : []),
      ]}
    >
      <rect x={ox - 28} y={oy - 22} width={fw + 56} height={fh + 44} fill="#d8c4a0" stroke="#b08960" strokeWidth="1" />
      <rect
        x={openingX}
        y={openingY}
        width={plan.openingW * s}
        height={plan.openingH * s}
        fill="#6d5a46"
      />
      <line
        x1={openingX + 6}
        y1={openingY + plan.openingH * s * 0.38}
        x2={openingX + plan.openingW * s - 6}
        y2={openingY + plan.openingH * s * 0.38}
        stroke="#8a7360"
        strokeWidth="3"
      />
      <line
        x1={openingX + 6}
        y1={openingY + plan.openingH * s * 0.7}
        x2={openingX + plan.openingW * s - 6}
        y2={openingY + plan.openingH * s * 0.7}
        stroke="#8a7360"
        strokeWidth="3"
      />
      <rect x={ox} y={oy} width={fw} height={fh} fill="url(#grain-frame)" stroke="#6b3a1f" strokeWidth="2" />
      <rect
        x={openingX}
        y={openingY}
        width={plan.openingW * s}
        height={plan.openingH * s}
        fill="none"
        stroke="#4a3424"
        strokeWidth="0.8"
      />
      {plan.doors.map((door, index) => {
        const gapPx = plan.doorCount === 2 ? Math.max(8, plan.midGap * s) : 0;
        const x = leftDoorX + index * (door.width * s + gapPx);
        const w = door.width * s;
        const h = door.height * s;
        const hingeSide = index === 0 ? "left" : "right";
        return (
          <g key={index} filter="url(#lift)">
            {index === 1 ? (
              <rect
                x={x - gapPx}
                y={doorY}
                width={gapPx}
                height={h}
                fill="#c45c26"
                fillOpacity="0.4"
              />
            ) : null}
            <rect x={x} y={doorY} width={w} height={h} fill="url(#grain-door)" stroke="#24180f" strokeWidth="1.4" />
            {plan.doorCount === 2 ? (
              <Chip x={x + w / 2} y={doorY + 16} text={index === 0 ? "left" : "right"} fill="#c45c26" />
            ) : null}
            <rect
              x={x}
              y={doorY}
              width={w}
              height={h}
              fill="url(#wood-shine)"
              stroke="none"
            />
            <rect
              x={x + Math.min(12, w * 0.1)}
              y={doorY + Math.min(12, h * 0.07)}
              width={Math.max(4, w - Math.min(24, w * 0.2))}
              height={Math.max(4, h - Math.min(24, h * 0.14))}
              fill="none"
              stroke="#c45c26"
              strokeWidth="0.8"
              opacity="0.4"
            />
            <circle
              cx={hingeSide === "left" ? x + w - Math.min(16, w * 0.18) : x + Math.min(16, w * 0.18)}
              cy={doorY + h / 2}
              r="4.5"
              fill="#6b3a1f"
            />
            <circle
              cx={hingeSide === "left" ? x + w - Math.min(16, w * 0.18) : x + Math.min(16, w * 0.18)}
              cy={doorY + h / 2}
              r="1.6"
              fill="#d8c39a"
            />
            {hinges.centers.map((cy) => {
              const cx = hingeSide === "left" ? x + 8 : x + w - 8;
              return (
                <g key={`${index}-${cy}`}>
                  <circle cx={cx} cy={doorY + cy * s} r="6" fill="#e8d7b5" stroke="#6b3a1f" strokeWidth="1.2" />
                  <circle cx={cx} cy={doorY + cy * s} r="2.4" fill="#6b3a1f" />
                </g>
              );
            })}
          </g>
        );
      })}
      <Callout n={1} x={ox + 14} y={oy + 16} />
      <Callout n={2} x={leftDoorX + plan.doorW * s * 0.52} y={doorY + plan.doorH * s * 0.42} />
      <Callout n={3} x={ox + 10} y={oy + fh * 0.55} />
      <Callout n={4} x={leftDoorX + 22} y={doorY + (hinges.centers[0] ?? 3.5) * s} />
      {plan.doorCount === 2 ? (
        <Callout
          n={5}
          x={leftDoorX + plan.doorW * s + Math.max(8, plan.midGap * s) / 2}
          y={doorY + plan.doorH * s * 0.2}
        />
      ) : null}
      <DimH x={ox} y={oy} w={fw} label={`frame ${formatInches(plan.overallW)}`} />
      <DimH
        x={leftDoorX}
        y={oy + fh}
        w={plan.doorW * s}
        label={`door ${formatInches(plan.doorW)}`}
        side="bottom"
      />
      <DimV x={ox} y={oy} h={fh} label={formatInches(plan.overallH)} />
      <DimV
        x={ox + fw}
        y={doorY}
        h={plan.doorH * s}
        label={formatInches(plan.doorH)}
        side="right"
      />
      <Caption x={ox - 8} y={viewH - 16} text="You are standing in the kitchen, looking at the cupboard." />
    </Picture>
  );
}

function OverlayCutaway({ plan }: { plan: DoorPlan }) {
  const blueprint = useBlueprint();
  const inset = plan.doorW < plan.openingW;
  const ox = 28;
  const oy = 62;
  const insideW = 96;
  const sideW = 26;
  const frameW = 78;
  const bodyH = 128;
  const doorBodyW = 168;
  const doorBodyH = 104;
  const stile = Math.max(plan.stile, 0.001);
  const overlayW = inset ? 0 : Math.max(0, Math.min(frameW, (plan.overlayX / stile) * frameW));
  const revealW = inset ? 0 : Math.max(0, frameW - overlayW);
  const gapW = inset ? 18 : 0;
  const sideX = ox + insideW;
  const frameX = sideX + sideW;
  const doorX = inset ? frameX + frameW + gapW : frameX + revealW;
  const doorY = oy + (bodyH - doorBodyH) / 2;
  const cupX = doorX + 16;
  const cupY = doorY + doorBodyH / 2;

  return (
    <Picture
      title="Looking down from the ceiling"
      caption={
        inset
          ? "Left is inside the cupboard. Then the plywood side, the face frame, a swing gap, and the door sitting in the opening."
          : "Left is inside the cupboard. Then the plywood side, the face frame, and the door coming in from the kitchen. Overlay is how much frame the door covers. Reveal is what you still see."
      }
      viewBox="0 0 560 320"
      legend={
        inset
          ? [
              { n: 1, label: "Inside", hint: "The cupboard box" },
              { n: 2, label: "Box side", hint: "Plywood end, looking down on its thickness" },
              { n: 3, label: "Face frame", hint: `${formatInches(plan.stile)} stile` },
              { n: 4, label: "Door", hint: `${formatInches(plan.revealX)} gap so it can swing` },
            ]
          : [
              { n: 1, label: "Inside", hint: "The cupboard box" },
              { n: 2, label: "Box side", hint: "Plywood end, looking down on its thickness" },
              { n: 3, label: "Face frame", hint: `${formatInches(plan.stile)} stile` },
              { n: 4, label: "Door", hint: `${formatInches(plan.overlayX)} overlay · ${formatInches(plan.revealX)} reveal` },
            ]
      }
    >
      <rect x={ox} y={oy} width={insideW} height={bodyH} fill={blueprint ? "#fff" : "url(#hatch-box)"} stroke={blueprint ? "#000" : "#8a7355"} strokeWidth="1.1" />
      <rect x={sideX} y={oy} width={sideW} height={bodyH} fill={blueprint ? "#fff" : "url(#grain-panel)"} stroke={blueprint ? "#000" : "#6b3a1f"} strokeWidth="1.2" />
      <rect x={frameX} y={oy} width={frameW} height={bodyH} fill={blueprint ? "#fff" : "url(#grain-frame)"} stroke={blueprint ? "#000" : "#6b3a1f"} strokeWidth="1.5" />
      {inset ? (
        <rect
          x={frameX + frameW}
          y={oy}
          width={gapW}
          height={bodyH}
          fill={blueprint ? "#fff" : "#f3ead7"}
          stroke={blueprint ? "#000" : "#c45c26"}
          strokeDasharray="3 2"
        />
      ) : revealW > 0.5 ? (
        <rect
          x={frameX}
          y={oy}
          width={revealW}
          height={bodyH}
          fill={blueprint ? "none" : "#c45c26"}
          fillOpacity={blueprint ? undefined : 0.22}
          stroke={blueprint ? "#000" : "none"}
          strokeDasharray={blueprint ? "4 2" : undefined}
        />
      ) : null}
      <rect
        x={doorX}
        y={doorY}
        width={doorBodyW}
        height={doorBodyH}
        fill={blueprint ? "#fff" : "url(#grain-door)"}
        stroke={blueprint ? "#000" : "#24180f"}
        strokeWidth="1.5"
        filter={blueprint ? undefined : "url(#lift)"}
      />
      {!inset && overlayW > 0.5 ? (
        <rect
          x={doorX}
          y={doorY}
          width={overlayW}
          height={doorBodyH}
          fill={blueprint ? "none" : "#c45c26"}
          fillOpacity={blueprint ? undefined : 0.2}
          stroke={blueprint ? "#000" : "none"}
          strokeDasharray={blueprint ? "4 2" : undefined}
        />
      ) : null}
      <circle cx={cupX} cy={cupY} r="9" fill="#e8d7b5" stroke="#6b3a1f" strokeWidth="1.1" />
      <circle cx={cupX} cy={cupY} r="3" fill="#6b3a1f" />
      <Callout n={1} x={ox + 22} y={oy + 22} />
      <Callout n={2} x={sideX + sideW / 2} y={oy + 22} />
      <Callout n={3} x={frameX + frameW / 2} y={oy + 22} />
      <Callout n={4} x={doorX + 48} y={doorY + 20} />
      <Chip x={ox + insideW / 2} y={oy - 22} text="inside" />
      <Chip x={sideX + sideW / 2} y={oy - 22} text="box" fill="#8b5a32" />
      <Chip x={frameX + frameW / 2} y={oy - 22} text="face frame" fill="#6b3a1f" />
      <Chip x={doorX + doorBodyW - 40} y={oy - 22} text="door" fill="#c45c26" />
      {!inset ? (
        <>
          {overlayW > 0.5 ? (
            <Chip
              x={doorX + overlayW / 2}
              y={oy + bodyH + 28}
              text={`overlay ${formatInches(plan.overlayX)}`}
              fill="#c45c26"
            />
          ) : null}
          {revealW > 8 ? (
            <Chip
              x={frameX + revealW / 2}
              y={oy + bodyH + 54}
              text={`reveal ${formatInches(plan.revealX)}`}
            />
          ) : plan.revealX <= 0.02 ? (
            <Chip x={frameX + frameW / 2} y={oy + bodyH + 54} text="no reveal — full overlay" />
          ) : (
            <Chip
              x={Math.max(frameX + 70, doorX + overlayW + 70)}
              y={oy + bodyH + 54}
              text={`reveal ${formatInches(plan.revealX)}`}
            />
          )}
        </>
      ) : (
        <Chip
          x={frameX + frameW + gapW / 2}
          y={oy + bodyH + 28}
          text={`gap ${formatInches(plan.revealX)}`}
          fill="#c45c26"
        />
      )}
      <Caption
        x={ox}
        y={304}
        text="Left = inside the cupboard. Right = the kitchen. The circle is the 35mm hinge cup in the door."
      />
    </Picture>
  );
}

function HingePicture({ plan, hinges }: { plan: DoorPlan; hinges: HingeAdvice }) {
  const height = 250;
  const doorW = 108;
  const ox = 92;
  const oy = 36;
  const scale = height / plan.doorH;
  return (
    <Picture
      title="Flip the door over — hinge cups"
      caption="This is the back of the door, hinge edge on the left. Bore 35mm cups. Measure down from the top of the door to each center. Stay 5mm in from the edge."
      viewBox="0 0 520 360"
      legend={hinges.centers.map((cy, i) => ({
        n: i + 1,
        label: `Hinge ${i + 1}`,
        hint: `${formatInches(cy)} from the top of the door`,
      }))}
    >
      <rect x={ox} y={oy} width={doorW} height={height} fill="url(#grain-door)" stroke="#24180f" strokeWidth="1.6" />
      <rect x={ox} y={oy} width={12} height={height} fill="#6b3a1f" opacity="0.16" />
      <text
        x={ox + doorW / 2}
        y={oy + 16}
        textAnchor="middle"
        fill="#5c4633"
        fontSize="10"
        fontFamily="ui-monospace, monospace"
      >
        back of the door
      </text>
      {hinges.centers.map((cy, i) => {
        const y = oy + cy * scale;
        return (
          <g key={cy}>
            <line
              x1={ox - 8}
              y1={oy}
              x2={ox - 8}
              y2={y}
              stroke="#5c4633"
              strokeWidth="0.9"
              strokeDasharray="3 2"
            />
            <circle cx={ox + 16} cy={y} r="13" fill="#e8d7b5" stroke="#6b3a1f" strokeWidth="1.4" />
            <circle cx={ox + 16} cy={y} r="4.2" fill="#6b3a1f" />
            <Callout n={i + 1} x={ox + 44} y={y} />
            <Chip x={ox - 70} y={y} text={formatInches(cy)} />
          </g>
        );
      })}
      <g>
        <circle cx={360} cy={150} r="52" fill="#efe0c4" stroke="#6b3a1f" strokeWidth="1.4" />
        <circle cx={360} cy={150} r="40" fill="#e8d7b5" stroke="#6b3a1f" strokeWidth="1.6" />
        <circle cx={360} cy={150} r="10" fill="#6b3a1f" />
        <Chip x={360} y={86} text="35mm cup" fill="#c45c26" />
        <Chip x={360} y={220} text="5mm from edge" />
        <Caption x={360} y={248} text="Close-up of one cup" anchor="middle" />
      </g>
      <Chip x={ox + doorW / 2} y={oy + height + 24} text={`${hinges.count} × 35mm`} fill="#c45c26" />
      <DimV x={ox + doorW} y={oy} h={height} label={formatInches(plan.doorH)} side="right" />
      <Caption x={24} y={346} text={hinges.euro} />
    </Picture>
  );
}
