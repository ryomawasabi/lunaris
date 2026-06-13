/**
 * Bazi feature — result composer.
 *
 * Turns a computed Chart + branch classification into the fully locale-resolved
 * BaziResult the client renders. Pure (no I/O), so it is safe to unit-test and
 * to call from the server route after timezone resolution.
 */

import {
  ELEMENT_COLOR,
  ELEMENT_KANJI,
  ELEMENT_LABEL,
  ENERGY_LABEL,
  ELEMENTS,
  type ElementKey,
} from './elements';
import type { Chart, Pillar } from './engine';
import { classify, type BranchResult } from './branching';
import { loc, type Locale } from './locale';
import { ARCHETYPE_TITLE } from './data/archetypes';
import { GUARDIANS } from './data/guardians';
import { STONES, STONE_ROLE } from './data/stones';
import { RARITY } from './data/rarity';
import { getTemplate, fallbackPersonality } from './data/templates';
import type {
  BaziResult,
  EnergyStatus,
  EnergyView,
  PillarView,
  CalloutView,
} from './types';

export { computeChart } from './engine';
export { classify } from './branching';
export type { Chart } from './engine';
export type { BaziResult } from './types';

function statusFor(count: number): EnergyStatus {
  if (count === 0) return 'Missing';
  if (count === 1) return 'Low';
  if (count === 2) return 'Balanced';
  if (count === 3) return 'Strong';
  return 'Overflowing';
}

function pillarView(
  p: Pillar | null,
  position: PillarView['position'],
  locale: Locale,
  known = true,
): PillarView {
  if (!p || !known) {
    return {
      position,
      tag: null,
      known: false,
      ganzhi: '',
      stemChar: '?',
      stemLabel: 'unlock with your exact time',
      branchChar: '',
      branchLabel: '',
      stemColor: '#2C3B33',
      branchColor: '#2C3B33',
    };
  }
  return {
    position,
    tag: position === 'DAY' ? 'YOU' : null,
    known: true,
    ganzhi: p.ganzhi,
    stemChar: p.stem,
    stemLabel: loc(ELEMENT_LABEL[p.stemElement], locale),
    branchChar: p.branch,
    branchLabel: loc(ELEMENT_LABEL[p.branchElement], locale),
    stemColor: ELEMENT_COLOR[p.stemElement],
    branchColor: ELEMENT_COLOR[p.branchElement],
  };
}

function buildEnergies(chart: Chart, locale: Locale): EnergyView[] {
  const maxCount = Math.max(1, ...ELEMENTS.map((e) => chart.counts[e]));
  // Display order mirrors the §1.4 item-6 listing: Stability/Passion/Expression/Flow/Growth
  const order: ElementKey[] = ['earth', 'fire', 'metal', 'water', 'wood'];
  return order.map((element) => {
    const count = chart.counts[element];
    return {
      element,
      kanji: ELEMENT_KANJI[element],
      label: loc(ENERGY_LABEL[element], locale),
      elementLabel: loc(ELEMENT_LABEL[element], locale),
      color: ELEMENT_COLOR[element],
      count,
      status: statusFor(count),
      percent: Math.round((count / maxCount) * 100),
    };
  });
}

function buildCallout(chart: Chart, branch: BranchResult, locale: Locale): CalloutView {
  const favLabel = loc(ELEMENT_LABEL[branch.favorable], locale);
  if (branch.inverted) {
    return {
      kind: 'inversion',
      title: `An all-${favLabel} chart`,
      body: `Your chart is built almost entirely of ${favLabel}. A nature like this is never balanced — only amplified. Rather than filling a gap, your stone leans into the one force you already are.`,
    };
  }
  if (branch.branch === 'harmonious') {
    return {
      kind: 'harmonious',
      title: 'A naturally balanced chart',
      body: `All five energies are present in you — about one chart in three. There is nothing to heal here, only something to strengthen: ${favLabel} is the energy worth feeding so your balance becomes a force, not just a calm.`,
    };
  }
  const nextLabel = branch.nextStep ? loc(ELEMENT_LABEL[branch.nextStep], locale) : null;
  const nextLine = nextLabel
    ? ` ${nextLabel} is the natural next step once ${favLabel} has found its place.`
    : '';
  return {
    kind: 'missing',
    title: `Your missing element: ${favLabel}`,
    body: `${favLabel} is the energy your chart is quietly without — and the one that completes it.${nextLine}`,
  };
}

