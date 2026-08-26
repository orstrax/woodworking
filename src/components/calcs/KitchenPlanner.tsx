"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { BuildSheet } from "@/components/BuildSheet";
import {
  AccordionSection,
  ChoiceCard,
  Field,
  Result,
  SectionCard,
  SelectInput,
  TextInput,
  btnGhost,
  btnPrimary,
  kickerClass,
} from "@/components/Fields";
import { PrintButton, PrintSheet } from "@/components/PrintSheet";
import { KitchenElevation } from "@/components/plans/KitchenElevation";
import { KitchenPictures } from "@/components/plans/KitchenPictures";
import { LayoutThumb } from "@/components/plans/LayoutThumb";
import type { FitStyle, ShakerBuild } from "@/lib/cabinet";
import { getLayout, layoutFromOpening } from "@/lib/cabinetBox";
import {
  KITCHEN_CATALOG,
  STANDARD_CAB_WIDTHS,
  defaultKitchen,
  kitchenTotals,
  newOpening,
  openingFromCatalog,
  openingWidthFromOverall,
  overallWidthInches,
  planKitchen,
  summarizeCuts,
  type KitchenCatalogItem,
  type KitchenOpeningInput,
  type KitchenRow,
  type KitchenState,
} from "@/lib/kitchen";
import { formatInches, parseInches } from "@/lib/measure";

const STORAGE = "storystick-kitchen-v1";
const EVENT = "storystick-kitchen";

const FIT_OPTIONS: { id: string; label: string; fit: FitStyle; amount: string }[] = [
  { id: "full", label: "Full overlay (covers the face frame)", fit: "reveal", amount: "0" },
  { id: "r16", label: '1/16" reveal', fit: "reveal", amount: "1/16" },
  { id: "r8", label: '1/8" reveal', fit: "reveal", amount: "1/8" },
  { id: "r4", label: '1/4" reveal', fit: "reveal", amount: "1/4" },
  { id: "o12", label: '1/2" overlay (standard face-frame)', fit: "overlay", amount: "1/2" },
  { id: "o38", label: '3/8" overlay', fit: "overlay", amount: "3/8" },
  { id: "in16", label: 'Inset, 1/16" gap', fit: "inset", amount: "1/16" },
  { id: "in8", label: 'Inset, 1/8" gap', fit: "inset", amount: "1/8" },
];

const FRONT_STYLES: {
  id: string;
  label: string;
  blurb: string;
  doorCount: KitchenOpeningInput["doorCount"];
  drawerCount: KitchenOpeningInput["drawerCount"];
  rows: KitchenRow[];
}[] = [
  { id: "doors2", label: "Pair of doors", blurb: "Two doors on the opening", doorCount: "2", drawerCount: "0", rows: ["base", "upper", "tall"] },
  { id: "door1", label: "Single door", blurb: "One door, narrow bay", doorCount: "1", drawerCount: "0", rows: ["base", "upper"] },
  { id: "d3", label: "3 drawers", blurb: "The usual drawer base", doorCount: "0", drawerCount: "3", rows: ["base"] },
  { id: "d4", label: "4 drawers", blurb: "Shallower top drawer", doorCount: "0", drawerCount: "4", rows: ["base"] },
  { id: "mix2", label: "Drawer over a pair", blurb: "Classic base", doorCount: "2", drawerCount: "1", rows: ["base"] },
  { id: "mix1", label: "Drawer over one door", blurb: "Narrow mix", doorCount: "1", drawerCount: "1", rows: ["base"] },
];

