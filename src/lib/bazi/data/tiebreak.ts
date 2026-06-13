/**
 * Bazi feature — 用神 tiebreak lookup table (§1.3).
 *
 * Per spec, tiebreak combinations ship as a STATIC, human-reviewable table in
 * data/ rather than as opaque runtime logic. `selectFavorable()` in
 * branching.ts computes a default from the classical 五行 rules; any entry in
 * this table OVERRIDES that default for a specific combination, so a reviewer
 * (or a Korean/Chinese 四柱 practitioner in a later locale phase) can correct a
 * single case without touching engine code.
 *
 * Key format: `${dayMasterElement}|${strong|weak}|${sortedMissingElements}`
 *   e.g. "earth|weak|fire,metal" → 'fire'
 *
 * NOTE for review: the default selection rule and the Day-Master strength
 * heuristic are documented in branching.ts. 用神 selection is school-dependent
 * (the ko/zh locales explicitly need native review, §1.10) — this table is the
 * intended override surface for those corrections.
 */

import type { ElementKey } from '../elements';

export const TIEBREAK_OVERRIDES: Record<string, ElementKey> = {
  // (empty — defaults from branching.ts apply until a reviewer pins a combo)
};

export function tiebreakKey(
  dayMasterElement: ElementKey,
  strength: 'strong' | 'weak',
  missing: ElementKey[],
): string {
  return `${dayMasterElement}|${strength}|${[...missing].sort().join(',')}`;
}
