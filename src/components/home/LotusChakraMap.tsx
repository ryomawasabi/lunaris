'use client';

import { useState, useRef, useCallback } from 'react';

const SVG_SIZE = 520;
const CX = SVG_SIZE / 2;
const CY = SVG_SIZE / 2;

const PETAL_R_OPEN = 190;
const PETAL_R_BUD = 55;
const PETAL_W_OPEN = 68;
const PETAL_W_BUD = 18;

const chakras = [
  { name: 'Crown', nameJa: 'クラウン', color: '#B8A0D8', stones: ['アメジスト', 'クリアクォーツ'], desc: '宇宙意識・悟り・スピリチュアルな覚醒' },
  { name: 'Third Eye', nameJa: '第三の目', color: '#7B8EC8', stones: ['ラピスラズリ', 'ソーダライト'], desc: '直感・洞察力・内なるビジョン' },
  { name: 'Throat', nameJa: 'スロート', color: '#6AB8D0', stones: ['アクアマリン', 'ターコイズ'], desc: 'コミュニケーション・自己表現・真実' },
  { name: 'Heart', nameJa: 'ハート', color: '#6CC88C', stones: ['ローズクォーツ', 'グリーンアベンチュリン'], desc: '愛・共感・癒し・調和' },
  { name: 'Solar Plexus', nameJa: 'ソーラー', color: '#E8D060', stones: ['シトリン', 'タイガーアイ'], desc: '自信・意志力・個人のパワー' },
  { name: 'Sacral', nameJa: 'サクラル', color: '#E8A060', stones: ['カーネリアン', 'オレンジカルサイト'], desc: '創造性・感情・情熱' },
  { name: 'Root', nameJa: 'ルート', color: '#D06868', stones: ['ガーネット', 'レッドジャスパー'], desc: '安定・グラウンディング・安心感' },
];

const angles = [-90, -38.6, 12.9, 64.3, 115.7, 167.1, 218.6];

