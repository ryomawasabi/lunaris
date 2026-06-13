/**
 * Bazi feature — serializable result shape returned by /api/bazi/calculate.
 *
 * Everything is RESOLVED TO A SINGLE LOCALE server-side so the client never
 * needs the data/engine modules (keeps lunar-javascript, luxon and the city
 * dataset out of the browser bundle).
 */

import type { Locale } from './locale';
import type { ElementKey } from './elements';
import type { BranchType } from './branching';

export interface PillarView {
  position: 'YEAR' | 'MONTH' | 'DAY' | 'HOUR';
  /** "YOU" on the Day pillar, else null. */
  tag: string | null;
  /** false → mystery tile (unknown birth time). */
  known: boolean;
  ganzhi: string;
  stemChar: string;
  stemLabel: string; // e.g. "Yin Earth"
  branchChar: string;
  branchLabel: string; // element label of the branch, e.g. "Earth"
  stemColor: string;
  branchColor: string;
}

export type EnergyStatus = 'Overflowing' | 'Strong' | 'Balanced' | 'Low' | 'Missing';

export interface EnergyView {
  element: ElementKey;
  kanji: string;
  label: string; // energy name: Stability / Passion / ...
  elementLabel: string; // Wood / Fire / ...
  color: string;
  count: number;
  status: EnergyStatus;
  /** 0–100 for the bar width. */
  percent: number;
}

export interface CalloutView {
  kind: 'missing' | 'harmonious' | 'inversion';
  title: string;
  body: string;
}

export interface GuardianView {
  name: string;
  cjk: string;
  crest: string;
  /** Full line: "Your guardian: Chaofeng — the one who…". */
  line: string;
}

export interface StoneView {
  roleLabel: string; // "your stone" / "your nurturing stone" / "your companion stone"
  category: string;
  description: string;
  productHref: string;
  /** Non-display: crystal_type values for product resolution. */
  crystalTypes: string[];
}

export interface NextStepView {
  elementLabel: string;
  stoneCategory: string;
}

export interface BaziResult {
  locale: Locale;
  birthLine: string;
  archetypeTitle: string;
  dayMasterSubtitle: string; // "己土 · Yin Earth"
  rarity: { mark: string; label: string } | null;
  pillars: PillarView[]; // display order: HOUR, DAY, MONTH, YEAR
  personality: string;
  reading: string | null; // authored body; null until a template is reviewed
  energies: EnergyView[];
  callout: CalloutView;
  guardian: GuardianView;
  stone: StoneView;
  nextStep: NextStepView | null;
  branch: BranchType;
  missingCount: number;
  favorable: ElementKey;
  lateZiFootnote: string | null;
  /** Whether an authored (reviewed) template backed the copy. */
  templated: boolean;
  shareImageUrl: string;
}
