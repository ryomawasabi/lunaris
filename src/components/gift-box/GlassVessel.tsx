'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// Stone glow colors
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

// Generate a random irregular stone shape (polygon vertices)
function generateStoneShape(seed: number): { dx: number; dy: number }[] {
  const points: { dx: number; dy: number }[] = [];
  const numVertices = 7 + Math.floor(seed * 4); // 7-10 vertices
  const rng = (i: number) => {
    const x = Math.sin(seed * 1000 + i * 127.1) * 43758.5453;
    return x - Math.floor(x);
  };
  for (let i = 0; i < numVertices; i++) {
    const angle = (i / numVertices) * Math.PI * 2;
    const r = 0.6 + rng(i) * 0.4; // radius variation 0.6-1.0
    points.push({
      dx: Math.cos(angle) * r,
      dy: Math.sin(angle) * r,
    });
  }
  return points;
}

interface FallingStone {
  stoneName: string;
  color: { r: number; g: number; b: number };
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  angularVel: number;
  radius: number;
  shape: { dx: number; dy: number }[];
  opacity: number;
  phase: 'falling' | 'settled';
  settled: boolean;
  shimmerPhase: number;
  targetX: number;
  targetY: number;
}

interface SettledStone {
  stoneName: string;
  color: { r: number; g: number; b: number };
  x: number;
  y: number;
  radius: number;
  rotation: number;
  shape: { dx: number; dy: number }[];
  shimmerPhase: number;
  targetX: number;
  targetY: number;
}

interface GlassVesselProps {
  selectedStones: string[];
  className?: string;
}

