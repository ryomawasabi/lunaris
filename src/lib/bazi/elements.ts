/**
 * Bazi feature — Five Elements (五行) constants & relationships.
 *
 * Element keys are the canonical internal identifiers. The CJK character,
 * English label, "energy" name (§1.4 item 6) and design token colour (§1.7)
 * all hang off these keys.
 */

import type { Localized } from './locale';

export type ElementKey = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export const ELEMENTS: ElementKey[] = ['wood', 'fire', 'earth', 'metal', 'water'];

/** CJK character for each element (shown in tiles / connoisseur copy). */
export const ELEMENT_KANJI: Record<ElementKey, string> = {
  wood: '木',
  fire: '火',
  earth: '土',
  metal: '金',
  water: '水',
};

/** Map the raw 五行 char emitted by lunar-javascript → internal key. */
export const KANJI_TO_ELEMENT: Record<string, ElementKey> = {
  '木': 'wood',
  '火': 'fire',
  '土': 'earth',
  '金': 'metal',
  '水': 'water',
};

/** §1.7 element colours. */
export const ELEMENT_COLOR: Record<ElementKey, string> = {
  wood: '#7BAE6E',
  fire: '#D4604A',
  earth: '#D9A441',
  metal: '#C9C2B4',
  water: '#5A8FB8',
};

/** English element label. */
export const ELEMENT_LABEL: Record<ElementKey, Localized> = {
  wood: { en: 'Wood' },
  fire: { en: 'Fire' },
  earth: { en: 'Earth' },
  metal: { en: 'Metal' },
  water: { en: 'Water' },
};

/** "Five Energies" display name per element (§1.4 item 6). */
export const ENERGY_LABEL: Record<ElementKey, Localized> = {
  wood: { en: 'Growth' },
  fire: { en: 'Passion' },
  earth: { en: 'Stability' },
  metal: { en: 'Expression' },
  water: { en: 'Flow' },
};

// ─── Classical 五行 relationships ───

/** Generating cycle (生): X nourishes GENERATES[X]. */
export const GENERATES: Record<ElementKey, ElementKey> = {
  wood: 'fire',
  fire: 'earth',
  earth: 'metal',
  metal: 'water',
  water: 'wood',
};

/** The element that generates X (its "resource" / 印). */
export const GENERATED_BY: Record<ElementKey, ElementKey> = {
  fire: 'wood',
  earth: 'fire',
  metal: 'earth',
  water: 'metal',
  wood: 'water',
};

/** Controlling cycle (克): X subdues CONTROLS[X]. */
export const CONTROLS: Record<ElementKey, ElementKey> = {
  wood: 'earth',
  earth: 'water',
  water: 'fire',
  fire: 'metal',
  metal: 'wood',
};

/** The element that controls X (X's "officer" / 官 — what restrains it). */
export const CONTROLLED_BY: Record<ElementKey, ElementKey> = {
  earth: 'wood',
  water: 'earth',
  fire: 'water',
  metal: 'fire',
  wood: 'metal',
};

/** Element counts across the visible 8 characters. */
export type ElementCounts = Record<ElementKey, number>;

export function emptyCounts(): ElementCounts {
  return { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
}
