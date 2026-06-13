/**
 * Bazi feature — rarity badges (§1.3).
 *
 * Frequencies are MEASURED (n = 22,320). Wording must match the measured
 * frequency — a 2-missing chart is "uncommon", never "extremely rare" (§1.6.5).
 */

import type { Localized } from '../locale';

export interface Rarity {
  /** Glyph mark shown before the label. */
  mark: string;
  label: Localized;
  /** Measured share of the population (for reference / OG copy). */
  frequency: string;
}

/** Keyed by number of missing elements. `1` deliberately has no badge. */
export const RARITY: Record<number, Rarity | null> = {
  1: null,
  0: { mark: '◎', label: { en: 'Harmonious — about 1 in 3' }, frequency: '30.6%' },
  2: { mark: '◆', label: { en: 'Uncommon — about 1 in 6' }, frequency: '16.0%' },
  3: { mark: '◆', label: { en: 'Exceptional — fewer than 1 in 100' }, frequency: '0.8%' },
  4: { mark: '★', label: { en: 'Legendary — one in tens of thousands' }, frequency: '<0.01%' },
};
