'use client';

import { useEffect, useState, useMemo } from 'react';

// Constellation star positions (normalized 0-100) and connection pairs
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

// Zodiac sign illustration SVG paths (simplified artistic outlines)
// Each path is drawn in a 100x100 viewBox
const ZODIAC_ILLUSTRATIONS: Record<string, string[]> = {
  Aries: [
    // Ram head with curved horns
    'M 35 75 Q 35 55 40 45 Q 45 35 50 30 Q 55 25 55 20 Q 55 12 48 8 Q 40 5 35 12 Q 30 18 28 25',
    'M 50 30 Q 55 25 55 20 Q 55 12 62 8 Q 70 5 75 12 Q 78 18 80 25',
    // Ram body outline
    'M 35 75 Q 30 70 28 65 Q 25 55 30 48 Q 35 42 42 40',
    'M 35 75 Q 40 78 50 80 Q 60 82 65 78 Q 72 74 70 65 Q 68 58 62 52 Q 56 46 50 42',
    // Ear
    'M 42 35 Q 38 30 40 25',
    // Eye area
    'M 40 42 Q 42 40 45 40 Q 48 42 46 44',
  ],
  Taurus: [
    // Bull head
    'M 30 55 Q 28 45 30 38 Q 32 30 38 28 Q 45 25 50 28 Q 55 25 62 28 Q 68 30 70 38 Q 72 45 70 55',
    // Left horn
    'M 30 38 Q 25 30 20 22 Q 18 15 22 10 Q 26 8 30 12',
    // Right horn
    'M 70 38 Q 75 30 80 22 Q 82 15 78 10 Q 74 8 70 12',
    // Nose/snout
    'M 38 55 Q 40 62 44 65 Q 48 67 50 67 Q 52 67 56 65 Q 60 62 62 55',
    // Nostrils
    'M 42 60 Q 44 62 46 60', 'M 54 60 Q 56 62 58 60',
    // Eyes
    'M 38 40 Q 40 38 43 40 Q 40 42 38 40', 'M 57 40 Q 60 38 62 40 Q 60 42 57 40',
    // Ears
    'M 30 35 Q 24 33 22 36 Q 22 40 26 42',
    'M 70 35 Q 76 33 78 36 Q 78 40 74 42',
  ],
  Gemini: [
    // Left twin
    'M 25 20 Q 27 15 30 13 Q 34 12 36 15 Q 38 18 36 22',
    'M 30 22 L 30 55 Q 28 60 26 65 Q 25 70 28 72',
    'M 30 30 Q 25 35 22 38 Q 20 42 22 45 Q 25 48 28 45',
    'M 30 30 Q 35 33 38 36',
    // Right twin
    'M 65 20 Q 67 15 70 13 Q 74 12 76 15 Q 78 18 76 22',
    'M 70 22 L 70 55 Q 72 60 74 65 Q 75 70 72 72',
    'M 70 30 Q 75 35 78 38 Q 80 42 78 45 Q 75 48 72 45',
    'M 70 30 Q 65 33 62 36',
    // Connection between twins
    'M 36 25 Q 50 22 64 25',
    'M 36 50 Q 50 53 64 50',
  ],
  Cancer: [
    // Crab body (shell)
    'M 30 45 Q 30 32 40 28 Q 50 24 60 28 Q 70 32 70 45 Q 70 55 60 58 Q 50 60 40 58 Q 30 55 30 45',
    // Left claw
    'M 30 42 Q 22 38 18 32 Q 15 26 18 22 Q 22 20 25 24 Q 28 28 26 34',
    'M 18 22 Q 12 20 10 24 Q 10 28 14 30',
    // Right claw
    'M 70 42 Q 78 38 82 32 Q 85 26 82 22 Q 78 20 75 24 Q 72 28 74 34',
    'M 82 22 Q 88 20 90 24 Q 90 28 86 30',
    // Legs
    'M 35 58 Q 30 65 25 70', 'M 42 60 Q 38 68 35 74',
    'M 58 60 Q 62 68 65 74', 'M 65 58 Q 70 65 75 70',
    // Shell details
    'M 38 35 Q 50 32 62 35', 'M 36 45 Q 50 42 64 45',
    // Eyes
    'M 40 38 L 38 32', 'M 60 38 L 62 32',
  ],
  Leo: [
    // Mane
    'M 30 30 Q 25 25 28 18 Q 32 12 40 10 Q 50 8 58 10 Q 66 12 70 18 Q 73 25 68 32',
    'M 25 30 Q 22 35 22 42 Q 23 48 28 50',
    // Head
    'M 30 30 Q 32 35 38 38 Q 42 40 48 40 Q 55 40 60 38 Q 65 35 68 32',
    // Body
    'M 28 50 Q 30 55 35 60 Q 40 65 45 68 Q 55 72 65 70 Q 72 68 78 62 Q 82 56 80 50',
    // Tail
    'M 78 62 Q 82 65 85 62 Q 88 58 85 55 Q 82 52 80 55',
    // Front legs
    'M 35 60 Q 32 70 30 78 Q 30 82 34 82', 'M 42 65 Q 40 72 38 80 Q 38 84 42 84',
    // Back legs
    'M 65 70 Q 68 76 70 82 Q 70 86 74 86', 'M 72 66 Q 76 72 78 80 Q 78 84 82 84',
    // Face details
    'M 40 34 Q 42 32 44 34', 'M 54 34 Q 56 32 58 34',
    'M 46 38 Q 48 40 50 38',
  ],
  Virgo: [
    // Head
    'M 42 18 Q 44 12 48 10 Q 52 9 55 12 Q 57 16 55 20',
    // Hair flowing
    'M 42 18 Q 38 15 35 18 Q 32 22 34 28',
    'M 55 14 Q 60 12 62 16 Q 63 20 60 24',
    // Torso
    'M 44 22 Q 46 28 48 35 Q 50 42 48 50',
    // Dress/robe
    'M 48 35 Q 42 38 36 45 Q 30 55 28 65 Q 27 72 30 78',
    'M 48 35 Q 54 38 60 45 Q 66 55 68 65 Q 69 72 66 78',
    // Left arm holding wheat
    'M 44 30 Q 38 32 32 30 Q 26 28 22 25',
    'M 22 25 Q 20 20 22 15 Q 24 12 22 8',
    'M 22 15 Q 18 13 16 10', 'M 22 15 Q 26 12 28 8',
    // Right arm
    'M 52 30 Q 58 34 62 38 Q 66 42 68 40',
    // Wings (subtle)
    'M 36 35 Q 28 30 25 35 Q 24 40 28 42',
    'M 58 35 Q 66 30 69 35 Q 70 40 66 42',
  ],
  Libra: [
    // Scale beam
    'M 20 42 L 80 42',
    // Center pillar
    'M 50 42 L 50 75',
    // Base
    'M 35 75 Q 50 80 65 75',
    'M 32 78 L 68 78',
    // Left pan
    'M 20 42 L 15 48 Q 15 55 22 58 Q 30 60 35 55 Q 38 50 35 45 L 20 42',
    // Right pan
    'M 80 42 L 75 48 Q 75 55 78 58 Q 82 60 85 55 Q 88 50 85 45 L 80 42',
    // Chains/strings
    'M 20 42 L 18 38 Q 18 34 22 32 Q 26 30 30 32',
    'M 80 42 L 82 38 Q 82 34 78 32 Q 74 30 70 32',
    // Top decoration
    'M 45 32 Q 50 28 55 32',
    'M 50 42 L 50 32',
  ],
  Scorpio: [
    // Body curve (long segmented tail)
    'M 15 40 Q 18 35 24 33 Q 30 32 36 35',
    'M 36 35 Q 42 38 46 42 Q 50 46 54 48',
    'M 54 48 Q 58 50 62 55 Q 65 60 68 62',
    'M 68 62 Q 72 64 76 60 Q 80 55 82 48',
    // Stinger
    'M 82 48 Q 85 42 88 38 Q 90 35 88 32',
    'M 88 38 Q 92 36 90 32',
    // Claws
    'M 15 40 Q 10 35 8 28 Q 7 22 10 18 Q 14 16 16 20',
    'M 10 18 Q 6 15 5 18 Q 5 22 8 24',
    'M 15 40 Q 12 42 10 38 Q 8 32 12 28',
    // Legs
    'M 28 35 Q 25 42 22 48', 'M 36 38 Q 34 46 32 52',
    'M 44 42 Q 42 50 40 56', 'M 52 48 Q 50 55 48 60',
    // Shell segments
    'M 24 33 Q 24 38 28 40', 'M 36 35 Q 38 40 42 42',
    'M 48 44 Q 50 48 54 50',
  ],
  Sagittarius: [
    // Bow
    'M 25 20 Q 20 35 25 50 Q 30 60 35 65',
    // Arrow
    'M 25 35 L 75 20',
    'M 75 20 L 70 16 M 75 20 L 72 25',
    // Bowstring
    'M 25 20 Q 35 35 25 50',
    // Horse body
    'M 35 50 Q 42 48 50 50 Q 58 52 65 58 Q 72 62 75 60',
    // Horse back legs
    'M 65 58 Q 62 68 60 78 Q 60 82 64 82',
    'M 72 60 Q 74 68 75 76 Q 75 80 78 80',
    // Horse front legs
    'M 40 55 Q 38 65 36 74 Q 36 78 40 78',
    'M 48 54 Q 46 62 45 72 Q 45 76 48 76',
    // Torso (human upper)
    'M 35 50 Q 36 42 38 35 Q 40 28 42 25',
    // Arms (drawing bow)
    'M 38 35 Q 32 33 25 35',
    'M 38 35 Q 45 30 50 28',
    // Horse tail
    'M 75 60 Q 80 58 82 62 Q 84 68 80 72',
  ],
  Capricorn: [
    // Goat head
    'M 25 30 Q 28 22 34 20 Q 40 18 44 22 Q 46 26 44 30',
    // Horn
    'M 34 20 Q 30 14 28 8 Q 27 4 30 3 Q 34 4 35 8 Q 36 12 34 18',
    // Goat body
    'M 25 30 Q 24 38 28 45 Q 32 50 38 52',
    'M 44 30 Q 48 35 50 42 Q 52 48 55 52',
    // Fish tail (curving)
    'M 55 52 Q 60 55 65 52 Q 70 48 74 50 Q 78 54 76 60 Q 72 66 68 64 Q 64 62 62 58',
    'M 76 60 Q 80 62 82 58 Q 84 54 82 50',
    'M 82 58 Q 86 60 88 56',
    // Tail fin
    'M 82 50 Q 86 48 88 52 Q 88 56 84 58',
    // Front legs
    'M 30 45 Q 28 55 26 62 Q 26 66 30 66',
    'M 38 52 Q 36 60 34 68 Q 34 72 38 72',
    // Eye
    'M 36 26 Q 38 24 40 26',
    // Beard
    'M 28 32 Q 24 36 22 34 Q 20 32 22 30',
  ],
  Aquarius: [
    // Figure with water jug
    // Head
    'M 38 15 Q 40 10 44 9 Q 48 9 50 12 Q 52 16 50 20',
    // Body
    'M 42 20 Q 44 28 45 35 Q 46 42 44 50',
    // Left arm (pouring)
    'M 42 28 Q 36 30 30 35 Q 26 38 22 42',
    // Jug
    'M 22 42 Q 18 40 16 44 Q 14 50 18 54 Q 22 56 26 52 Q 28 48 26 44',
    // Water streams
    'M 18 54 Q 20 60 18 66 Q 16 72 20 76 Q 24 80 28 76',
    'M 22 56 Q 26 62 24 68 Q 22 74 26 78 Q 30 82 34 78',
    'M 26 52 Q 30 58 28 64 Q 26 70 30 74',
    // Right arm
    'M 48 28 Q 54 26 58 28 Q 62 30 64 34',
    // Robe/lower body
    'M 44 35 Q 38 40 34 48 Q 30 55 32 60',
    'M 44 35 Q 50 40 54 48 Q 58 55 56 62',
    // Legs
    'M 36 55 Q 34 65 32 74', 'M 52 55 Q 54 65 56 74',
  ],
  Pisces: [
    // Left fish
    'M 20 30 Q 15 35 12 40 Q 10 48 14 54 Q 18 58 24 56 Q 28 54 30 48 Q 32 42 28 36 Q 24 32 20 30',
    // Left fish tail
    'M 12 40 Q 6 36 4 40 Q 4 45 8 48',
    // Left fish eye
    'M 22 42 Q 24 40 26 42',
    // Left fish fins
    'M 18 48 Q 14 52 16 56', 'M 24 38 Q 28 34 26 30',
    // Right fish
    'M 70 50 Q 65 55 62 60 Q 60 68 64 74 Q 68 78 74 76 Q 78 74 80 68 Q 82 62 78 56 Q 74 52 70 50',
    // Right fish tail
    'M 82 62 Q 88 58 90 62 Q 90 67 86 70',
    // Right fish eye
    'M 72 62 Q 74 60 76 62',
    // Right fish fins
    'M 68 68 Q 64 72 66 76', 'M 74 58 Q 78 54 76 50',
    // Connecting ribbon/cord
    'M 28 48 Q 35 52 42 50 Q 50 48 58 52 Q 64 56 70 54',
    'M 30 44 Q 38 40 46 42 Q 52 44 58 48',
  ],
};

