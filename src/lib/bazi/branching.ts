/**
 * Bazi feature — result branching logic (§1.3). This is CORE logic.
 *
 * Five cases by number of missing elements (count === 0 among visible chars):
 *
 *   1 missing (52.6%) → favourable = the missing element.            badge: none
 *   0 missing (30.6%) → strengthen, don't heal: LOWEST-count element
 *                       (tie → the one supporting the Day Master).   badge: ◎
 *   2 missing (16.0%) → 用神 tiebreak; primary + name 2nd as next.   badge: ◆
 *   3 missing (0.8%)  → same tiebreak; ONE primary + next step.      badge: ◆
 *   4 missing (専旺格)→ RULE INVERSION: favourable = the chart's OWN
 *                       dominant element ("never balanced—only amplified"). ★
 */

import {
  CONTROLLED_BY,
  GENERATED_BY,
  GENERATES,
  ELEMENTS,
  type ElementCounts,
  type ElementKey,
} from './elements';
import type { Chart } from './engine';
import { TIEBREAK_OVERRIDES, tiebreakKey } from './data/tiebreak';

export type BranchType =
  | 'one-missing'
  | 'harmonious'
  | 'two-missing'
  | 'three-missing'
  | 'inversion';

export type StoneRole = 'default' | 'nurturing' | 'companion';

export interface BranchResult {
  branch: BranchType;
  /** Number of elements with zero count. */
  missingCount: number;
  missing: ElementKey[];
  /** The element whose guardian + stone the result leads with. */
  favorable: ElementKey;
  /** Named-but-not-sold "next step" element (2-/3-missing only). */
  nextStep: ElementKey | null;
  /** Day Master strength (MVP heuristic — see below). */
  strength: 'strong' | 'weak';
  stoneRole: StoneRole;
  /** True only for the 専旺格 inversion case. */
  inverted: boolean;
}

/** Deterministic element order for stable tiebreaks. */
function firstByOrder(candidates: ElementKey[]): ElementKey {
  for (const el of ELEMENTS) if (candidates.includes(el)) return el;
  return candidates[0];
}

function missingElements(counts: ElementCounts): ElementKey[] {
  return ELEMENTS.filter((e) => counts[e] === 0);
}

function maxCountElement(counts: ElementCounts): ElementKey {
  let best: ElementKey = 'wood';
  let bestN = -1;
  for (const e of ELEMENTS) {
    if (counts[e] > bestN) {
      bestN = counts[e];
      best = e;
    }
  }
  return best;
}

/**
 * Day Master strength — MVP heuristic (flagged for review).
 *
 * Support = companions (same element as the Day Master) + resource (the element
 * that generates the Day Master), counted across the visible characters, with a
 * +1 seasonal bonus when the MONTH branch supports the Day Master (the month is
 * the strongest positional weight in classical theory). Strong when support
 * reaches half the visible characters.
 *
 * This is intentionally simple for MVP; the 用神 override table is the surface
 * for per-locale practitioner corrections (§1.10 ko/zh).
 */
export function dayMasterStrength(chart: Chart): 'strong' | 'weak' {
  const dm = chart.dayMaster.element;
  const resource = GENERATED_BY[dm];
  const visibleChars = chart.hour ? 8 : 6;
  let support = chart.counts[dm] + chart.counts[resource];
  if (chart.month.branchElement === dm || chart.month.branchElement === resource) {
    support += 1;
  }
  return support >= Math.ceil(visibleChars / 2) ? 'strong' : 'weak';
}

function applyOverride(
  computed: ElementKey,
  dm: ElementKey,
  strength: 'strong' | 'weak',
  missing: ElementKey[],
): ElementKey {
  return TIEBREAK_OVERRIDES[tiebreakKey(dm, strength, missing)] ?? computed;
}

/**
 * Pick the primary favourable element among the MISSING candidates for the
 * 2-/3-missing branches (§1.3).
 *  - weak Day Master → prefer a candidate that SUPPORTS it (resource, then
 *    companion).
 *  - otherwise       → prefer a candidate that CONTROLS (克) the most excessive
 *    element, else one that DRAINS it (its output).
 */
function selectFavorable(
  chart: Chart,
  missing: ElementKey[],
  strength: 'strong' | 'weak',
): { favorable: ElementKey; nextStep: ElementKey | null } {
  const dm = chart.dayMaster.element;
  const ranked: ElementKey[] = [];

  if (strength === 'weak') {
    const resource = GENERATED_BY[dm];
    if (missing.includes(resource)) ranked.push(resource);
    if (missing.includes(dm)) ranked.push(dm);
  } else {
    const excessive = maxCountElement(chart.counts);
    const controller = CONTROLLED_BY[excessive]; // 克 excessive
    const drainer = GENERATES[excessive]; // excessive's output (drains it)
    if (missing.includes(controller)) ranked.push(controller);
    if (missing.includes(drainer)) ranked.push(drainer);
  }

  // Fill remaining candidates in deterministic order.
  for (const el of ELEMENTS) if (missing.includes(el) && !ranked.includes(el)) ranked.push(el);

  const favorable = applyOverride(ranked[0], dm, strength, missing);
  const nextStep = ranked.find((e) => e !== favorable) ?? null;
  return { favorable, nextStep };
}

export function classify(chart: Chart): BranchResult {
  const missing = missingElements(chart.counts);
  const missingCount = missing.length;
  const strength = dayMasterStrength(chart);

  // 4 missing → 専旺格 inversion: favour the chart's OWN dominant element.
  if (missingCount >= 4) {
    const dominant = maxCountElement(chart.counts);
    return {
      branch: 'inversion',
      missingCount: 4,
      missing,
      favorable: dominant,
      nextStep: null,
      strength,
      stoneRole: 'companion',
      inverted: true,
    };
  }

  // 0 missing → strengthen, don't heal.
  if (missingCount === 0) {
    let lowest = Infinity;
    for (const e of ELEMENTS) lowest = Math.min(lowest, chart.counts[e]);
    const lowestEls = ELEMENTS.filter((e) => chart.counts[e] === lowest);
    const dm = chart.dayMaster.element;
    const supporting = lowestEls.filter((e) => e === dm || e === GENERATED_BY[dm]);
    const favorable = firstByOrder(supporting.length ? supporting : lowestEls);
    return {
      branch: 'harmonious',
      missingCount: 0,
      missing,
      favorable,
      nextStep: null,
      strength,
      stoneRole: 'nurturing',
      inverted: false,
    };
  }

  // 1 missing → fill the single gap.
  if (missingCount === 1) {
    return {
      branch: 'one-missing',
      missingCount: 1,
      missing,
      favorable: missing[0],
      nextStep: null,
      strength,
      stoneRole: 'default',
      inverted: false,
    };
  }

  // 2 or 3 missing → 用神 tiebreak, one primary + next step.
  const { favorable, nextStep } = selectFavorable(chart, missing, strength);
  return {
    branch: missingCount === 2 ? 'two-missing' : 'three-missing',
    missingCount,
    missing,
    favorable,
    nextStep,
    strength,
    stoneRole: 'default',
    inverted: false,
  };
}
