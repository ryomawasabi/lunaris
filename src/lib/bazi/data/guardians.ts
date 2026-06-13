/**
 * Bazi feature — Guardian mapping (§1.5).
 *
 * The launch FIVE sons, one per element. MVP shows name + one-liner + a
 * typographic crest mark only — NOT the full three-beat story (that is v2).
 * No emoji in production; the crest is a simple line mark / glyph placeholder.
 *
 * One-liners are pending Lucy's sign-off (§3 item 3).
 */

import type { ElementKey } from '../elements';
import type { Localized } from '../locale';

export interface Guardian {
  /** Romanised name used in copy, e.g. "Chaofeng". */
  name: string;
  /** CJK name, e.g. "嘲風". */
  cjk: string;
  element: ElementKey;
  /** Single sentence linking the son to the element (§1.4 item 8). */
  oneLiner: Localized;
  /** Typographic crest glyph placeholder (v2 = full illustration). */
  crest: string;
}

export const GUARDIANS: Record<ElementKey, Guardian> = {
  water: {
    name: 'Pixiu',
    cjk: '貔貅',
    element: 'water',
    oneLiner: { en: 'the one who swallows fortune and never lets it go' },
    crest: '水',
  },
  fire: {
    name: 'Yazi',
    cjk: '睚眦',
    element: 'fire',
    oneLiner: { en: 'the one who never took a single step back' },
    crest: '火',
  },
  wood: {
    name: 'Chaofeng',
    cjk: '嘲風',
    element: 'wood',
    oneLiner: { en: 'the one who watched new horizons from the highest roofs' },
    crest: '木',
  },
  earth: {
    name: 'Chiwen',
    cjk: '螭吻',
    element: 'earth',
    oneLiner: { en: 'the one who stayed on the roof to guard the house' },
    crest: '土',
  },
  metal: {
    name: 'Qiuniu',
    cjk: '囚牛',
    element: 'metal',
    oneLiner: { en: 'the one who moved hearts with music, not war' },
    crest: '金',
  },
};
