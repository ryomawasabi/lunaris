'use client';

import { useEffect, useState } from 'react';

// Constellation star positions (normalized 0-100) and connection pairs
// Based on simplified real constellation patterns
const CONSTELLATIONS: Record<string, { stars: [number, number][]; lines: [number, number][] }> = {
  Aries: {
    stars: [[25, 55], [40, 45], [58, 40], [72, 50]],
    lines: [[0, 1], [1, 2], [2, 3]],
  },
  Taurus: {
    stars: [[20, 35], [30, 45], [42, 50], [55, 42], [65, 35], [52, 55], [60, 62], [38, 60]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [5, 6], [2, 7]],
  },
  Gemini: {
    stars: [[30, 20], [35, 35], [32, 50], [28, 65], [60, 22], [58, 38], [62, 52], [65, 68]],
    lines: [[0, 1], [1, 2], [2, 3], [4, 5], [5, 6], [6, 7], [1, 5], [2, 6]],
  },
  Cancer: {
    stars: [[30, 40], [42, 35], [55, 45], [50, 58], [65, 55]],
    lines: [[0, 1], [1, 2], [2, 3], [2, 4]],
  },
  Leo: {
    stars: [[20, 55], [30, 40], [42, 30], [55, 25], [65, 35], [60, 50], [50, 55], [72, 60]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1], [5, 7]],
  },
  Virgo: {
    stars: [[22, 30], [35, 25], [48, 35], [60, 30], [45, 50], [55, 55], [65, 65], [50, 70], [38, 62]],
    lines: [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5], [5, 6], [5, 7], [4, 8]],
  },
  Libra: {
    stars: [[35, 35], [50, 30], [65, 35], [30, 55], [50, 60], [70, 55]],
    lines: [[0, 1], [1, 2], [3, 4], [4, 5], [0, 3], [1, 4], [2, 5]],
  },
  Scorpio: {
    stars: [[15, 45], [28, 40], [40, 42], [52, 38], [60, 45], [68, 50], [75, 58], [80, 52], [82, 42]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8]],
  },
  Sagittarius: {
    stars: [[30, 25], [40, 40], [50, 50], [55, 35], [65, 30], [45, 60], [35, 65], [60, 60]],
    lines: [[0, 1], [1, 2], [1, 3], [3, 4], [2, 5], [5, 6], [2, 7]],
  },
  Capricorn: {
    stars: [[25, 40], [38, 30], [52, 35], [65, 30], [70, 45], [58, 58], [42, 60]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0]],
  },
  Aquarius: {
    stars: [[20, 35], [32, 30], [45, 35], [55, 30], [68, 35], [40, 50], [52, 55], [62, 50], [70, 60]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [5, 6], [6, 7], [7, 8]],
  },
  Pisces: {
    stars: [[25, 45], [35, 35], [48, 32], [60, 38], [68, 50], [58, 60], [45, 58], [35, 55]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0]],
  },
};

interface ConstellationMapProps {
  sign: string;
  size?: number;
  className?: string;
}

export function ConstellationMap({ sign, size = 280, className = '' }: ConstellationMapProps) {
  const [visibleStars, setVisibleStars] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [twinkle, setTwinkle] = useState<number[]>([]);

  const constellation = CONSTELLATIONS[sign];

  useEffect(() => {
    if (!constellation) return;

    setVisibleStars(0);
    setVisibleLines(0);

    // Animate stars appearing one by one
    const starTimers: NodeJS.Timeout[] = [];
    constellation.stars.forEach((_, i) => {
      starTimers.push(
        setTimeout(() => setVisibleStars((v) => v + 1), 200 + i * 250)
      );
    });

    // After all stars, animate lines
    const lineDelay = 200 + constellation.stars.length * 250 + 300;
    constellation.lines.forEach((_, i) => {
      starTimers.push(
        setTimeout(() => setVisibleLines((v) => v + 1), lineDelay + i * 200)
      );
    });

    return () => starTimers.forEach(clearTimeout);
  }, [sign]);

  // Random twinkling
  useEffect(() => {
    if (!constellation) return;
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * constellation.stars.length);
      setTwinkle((t) => [...t, idx]);
      setTimeout(() => {
        setTwinkle((t) => t.filter((v) => v !== idx));
      }, 600);
    }, 800);
    return () => clearInterval(interval);
  }, [sign]);

  if (!constellation) return null;

  const pad = 15;
  const scale = (v: number) => (v / 100) * (size - pad * 2) + pad;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Background stars (tiny random dots) */}
      <svg width={size} height={size} className="absolute inset-0 opacity-30">
        {Array.from({ length: 40 }, (_, i) => (
          <circle
            key={`bg-${i}`}
            cx={((i * 37 + 13) % 100) / 100 * size}
            cy={((i * 53 + 29) % 100) / 100 * size}
            r={Math.random() > 0.7 ? 1.2 : 0.6}
            fill="white"
            opacity={0.3 + Math.random() * 0.4}
          />
        ))}
      </svg>

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative z-10">
        <defs>
          <radialGradient id="starGlow">
            <stop offset="0%" stopColor="rgba(139,184,214,1)" />
            <stop offset="50%" stopColor="rgba(90,142,174,0.4)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="lineGlow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Constellation lines */}
        {constellation.lines.map(([from, to], i) => {
          if (i >= visibleLines) return null;
          const [x1, y1] = constellation.stars[from];
          const [x2, y2] = constellation.stars[to];
          return (
            <line
              key={`line-${i}`}
              x1={scale(x1)}
              y1={scale(y1)}
              x2={scale(x2)}
              y2={scale(y2)}
              stroke="rgba(139,184,214,0.5)"
              strokeWidth={1.5}
              filter="url(#lineGlow)"
              className="animate-fade-in-up"
              style={{ animationDuration: '0.4s' }}
            />
          );
        })}

        {/* Stars */}
        {constellation.stars.map(([x, y], i) => {
          if (i >= visibleStars) return null;
          const isTwinkling = twinkle.includes(i);
          const starSize = i === 0 ? 4 : 3; // First star slightly larger

          return (
            <g key={`star-${i}`} className="animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
              {/* Glow halo */}
              <circle
                cx={scale(x)}
                cy={scale(y)}
                r={isTwinkling ? 12 : 8}
                fill="url(#starGlow)"
                opacity={isTwinkling ? 0.6 : 0.3}
                style={{ transition: 'all 0.3s ease' }}
              />
              {/* Star point */}
              <circle
                cx={scale(x)}
                cy={scale(y)}
                r={isTwinkling ? starSize + 1.5 : starSize}
                fill="white"
                filter="url(#glow)"
                style={{ transition: 'all 0.3s ease' }}
              />
              {/* Cross sparkle on twinkle */}
              {isTwinkling && (
                <>
                  <line
                    x1={scale(x) - 8} y1={scale(y)}
                    x2={scale(x) + 8} y2={scale(y)}
                    stroke="rgba(200,225,255,0.5)" strokeWidth={0.5}
                  />
                  <line
                    x1={scale(x)} y1={scale(y) - 8}
                    x2={scale(x)} y2={scale(y) + 8}
                    stroke="rgba(200,225,255,0.5)" strokeWidth={0.5}
                  />
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
