import { Callout, Caption, Chip, DimH, DimV, Picture } from "@/components/Visuals";
import type { DrawerPlan } from "@/lib/cabinet";
import { formatInches } from "@/lib/measure";

export function DrawerPictures({ plan }: { plan: DrawerPlan }) {
  return (
    <>
      <FrontStack plan={plan} />
      <SideCut plan={plan} />
    </>
  );
}

function FrontStack({ plan }: { plan: DrawerPlan }) {
  const s = Math.min(13, 260 / Math.max(plan.overallW, 8), 240 / Math.max(plan.overallH, 6));
  const ox = 100;
  const oy = 52;
  const fw = plan.overallW * s;
  const fh = plan.overallH * s;
  const inset = plan.fit === "inset";
  const frontX = ox + (inset ? plan.stile + plan.reveal : plan.reveal) * s;
  const stackTop = oy + (inset ? plan.stile + plan.reveal : plan.reveal) * s;
  const viewW = Math.max(500, fw + 210);
  const viewH = Math.max(360, fh + 110);

  return (
    <Picture
      title="Drawer fronts on the cabinet"
      caption="Each light rectangle is a drawer front — the pretty face you see. The brown border is the face frame. Number 1 is the top drawer."
      viewBox={`0 0 ${viewW} ${viewH}`}
      legend={[
        { n: 1, label: "Face frame", hint: `${formatInches(plan.overallW)} overall` },
        {
          n: 2,
          label: plan.count === 1 ? "Drawer front" : `${plan.count} drawer fronts`,
          hint: `${formatInches(plan.frontW)} × ${formatInches(plan.frontH)} each`,
        },
        ...(plan.count > 1 ? [{ n: 3, label: "Gap between fronts", hint: formatInches(plan.gap) }] : []),
      ]}
    >
      <rect x={ox} y={oy} width={fw} height={fh} fill="url(#grain-frame)" stroke="#6b3a1f" strokeWidth="1.7" />
      {plan.fronts.map((front, index) => {
        const y = stackTop + index * (front.height * s + plan.gap * s);
        return (
          <g key={front.label} filter="url(#lift)">
            <rect
              x={frontX}
              y={y}
              width={front.width * s}
              height={front.height * s}
              fill="url(#grain-door)"
              stroke="#24180f"
              strokeWidth="1.3"
            />
            <rect
              x={frontX + front.width * s * 0.5 - 14}
              y={y + front.height * s * 0.5 - 4}
              width="28"
              height="8"
              rx="2"
              fill="#6b3a1f"
            />
            <Callout n={2} x={frontX + (front.width * s) / 2} y={y + (front.height * s) / 2} />
            {plan.count > 1 ? (
              <Chip x={frontX - 40} y={y + (front.height * s) / 2} text={`${index + 1}`} fill="#c45c26" />
            ) : null}
          </g>
        );
      })}
      <Callout n={1} x={ox + 14} y={oy + 16} />
      {plan.count > 1 ? (
        <Callout
          n={3}
          x={frontX + (plan.frontW * s) / 2}
          y={stackTop + plan.frontH * s + (plan.gap * s) / 2}
        />
      ) : null}
      <DimH x={ox} y={oy} w={fw} label={formatInches(plan.overallW)} />
      <DimH
        x={frontX}
        y={oy + fh}
        w={plan.frontW * s}
        label={`front ${formatInches(plan.frontW)}`}
        side="bottom"
      />
      <DimV
        x={ox + fw}
        y={stackTop}
        h={plan.frontH * s}
        label={formatInches(plan.frontH)}
        side="right"
      />
      <Caption x={ox} y={viewH - 14} text="Same overlay rules as the doors. The next picture shows the box behind the front." />
    </Picture>
  );
}

function SideCut({ plan }: { plan: DrawerPlan }) {
  return (
    <Picture
      title="From the side — front, box, and slides"
      caption="The pretty front is larger than the box. The box is what rides on the slides inside the cabinet. Left is the kitchen; right is inside the cupboard."
      viewBox="0 0 520 250"
      legend={[
        { n: 1, label: "Drawer front", hint: `${formatInches(plan.frontW)} × ${formatInches(plan.frontH)}` },
        {
          n: 2,
          label: "Drawer box",
          hint: `${formatInches(plan.boxW)} wide × ${formatInches(plan.boxD)} deep × ${formatInches(plan.boxH)} high`,
        },
        {
          n: 3,
          label: plan.slide === "side" ? "Side-mount slides" : "Undermount slides",
          hint: plan.slide === "side" ? "Hide on the sides of the box" : "Hide under the box (Blum Tandem-style)",
        },
      ]}
    >
      <rect
        x={48}
        y={48}
        width={20}
        height={140}
        fill="url(#grain-door)"
        stroke="#24180f"
        strokeWidth="1.4"
        filter="url(#lift)"
      />
      <rect x={68} y={72} width={240} height={84} fill="#e6d3b0" stroke="#6b3a1f" strokeWidth="1.3" />
      <rect x={76} y={80} width={224} height={68} fill="none" stroke="#c4a06a" strokeWidth="0.8" />
      {plan.slide === "undermount" ? (
        <rect x={84} y={156} width={200} height={9} rx="1" fill="#3d3832" />
      ) : (
        <>
          <rect x={84} y={68} width={200} height={8} fill="#3d3832" />
          <rect x={84} y={156} width={200} height={8} fill="#3d3832" />
        </>
      )}
      <rect x={308} y={58} width={16} height={120} fill="url(#hatch-box)" stroke="#8a7355" />
      <Callout n={1} x={58} y={58} />
      <Callout n={2} x={170} y={108} />
      <Callout n={3} x={180} y={plan.slide === "undermount" ? 161 : 64} />
      <Chip x={58} y={30} text="front" fill="#c45c26" />
      <Chip x={188} y={58} text={`box ${formatInches(plan.boxD)} deep`} />
      <Chip x={188} y={196} text={`${formatInches(plan.boxW)} wide`} fill="#6b3a1f" />
      <Caption x={48} y={232} text="Left = the room. Right = inside the cabinet. The box is smaller so the slides have room." />
    </Picture>
  );
}
