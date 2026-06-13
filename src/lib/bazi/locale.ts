/**
 * Bazi feature — locale layer (§1.10)
 *
 * The live site supports four locales. The Bazi quiz LAUNCHES IN ENGLISH ONLY,
 * but every piece of feature data carries all four locale keys from day one so
 * adding ja/ko/zh later is a copy-authoring pass, not a refactor.
 *
 * Rule: only `en` is required/populated this round. No engine code may assume
 * English — all human-facing strings resolve through `loc()`.
 */

import type { Locale } from '@/lib/i18n';

export type { Locale };

/**
 * A localized string. `en` is mandatory; ja/ko/zh are optional and added in
 * later phases (per-locale authored copy, NOT machine translation).
 */
export type Localized = { en: string } & Partial<Record<Locale, string>>;

/** Resolve a localized value for a locale, falling back to English. */
export function loc(value: Localized, locale: Locale): string {
  return value[locale] ?? value.en;
}

/** Convenience: build an English-only localized value (other locales TBD). */
export function en(text: string): Localized {
  return { en: text };
}
