/**
 * Bazi feature — calculation engine (§1.2).
 *
 * HARD REQUIREMENTS:
 *  - Deterministic. NO LLM at runtime.
 *  - lunar-javascript for calendar / solar-term conversion.
 *  - Month boundaries follow solar terms (節気), never lunar new year.
 *  - Late Zi hour (23:00–23:59): day pillar stays with the birth date; the hour
 *    stem derives from the NEXT day's stem — i.e. setSect(2) behaviour.
 *  - Unknown birth time → three-pillar reading (year / month / day).
 *  - Element counting = the visible 8 characters (stems + branches). Hidden
 *    stems (蔵干) are ignored in MVP.
 *
 * The engine takes LOCAL STANDARD-TIME components. DST normalisation happens
 * upstream in timezone.ts so this module stays purely about chart maths.
 */

import { Solar, LunarUtil } from 'lunar-javascript';
import {
  KANJI_TO_ELEMENT,
  emptyCounts,
  type ElementCounts,
  type ElementKey,
} from './elements';
import { STEMS, BRANCHES, type StemInfo } from './stems';

export interface Pillar {
  /** Two-character pillar, e.g. "己未". */
  ganzhi: string;
  /** Heavenly stem character. */
  stem: string;
  /** Earthly branch character. */
  branch: string;
  stemElement: ElementKey;
  branchElement: ElementKey;
}

export interface ChartInput {
  year: number;
  month: number; // 1–12
  day: number; // 1–31
  /** Local standard-time hour 0–23. Ignored when `knownTime` is false. */
  hour: number;
  minute: number;
  /** When false, the hour pillar is omitted (three-pillar reading). */
  knownTime: boolean;
}

export interface Chart {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  /** null when the birth time is unknown (three-pillar reading). */
  hour: Pillar | null;
  /** Day Master = day-pillar stem. */
  dayMaster: StemInfo;
  /** Counts over the VISIBLE characters (8 with time, 6 without). */
  counts: ElementCounts;
  /** True when birth fell in the late Zi hour (23:00–23:59). */
  lateZi: boolean;
}

function elementOfKanji(kanji: string): ElementKey {
  const el = KANJI_TO_ELEMENT[kanji];
  if (!el) throw new Error(`Unknown 五行 character: ${kanji}`);
  return el;
}

function buildPillar(ganzhi: string): Pillar {
  const stem = ganzhi.charAt(0);
  const branch = ganzhi.charAt(1);
  const stemEl = STEMS[stem]?.element ?? elementOfKanji(LunarUtil.WU_XING_GAN[stem]);
  const branchEl = BRANCHES[branch] ?? elementOfKanji(LunarUtil.WU_XING_ZHI[branch]);
  return {
    ganzhi,
    stem,
    branch,
    stemElement: stemEl,
    branchElement: branchEl,
  };
}

/**
 * Compute the Four Pillars chart from local standard-time components.
 */
export function computeChart(input: ChartInput): Chart {
  const { year, month, day, knownTime } = input;
  // For an unknown time we evaluate at local noon: this fixes the day pillar
  // unambiguously (no Zi-hour edge) and the hour pillar is then discarded.
  const hour = knownTime ? input.hour : 12;
  const minute = knownTime ? input.minute : 0;

  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const eightChar = solar.getLunar().getEightChar();
  // setSect(2): late-Zi day pillar stays with the birth date; hour stem from
  // the next day's stem. Harmless for all non-late-Zi times.
  eightChar.setSect(2);

  const yearP = buildPillar(eightChar.getYear());
  const monthP = buildPillar(eightChar.getMonth());
  const dayP = buildPillar(eightChar.getDay());
  const hourP = knownTime ? buildPillar(eightChar.getTime()) : null;

  const lateZi = knownTime && hour === 23;

  const dayMaster = STEMS[dayP.stem];
  if (!dayMaster) throw new Error(`Unknown Day Master stem: ${dayP.stem}`);

  const counts = emptyCounts();
  const visible: Pillar[] = hourP ? [yearP, monthP, dayP, hourP] : [yearP, monthP, dayP];
  for (const p of visible) {
    counts[p.stemElement] += 1;
    counts[p.branchElement] += 1;
  }

  return {
    year: yearP,
    month: monthP,
    day: dayP,
    hour: hourP,
    dayMaster,
    counts,
    lateZi,
  };
}
