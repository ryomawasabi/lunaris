/**
 * Bazi feature — Guardian mapping (§1.5, extended to the nine sons).
 *
 * Each element now carries a YIN and a YANG guardian. The variant a chart gets
 * is COMPLEMENTARY to the Day Master's polarity (yin attracts yang — the son
 * that completes you): see `index.ts`. Water keeps a single son (Pixiu) shared
 * across both polarities, giving 9 guardians across 5 elements.
 *
 * ⚠️ The four NEW sons (Suanni / Pulao / Bixi / Bi'an), their element + polarity
 * placement, and ALL one-liners are DRAFTS pending Lucy's sign-off (§3.3). MVP
 * shows name + one-liner + a typographic crest only (full illustrations = v2).
 */

import type { ElementKey } from '../elements';
import { ELEMENT_KANJI } from '../elements';
import type { Localized } from '../locale';

export type Polarity = 'yin' | 'yang';

export interface Guardian {
  name: string;
  cjk: string;
  element: ElementKey;
  polarity: Polarity;
  oneLiner: Localized;
  crest: string;
}

// ─── The nine sons ───
const PIXIU: Guardian = {
  name: 'Pixiu', cjk: '貔貅', element: 'water', polarity: 'yang',
  oneLiner: { en: 'the one who swallows fortune and never lets it go' },
  crest: ELEMENT_KANJI.water,
};
const YAZI: Guardian = {
  name: 'Yazi', cjk: '睚眦', element: 'fire', polarity: 'yang',
  oneLiner: { en: 'the one who never took a single step back' },
  crest: ELEMENT_KANJI.fire,
};
const SUANNI: Guardian = {
  name: 'Suanni', cjk: '狻猊', element: 'fire', polarity: 'yin',
  oneLiner: { en: 'the one who watched the world through rising smoke' },
  crest: ELEMENT_KANJI.fire,
};
const CHAOFENG: Guardian = {
  name: 'Chaofeng', cjk: '嘲風', element: 'wood', polarity: 'yang',
  oneLiner: { en: 'the one who watched new horizons from the highest roofs' },
  crest: ELEMENT_KANJI.wood,
};
const PULAO: Guardian = {
  name: 'Pulao', cjk: '蒲牢', element: 'wood', polarity: 'yin',
  oneLiner: { en: 'the one whose voice carried farther than any step' },
  crest: ELEMENT_KANJI.wood,
};
const CHIWEN: Guardian = {
  name: 'Chiwen', cjk: '螭吻', element: 'earth', polarity: 'yang',
  oneLiner: { en: 'the one who stayed on the roof to guard the house' },
  crest: ELEMENT_KANJI.earth,
};
const BIXI: Guardian = {
  name: 'Bixi', cjk: '贔屭', element: 'earth', polarity: 'yin',
  oneLiner: { en: 'the one who carried what others could not lift' },
  crest: ELEMENT_KANJI.earth,
};
const QIUNIU: Guardian = {
  name: 'Qiuniu', cjk: '囚牛', element: 'metal', polarity: 'yang',
  oneLiner: { en: 'the one who moved hearts with music, not war' },
  crest: ELEMENT_KANJI.metal,
};
const BIAN: Guardian = {
  name: "Bi'an", cjk: '狴犴', element: 'metal', polarity: 'yin',
  oneLiner: { en: 'the one who stood for what was right, and would not move' },
  crest: ELEMENT_KANJI.metal,
};

/** element → { yin, yang } guardian. */
export const GUARDIANS: Record<ElementKey, Record<Polarity, Guardian>> = {
  water: { yang: PIXIU, yin: PIXIU },
  fire: { yang: YAZI, yin: SUANNI },
  wood: { yang: CHAOFENG, yin: PULAO },
  earth: { yang: CHIWEN, yin: BIXI },
  metal: { yang: QIUNIU, yin: BIAN },
};

/** Resolve the guardian for a favourable element and a chosen polarity. */
export function getGuardian(element: ElementKey, polarity: Polarity): Guardian {
  return GUARDIANS[element][polarity];
}
