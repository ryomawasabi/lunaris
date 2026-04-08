'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// Stone glow colors (rgba)
const STONE_GLOW_COLORS: Record<string, { r: number; g: number; b: number }> = {
  'Smoky Quartz': { r: 168, g: 152, b: 130 },
  'Aquamarine': { r: 100, g: 200, b: 230 },
  'Amethyst': { r: 170, g: 120, b: 210 },
  'Black Obsidian': { r: 80, g: 80, b: 100 },
  'Green Fluorite': { r: 100, g: 210, b: 160 },
  'Citrine': { r: 240, g: 200, b: 80 },
  'Rose Quartz': { r: 230, g: 150, b: 180 },
  'Carnelian': { r: 230, g: 120, b: 60 },
};

interface FallingOrb {
  stoneName: string;
  color: { r: number; g: number; b: number };
  x: number;
  y: number;
  targetY: number;
  vy: number;
  radius: number;
  glowRadius: number;
  opacity: number;
  phase: 'falling' | 'bouncing' | 'settled';
  bounceCount: number;
  settled: boolean;
  shimmerPhase: number;
}

interface SettledOrb {
  stoneName: string;
  color: { r: number; g: number; b: number };
  x: number;
  y: number;
  radius: number;
  glowRadius: number;
  shimmerPhase: number;
}

interface GlassVesselProps {
  selectedStones: string[];
  className?: string;
}

