'use client';

import { motion } from 'framer-motion';

type DividerVariant = 'yinyang' | 'lotus' | 'line' | 'dots';

interface SectionDividerProps {
  variant?: DividerVariant;
  className?: string;
  color?: string;
}

function YinYangIcon({ color }: { color: string }) {
  return (
    <motion.svg
      width="32" height="32" viewBox="0 0 32 32"
      initial={{ rotate: 0 }}
      whileInView={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      viewport={{ once: false }}
    >
      <circle cx="16" cy="16" r="15" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <path d="M16 1 A15 15 0 0 1 16 31 A7.5 7.5 0 0 1 16 16 A7.5 7.5 0 0 0 16 1" fill={color} opacity="0.15" />
      <path d="M16 1 A15 15 0 0 0 16 31 A7.5 7.5 0 0 0 16 16 A7.5 7.5 0 0 1 16 1" fill={color} opacity="0.05" />
      <circle cx="16" cy="8.5" r="2.5" fill={color} opacity="0.08" />
      <circle cx="16" cy="23.5" r="2.5" fill={color} opacity="0.2" />
    </motion.svg>
  );
}

function LotusIcon({ color }: { color: string }) {
  return (
    <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
      <path d="M20 2 Q14 10 8 20 Q14 16 20 20 Q26 16 32 20 Q26 10 20 2Z" stroke={color} strokeWidth="0.6" fill={color} fillOpacity="0.06" />
      <path d="M20 4 Q16 10 12 18 Q16 15 20 18 Q24 15 28 18 Q24 10 20 4Z" stroke={color} strokeWidth="0.4" fill={color} fillOpacity="0.04" />
      <circle cx="20" cy="14" r="1.5" fill={color} opacity="0.25" />
    </svg>
  );
}

export function SectionDivider({ variant = 'yinyang', className = '', color = '#5A8EAE' }: SectionDividerProps) {
  return (
    <div className={`flex items-center justify-center gap-4 py-4 ${className}`}>
      <div className="h-px flex-1 max-w-[120px]" style={{ background: `linear-gradient(90deg, transparent, ${color}30)` }} />

      {variant === 'yinyang' && <YinYangIcon color={color} />}
      {variant === 'lotus' && <LotusIcon color={color} />}
      {variant === 'dots' && (
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{ width: i === 1 ? 6 : 4, height: i === 1 ? 6 : 4, background: color, opacity: i === 1 ? 0.35 : 0.2 }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
            />
          ))}
        </div>
      )}
      {variant === 'line' && (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rotate-45" style={{ border: `1px solid ${color}40` }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: color, opacity: 0.3 }} />
          <div className="w-2 h-2 rotate-45" style={{ border: `1px solid ${color}40` }} />
        </div>
      )}

      <div className="h-px flex-1 max-w-[120px]" style={{ background: `linear-gradient(90deg, ${color}30, transparent)` }} />
    </div>
  );
}
