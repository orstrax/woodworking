"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { BuildSheet } from "@/components/BuildSheet";
import { Field, Result, SelectInput, TextInput, ToolFrame, btnGhost, btnPrimary } from "@/components/Fields";
import { KitchenPictures } from "@/components/plans/KitchenPictures";
import type { FitStyle, ShakerBuild } from "@/lib/cabinet";
import { layoutFromOpening } from "@/lib/cabinetBox";
import {
  defaultKitchen,
  kitchenTotals,
  newOpening,
  planKitchen,
  summarizeCuts,
  type KitchenOpeningInput,
  type KitchenState,
  type KitchenRow,
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

export function KitchenPlanner() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => "");
  const state = useMemo(() => parseKitchen(raw), [raw]);
  const results = useMemo(() => planKitchen(state), [state]);
  const summary = useMemo(() => summarizeCuts(results), [results]);
  const totals = useMemo(() => kitchenTotals(results), [results]);
  const preset = fitPresetId(state.defaults.fit, state.defaults.amount);

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

  return (
    <ToolFrame
      title="Kitchen planner"
      description="Measure every opening once. Get a door and drawer cut list for each cabinet, then a shop summary so you know which stiles go with the sink base and which go with the uppers. Print it and take it to the saw."
      ticketClassName="print:hidden"
      results={
        <>
          <Result
            label={state.defaults.name.trim() || "Kitchen"}
            value={`${totals.doors} door${totals.doors === 1 ? "" : "s"}`}
            note={`${totals.drawers} drawer front${totals.drawers === 1 ? "" : "s"} · ${totals.openings} opening${totals.openings === 1 ? "" : "s"}`}
          />
          {totals.errors ? (
            <Result label="Needs a look" value={`${totals.errors}`} note="Openings in red are missing a size or a door/drawer pick." />
          ) : (
            <Result
              label="Shop summary"
              value={`${summary.length} cuts`}
              note="Same-size parts roll together. Notes say which cabinet they belong to."
            />
          )}
          <button
            type="button"
            className={`${btnGhost} mt-4 w-full`}
            onClick={() => writeKitchen(defaultKitchen())}
          >
            Reset sample
          </button>
        </>
      }
      printFacts={[
        {
          label: state.defaults.name.trim() || "Kitchen",
          value: `${totals.doors} door${totals.doors === 1 ? "" : "s"}`,
          note: `${totals.drawers} drawer fronts · ${totals.openings} openings`,
        },
      ]}
      printRows={summary}
      printSections={results
        .filter((result) => !result.error && result.parts.length > 0)
        .map((result) => ({
          heading: result.name,
          rows: result.parts.map(({ name, qty, size, note }) => ({ name, qty, size, note })),
        }))}
      printSteps={[
        { id: "gang", text: "Gang matching sizes from the shop summary — all matching stiles in one stack." },
        { id: "label", text: "Keep a painter’s-tape label on each bundle with the cabinet names from the note column." },
        { id: "check", text: "Check the list against the kitchen so no opening is missing a door." },
      ]}
      note={`${totals.doors} doors · ${totals.drawers} drawer fronts · ${totals.openings} openings`}
      printFigures={<KitchenPictures results={results} />}
      plan={
        <>
          <div className="print:hidden">
            <KitchenPictures results={results} />
          </div>
          <div className="grid gap-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-shellac">By cabinet</p>
              <h3 className="mt-1 font-display text-2xl tracking-tight">What goes with what</h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-soft">
                Each opening keeps its own list, so the sink-base stiles do not get mixed with the upper doors.
              </p>
            </div>
            {results.map((result) => (
              <article key={result.id} className="print-break rounded-[12px] border border-rule bg-surface p-4 sm:p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="font-display text-xl tracking-tight">{result.name}</h4>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">{result.row}</p>
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
                          .map(
                            (drawer) =>
                              `${drawer.label} ${formatInches(drawer.width)} × ${formatInches(drawer.height)}`,
                          )
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
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-shellac">Whole kitchen</p>
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
          </div>
        </>
      }
    >
      <div className="grid gap-4 print:hidden">
        <Field label="Kitchen name">
          <TextInput value={state.defaults.name} onChange={(name) => patchDefaults({ name })} />
        </Field>
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
            <TextInput value={state.defaults.stile} onChange={(stile) => patchDefaults({ stile })} />
          </Field>
          <Field label="Face-frame rail" hint="horizontal">
            <TextInput value={state.defaults.rail} onChange={(rail) => patchDefaults({ rail })} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Pair gap">
            <TextInput value={state.defaults.midGap} onChange={(midGap) => patchDefaults({ midGap })} />
          </Field>
          <Field label="Drawer front gap">
            <TextInput value={state.defaults.drawerGap} onChange={(drawerGap) => patchDefaults({ drawerGap })} />
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
                <TextInput value={state.defaults.shakerStile} onChange={(shakerStile) => patchDefaults({ shakerStile })} />
              </Field>
              <Field label="Door rail">
                <TextInput value={state.defaults.shakerRail} onChange={(shakerRail) => patchDefaults({ shakerRail })} />
              </Field>
              <Field label="Stock thickness">
                <TextInput value={state.defaults.thickness} onChange={(thickness) => patchDefaults({ thickness })} />
              </Field>
            </div>
          </>
        ) : (
          <Field label="Stock thickness">
            <TextInput value={state.defaults.thickness} onChange={(thickness) => patchDefaults({ thickness })} />
          </Field>
        )}

        <div className="mt-2 flex flex-wrap items-end justify-between gap-3 border-t border-rule pt-5">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-shellac">Openings</p>
            <h2 className="font-display text-2xl tracking-tight">Measure each hole</h2>
          </div>
          <button
            type="button"
            className={btnPrimary}
            onClick={() =>
              setState((current) => ({
                ...current,
                openings: [
                  ...current.openings,
                  newOpening({
                    name: `Cabinet ${current.openings.length + 1}`,
                    row: "base",
                  }),
                ],
              }))
            }
          >
            Add opening
          </button>
        </div>

        {state.openings.map((opening, index) => (
          <OpeningCard
            key={opening.id}
            opening={opening}
            index={index}
            onChange={(patch) => patchOpening(opening.id, patch)}
            onDuplicate={() =>
              setState((current) => ({
                ...current,
                openings: [...current.openings, duplicateOpening(opening)],
              }))
            }
            onRemove={() =>
              setState((current) => ({
                ...current,
                openings: current.openings.filter((item) => item.id !== opening.id),
              }))
            }
            canRemove={state.openings.length > 1}
            stile={state.defaults.stile}
          />
        ))}
      </div>
    </ToolFrame>
  );
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

function OpeningCard({
  opening,
  index,
  onChange,
  onDuplicate,
  onRemove,
  canRemove,
  stile,
}: {
  opening: KitchenOpeningInput;
  index: number;
  onChange: (patch: Partial<KitchenOpeningInput>) => void;
  onDuplicate: () => void;
  onRemove: () => void;
  canRemove: boolean;
  stile: string;
}) {
  const openingW = parseInches(opening.openingW);
  const stileN = parseInches(stile) ?? 1.5;
  const overall = openingW ? formatInches(openingW + stileN * 2).replace(/"/g, "") : opening.openingW;
  const boxHref = `/tools/cabinet-box?kind=${opening.row}&layout=${layoutFromOpening(opening.row, opening.doorCount, opening.drawerCount)}&w=${encodeURIComponent(overall)}`;
  return (
    <div className="rounded-[12px] border border-rule bg-surface p-4 shadow-[var(--shadow-sm)] sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-ink-soft">
          Opening {String(index + 1).padStart(2, "0")}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-walnut hover:text-ink"
            onClick={onDuplicate}
          >
            Duplicate
          </button>
          {canRemove ? (
            <button
              type="button"
              className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-walnut hover:text-ink"
              onClick={onRemove}
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <TextInput value={opening.name} onChange={(name) => onChange({ name })} />
        </Field>
        <Field label="Row">
          <SelectInput value={opening.row} onChange={(row) => onChange({ row: row as KitchenRow })}>
            <option value="upper">Upper</option>
            <option value="base">Base</option>
            <option value="tall">Tall / pantry</option>
          </SelectInput>
        </Field>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Field label="Opening width">
          <TextInput value={opening.openingW} onChange={(openingW) => onChange({ openingW })} unit="in" />
        </Field>
        <Field label="Opening height" hint="doors">
          <TextInput value={opening.openingH} onChange={(openingH) => onChange({ openingH })} unit="in" />
        </Field>
        <Field label="Cabinet depth">
          <TextInput value={opening.openingD} onChange={(openingD) => onChange({ openingD })} unit="in" />
        </Field>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Field label="Doors">
          <SelectInput
            value={opening.doorCount}
            onChange={(doorCount) => onChange({ doorCount: doorCount as KitchenOpeningInput["doorCount"] })}
          >
            <option value="0">None</option>
            <option value="1">One</option>
            <option value="2">Pair</option>
          </SelectInput>
        </Field>
        <Field label="Drawers">
          <SelectInput
            value={opening.drawerCount}
            onChange={(drawerCount) => onChange({ drawerCount: drawerCount as KitchenOpeningInput["drawerCount"] })}
          >
            <option value="0">None</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </SelectInput>
        </Field>
        {opening.drawerCount !== "0" ? (
          <Field label="Drawer stack height" hint="if different">
            <TextInput
              value={opening.drawerH}
              onChange={(drawerH) => onChange({ drawerH })}
              placeholder="Same as opening height"
            />
          </Field>
        ) : (
          <div />
        )}
      </div>
      <p className="mt-3">
        <Link href={boxHref} className="font-mono text-[11px] uppercase tracking-[0.14em] text-walnut hover:text-shellac">
          Build this box →
        </Link>
      </p>
    </div>
  );
}
