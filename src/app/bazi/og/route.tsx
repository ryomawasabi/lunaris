/**
 * Bazi feature — auto-generated OG / chart-card share image (§1.9).
 * Four pillars + archetype name + missing element + rarity badge.
 * This is the organic share loop, so it ships in MVP.
 */
import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

// Ink / jade / gold palette (§1.7)
const INK = '#15211C';
const RAISED = '#1C2B24';
const BORDER = '#2C3B33';
const GOLD = '#C9A86A';
const CREAM = '#F2EBDD';
const BODY = '#D8D2C4';
const MUTED = '#8A9389';

const ELEMENT_COLOR: Record<string, string> = {
  wood: '#7BAE6E', fire: '#D4604A', earth: '#D9A441', metal: '#C9C2B4', water: '#5A8FB8',
};

/** Fetch only the exact glyphs we render, keeping the font payload tiny. */
async function loadKanjiFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const uniq = Array.from(new Set(text.split(''))).join('');
    const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@600&text=${encodeURIComponent(uniq)}`;
    const css = await (await fetch(cssUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; baziog/1.0)' },
    })).text();
    const url = css.match(/src:\s*url\(([^)]+)\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const title = sp.get('t') || 'Your Bazi Chart';
  const subtitle = sp.get('s') || '';
  const pillars = (sp.get('p') || '').split('-').filter(Boolean);
  const favorable = sp.get('e') || '';
  const rarity = sp.get('r') || '';
  const accent = ELEMENT_COLOR[favorable] || GOLD;

  const glyphs = pillars.join('') + subtitle;
  const font = await loadKanjiFont(glyphs);

  return new ImageResponse(
    (
      <div style={{
        width: '1200px', height: '630px', display: 'flex', flexDirection: 'column',
        background: INK, padding: '64px 72px', position: 'relative',
        fontFamily: 'serif', color: CREAM,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: GOLD, fontSize: 22, letterSpacing: 6, textTransform: 'uppercase' }}>
            Yinyang Guardian
          </div>
          {rarity ? (
            <div style={{ color: accent, fontSize: 22, border: `1px solid ${BORDER}`, padding: '6px 16px', borderRadius: 999 }}>
              {rarity}
            </div>
          ) : <div />}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 28 }}>
          <div style={{ fontSize: 72, color: CREAM, lineHeight: 1.05 }}>{title}</div>
          <div style={{ fontSize: 30, color: MUTED, marginTop: 10 }}>{subtitle}</div>
        </div>

        <div style={{ display: 'flex', gap: 20, marginTop: 'auto' }}>
          {['HOUR', 'DAY', 'MONTH', 'YEAR'].map((label, i) => {
            const gz = pillars[i] || '??';
            const isDay = label === 'DAY';
            return (
              <div key={label} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                width: 168, height: 200, borderRadius: 14,
                background: RAISED, border: `1px solid ${isDay ? GOLD : BORDER}`,
                justifyContent: 'center',
              }}>
                <div style={{ fontSize: 18, color: isDay ? GOLD : MUTED, letterSpacing: 3, marginBottom: 8 }}>
                  {isDay ? 'YOU' : label}
                </div>
                <div style={{ fontSize: 72, color: CREAM }}>{gz}</div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 28, fontSize: 24, color: BODY, display: 'flex' }}>
          {favorable ? `Guided toward ${favorable.charAt(0).toUpperCase() + favorable.slice(1)}` : 'Discover your chart'}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: font ? [{ name: 'Noto Serif JP', data: font, style: 'normal', weight: 600 }] : [],
    },
  );
}