export default function GlassVessel({ selectedStones, className = '' }: GlassVesselProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const fallingOrbsRef = useRef<FallingOrb[]>([]);
  const settledOrbsRef = useRef<SettledOrb[]>([]);
  const prevStonesRef = useRef<string[]>([]);
  const timeRef = useRef(0);
  const [ready, setReady] = useState(false);

  // Vessel dimensions (relative to canvas)
  const getVesselDimensions = useCallback((w: number, h: number) => {
    const vesselW = w * 0.44;
    const vesselH = h * 0.52;
    const vesselX = (w - vesselW) / 2;
    const vesselY = h * 0.38;
    const vesselBottomY = vesselY + vesselH;
    const vesselInnerBottom = vesselBottomY - vesselH * 0.12;
    return { vesselW, vesselH, vesselX, vesselY, vesselBottomY, vesselInnerBottom };
  }, []);

  // Calculate settled positions for orbs inside the vessel
  const getSettledPositions = useCallback((count: number, w: number, h: number) => {
    const { vesselW, vesselX, vesselInnerBottom } = getVesselDimensions(w, h);
    const orbRadius = Math.min(vesselW * 0.18, 28);
    const centerX = vesselX + vesselW / 2;
    const positions: { x: number; y: number }[] = [];

    if (count === 1) {
      positions.push({ x: centerX, y: vesselInnerBottom - orbRadius - 4 });
    } else if (count === 2) {
      const spread = orbRadius * 1.2;
      positions.push({ x: centerX - spread, y: vesselInnerBottom - orbRadius - 4 });
      positions.push({ x: centerX + spread, y: vesselInnerBottom - orbRadius - 4 });
    } else if (count === 3) {
      const spread = orbRadius * 1.2;
      positions.push({ x: centerX - spread, y: vesselInnerBottom - orbRadius - 4 });
      positions.push({ x: centerX + spread, y: vesselInnerBottom - orbRadius - 4 });
      positions.push({ x: centerX, y: vesselInnerBottom - orbRadius * 2.4 - 4 });
    }
    return { positions, orbRadius };
  }, [getVesselDimensions]);

  // Detect stone additions/removals
  useEffect(() => {
    const prev = prevStonesRef.current;
    const added = selectedStones.filter(s => !prev.includes(s));
    const removed = prev.filter(s => !selectedStones.includes(s));

    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    // Remove settled orbs for removed stones
    if (removed.length > 0) {
      settledOrbsRef.current = settledOrbsRef.current.filter(
        o => !removed.includes(o.stoneName)
      );
      fallingOrbsRef.current = fallingOrbsRef.current.filter(
        o => !removed.includes(o.stoneName)
      );
    }

    // Recalculate settled positions
    const currentStones = selectedStones;
    const { positions, orbRadius } = getSettledPositions(currentStones.length, w, h);
    settledOrbsRef.current.forEach((orb) => {
      const idx = currentStones.indexOf(orb.stoneName);
      if (idx >= 0 && idx < positions.length) {
        orb.x = positions[idx].x;
        orb.y = positions[idx].y;
        orb.radius = orbRadius;
        orb.glowRadius = orbRadius * 2.5;
      }
    });

    // Create falling orbs for added stones
    added.forEach(stoneName => {
      const color = STONE_GLOW_COLORS[stoneName] || { r: 200, g: 200, b: 200 };
      const idx = currentStones.indexOf(stoneName);
      const targetPos = idx < positions.length ? positions[idx] : { x: w / 2, y: h * 0.7 };

      const orb: FallingOrb = {
        stoneName,
        color,
        x: targetPos.x + (Math.random() - 0.5) * 20,
        y: -40,
        targetY: targetPos.y,
        vy: 0,
        radius: orbRadius,
        glowRadius: orbRadius * 2.5,
        opacity: 0,
        phase: 'falling',
        bounceCount: 0,
        settled: false,
        shimmerPhase: Math.random() * Math.PI * 2,
      };
      fallingOrbsRef.current.push(orb);
    });

    prevStonesRef.current = [...selectedStones];
  }, [selectedStones, getSettledPositions]);

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };
    resize();
    window.addEventListener('resize', resize);
    setReady(true);

    const ctx = canvas.getContext('2d')!;
    const gravity = 0.35;
    const damping = 0.45;

    const animate = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;

      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const { vesselW, vesselH, vesselX, vesselY, vesselBottomY } = getVesselDimensions(w, h);
      const vesselCenterX = vesselX + vesselW / 2;

      // === Draw Glass Vessel ===
      // Vessel body (rounded trapezoid)
      const topW = vesselW * 0.95;
      const bottomW = vesselW * 0.65;
      const rimY = vesselY;
      const baseY = vesselBottomY;

      ctx.save();
      // Vessel fill - glass effect
      const glassGrad = ctx.createLinearGradient(vesselCenterX - topW / 2, rimY, vesselCenterX + topW / 2, rimY);
      glassGrad.addColorStop(0, 'rgba(255,255,255,0.08)');
      glassGrad.addColorStop(0.3, 'rgba(255,255,255,0.15)');
      glassGrad.addColorStop(0.5, 'rgba(255,255,255,0.05)');
      glassGrad.addColorStop(0.7, 'rgba(255,255,255,0.12)');
      glassGrad.addColorStop(1, 'rgba(255,255,255,0.06)');

      ctx.beginPath();
      ctx.moveTo(vesselCenterX - topW / 2, rimY);
      // Left side curve
      ctx.bezierCurveTo(
        vesselCenterX - topW / 2 - 4, rimY + vesselH * 0.5,
        vesselCenterX - bottomW / 2 - 8, baseY - vesselH * 0.3,
        vesselCenterX - bottomW / 2, baseY
      );
      // Bottom curve
      ctx.quadraticCurveTo(vesselCenterX, baseY + 14, vesselCenterX + bottomW / 2, baseY);
      // Right side curve
      ctx.bezierCurveTo(
        vesselCenterX + bottomW / 2 + 8, baseY - vesselH * 0.3,
        vesselCenterX + topW / 2 + 4, rimY + vesselH * 0.5,
        vesselCenterX + topW / 2, rimY
      );
      ctx.fillStyle = glassGrad;
      ctx.fill();

      // Vessel outline
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner glow from settled stones
      settledOrbsRef.current.forEach(orb => {
        const innerGlow = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, vesselW * 0.5
        );
        innerGlow.addColorStop(0, `rgba(${orb.color.r},${orb.color.g},${orb.color.b},0.08)`);
        innerGlow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = innerGlow;
        ctx.fill();
      });

      // Rim highlight
      ctx.beginPath();
      ctx.ellipse(vesselCenterX, rimY, topW / 2, 4, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Glass reflection line
      ctx.beginPath();
      const reflectX = vesselCenterX - topW * 0.28;
      ctx.moveTo(reflectX, rimY + vesselH * 0.1);
      ctx.quadraticCurveTo(
        reflectX - 6, rimY + vesselH * 0.5,
        vesselCenterX - bottomW * 0.32, baseY - 10
      );
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();

      // === Draw Settled Orbs ===
      settledOrbsRef.current.forEach(orb => {
        orb.shimmerPhase += 0.02;
        const shimmer = 0.7 + Math.sin(orb.shimmerPhase) * 0.3;

        // Outer glow
        const glow = ctx.createRadialGradient(
          orb.x, orb.y, orb.radius * 0.3,
          orb.x, orb.y, orb.glowRadius
        );
        glow.addColorStop(0, `rgba(${orb.color.r},${orb.color.g},${orb.color.b},${0.35 * shimmer})`);
        glow.addColorStop(0.5, `rgba(${orb.color.r},${orb.color.g},${orb.color.b},${0.12 * shimmer})`);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core orb
        const coreGrad = ctx.createRadialGradient(
          orb.x - orb.radius * 0.25, orb.y - orb.radius * 0.25, orb.radius * 0.1,
          orb.x, orb.y, orb.radius
        );
        coreGrad.addColorStop(0, `rgba(${Math.min(255, orb.color.r + 80)},${Math.min(255, orb.color.g + 80)},${Math.min(255, orb.color.b + 80)},${0.9 * shimmer})`);
        coreGrad.addColorStop(0.6, `rgba(${orb.color.r},${orb.color.g},${orb.color.b},${0.8 * shimmer})`);
        coreGrad.addColorStop(1, `rgba(${Math.max(0, orb.color.r - 40)},${Math.max(0, orb.color.g - 40)},${Math.max(0, orb.color.b - 40)},${0.6 * shimmer})`);
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();

        // Highlight
        ctx.beginPath();
        ctx.arc(orb.x - orb.radius * 0.25, orb.y - orb.radius * 0.3, orb.radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.4 * shimmer})`;
        ctx.fill();
      });

      // === Animate Falling Orbs ===
      const toSettle: FallingOrb[] = [];

      fallingOrbsRef.current.forEach(orb => {
        if (orb.phase === 'falling') {
          orb.opacity = Math.min(1, orb.opacity + 0.05);
          orb.vy += gravity;
          orb.y += orb.vy;

          // Gentle sway
          orb.x += Math.sin(t * 3 + orb.shimmerPhase) * 0.5;

          if (orb.y >= orb.targetY) {
            orb.y = orb.targetY;
            orb.vy = -orb.vy * damping;
            orb.bounceCount++;
            orb.phase = 'bouncing';
          }
        } else if (orb.phase === 'bouncing') {
          orb.vy += gravity * 0.5;
          orb.y += orb.vy;

          if (orb.y >= orb.targetY) {
            orb.y = orb.targetY;
            orb.vy = -orb.vy * damping;
            orb.bounceCount++;
          }

          if (orb.bounceCount >= 3 || Math.abs(orb.vy) < 0.5) {
            orb.y = orb.targetY;
            orb.phase = 'settled';
            orb.settled = true;
            toSettle.push(orb);
          }
        }

        if (!orb.settled) {
          orb.shimmerPhase += 0.04;
          const shimmer = 0.7 + Math.sin(orb.shimmerPhase) * 0.3;

          // Trail particles
          for (let i = 0; i < 3; i++) {
            const trailY = orb.y - 10 - i * 12;
            const trailAlpha = orb.opacity * (0.3 - i * 0.1) * shimmer;
            const trailR = orb.radius * (0.4 - i * 0.1);
            if (trailY > 0 && trailAlpha > 0) {
              ctx.beginPath();
              ctx.arc(
                orb.x + Math.sin(t * 5 + i) * 3,
                trailY,
                trailR,
                0, Math.PI * 2
              );
              ctx.fillStyle = `rgba(${orb.color.r},${orb.color.g},${orb.color.b},${trailAlpha})`;
              ctx.fill();
            }
          }

          // Glow
          const glow = ctx.createRadialGradient(
            orb.x, orb.y, orb.radius * 0.2,
            orb.x, orb.y, orb.glowRadius * 1.2
          );
          glow.addColorStop(0, `rgba(${orb.color.r},${orb.color.g},${orb.color.b},${0.4 * orb.opacity})`);
          glow.addColorStop(0.5, `rgba(${orb.color.r},${orb.color.g},${orb.color.b},${0.15 * orb.opacity})`);
          glow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, orb.glowRadius * 1.2, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();

          // Core
          const coreGrad = ctx.createRadialGradient(
            orb.x - orb.radius * 0.2, orb.y - orb.radius * 0.2, 0,
            orb.x, orb.y, orb.radius
          );
          coreGrad.addColorStop(0, `rgba(${Math.min(255, orb.color.r + 100)},${Math.min(255, orb.color.g + 100)},${Math.min(255, orb.color.b + 100)},${orb.opacity})`);
          coreGrad.addColorStop(0.5, `rgba(${orb.color.r},${orb.color.g},${orb.color.b},${orb.opacity * 0.9})`);
          coreGrad.addColorStop(1, `rgba(${orb.color.r},${orb.color.g},${orb.color.b},${orb.opacity * 0.5})`);
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
          ctx.fillStyle = coreGrad;
          ctx.fill();

          // Bright highlight
          ctx.beginPath();
          ctx.arc(orb.x - orb.radius * 0.2, orb.y - orb.radius * 0.3, orb.radius * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${0.5 * orb.opacity})`;
          ctx.fill();
        }
      });

      // Move settled falling orbs to settled array
      toSettle.forEach(orb => {
        settledOrbsRef.current.push({
          stoneName: orb.stoneName,
          color: orb.color,
          x: orb.x,
          y: orb.targetY,
          radius: orb.radius,
          glowRadius: orb.glowRadius,
          shimmerPhase: orb.shimmerPhase,
        });
      });
      if (toSettle.length > 0) {
        fallingOrbsRef.current = fallingOrbsRef.current.filter(o => !o.settled);
      }

      // === Ambient particles ===
      for (let i = 0; i < 8; i++) {
        const px = vesselCenterX + Math.sin(t * 0.5 + i * 0.8) * vesselW * 0.35;
        const py = rimY + vesselH * 0.2 + Math.cos(t * 0.3 + i * 1.1) * vesselH * 0.3;
        const pAlpha = 0.06 + Math.sin(t + i) * 0.04;
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${pAlpha})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [getVesselDimensions]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={{ display: 'block' }}
    />
  );
}
