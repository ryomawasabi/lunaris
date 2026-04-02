'use client';

import { useEffect, useState } from 'react';

const SIGNS = [
  { symbol: '♈', name: 'Aries' },
  { symbol: '♉', name: 'Taurus' },
  { symbol: '♊', name: 'Gemini' },
  { symbol: '♋', name: 'Cancer' },
  { symbol: '♌', name: 'Leo' },
  { symbol: '♍', name: 'Virgo' },
  { symbol: '♎', name: 'Libra' },
  { symbol: '♏', name: 'Scorpio' },
  { symbol: '♐', name: 'Sagittarius' },
  { symbol: '♑', name: 'Capricorn' },
  { symbol: '♒', name: 'Aquarius' },
  { symbol: '♓', name: 'Pisces' },
];

interface ZodiacWheelProps {
  highlightSign?: string;
  size?: number;
}

export function ZodiacWheel({ highlightSign, size = 320 }: ZodiacWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [glowIndex, setGlowIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((r) => r + 0.3);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIndex((g) => (g + 1) % 12);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const center = size / 2;
  const outerR = size / 2 - 8;
  const innerR = outerR * 0.62;
  const symbolR = (outerR + innerR) / 2;
  const dotR = outerR + 2;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(90,142,174,0.15) 0%, transparent 70%)',
          filter: 'blur(20px)',
          transform: `scale(1.3)`,
        }}
      />

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="relative z-10"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Outer ring */}
        <circle cx={center} cy={center} r={outerR} fill="none" stroke="rgba(90,142,174,0.3)" strokeWidth={1} />
        <circle cx={center} cy={center} r={innerR} fill="none" stroke="rgba(90,142,174,0.2)" strokeWidth={1} />

        {/* Division lines and symbols */}
        {SIGNS.map((sign, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const midAngle = ((i * 30 + 15) - 90) * (Math.PI / 180);

          // Division line
          const lx1 = center + innerR * Math.cos(angle);
          const ly1 = center + innerR * Math.sin(angle);
          const lx2 = center + outerR * Math.cos(angle);
          const ly2 = center + outerR * Math.sin(angle);

          // Symbol position
          const sx = center + symbolR * Math.cos(midAngle);
          const sy = center + symbolR * Math.sin(midAngle);

          // Dot on outer ring
          const dx = center + dotR * Math.cos(angle);
          const dy = center + dotR * Math.sin(angle);

          const isHighlighted = highlightSign === sign.name;
          const isGlowing = glowIndex === i;

          return (
            <g key={sign.name}>
              {/* Division line */}
              <line
                x1={lx1} y1={ly1} x2={lx2} y2={ly2}
                stroke="rgba(90,142,174,0.2)"
                strokeWidth={0.5}
              />

              {/* Outer dot */}
              <circle
                cx={dx} cy={dy} r={3}
                fill={isGlowing ? '#5A8EAE' : 'rgba(90,142,174,0.5)'}
                className="transition-all duration-300"
              >
                {isGlowing && (
                  <animate attributeName="r" values="3;5;3" dur="0.6s" repeatCount="1" />
                )}
              </circle>

              {/* Zodiac symbol */}
              <text
                x={sx}
                y={sy}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isHighlighted ? '#fff' : isGlowing ? '#8BB8D6' : 'rgba(200,220,240,0.7)'}
                fontSize={size * 0.055}
                style={{
                  filter: isHighlighted ? 'drop-shadow(0 0 8px rgba(90,142,174,0.9))' : isGlowing ? 'drop-shadow(0 0 4px rgba(90,142,174,0.5))' : 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                {sign.symbol}
              </text>
            </g>
          );
        })}

        {/* Inner decorative ring */}
        <circle cx={center} cy={center} r={innerR * 0.65} fill="none" stroke="rgba(90,142,174,0.15)" strokeWidth={0.5} strokeDasharray="4 6" />

        {/* Center glow circle */}
        <circle cx={center} cy={center} r={innerR * 0.35} fill="url(#centerGlow)" />

        <defs>
          <radialGradient id="centerGlow">
            <stop offset="0%" stopColor="rgba(90,142,174,0.2)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </svg>

      {/* Center text - counter-rotates to stay readable */}
      <div
        className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
      >
        <div className="text-center">
          <div className="text-3xl mb-1 animate-pulse" style={{ textShadow: '0 0 20px rgba(90,142,174,0.6)' }}>
            ✦
          </div>
        </div>
      </div>
    </div>
  );
}