export default function GlassVessel({ selectedStones, className = '' }: GlassVesselProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const fallingRef = useRef<FallingStone[]>([]);
  const settledRef = useRef<SettledStone[]>([]);
  const prevStonesRef = useRef<string[]>([]);
  const timeRef = useRef(0);
  const [ready, setReady] = useState(false);

  // Cylinder vessel dimensions
  const getVessel = useCallback((w: number, h: number) => {
    const vW = w * 0.52;
    const vH = h * 0.50;
    const cx = w / 2;
    const topY = h * 0.22;
    const bottomY = topY + vH;
    const rimRx = vW / 2;
    const rimRy = rimRx * 0.22; // ellipse ratio for perspective
    return { vW, vH, cx, topY, bottomY, rimRx, rimRy };
  }, []);

  // Settled positions inside vessel
  const getPositions = useCallback((count: number, w: number, h: number) => {
    const { vW, cx, bottomY, rimRy } = getVessel(w, h);
    const stoneR = Math.min(vW * 0.16, 26);
    const innerBottom = bottomY - rimRy - stoneR - 6;
    const positions: { x: number; y: number }[] = [];

    if (count === 1) {
      positions.push({ x: cx, y: innerBottom });
    } else if (count === 2) {
      const gap = stoneR * 1.4;
      positions.push({ x: cx - gap, y: innerBottom });
      positions.push({ x: cx + gap, y: innerBottom });
    } else if (count === 3) {
      const gap = stoneR * 1.3;
      positions.push({ x: cx - gap, y: innerBottom });
      positions.push({ x: cx + gap, y: innerBottom });
      positions.push({ x: cx, y: innerBottom - stoneR * 1.8 });
    }
    return { positions, stoneR };
  }, [getVessel]);

  // Handle stone changes
  useEffect(() => {
    const prev = prevStonesRef.current;
    const added = selectedStones.filter(s => !prev.includes(s));
    const removed = prev.filter(s => !selectedStones.includes(s));
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    // Remove
    if (removed.length > 0) {
      settledRef.current = settledRef.current.filter(o => !removed.includes(o.stoneName));
      fallingRef.current = fallingRef.current.filter(o => !removed.includes(o.stoneName));
    }

    // Recalculate positions for settled stones
    const { positions, stoneR } = getPositions(selectedStones.length, w, h);
    settledRef.current.forEach(orb => {
      const idx = selectedStones.indexOf(orb.stoneName);
      if (idx >= 0 && idx < positions.length) {
        orb.targetX = positions[idx].x;
        orb.targetY = positions[idx].y;
        orb.radius = stoneR;
      }
    });

    // Add new falling stones
    added.forEach(stoneName => {
      const color = STONE_GLOW_COLORS[stoneName] || { r: 200, g: 200, b: 200 };
      const idx = selectedStones.indexOf(stoneName);
      const target = idx < positions.length ? positions[idx] : { x: w / 2, y: h * 0.65 };
      const seed = Object.keys(STONE_GLOW_COLORS).indexOf(stoneName) * 0.123 + 0.1;

      fallingRef.current.push({
        stoneName,
        color,
        x: target.x + (Math.random() - 0.5) * 30,
        y: -50,
        vx: (Math.random() - 0.5) * 1.5,
        vy: 0,
        rotation: Math.random() * Math.PI * 2,
        angularVel: (Math.random() - 0.5) * 0.08,
        radius: stoneR,
        shape: generateStoneShape(seed),
        opacity: 0,
        phase: 'falling',
        settled: false,
        shimmerPhase: Math.random() * Math.PI * 2,
        targetX: target.x,
        targetY: target.y,
      });
    });

    prevStonesRef.current = [...selectedStones];
  }, [selectedStones, getPositions]);

  // Animation loop
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

    const GRAVITY = 0.22;
    const FRICTION = 0.985;
    const BOUNCE = 0.35;
    const AIR_RESIST = 0.998;

    // Draw a stone shape
    const drawStone = (
      x: number, y: number, r: number, rotation: number,
      shape: { dx: number; dy: number }[],
      color: { r: number; g: number; b: number },
      alpha: number, shimmer: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      // Stone body path
      ctx.beginPath();
      shape.forEach((p, i) => {
        const px = p.dx * r;
        const py = p.dy * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();

      // Stone gradient fill
      const grad = ctx.createRadialGradient(
        -r * 0.2, -r * 0.25, r * 0.1,
        0, 0, r
      );
      const cr = color.r, cg = color.g, cb = color.b;
      grad.addColorStop(0, `rgba(${Math.min(255, cr + 60)},${Math.min(255, cg + 60)},${Math.min(255, cb + 60)},${alpha * shimmer})`);
      grad.addColorStop(0.4, `rgba(${cr},${cg},${cb},${alpha * shimmer})`);
      grad.addColorStop(0.8, `rgba(${Math.max(0, cr - 35)},${Math.max(0, cg - 35)},${Math.max(0, cb - 35)},${alpha * shimmer})`);
      grad.addColorStop(1, `rgba(${Math.max(0, cr - 60)},${Math.max(0, cg - 60)},${Math.max(0, cb - 60)},${alpha * 0.7 * shimmer})`);
      ctx.fillStyle = grad;
      ctx.fill();

      // Subtle edge
      ctx.strokeStyle = `rgba(${Math.max(0, cr - 40)},${Math.max(0, cg - 40)},${Math.max(0, cb - 40)},${alpha * 0.3})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Specular highlights
      ctx.beginPath();
      ctx.ellipse(-r * 0.2, -r * 0.28, r * 0.28, r * 0.18, -0.3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.35 * alpha * shimmer})`;
      ctx.fill();

      // Small secondary highlight
      ctx.beginPath();
      ctx.ellipse(r * 0.15, r * 0.1, r * 0.12, r * 0.08, 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.15 * alpha * shimmer})`;
      ctx.fill();

      ctx.restore();

      // Outer glow
      const glow = ctx.createRadialGradient(x, y, r * 0.5, x, y, r * 2.2);
      glow.addColorStop(0, `rgba(${cr},${cg},${cb},${0.2 * alpha * shimmer})`);
      glow.addColorStop(0.6, `rgba(${cr},${cg},${cb},${0.06 * alpha * shimmer})`);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(x, y, r * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
    };

    // Draw cylindrical glass vessel
    const drawVessel = (w: number, h: number, t: number) => {
      const { vW, cx, topY, bottomY, rimRx, rimRy } = getVessel(w, h);
      const halfW = vW / 2;

      // -- Back half of bottom ellipse --
      ctx.beginPath();
      ctx.ellipse(cx, bottomY, rimRx, rimRy, 0, Math.PI, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // -- Vessel body (left + right walls) --
      ctx.save();

      // Glass body fill
      const bodyGrad = ctx.createLinearGradient(cx - halfW, topY, cx + halfW, topY);
      bodyGrad.addColorStop(0, 'rgba(255,255,255,0.04)');
      bodyGrad.addColorStop(0.15, 'rgba(255,255,255,0.10)');
      bodyGrad.addColorStop(0.35, 'rgba(255,255,255,0.03)');
      bodyGrad.addColorStop(0.65, 'rgba(255,255,255,0.06)');
      bodyGrad.addColorStop(0.85, 'rgba(255,255,255,0.10)');
      bodyGrad.addColorStop(1, 'rgba(255,255,255,0.03)');

      ctx.beginPath();
      // Top rim left → bottom left → bottom right → top rim right
      ctx.ellipse(cx, topY, rimRx, rimRy, 0, Math.PI, Math.PI * 2); // top arc (back)
      ctx.lineTo(cx + halfW, bottomY);
      ctx.ellipse(cx, bottomY, rimRx, rimRy, 0, 0, Math.PI); // bottom arc (front)
      ctx.lineTo(cx - halfW, topY);
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // Left wall
      ctx.beginPath();
      ctx.moveTo(cx - halfW, topY);
      ctx.lineTo(cx - halfW, bottomY);
      ctx.strokeStyle = 'rgba(255,255,255,0.22)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Right wall
      ctx.beginPath();
      ctx.moveTo(cx + halfW, topY);
      ctx.lineTo(cx + halfW, bottomY);
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // -- Front half of bottom ellipse --
      ctx.beginPath();
      ctx.ellipse(cx, bottomY, rimRx, rimRy, 0, 0, Math.PI);
      ctx.strokeStyle = 'rgba(255,255,255,0.22)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Glass reflection (vertical line, left side)
      ctx.beginPath();
      ctx.moveTo(cx - halfW * 0.65, topY + rimRy * 2);
      ctx.lineTo(cx - halfW * 0.62, bottomY - rimRy * 1.5);
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Second reflection (thinner, right)
      ctx.beginPath();
      ctx.moveTo(cx + halfW * 0.55, topY + rimRy * 3);
      ctx.lineTo(cx + halfW * 0.57, bottomY - rimRy * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();

      // -- Top rim ellipse (full) --
      ctx.beginPath();
      ctx.ellipse(cx, topY, rimRx, rimRy, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.30)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Rim fill (very subtle)
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.fill();

      // Ambient sparkles inside vessel
      for (let i = 0; i < 5; i++) {
        const sx = cx + Math.sin(t * 0.4 + i * 1.3) * halfW * 0.6;
        const sy = topY + (bottomY - topY) * (0.3 + Math.cos(t * 0.25 + i * 0.9) * 0.25);
        const sa = 0.04 + Math.sin(t * 0.8 + i * 2) * 0.03;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${sa})`;
        ctx.fill();
      }
    };

    const animate = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const vessel = getVessel(w, h);
      const halfW = vessel.vW / 2;

      // Draw vessel (back part)
      drawVessel(w, h, t);

      // === Settled stones (animate toward target smoothly) ===
      settledRef.current.forEach(stone => {
        stone.shimmerPhase += 0.015;
        const shimmer = 0.75 + Math.sin(stone.shimmerPhase) * 0.25;
        // Smooth lerp to target
        stone.x += (stone.targetX - stone.x) * 0.08;
        stone.y += (stone.targetY - stone.y) * 0.08;
        drawStone(stone.x, stone.y, stone.radius, stone.rotation, stone.shape, stone.color, 1, shimmer);
      });

      // === Falling stones ===
      const toSettle: FallingStone[] = [];

      fallingRef.current.forEach(stone => {
        if (stone.phase !== 'falling') return;

        // Fade in
        stone.opacity = Math.min(1, stone.opacity + 0.04);

        // Physics
        stone.vy += GRAVITY;
        stone.vy *= AIR_RESIST;
        stone.vx *= FRICTION;
        stone.x += stone.vx;
        stone.y += stone.vy;
        stone.rotation += stone.angularVel;
        stone.angularVel *= 0.995;

        // Gentle wind sway while falling
        stone.vx += Math.sin(t * 2 + stone.shimmerPhase) * 0.03;

        // Wall collisions (vessel sides)
        const leftWall = vessel.cx - halfW + stone.radius + 3;
        const rightWall = vessel.cx + halfW - stone.radius - 3;
        if (stone.y > vessel.topY) {
          if (stone.x < leftWall) {
            stone.x = leftWall;
            stone.vx = Math.abs(stone.vx) * BOUNCE;
            stone.angularVel += 0.02;
          }
          if (stone.x > rightWall) {
            stone.x = rightWall;
            stone.vx = -Math.abs(stone.vx) * BOUNCE;
            stone.angularVel -= 0.02;
          }
        }

        // Floor collision (vessel bottom)
        if (stone.y >= stone.targetY) {
          stone.y = stone.targetY;
          if (Math.abs(stone.vy) < 1.2) {
            // Settle
            stone.phase = 'settled';
            stone.settled = true;
            toSettle.push(stone);
          } else {
            stone.vy = -Math.abs(stone.vy) * BOUNCE;
            stone.angularVel += (Math.random() - 0.5) * 0.04;
            // Move toward target X on bounce
            stone.vx += (stone.targetX - stone.x) * 0.05;
          }
        }

        // Stone-to-stone collision (simple)
        settledRef.current.forEach(other => {
          const dx = stone.x - other.x;
          const dy = stone.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = stone.radius + other.radius;
          if (dist < minDist && dist > 0) {
            const overlap = minDist - dist;
            const nx = dx / dist;
            const ny = dy / dist;
            stone.x += nx * overlap * 0.7;
            stone.y += ny * overlap * 0.7;
            stone.vx += nx * 0.8;
            stone.vy += ny * 0.5;
            stone.angularVel += (Math.random() - 0.5) * 0.03;
          }
        });

        // Draw falling stone
        if (!stone.settled) {
          stone.shimmerPhase += 0.03;
          const shimmer = 0.8 + Math.sin(stone.shimmerPhase) * 0.2;

          // Trail glow
          for (let i = 1; i <= 3; i++) {
            const ty = stone.y - stone.vy * i * 2;
            const ta = stone.opacity * (0.15 / i);
            if (ty > 0) {
              ctx.beginPath();
              ctx.arc(stone.x, ty, stone.radius * (0.6 / i), 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${stone.color.r},${stone.color.g},${stone.color.b},${ta})`;
              ctx.fill();
            }
          }

          drawStone(stone.x, stone.y, stone.radius, stone.rotation, stone.shape, stone.color, stone.opacity, shimmer);
        }
      });

      // Transfer settled
      toSettle.forEach(s => {
        settledRef.current.push({
          stoneName: s.stoneName,
          color: s.color,
          x: s.x,
          y: s.y,
          radius: s.radius,
          rotation: s.rotation,
          shape: s.shape,
          shimmerPhase: s.shimmerPhase,
          targetX: s.targetX,
          targetY: s.targetY,
        });
      });
      if (toSettle.length > 0) {
        fallingRef.current = fallingRef.current.filter(o => !o.settled);
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [getVessel]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={{ display: 'block' }}
    />
  );
}
