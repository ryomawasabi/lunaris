# Bazi Quiz MVP — build notes

Built per `yyg-bazi-MVP-scope.md`. Scope respected: quiz funnel + result page only
(Option B — guardian name + one-liner + crest, no full story section). No changes to
the product DB / Supabase schema; the only new data surfaces are static TS files.

## Where it lives
- Route: **`/bazi`** (new — existing `/crystal-quiz` left untouched, per §3 decision).
- Engine + data: `src/lib/bazi/`
  - `engine.ts` — Four Pillars via `lunar-javascript`, solar-term months, late-Zi `setSect(2)`, unknown-time 3-pillar, visible-8 element count.
  - `timezone.ts` — city → IANA tz (`city-timezones`) + historical DST → local standard time (`luxon`). **Server-only.**
  - `branching.ts` — all 5 result branches + 用神/favourable selection + Day-Master strength.
  - `data/` — `guardians.ts`, `stones.ts`, `archetypes.ts`, `rarity.ts`, `tiebreak.ts`, `templates.ts`.
  - `index.ts` — composes the locale-resolved `BaziResult`.
- API: `src/app/api/bazi/{cities,calculate,subscribe}/route.ts`
- OG image: `src/app/bazi/og/route.tsx` (`next/og`, edge).
- UI: `src/app/bazi/page.tsx`, `src/components/bazi/{BaziQuiz,BaziResultView}.tsx`.
- Tokens/fonts: added (ADD-ONLY) to `tailwind.config.ts` (`bazi-*`, `element-*`, `font-serif-jp`) and `layout.tsx` (Noto Serif JP).

## Acceptance test — PASSING
`2001-10-23 23:30 Sydney` (AEST, pre-DST) → **辛巳 / 戊戌 / 己未 / 丙子**.
All 5 branch rules verified with synthetic charts (28/28 checks). NO LLM at runtime.

## Template copy — DONE (tone v2 approved)
Full **100-block matrix** generated and integrated: `scripts/gen-templates.mjs`
(authored fragments → build-time compose, no LLM at runtime) → `data/templates.generated.ts`
→ re-exported by `data/templates.ts`. Full text for review: `BAZI_TEMPLATES_ALL.md`.
Distribution: observer A20/B20/C15/D15/E15/F15 · missing P1×28/P2×28/P3×24/own×20.
Quotes verified curly, no straight/full-width in copy. To change copy, edit the
generator fragments and re-run it.

Still open:
- **Guardian one-liners** await Lucy's sign-off (§3.3).

## Post-MVP polish backlog
- **Observer-clause variety.** A few strong Day Masters currently share the exact
  observer phrase "become someone a room arranges itself around" (form A). Acceptable
  for MVP (each user sees only their own block); diversify the per-DM observer wording
  in a post-launch polish pass.

## Decisions captured (§3 open items)
1. CTA → recommended stone's product page (resolved live from the catalogue by `crystal_type`; falls back to `/products`).
2. Quiz lives at **new `/bazi`** (no 301 needed).
4. **zh locale split (zh-CN / zh-TW): still UNDECIDED.** Not built this round. The data layer already carries all four locale keys (`en/ja/ko/zh`); only `en` is populated. Resolve before the zh phase — it affects son names + 五行 terms.

## Flagged for review (engineering)
- **Day-Master strength** is an MVP heuristic (companions + resource across visible chars, +1 month-branch seasonal bonus, strong ≥ half). Documented in `branching.ts`.
- **用神 tiebreak** for 2-/3-missing is computed from classical 生/克 rules; `data/tiebreak.ts` is the static override surface for per-combo / per-locale corrections (Korean 사주 and Chinese audiences need native review per §1.10).

## Localization
English-only launch. Non-EN visitors see a non-blocking "available in English" notice at the quiz entry (no auto-switch). Phase-2 locales are authored copy, not string translation.

## Env
- `RESEND_API_KEY` / `RESEND_FROM_EMAIL` — optional; email capture no-ops gracefully if unset (never gates the reward).