interface ConstellationMapProps {
  sign: string;
  size?: number;
  className?: string;
}

export function ConstellationMap({ sign, size = 280, className = '' }: ConstellationMapProps) {
  const [visibleStars, setVisibleStars] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [showIllustration, setShowIllustration] = useState(false);
  const [illustrationOpacity, setIllustrationOpacity] = useState(0);
  const [twinkle, setTwinkle] = useState<number[]>([]);

  const constellation = CONSTELLATIONS[sign];
  const illustration = ZODIAC_ILLUSTRATIONS[sign];

  // Deterministic background stars
  const bgStars = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      cx: ((i * 37 + 13) % 100) / 100 * size,
      cy: ((i * 53 + 29) % 100) / 100 * size,
      r: (i % 5 === 0) ? 1.2 : 0.6,
      opacity: 0.15 + (i % 7) * 0.06,
    }));
  }, [size]);

  useEffect(() => {
    if (!constellation) return;

    setVisibleStars(0);
    setVisibleLines(0);
    setShowIllustration(false);
    setIllustrationOpacity(0);

    const timers: NodeJS.Timeout[] = [];

    // Stars appear one by one
    constellation.stars.forEach((_, i) => {
      timers.push(
        setTimeout(() => setVisibleStars((v) => v + 1), 200 + i * 250)
      );
    });

    // Lines draw after stars
    const lineDelay = 200 + constellation.stars.length * 250 + 300;
    constellation.lines.forEach((_, i) => {
      timers.push(
        setTimeout(() => setVisibleLines((v) => v + 1), lineDelay + i * 200)
      );
    });

    // Illustration fades in after all lines
    const illustrationDelay = lineDelay + constellation.lines.length * 200 + 500;
    timers.push(
      setTimeout(() => setShowIllustration(true), illustrationDelay)
    );
    // Gradual opacity increase
    timers.push(
      setTimeout(() => setIllustrationOpacity(0.06), illustrationDelay + 100)
    );
    timers.push(
      setTimeout(() => setIllustrationOpacity(0.1), illustrationDelay + 300)
    );
    timers.push(
      setTimeout(() => setIllustrationOpacity(0.15), illustrationDelay + 600)
    );

    return () => timers.forEach(clearTimeout);
  }, [sign, constellation]);

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
  }, [sign, constellation]);

  if (!constellation) return null;

  const pad = 15;
  const scale = (v: number) => (v / 100) * (size - pad * 2) + pad;
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Background stars */}
      <svg width={size} height={size} className="absolute inset-0 opacity-40">
        {bgStars.map((s, i) => (
          <circle key={`bg-${i}`} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={s.opacity} />
        ))}
      </svg>

      {/* Zodiac illustration (fades in behind) */}
      {showIllustration && illustration && (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="absolute inset-0 z-[1]"
          style={{
            opacity: illustrationOpacity,
            transition: 'opacity 1.5s ease-in-out',
          }}
        >
          <defs>
            <filter id="illustrationGlow">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {illustration.map((pathD, i) => (
            <path
              key={`illust-${i}`}
              d={pathD}
              fill="none"
              stroke="rgba(139,184,214,0.8)"
              strokeWidth={0.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#illustrationGlow)"
            />
          ))}
        </svg>
      )}

      {/* Constellation stars and lines */}
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
              x1={scale(x1)} y1={scale(y1)}
              x2={scale(x2)} y2={scale(y2)}
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
          const starSize = i === 0 ? 4 : 3;

          return (
            <g key={`star-${i}`} className="animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
              {/* Glow halo */}
              <circle
                cx={scale(x)} cy={scale(y)}
                r={isTwinkling ? 12 : 8}
                fill="url(#starGlow)"
                opacity={isTwinkling ? 0.6 : 0.3}
                style={{ transition: 'all 0.3s ease' }}
              />
              {/* Star point */}
              <circle
                cx={scale(x)} cy={scale(y)}
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
