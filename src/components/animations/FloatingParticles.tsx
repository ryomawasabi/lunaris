'use client';

import { useMemo } from 'react';

interface FloatingParticlesProps {
  count?: number;
  color?: string;
  className?: string;
}

export function FloatingParticles({ count = 30, color = '#5A8EAE', className = '' }: FloatingParticlesProps) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10,
      drift: (Math.random() - 0.5) * 60,
      opacity: Math.random() * 0.4 + 0.1,
    }));
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <style>{`
        @keyframes particleFloat {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: var(--p-opacity);
          }
          90% {
            opacity: var(--p-opacity);
          }
          100% {
            transform: translateY(-100vh) translateX(var(--p-drift));
            opacity: 0;
          }
        }
        @keyframes particleGlow {
          0%, 100% { box-shadow: 0 0 4px 1px var(--p-color); }
          50% { box-shadow: 0 0 8px 3px var(--p-color); }
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: color,
            ['--p-opacity' as string]: p.opacity,
            ['--p-drift' as string]: `${p.drift}px`,
            ['--p-color' as string]: `${color}40`,
            animation: `particleFloat ${p.duration}s linear ${p.delay}s infinite, particleGlow ${p.duration * 0.4}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
