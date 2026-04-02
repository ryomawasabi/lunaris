'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';

const SIZE = 400;
const HALF = SIZE / 2;
const CIRCLE_R = 190;
const SPREAD = 200;

const CC = {
  yinWhite: '#FFFFFF',
  yinBlack: '#1C2A38',
  accent: '#5A8EAE',
};

// S-curve path for yin-yang
const sPath = `M ${HALF} 0 A ${HALF / 2} ${HALF / 2} 0 0 1 ${HALF} ${HALF} A ${HALF / 2} ${HALF / 2} 0 0 0 ${HALF} ${SIZE}`;
const rightClip = `${sPath} L ${SIZE} ${SIZE} L ${SIZE} 0 Z`;

const leftItems = [
  { icon: '✦', label: 'New Arrivals', href: '/products?sort=newest' },
  { icon: '◈', label: 'Collections', href: '/collections' },
  { icon: '☾', label: 'Soul Stone Discovery', href: '/crystal-quiz' },
];

const rightItems = [
  { icon: '✧', label: 'Gifts', href: '/gifts' },
  { icon: '◇', label: 'About', href: '/about' },
  { icon: '○', label: 'Shop All', href: '/products' },
];

function NavLink({ icon, label, href, side }: { icon: string; label: string; href: string; side: 'left' | 'right' }) {
  const isDark = side === 'right';

  return (
    <Link
      href={href}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(28,42,56,0.06)';
        const iconEl = e.currentTarget.querySelector('[data-icon]') as HTMLElement;
        if (iconEl) iconEl.style.color = CC.accent;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        const iconEl = e.currentTarget.querySelector('[data-icon]') as HTMLElement;
        if (iconEl) iconEl.style.color = isDark ? '#8A9DB0' : '#8A9DB0';
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 20px',
        borderRadius: 8,
        color: isDark ? '#E0E8EE' : '#2A3E50',
        textDecoration: 'none',
        fontSize: 15,
        fontWeight: 500,
        letterSpacing: 0.5,
        transition: 'background 0.15s',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <span data-icon style={{ fontSize: 14, color: '#8A9DB0', transition: 'color 0.15s' }}>{icon}</span>
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

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        position: 'relative',
        width: open ? CIRCLE_R * 2 + SPREAD + 80 : SIZE,
        height: open ? CIRCLE_R * 2 + 20 : SIZE,
        cursor: 'pointer',
        transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1), height 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {/* ===== Closed: Complete Yin-Yang ===== */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: SIZE,
        height: SIZE,
        zIndex: 3,
        opacity: open ? 0 : 1,
        transition: 'opacity 0.3s ease',
        pointerEvents: open ? 'none' : 'auto',
        filter: 'drop-shadow(0 4px 24px rgba(28,42,56,0.15))',
      }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <circle cx={HALF} cy={HALF} r={HALF} fill={CC.yinWhite} />
          <clipPath id="yy-closed-r">
            <path d={rightClip} />
          </clipPath>
          <circle cx={HALF} cy={HALF} r={HALF} fill={CC.yinBlack} clipPath="url(#yy-closed-r)" />
          <circle cx={HALF} cy={HALF * 0.5} r={HALF * 0.1} fill={CC.yinBlack} />
          <circle cx={HALF} cy={HALF * 1.5} r={HALF * 0.12} fill={CC.yinWhite} />
        </svg>
      </div>

      {/* ===== Open: Left Circle (White) ===== */}
      <div style={{
        position: 'absolute',
        left: open ? 0 : '50%',
        top: '50%',
        transform: open ? 'translate(0, -50%)' : 'translate(-50%, -50%)',
        width: CIRCLE_R * 2,
        height: CIRCLE_R * 2,
        borderRadius: '50%',
        background: CC.yinWhite,
        boxShadow: '0 4px 30px rgba(28,42,56,0.1), 0 1px 3px rgba(28,42,56,0.06)',
        opacity: open ? 1 : 0,
        transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* 勾玉 dot */}
        <div style={{
          position: 'absolute',
          top: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: CC.yinBlack,
          opacity: open ? 0.3 : 0,
          transition: 'opacity 0.4s ease 0.2s',
        }} />
        {/* Category label */}
        <div style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 3,
          color: CC.accent,
          textTransform: 'uppercase' as const,
          marginBottom: 16,
          opacity: open ? 1 : 0,
          transition: 'opacity 0.4s ease 0.2s',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>SHOP</div>
        {/* Nav items */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          opacity: open ? 1 : 0,
          transition: 'opacity 0.4s ease 0.15s',
          pointerEvents: open ? 'auto' : 'none',
        }}>
          {leftItems.map((item) => (
            <NavLink key={item.label} {...item} side="left" />
          ))}
        </div>
      </div>

      {/* ===== Open: Right Circle (Dark) ===== */}
      <div style={{
        position: 'absolute',
        right: open ? 0 : '50%',
        top: '50%',
        transform: open ? 'translate(0, -50%)' : 'translate(50%, -50%)',
        width: CIRCLE_R * 2,
        height: CIRCLE_R * 2,
        borderRadius: '50%',
        background: CC.yinBlack,
        boxShadow: '0 4px 30px rgba(28,42,56,0.2)',
        opacity: open ? 1 : 0,
        transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* 勾玉 dot */}
        <div style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: CC.yinWhite,
          opacity: open ? 0.3 : 0,
          transition: 'opacity 0.4s ease 0.2s',
        }} />
        {/* Category label */}
        <div style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 3,
          color: CC.accent,
          textTransform: 'uppercase' as const,
          marginBottom: 16,
          opacity: open ? 1 : 0,
          transition: 'opacity 0.4s ease 0.2s',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>DISCOVER</div>
        {/* Nav items */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          opacity: open ? 1 : 0,
          transition: 'opacity 0.4s ease 0.15s',
          pointerEvents: open ? 'auto' : 'none',
        }}>
          {rightItems.map((item) => (
            <NavLink key={item.label} {...item} side="right" />
          ))}
        </div>
      </div>

      {/* ===== Center connector dot (visible when open) ===== */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 8,
        height: 8,
        borderRadius: '50%',
        border: `1.5px solid ${CC.accent}`,
        background: 'transparent',
        opacity: open ? 0.4 : 0,
        transition: 'opacity 0.4s ease 0.3s',
        zIndex: 4,
        pointerEvents: 'none',
      }} />
    </div>
  );
}