function fitPresetId(fit: FitStyle, amount: string) {
  return FIT_OPTIONS.find((item) => item.fit === fit && item.amount === amount)?.id ?? "custom";
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot() {
  try {
    return localStorage.getItem(STORAGE) ?? "";
  } catch {
    return "";
  }
}

function parseKitchen(raw: string): KitchenState {
  if (!raw) return defaultKitchen();
  try {
    const parsed = JSON.parse(raw) as KitchenState;
    if (parsed?.defaults && Array.isArray(parsed.openings) && parsed.openings.length > 0) {
      return {
        defaults: { ...defaultKitchen().defaults, ...parsed.defaults },
        openings: parsed.openings.map((opening) => newOpening(opening)),
      };
    }
  } catch {
    /* sample kitchen */
  }
  return defaultKitchen();
}

function writeKitchen(next: KitchenState) {
  try {
    localStorage.setItem(STORAGE, JSON.stringify(next));
  } catch {
    /* private mode */
  }
  window.dispatchEvent(new Event(EVENT));
}

function duplicateOpening(opening: KitchenOpeningInput) {
  return newOpening({
    name: `${opening.name} copy`,
    row: opening.row,
    openingW: opening.openingW,
    openingH: opening.openingH,
    openingD: opening.openingD,
    drawerH: opening.drawerH,
    doorCount: opening.doorCount,
    drawerCount: opening.drawerCount,
  });
}

export function KitchenPlanner() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => "");
  const state = useMemo(() => parseKitchen(raw), [raw]);
  const results = useMemo(() => planKitchen(state), [state]);
  const summary = useMemo(() => summarizeCuts(results), [results]);
  const totals = useMemo(() => kitchenTotals(results), [results]);
  const preset = fitPresetId(state.defaults.fit, state.defaults.amount);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected =
    state.openings.find((item) => item.id === selectedId) ?? state.openings[0] ?? null;

  function setState(update: KitchenState | ((current: KitchenState) => KitchenState)) {
    writeKitchen(typeof update === "function" ? update(state) : update);
  }

  function patchDefaults(patch: Partial<KitchenState["defaults"]>) {
    setState((current) => ({ ...current, defaults: { ...current.defaults, ...patch } }));
  }

  function patchOpening(id: string, patch: Partial<KitchenOpeningInput>) {
    setState((current) => ({
      ...current,
      openings: current.openings.map((opening) => (opening.id === id ? { ...opening, ...patch } : opening)),
    }));
  }

  function addFromCatalog(item: KitchenCatalogItem) {
    const next = openingFromCatalog(item, state.defaults.stile);
    setState((current) => ({ ...current, openings: [...current.openings, next] }));
    setSelectedId(next.id);
  }

  function moveSelected(dir: -1 | 1) {
    if (!selected) return;
    setState((current) => {
      const index = current.openings.findIndex((item) => item.id === selected.id);
      const next = index + dir;
      if (index < 0 || next < 0 || next >= current.openings.length) return current;
      const openings = [...current.openings];
      const [item] = openings.splice(index, 1);
      openings.splice(next, 0, item);
      return { ...current, openings };
    });
  }

  const printBlock = (
    <>
      <PrintSheet
        title="Kitchen planner"
        facts={[
          {
            label: state.defaults.name.trim() || "Kitchen",
            value: `${totals.doors} door${totals.doors === 1 ? "" : "s"}`,
            note: `${totals.drawers} drawer fronts · ${totals.openings} openings`,
          },
        ]}
        rows={summary}
        sections={results
          .filter((result) => !result.error && result.parts.length > 0)
          .map((result) => ({
            heading: result.name,
            rows: result.parts.map(({ name, qty, size, note }) => ({ name, qty, size, note })),
          }))}
        steps={[
          { id: "gang", text: "Gang matching sizes from the shop summary — all matching stiles in one stack." },
          { id: "label", text: "Keep a painter’s-tape label on each bundle with the cabinet names from the note column." },
          { id: "check", text: "Check the list against the kitchen so no opening is missing a door." },
        ]}
        figures={<KitchenPictures results={results} />}
        note={`${totals.doors} doors · ${totals.drawers} drawer fronts · ${totals.openings} openings`}
      />
    </>
  );

  return (
    <>
      <div className="grid gap-6 print:hidden pb-24 lg:pb-0">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Kitchen planner</h1>
            <p className="mt-3 text-base leading-7 text-ink-soft">
              Place cabinets on a wall the way a showroom planner does. Tap a typical size, click it on
              the elevation, then print a cut list for the shop.
            </p>
          </div>
          <label className="block sm:w-56">
            <span className="text-sm font-semibold">Kitchen name</span>
            <span className="mt-2 block">
              <TextInput value={state.defaults.name} onChange={(name) => patchDefaults({ name })} />
            </span>
          </label>
        </header>

        <KitchenElevation
          openings={state.openings}
          results={results}
          stile={state.defaults.stile}
          selectedId={selected?.id ?? null}
          onSelect={setSelectedId}
        />

        <div>
          <p className={kickerClass}>Catalog</p>
          <h2 className="mt-1 font-display text-2xl tracking-tight">Add a cabinet to the run</h2>
          <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
            {KITCHEN_CATALOG.map((item) => {
              const layout = getLayout(layoutFromOpening(item.row, item.doorCount, item.drawerCount));
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => addFromCatalog(item)}
                  className="w-[7.5rem] shrink-0 rounded-[12px] border border-rule bg-surface p-2.5 text-left shadow-[var(--shadow-sm)] transition hover:border-walnut/50"
                >
                  {layout ? <LayoutThumb layout={layout} className="mx-auto h-20 w-14" /> : null}
                  <span className="mt-2 block text-sm font-semibold leading-5">{item.label}</span>
                  <span className="mt-0.5 block text-xs leading-4 text-ink-soft">{item.blurb}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)]">
          <SelectedInspector
            opening={selected}
            stile={state.defaults.stile}
            canRemove={state.openings.length > 1}
            onChange={(patch) => selected && patchOpening(selected.id, patch)}
            onMove={moveSelected}
            onDuplicate={() => {
              if (!selected) return;
              const copy = duplicateOpening(selected);
              setState((current) => ({ ...current, openings: [...current.openings, copy] }));
              setSelectedId(copy.id);
            }}
            onRemove={() => {
              if (!selected || state.openings.length <= 1) return;
              setState((current) => ({
                ...current,
                openings: current.openings.filter((item) => item.id !== selected.id),
              }));
            }}
          />

          <div className="grid gap-4">
            <div className="rounded-[12px] border border-rule bg-surface p-5 shadow-[var(--shadow-sm)]">
              <p className={kickerClass}>Build summary</p>
              <Result
                label={state.defaults.name.trim() || "Kitchen"}
                value={`${totals.doors} door${totals.doors === 1 ? "" : "s"}`}
                note={`${totals.drawers} drawer front${totals.drawers === 1 ? "" : "s"} · ${totals.openings} cabinet${totals.openings === 1 ? "" : "s"}`}
              />
              {totals.errors ? (
                <Result
                  label="Needs a look"
                  value={`${totals.errors}`}
                  note="Red cabinets are missing a size or a door/drawer pick."
                />
              ) : (
                <Result
                  label="Shop summary"
                  value={`${summary.length} cuts`}
                  note="Same-size parts roll together. Notes say which cabinet they belong to."
                />
              )}
              <div className="mt-4">
                <PrintButton />
              </div>
              <button type="button" className={`${btnGhost} mt-2 w-full`} onClick={() => writeKitchen(defaultKitchen())}>
                Reset sample kitchen
              </button>
            </div>

            <AccordionSection
              title="Shop details"
              summary="Overlay, face-frame, and door style for the whole kitchen."
            >
              <ShopDefaults state={state} preset={preset} patchDefaults={patchDefaults} />
            </AccordionSection>
          </div>
        </div>

        <section className="grid gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={kickerClass}>Pictures & plans</p>
              <h2 className="mt-1 font-display text-3xl tracking-tight">Cut lists for the run</h2>
              <p className="mt-2 max-w-2xl text-base leading-7 text-ink-soft">
                Each cabinet keeps its own parts. The shop summary gangs matching sizes so you can cut
                every 32 3/4″ stile in one stack.
              </p>
            </div>
            <div className="w-full shrink-0 sm:w-auto">
              <PrintButton />
            </div>
          </div>

          {results.map((result) => (
            <article key={result.id} className="print-break rounded-[12px] border border-rule bg-surface p-4 sm:p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="font-display text-xl tracking-tight">{result.name}</h4>
                <p className="text-sm font-semibold capitalize text-ink-soft">{result.row}</p>
              </div>
              {result.error ? (
                <p className="mt-2 text-sm text-shellac">{result.error}</p>
              ) : (
                <>
                  {result.doors.length > 0 ? (
                    <p className="mt-2 text-sm text-ink-soft">
                      {result.doors
                        .map((door) => `${door.label} ${formatInches(door.width)} × ${formatInches(door.height)}`)
                        .join(" · ")}
                    </p>
                  ) : null}
                  {result.drawers.length > 0 ? (
                    <p className="mt-1 text-sm text-ink-soft">
                      {result.drawers
                        .map((drawer) => `${drawer.label} ${formatInches(drawer.width)} × ${formatInches(drawer.height)}`)
                        .join(" · ")}
                    </p>
                  ) : null}
                  <div className="mt-3">
                    <BuildSheet
                      storageKey={`storystick-cuts-kitchen-${result.id}`}
                      rows={result.parts}
                      steps={[
                        {
                          id: "cut",
                          text: `Cut and label every part for ${result.name} before you move on.`,
                        },
                        {
                          id: "box",
                          text: "Build the plywood box (or open the cabinet box tool) so these faces have a home.",
                        },
                      ]}
                      title={`${result.name} cut list`}
                    />
                  </div>
                </>
              )}
            </article>
          ))}
          <article className="print-break rounded-[12px] border border-rule bg-surface p-4 sm:p-5">
            <p className={kickerClass}>Whole kitchen</p>
            <h3 className="mt-1 font-display text-2xl tracking-tight">Shop summary — gang the cuts</h3>
            <p className="mt-1 mb-3 max-w-2xl text-sm leading-6 text-ink-soft">
              Same part name and size stacked. The note column lists every cabinet that uses that size.
            </p>
            <BuildSheet
              storageKey="storystick-cuts-kitchen-summary"
              rows={summary}
              steps={[
                {
                  id: "gang",
                  text: "Gang matching sizes from this summary — all 32 3/4″ stiles in one stack.",
                },
                {
                  id: "label",
                  text: "Keep a painter’s-tape label on each bundle with the cabinet names from the note column.",
                },
                {
                  id: "check",
                  text: "Check the list against the kitchen picture so no opening is missing a door.",
                },
              ]}
              title="Shop summary"
            />
          </article>
        </section>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-paper px-5 py-3 print:hidden lg:hidden sm:px-8">
        <PrintButton />
      </div>
      {printBlock}
    </>
  );
}

