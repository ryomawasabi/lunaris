/**
 * Bazi feature — Stone inventory table (§1.5, §1.7).
 *
 * Stones are CATEGORIES resolved from this table, never hard-coded in result
 * templates. Swapping a supplier or product must only touch this file, never
 * copy. `crystalTypes` are matched (case-insensitive) against the existing
 * product catalogue `crystal_type` field to deep-link the CTA to a real
 * product page (§3 item 1 → "推奨ストーンの商品ページ").
 *
 * The stone "role name" changes per branch (§1.3):
 *   - default / missing      → the element's stone
 *   - 0-missing (harmonious) → "nurturing stone"
 *   - 4-missing (専旺格)      → "companion stone"
 */

import type { ElementKey } from '../elements';
import type { Localized } from '../locale';

export interface Stone {
  category: Localized; // human-facing category name
  /** crystal_type values to match in the product catalogue (priority order). */
  crystalTypes: string[];
  /** 1–2 sentence description (§1.4 item 9). */
  description: Localized;
}

export const STONES: Record<ElementKey, Stone> = {
  water: {
    category: { en: 'Obsidian' },
    crystalTypes: ['Black Obsidian', 'Obsidian', 'Smoky Quartz'],
    description: {
      en: 'A grounding obsidian that holds what it gathers — depth, memory, and the quiet pull of moving water. Worn close it steadies a restless mind and keeps your own counsel: the piece you reach for when the world asks too much.',
    },
  },
  fire: {
    category: { en: 'Carnelian' },
    crystalTypes: ['Carnelian', 'Red Agate', 'Red Jasper'],
    description: {
      en: 'A warm carnelian of nerve and momentum that keeps the spark lit when the moment asks you to move. Wear it on the days you need to begin — courage you can feel against the skin.',
    },
  },
  wood: {
    category: { en: 'Green Aventurine' },
    crystalTypes: ['Green Aventurine', 'Aventurine', 'Green Fluorite'],
    description: {
      en: 'A fresh green aventurine of opening and growth — the feeling of a new horizon seen from somewhere high. Kept near, it turns hesitation into a first step: a quiet talisman for everything still ahead of you.',
    },
  },
  earth: {
    category: { en: "Citrine & Tiger's Eye" },
    crystalTypes: ['Citrine', "Tiger's Eye", 'Tigers Eye', 'Tiger Eye'],
    description: {
      en: 'Steadying golden stones that hold the centre — warmth you can stand on when everything else shifts. Worn together they carry the calm confidence of someone the whole room quietly leans on.',
    },
  },
  metal: {
    category: { en: 'Clear Quartz & Moonstone' },
    // Specific names only — a bare 'Quartz' token over-matched Smoky/Rose Quartz.
    crystalTypes: ['Clear Quartz', 'Moonstone'],
    description: {
      en: 'Clear, resonant stones of expression and clarity that carry a true note without ever raising their voice. They are for the days you want to be heard — and remembered.',
    },
  },
};

/** The stone "role" label per result branch. */
export const STONE_ROLE = {
  default: { en: 'your stone' } as Localized,
  nurturing: { en: 'your nurturing stone' } as Localized,
  companion: { en: 'your companion stone' } as Localized,
};
