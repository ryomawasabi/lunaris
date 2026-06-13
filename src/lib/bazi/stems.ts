/**
 * Bazi feature — Heavenly Stems (天干) & Earthly Branches (地支).
 *
 * The Day Master is the day-pillar stem; its element + yin/yang drive the
 * archetype title and the strong/weak determination.
 */

import type { ElementKey } from './elements';

export type Polarity = 'yang' | 'yin';

export interface StemInfo {
  char: string;
  element: ElementKey;
  polarity: Polarity;
  /** Pinyin-ish romanisation for the Day Master subtitle, e.g. "Yin Earth". */
  englishName: string;
}

/** Ten Heavenly Stems in canonical order. */
export const STEMS: Record<string, StemInfo> = {
  '甲': { char: '甲', element: 'wood', polarity: 'yang', englishName: 'Yang Wood' },
  '乙': { char: '乙', element: 'wood', polarity: 'yin', englishName: 'Yin Wood' },
  '丙': { char: '丙', element: 'fire', polarity: 'yang', englishName: 'Yang Fire' },
  '丁': { char: '丁', element: 'fire', polarity: 'yin', englishName: 'Yin Fire' },
  '戊': { char: '戊', element: 'earth', polarity: 'yang', englishName: 'Yang Earth' },
  '己': { char: '己', element: 'earth', polarity: 'yin', englishName: 'Yin Earth' },
  '庚': { char: '庚', element: 'metal', polarity: 'yang', englishName: 'Yang Metal' },
  '辛': { char: '辛', element: 'metal', polarity: 'yin', englishName: 'Yin Metal' },
  '壬': { char: '壬', element: 'water', polarity: 'yang', englishName: 'Yang Water' },
  '癸': { char: '癸', element: 'water', polarity: 'yin', englishName: 'Yin Water' },
};

/** Twelve Earthly Branches → element of the branch itself (visible char only;
 *  hidden stems / 蔵干 are intentionally ignored in MVP, §1.2). */
export const BRANCHES: Record<string, ElementKey> = {
  '子': 'water',
  '丑': 'earth',
  '寅': 'wood',
  '卯': 'wood',
  '辰': 'earth',
  '巳': 'fire',
  '午': 'fire',
  '未': 'earth',
  '申': 'metal',
  '酉': 'metal',
  '戌': 'earth',
  '亥': 'water',
};

export function stemInfo(char: string): StemInfo | undefined {
  return STEMS[char];
}
