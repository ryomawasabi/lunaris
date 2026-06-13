/**
 * Bazi feature — result template copy (§1.6).
 *
 * The full matrix is Day Master (10) × strong/weak (2) × favourable element (5)
 * = 100 authored blocks. They are composed at build time from authored
 * fragments by `scripts/gen-templates.mjs` into `templates.generated.ts`
 * (deterministic, NO LLM at runtime) and re-exported here. To change copy,
 * edit the fragments in the generator and re-run it.
 *
 * `personality` = the single italic serif sentence on the result page
 * (§1.4 item 5). `reading` = the body shown below it / emailed.
 *
 * ── GENERATION RULES (v2, tone-approved) ──────────────────────────────────
 * Structure: each `reading` is 3 sentences (golden example: 己 strong Wood):
 *   S1 — "you carry both X and Y" paired-opposites trait + ONE rotated
 *        observer clause (6 forms: A/B/C/D/E/F).
 *   S2 — the favourable element, with a rotated lead-in (P1 "quietly without" /
 *        P2 "reaches toward" / P3 "leaves unopened") and one "X rather than Y".
 *        When the favourable element IS the Day Master's own (Harmonious /
 *        専旺格 only) the missing framing is dropped for "more of your own ___".
 *   S3 — challenge framed as the COST of a named strength. Weak Day Masters
 *        carry a distinct "draws others out / makes others more themselves"
 *        character.
 * Same Day Master keeps a fixed metaphor world; only the favourable part (S2)
 * varies across its five element-siblings. Positive:challenge ≈ 70:30.
 *
 * Measured distribution across the 100 blocks:
 *   observer A20 B20 C15 D15 E15 F15 · missing P1×28 P2×28 P3×24 · own×20.
 */

import type { ElementKey } from '../elements';
import type { Localized } from '../locale';
import type { Polarity } from '../stems';
import { ARCHETYPE_TITLE, } from './archetypes';
import { ENERGY_LABEL } from '../elements';
import { GENERATED_TEMPLATES } from './templates.generated';

export interface TemplateBlock {
  /** Day Master stem character. */
  stem: string;
  strength: 'strong' | 'weak';
  favorable: ElementKey;
  personality: Localized;
  reading: Localized;
}

/** The full 100-block matrix (built by scripts/gen-templates.mjs). */
export const TEMPLATES: TemplateBlock[] = GENERATED_TEMPLATES;

// ─── Lookup & graceful fallback ───

const KEY = (stem: string, strength: string, fav: ElementKey) => `${stem}|${strength}|${fav}`;
const INDEX = new Map(TEMPLATES.map((t) => [KEY(t.stem, t.strength, t.favorable), t]));

export function getTemplate(
  stem: string,
  strength: 'strong' | 'weak',
  favorable: ElementKey,
): TemplateBlock | null {
  return INDEX.get(KEY(stem, strength, favorable)) ?? null;
}

/**
 * Fallback personality sentence — retained as a safety net only. With the full
 * 100-block matrix populated, every valid (Day Master × strength × favourable)
 * combination resolves to an authored block, so this should not normally fire.
 */
export function fallbackPersonality(
  stem: string,
  _polarity: Polarity,
  favorable: ElementKey,
): Localized {
  const archetype = (ARCHETYPE_TITLE[stem]?.en ?? 'your nature').replace(/^The /, '');
  const energy = ENERGY_LABEL[favorable].en.toLowerCase();
  return {
    en: `You move through the world as ${archetype.toLowerCase()} — and ${energy} is the note that completes you rather than the one you force.`,
  };
}