export default function LotusChakraMap() {
  const [activeChakra, setActiveChakra] = useState<number | null>(null);
  const [bloomed, setBloomed] = useState(false);
  const bloomTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const curR = bloomed ? PETAL_R_OPEN : PETAL_R_BUD;
  const curW = bloomed ? PETAL_W_OPEN : PETAL_W_BUD;

  const petalPath = useCallback((angleDeg: number, r: number, w: number, active: boolean, isBloomed: boolean) => {
    const a = (angleDeg * Math.PI) / 180;
    const tipX = CX + r * Math.cos(a);
    const tipY = CY + r * Math.sin(a);
    const perpA = a + Math.PI / 2;
    const baseOffset = isBloomed ? (active ? 30 : 24) : 10;
    const bx1 = CX + baseOffset * Math.cos(perpA);
    const by1 = CY + baseOffset * Math.sin(perpA);
    const bx2 = CX - baseOffset * Math.cos(perpA);
    const by2 = CY - baseOffset * Math.sin(perpA);
    const ctrlDist = r * 0.55;
    const widthMul = active ? w * 1.15 : w;
    const c1x = CX + ctrlDist * Math.cos(a) + widthMul * Math.cos(perpA);
    const c1y = CY + ctrlDist * Math.sin(a) + widthMul * Math.sin(perpA);
    const c2x = CX + ctrlDist * Math.cos(a) - widthMul * Math.cos(perpA);
    const c2y = CY + ctrlDist * Math.sin(a) - widthMul * Math.sin(perpA);
    return `M ${bx1} ${by1} Q ${c1x} ${c1y} ${tipX} ${tipY} Q ${c2x} ${c2y} ${bx2} ${by2} Z`;
  }, []);

  const tipPos = (i: number) => {
    const a = (angles[i] * Math.PI) / 180;
    return { x: CX + (PETAL_R_OPEN + 16) * Math.cos(a), y: CY + (PETAL_R_OPEN + 16) * Math.sin(a) };
  };

  const handleAreaEnter = () => {
    if (bloomTimer.current) clearTimeout(bloomTimer.current);
    setBloomed(true);
  };

  const handleAreaLeave = () => {
    bloomTimer.current = setTimeout(() => {
      setBloomed(false);
      setActiveChakra(null);
    }, 400);
  };

  const lotusStyles = `
    @keyframes lotusBreath {
      0%, 100% { opacity: 0.18; }
      50% { opacity: 0.32; }
    }
    @keyframes lotusGlowPulse {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 0.8; }
    }
    @keyframes budPulse {
      0%, 100% { transform: scale(1); opacity: 0.6; }
      50% { transform: scale(1.08); opacity: 0.9; }
    }
    @keyframes petalFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }
  `;

  return (
    <section className="py-20 md:py-28 px-4 bg-cream relative overflow-hidden">
      <style>{lotusStyles}</style>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold mb-4">Energy Guide</p>
          <h2 className="font-serif text-3xl md:text-5xl text-dark font-light">Chakra × Crystal Map</h2>
          <div className="h-px w-16 mx-auto mt-5" style={{ background: 'linear-gradient(90deg, transparent, #5A8EAE, transparent)' }} />
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center justify-center">
          {/* Lotus Mandala */}
          <div
            onMouseEnter={handleAreaEnter}
            onMouseLeave={handleAreaLeave}
            style={{ position: 'relative', width: SVG_SIZE, height: SVG_SIZE, flexShrink: 0, cursor: bloomed ? 'default' : 'pointer' }}
          >
            {/* Bud hint */}
            <div style={{
              position: 'absolute', left: '50%', bottom: 30, transform: 'translateX(-50%)',
              whiteSpace: 'nowrap', textAlign: 'center',
              opacity: bloomed ? 0 : 0.6, transition: 'opacity 0.6s ease', pointerEvents: 'none', zIndex: 5,
            }}>
              <p className="font-sans text-xs text-warm tracking-widest uppercase">Hover to Bloom</p>
            </div>

            <svg width={SVG_SIZE} height={SVG_SIZE} viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} style={{ position: 'absolute', top: 0, left: 0 }}>
              <defs>
                {chakras.map((ch, i) => (
                  <linearGradient key={`pg-${i}`} id={`lpg${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={ch.color} stopOpacity="0.05" />
                    <stop offset="50%" stopColor={ch.color} stopOpacity={activeChakra === i ? '0.35' : bloomed ? '0.12' : '0.25'} />
                    <stop offset="100%" stopColor={ch.color} stopOpacity="0.05" />
                  </linearGradient>
                ))}
                {chakras.map((ch, i) => (
                  <radialGradient key={`rg-${i}`} id={`lrg${i}`}>
                    <stop offset="0%" stopColor={ch.color} stopOpacity="0.6" />
                    <stop offset="100%" stopColor={ch.color} stopOpacity="0" />
                  </radialGradient>
                ))}
                <radialGradient id="lcg">
                  <stop offset="0%" stopColor="#5A8EAE" stopOpacity="0.25" />
                  <stop offset="60%" stopColor="#5A8EAE" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#5A8EAE" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="lbg">
                  <stop offset="0%" stopColor="#5A8EAE" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#8BB8D6" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#5A8EAE" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Decorative rings (bloom only) */}
              {[60, 110, 160, 210].map((r, i) => (
                <circle key={`ring-${i}`} cx={CX} cy={CY} r={r} fill="none" stroke="#5A8EAE" strokeWidth="0.4"
                  opacity={bloomed ? (0.12 - i * 0.02) : 0} strokeDasharray="2 8"
                  style={{ transition: 'opacity 0.8s ease', animation: bloomed ? `lotusBreath ${10 + i * 3}s ease-in-out infinite` : 'none', animationDelay: `${i}s` }} />
              ))}

              {/* Bud glow */}
              <circle cx={CX} cy={CY} r={bloomed ? 48 : 70} fill="url(#lbg)"
                opacity={bloomed ? 0 : 1}
                style={{ transition: 'all 0.8s ease', animation: !bloomed ? 'budPulse 3s ease-in-out infinite' : 'none' }} />

              {/* Petals */}
              {chakras.map((ch, i) => {
                const isActive = activeChakra === i && bloomed;
                return (
                  <path key={`petal-${i}`}
                    d={petalPath(angles[i], curR, curW, isActive, bloomed)}
                    fill={`url(#lpg${i})`}
                    stroke={ch.color}
                    strokeWidth={isActive ? 1.5 : bloomed ? 0.6 : 1}
                    opacity={isActive ? 1 : bloomed ? 0.7 : 0.85}
                    style={{
                      transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      cursor: bloomed ? 'pointer' : 'default',
                      animation: bloomed && !isActive ? `petalFloat ${6 + i}s ease-in-out infinite` : 'none',
                      animationDelay: `${i * 0.4}s`,
                    }}
                    onMouseEnter={() => bloomed && setActiveChakra(i)}
                    onMouseLeave={() => bloomed && setActiveChakra(null)}
                  />
                );
              })}

              {/* Active petal glow */}
              {activeChakra !== null && bloomed && (() => {
                const a = (angles[activeChakra] * Math.PI) / 180;
                const glowX = CX + PETAL_R_OPEN * 0.5 * Math.cos(a);
                const glowY = CY + PETAL_R_OPEN * 0.5 * Math.sin(a);
                return (
                  <circle cx={glowX} cy={glowY} r={60} fill={`url(#lrg${activeChakra})`}
                    style={{ animation: 'lotusGlowPulse 2s ease-in-out infinite', pointerEvents: 'none' }} />
                );
              })()}

              {/* Center */}
              <circle cx={CX} cy={CY} r={bloomed ? 48 : 36} fill="url(#lcg)" style={{ transition: 'all 0.8s ease' }} />
              <circle cx={CX} cy={CY} r={bloomed ? 32 : 24} fill="none" stroke="#5A8EAE" strokeWidth="0.8" opacity="0.25" style={{ transition: 'all 0.8s ease' }} />
              <circle cx={CX} cy={CY} r={bloomed ? 20 : 14} fill="none" stroke="#5A8EAE" strokeWidth="0.5" opacity="0.2" style={{ transition: 'all 0.8s ease' }} />
              <circle cx={CX} cy={CY} r={7} fill="#5A8EAE" opacity="0.4" />

              {/* Jewels at petal tips */}
              {chakras.map((ch, i) => {
                const a = (angles[i] * Math.PI) / 180;
                const jx = CX + (curR - 12) * Math.cos(a);
                const jy = CY + (curR - 12) * Math.sin(a);
                const isActive = activeChakra === i && bloomed;
                const jewR = isActive ? 10 : bloomed ? 6 : 3;
                return (
                  <g key={`jewel-${i}`} style={{ cursor: bloomed ? 'pointer' : 'default' }}
                    onMouseEnter={() => bloomed && setActiveChakra(i)}
                    onMouseLeave={() => bloomed && setActiveChakra(null)}>
                    {isActive && <circle cx={jx} cy={jy} r={20} fill={`url(#lrg${i})`} />}
                    <circle cx={jx} cy={jy} r={jewR + 3} fill="none" stroke={ch.color}
                      strokeWidth={isActive ? 1.2 : 0.5} opacity={bloomed ? (isActive ? 0.6 : 0.3) : 0}
                      style={{ transition: 'all 0.8s ease' }} />
                    <circle cx={jx} cy={jy} r={jewR} fill={ch.color}
                      opacity={isActive ? 1 : bloomed ? 0.7 : 0.5}
                      style={{ transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)', filter: isActive ? `drop-shadow(0 0 6px ${ch.color})` : 'none' }} />
                  </g>
                );
              })}
            </svg>

            {/* Labels */}
            {chakras.map((ch, i) => {
              const pos = tipPos(i);
              const isActive = activeChakra === i && bloomed;
              const angleDeg = angles[i];
              const isRight = angleDeg > -90 && angleDeg < 90;
              const isBottom = angleDeg > 0 && angleDeg < 180;
              return (
                <div key={`label-${i}`}
                  onMouseEnter={() => bloomed && setActiveChakra(i)}
                  onMouseLeave={() => bloomed && setActiveChakra(null)}
                  style={{
                    position: 'absolute', left: pos.x, top: pos.y,
                    transform: `translate(${isRight ? '4px' : '-100%'}, ${isBottom ? '0' : '-100%'})`,
                    whiteSpace: 'nowrap', textAlign: isRight ? 'left' : 'right',
                    opacity: bloomed ? (isActive ? 1 : 0.4) : 0,
                    transition: 'opacity 0.6s ease', cursor: 'pointer', padding: '4px 8px',
                    pointerEvents: bloomed ? 'auto' : 'none',
                  }}>
                  <div className="font-sans text-xs font-semibold" style={{ color: ch.color, lineHeight: 1.3 }}>{ch.nameJa}</div>
                  <div className="font-sans text-[9px] text-warm tracking-wider">{ch.name}</div>
                </div>
              );
            })}
          </div>

          {/* Detail Panel */}
          <div className="w-full lg:w-[340px] min-h-[280px] bg-white rounded-2xl p-8 flex flex-col justify-center"
            style={{
              border: `1px solid ${activeChakra !== null && bloomed ? chakras[activeChakra].color + '44' : '#DDE8F0'}`,
              boxShadow: activeChakra !== null && bloomed
                ? `0 4px 32px ${chakras[activeChakra].color}15`
                : '0 4px 24px rgba(0,0,0,0.04)',
              transition: 'all 0.4s ease',
            }}>
            {activeChakra !== null && bloomed ? (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center"
                    style={{
                      background: `radial-gradient(circle at 35% 35%, ${chakras[activeChakra].color}40, ${chakras[activeChakra].color}15)`,
                      border: `2px solid ${chakras[activeChakra].color}`,
                      boxShadow: `0 0 16px ${chakras[activeChakra].color}30`,
                    }}>
                    <div className="w-4 h-4 rounded-full" style={{ background: chakras[activeChakra].color }} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-dark">{chakras[activeChakra].nameJa}</h3>
                    <p className="font-sans text-xs tracking-widest" style={{ color: chakras[activeChakra].color }}>{chakras[activeChakra].name}</p>
                  </div>
                </div>
                <p className="font-sans text-sm text-warm leading-relaxed mb-5 font-light">
                  {chakras[activeChakra].desc}
                </p>
                <p className="font-sans text-[11px] text-gold tracking-widest uppercase font-semibold mb-3">Recommended Stones</p>
                <div className="flex gap-2 flex-wrap">
                  {chakras[activeChakra].stones.map((s) => (
                    <span key={s} className="font-sans text-sm text-dark"
                      style={{
                        padding: '8px 16px', borderRadius: 20,
                        background: `${chakras[activeChakra].color}12`,
                        border: `1px solid ${chakras[activeChakra].color}33`,
                      }}>{s}</span>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center">
                <p className="font-sans text-[11px] text-gold tracking-widest uppercase mb-3">Lotus Mandala</p>
                <p className="font-serif text-3xl text-stone mb-3">❀</p>
                <p className="font-sans text-sm text-warm font-light leading-relaxed">
                  {bloomed ? '花弁にカーソルを合わせて\nチャクラとクリスタルを探索' : '蓮の蕾にカーソルを近づけると\n花が開きます'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
