'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';

const SIZE = 380;
const HALF = SIZE / 2;
const SPREAD = 200;

// Crystal Clear palette
const CC = {
  yinWhite: '#F0F4F8',
  yinBlack: '#1C2A38',
  accent: '#5A8EAE',
};

// S-curve path for yin-yang boundary
const sPath = `M ${HALF} 0 A ${HALF / 2} ${HALF / 2} 0 0 1 ${HALF} ${HALF} A ${HALF / 2} ${HALF / 2} 0 0 0 ${HALF} ${SIZE}`;

// Left half clip (white side): S-curve + left boundary
const leftClip = `${sPath} L 0 ${SIZE} L 0 0 Z`;
// Right half clip (black side): S-curve + right boundary
const rightClip = `${sPath} L ${SIZE} ${SIZE} L ${SIZE} 0 Z`;

const navItems = [
  { icon: '✦', label: 'New Arrivals', href: '/products?sort=newest' },
  { icon: '◈', label: 'Collections', href: '/collections' },
  { icon: '☾', label: 'Crystal Quiz', href: '/crystal-quiz' },
  { icon: '✧', label: 'Gifts', href: '/gifts' },
  { icon: '◇', label: 'About', href: '/about' },
];

function NavLink({ icon, label, href, side }: { icon: string; label: string; href: string; side: 'left' | 'right' }) {
  const isDark = side === 'right';
  const baseColor = isDark ? 'rgba(240,244,248,0.7)' : 'rgba(28,42,56,0.7)';
  const hoverColor = isDark ? '#F0F4F8' : CC.yinBlack;
  const hoverBg = isDark ? 'rgba(240,244,248,0.08)' : 'rgba(28,42,56,0.06)';

  return (
    <Link
      href={href}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = hoverBg;
        e.currentTarget.style.color = hoverColor;
        const iconEl = e.currentTarget.querySelector('[data-icon]') as HTMLElement;
        if (iconEl) iconEl.style.color = CC.accent;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = baseColor;
        const iconEl = e.currentTarget.querySelector('[data-icon]') as HTMLElement;
        if (iconEl) iconEl.style.color = baseColor;
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 18px',
        borderRadius: 8,
        color: baseColor,
        textDecoration: 'none',
        fontSize: 14,
        fontWeight: 400,
        letterSpacing: 1.5,
        transition: 'background 0.15s, color 0.15s',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <span data-icon style={{ fontSize: 15, transition: 'color 0.15s' }}>{icon}</span>
      {label}
    </Link>
  );
}

export default function YinYangNav() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }, []);

  const handleLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpen(false), 300);
  }, []);

  const leftItems = navItems.slice(0, Math.ceil(navItems.length / 2));
  const rightItems = navItems.slice(Math.ceil(navItems.length / 2));

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        position: 'relative',
        width: open ? SIZE + SPREAD * 2 : SIZE,
        height: SIZE,
        cursor: 'pointer',
        transition: 'width 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {/* Closed state: Complete yin-yang (single SVG, no background) */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        transform: 'translateX(-50%)',
        width: SIZE,
        height: SIZE,
        zIndex: 3,
        opacity: open ? 0 : 1,
        transition: 'opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: open ? 'none' : 'auto',
      }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          {/* White circle base */}
          <circle cx={HALF} cy={HALF} r={HALF} fill={CC.yinWhite} />
          {/* Black half via clip */}
          <clipPath id="yy-closed-right">
            <path d={rightClip} />
          </clipPath>
          <circle cx={HALF} cy={HALF} r={HALF} fill={CC.yinBlack} clipPath="url(#yy-closed-right)" />
          {/* 勾玉 dots */}
          <circle cx={HALF} cy={HALF * 0.5} r={HALF * 0.1} fill={CC.yinBlack} />
          <circle cx={HALF} cy={HALF * 1.5} r={HALF * 0.12} fill={CC.yinWhite} />
        </svg>
      </div>

      {/* Open state: Left panel (white / yin) */}
      <div style={{
        position: 'absolute',
        width: SIZE,
        height: SIZE,
        left: open ? '50%' : '50%',
        top: 0,
        transform: open ? `translateX(calc(-50% - ${SPREAD}px))` : 'translateX(-50%)',
        transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        zIndex: 2,
      }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ position: 'absolute', top: 0, left: 0 }}>
          <defs>
            <clipPath id="yy-left-clip">
              <path d={leftClip} />
            </clipPath>
          </defs>
          <circle cx={HALF} cy={HALF} r={HALF} fill={CC.yinWhite} clipPath="url(#yy-left-clip)" />
          <circle cx={HALF} cy={HALF * 0.5} r={HALF * 0.1} fill={CC.yinBlack} clipPath="url(#yy-left-clip)" />
        </svg>
        {/* Left nav items */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          opacity: open ? 1 : 0,
          transition: 'opacity 0.4s ease 0.15s',
          pointerEvents: open ? 'auto' : 'none',
        }}>
          {leftItems.map((item) => (
            <NavLink key={item.label} {...item} side="left" />
          ))}
        </div>
      </div>

      {/* Open state: Right panel (black / yang) */}
      <div style={{
        position: 'absolute',
        width: SIZE,
        height: SIZE,
        left: open ? '50%' : '50%',
        top: 0,
        transform: open ? `translateX(calc(-50% + ${SPREAD}px))` : 'translateX(-50%)',
        transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        zIndex: 2,
      }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ position: 'absolute', top: 0, left: 0 }}>
          <defs>
            <clipPath id="yy-right-clip">
              <path d={rightClip} />
            </clipPath>
          </defs>
          <circle cx={HALF} cy={HALF} r={HALF} fill={CC.yinBlack} clipPath="url(#yy-right-clip)" />
          <circle cx={HALF} cy={HALF * 1.5} r={HALF * 0.12} fill={CC.yinWhite} clipPath="url(#yy-right-clip)" />
        </svg>
        {/* Right nav items */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          opacity: open ? 1 : 0,
          transition: 'opacity 0.4s ease 0.15s',
          pointerEvents: open ? 'auto' : 'none',
        }}>
          {rightItems.map((item) => (
            <NavLink key={item.label} {...item} side="right" />
          ))}
        </div>
      </div>
    </div>
  );
}