/** Four pillars in display order (HOUR, DAY, MONTH, YEAR). Shared by the
 *  full result and the live input preview. */
export function pillarViews(chart: Chart, locale: Locale = 'en'): PillarView[] {
  return [
    pillarView(chart.hour, 'HOUR', locale, chart.hour !== null),
    pillarView(chart.day, 'DAY', locale),
    pillarView(chart.month, 'MONTH', locale),
    pillarView(chart.year, 'YEAR', locale),
  ];
}

export interface ComposeContext {
  birthLine: string;
  shareImageUrl: string;
  lateZiFootnote?: string | null;
}

export function composeResult(
  chart: Chart,
  ctx: ComposeContext,
  locale: Locale = 'en',
): BaziResult {
  const branch = classify(chart);
  const dm = chart.dayMaster;

  const template = getTemplate(dm.char, branch.strength, branch.favorable);
  const personality = template
    ? loc(template.personality, locale)
    : loc(fallbackPersonality(dm.char, dm.polarity, branch.favorable), locale);
  const reading = template ? loc(template.reading, locale) : null;

  const guardian = GUARDIANS[branch.favorable];
  const stone = STONES[branch.favorable];
  const stoneRole =
    branch.stoneRole === 'nurturing'
      ? STONE_ROLE.nurturing
      : branch.stoneRole === 'companion'
        ? STONE_ROLE.companion
        : STONE_ROLE.default;

  const rarity = RARITY[branch.missingCount];

  const pillars: PillarView[] = pillarViews(chart, locale);

  // Guardian preamble adapts to the branch so a 0-missing (Harmonious) or
  // 4-missing (専旺格 inversion) chart never reads as if it were "missing" the
  // element. For Harmonious the guardian is framed as the guide to the element
  // worth GROWING; for inversion, the keeper of the element you already ARE.
  const favLabel = loc(ELEMENT_LABEL[branch.favorable], locale);
  const guardianOneLiner = loc(guardian.oneLiner, locale);
  const guardianLine =
    branch.branch === 'harmonious'
      ? `To grow your ${favLabel}: ${guardian.name} — ${guardianOneLiner}.`
      : branch.inverted
        ? `The keeper of your ${favLabel}: ${guardian.name} — ${guardianOneLiner}.`
        : `Your guardian: ${guardian.name} — ${guardianOneLiner}.`;

  return {
    locale,
    birthLine: ctx.birthLine,
    archetypeTitle: loc(ARCHETYPE_TITLE[dm.char], locale),
    dayMasterSubtitle: `${dm.char}${ELEMENT_KANJI[dm.element]} · ${dm.englishName}`,
    rarity: rarity ? { mark: rarity.mark, label: loc(rarity.label, locale) } : null,
    pillars,
    personality,
    reading,
    energies: buildEnergies(chart, locale),
    callout: buildCallout(chart, branch, locale),
    guardian: {
      name: guardian.name,
      cjk: guardian.cjk,
      crest: guardian.crest,
      line: guardianLine,
    },
    stone: {
      roleLabel: loc(stoneRole, locale),
      category: loc(stone.category, locale),
      description: loc(stone.description, locale),
      productHref: '/products', // enriched by the calculate route
      crystalTypes: stone.crystalTypes,
    },
    nextStep: branch.nextStep
      ? {
          elementLabel: loc(ELEMENT_LABEL[branch.nextStep], locale),
          stoneCategory: loc(STONES[branch.nextStep].category, locale),
        }
      : null,
    branch: branch.branch,
    missingCount: branch.missingCount,
    favorable: branch.favorable,
    lateZiFootnote: ctx.lateZiFootnote ?? null,
    templated: template !== null,
    shareImageUrl: ctx.shareImageUrl,
  };
}