function SelectedInspector({
  opening,
  stile,
  canRemove,
  onChange,
  onMove,
  onDuplicate,
  onRemove,
}: {
  opening: KitchenOpeningInput | null;
  stile: string;
  canRemove: boolean;
  onChange: (patch: Partial<KitchenOpeningInput>) => void;
  onMove: (dir: -1 | 1) => void;
  onDuplicate: () => void;
  onRemove: () => void;
}) {
  if (!opening) {
    return (
      <SectionCard>
        <p className={kickerClass}>Selected cabinet</p>
        <p className="mt-2 text-base text-ink-soft">Tap a cabinet on the wall, or add one from the catalog.</p>
      </SectionCard>
    );
  }

  const overall = overallWidthInches(opening, stile);
  const overallText = overall ? formatInches(overall).replace(/"/g, "") : opening.openingW;
  const boxHref = `/tools/cabinet-box?kind=${opening.row}&layout=${layoutFromOpening(opening.row, opening.doorCount, opening.drawerCount)}&w=${encodeURIComponent(overallText)}`;
  const fronts = FRONT_STYLES.filter((item) => item.rows.includes(opening.row));

  return (
    <SectionCard>
      <p className={kickerClass}>Selected cabinet</p>
      <h3 className="mt-1 font-display text-2xl tracking-tight">{opening.name}</h3>
      <div className="mt-4 grid gap-4">
        <Field label="Name">
          <TextInput value={opening.name} onChange={(name) => onChange({ name })} />
        </Field>
        <div>
          <p className="text-[15px] font-semibold">Cabinet width</p>
          <p className="mt-1 text-sm text-ink-soft">Standard kitchen sizes. The opening is figured from the face-frame stiles.</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {STANDARD_CAB_WIDTHS.map((width) => {
              const on = overall !== null && Math.abs(overall - width) < 0.03;
              return (
                <button
                  key={width}
                  type="button"
                  onClick={() => onChange({ openingW: openingWidthFromOverall(width, stile) })}
                  className={`min-h-11 min-w-11 rounded-[10px] border px-3 text-sm font-semibold ${
                    on ? "border-walnut bg-[#f3e8df]" : "border-rule bg-surface hover:border-walnut/40"
                  }`}
                >
                  {width}″
                </button>
              );
            })}
          </div>
          <div className="mt-3 max-w-[12rem]">
            <Field label="Custom overall" hint="in">
              <TextInput
                value={overallText}
                onChange={(value) => {
                  const n = parseInches(value);
                  if (n) onChange({ openingW: openingWidthFromOverall(n, stile) });
                }}
                unit="in"
              />
            </Field>
          </div>
        </div>
        <div>
          <p className="text-[15px] font-semibold">What’s on the front</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {fronts.map((item) => (
              <ChoiceCard
                key={item.id}
                selected={opening.doorCount === item.doorCount && opening.drawerCount === item.drawerCount}
                onSelect={() => onChange({ doorCount: item.doorCount, drawerCount: item.drawerCount })}
                title={item.label}
                hint={item.blurb}
                visual={
                  <LayoutThumb
                    layout={
                      getLayout(layoutFromOpening(opening.row, item.doorCount, item.drawerCount)) ?? {
                        kind: opening.row,
                        cells: [],
                      }
                    }
                    className="h-12 w-8 shrink-0"
                  />
                }
              />
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btnGhost} onClick={() => onMove(-1)}>
            Move left
          </button>
          <button type="button" className={btnGhost} onClick={() => onMove(1)}>
            Move right
          </button>
          <button type="button" className={btnGhost} onClick={onDuplicate}>
            Duplicate
          </button>
          {canRemove ? (
            <button type="button" className={btnGhost} onClick={onRemove}>
              Remove
            </button>
          ) : null}
        </div>
        <Link href={boxHref} className={`${btnPrimary} sm:w-auto`}>
          Build this box →
        </Link>
        <details className="rounded-[12px] border border-rule bg-paper-2/40">
          <summary className="cursor-pointer px-4 py-3 text-[15px] font-semibold">
            Fine-tune opening height, depth, and row
          </summary>
          <div className="border-t border-rule px-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Row">
                <SelectInput value={opening.row} onChange={(row) => onChange({ row: row as KitchenRow })}>
                  <option value="upper">Upper (on the wall)</option>
                  <option value="base">Base (on the floor)</option>
                  <option value="tall">Tall / pantry</option>
                </SelectInput>
              </Field>
              <Field label="Opening height" hint="doors">
                <TextInput value={opening.openingH} onChange={(openingH) => onChange({ openingH })} unit="in" />
              </Field>
              <Field label="Cabinet depth">
                <TextInput value={opening.openingD} onChange={(openingD) => onChange({ openingD })} unit="in" />
              </Field>
              {opening.drawerCount !== "0" ? (
                <Field label="Drawer stack height" hint="if different">
                  <TextInput
                    value={opening.drawerH}
                    onChange={(drawerH) => onChange({ drawerH })}
                    placeholder="Same as opening height"
                    unit="in"
                  />
                </Field>
              ) : null}
            </div>
          </div>
        </details>
      </div>
    </SectionCard>
  );
}

function ShopDefaults({
  state,
  preset,
  patchDefaults,
}: {
  state: KitchenState;
  preset: string;
  patchDefaults: (patch: Partial<KitchenState["defaults"]>) => void;
}) {
  return (
    <div className="grid gap-4">
      <Field label="How the doors sit">
        <SelectInput
          value={preset}
          onChange={(id) => {
            const next = FIT_OPTIONS.find((item) => item.id === id);
            if (next) patchDefaults({ fit: next.fit, amount: next.amount });
          }}
        >
          {FIT_OPTIONS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </SelectInput>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Face-frame stile" hint="vertical">
          <TextInput value={state.defaults.stile} onChange={(stile) => patchDefaults({ stile })} unit="in" />
        </Field>
        <Field label="Face-frame rail" hint="horizontal">
          <TextInput value={state.defaults.rail} onChange={(rail) => patchDefaults({ rail })} unit="in" />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Pair gap">
          <TextInput value={state.defaults.midGap} onChange={(midGap) => patchDefaults({ midGap })} unit="in" />
        </Field>
        <Field label="Drawer front gap">
          <TextInput value={state.defaults.drawerGap} onChange={(drawerGap) => patchDefaults({ drawerGap })} unit="in" />
        </Field>
        <Field label="Slides">
          <SelectInput
            value={state.defaults.slide}
            onChange={(slide) => patchDefaults({ slide: slide as "undermount" | "side" })}
          >
            <option value="undermount">Undermount</option>
            <option value="side">Side-mount</option>
          </SelectInput>
        </Field>
      </div>
      <Field label="Build the faces as">
        <SelectInput
          value={state.defaults.makeShaker ? "shaker" : "slab"}
          onChange={(value) => patchDefaults({ makeShaker: value === "shaker" })}
        >
          <option value="shaker">Shaker / applied frame (stiles, rails, panel)</option>
          <option value="slab">Flat slab doors and fronts only</option>
        </SelectInput>
      </Field>
      {state.defaults.makeShaker ? (
        <>
          <Field label="Frame joints">
            <SelectInput
              value={state.defaults.shakerBuild}
              onChange={(shakerBuild) => patchDefaults({ shakerBuild: shakerBuild as ShakerBuild })}
            >
              <option value="applied-miter">Applied mitered frame on a slab (45° corners)</option>
              <option value="applied-butt">Applied frame, stiles through / rails butt</option>
              <option value="cope">Cope-and-stick 5-piece</option>
            </SelectInput>
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Door stile">
              <TextInput value={state.defaults.shakerStile} onChange={(shakerStile) => patchDefaults({ shakerStile })} unit="in" />
            </Field>
            <Field label="Door rail">
              <TextInput value={state.defaults.shakerRail} onChange={(shakerRail) => patchDefaults({ shakerRail })} unit="in" />
            </Field>
            <Field label="Stock thickness">
              <TextInput value={state.defaults.thickness} onChange={(thickness) => patchDefaults({ thickness })} unit="in" />
            </Field>
          </div>
        </>
      ) : (
        <Field label="Stock thickness">
          <TextInput value={state.defaults.thickness} onChange={(thickness) => patchDefaults({ thickness })} unit="in" />
        </Field>
      )}
    </div>
  );
}
