/**
 * Bazi feature — Day Master archetype titles (§1.4 item 2).
 *
 * One archetype per Day Master stem (10). Title uses the definite article
 * ("The Nurturing Earth"); the subtitle is the stem itself + its English name
 * (e.g. "己土 · Yin Earth"). EN only this round (§1.10); ja/ko/zh re-coined
 * later (the JP proof: "The Nurturing Earth" → 「育てる大地」タイプ).
 *
 * 己 → "The Nurturing Earth" is LOCKED by the spec example.
 */

import type { Localized } from '../locale';

export const ARCHETYPE_TITLE: Record<string, Localized> = {
  '甲': { en: 'The Pioneering Tree' },
  '乙': { en: 'The Yielding Vine' },
  '丙': { en: 'The Radiant Sun' },
  '丁': { en: 'The Steady Flame' },
  '戊': { en: 'The Enduring Mountain' },
  '己': { en: 'The Nurturing Earth' }, // locked by spec
  '庚': { en: 'The Tempered Blade' },
  '辛': { en: 'The Refined Jewel' },
  '壬': { en: 'The Open Ocean' },
  '癸': { en: 'The Quiet Rain' },
};
