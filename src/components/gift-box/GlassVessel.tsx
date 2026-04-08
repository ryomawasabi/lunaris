'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// Stone glow colors — richer, more saturated
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

// Generate faceted crystal shape — 5-7 main facets
function generateCrystalShape(seed: number): { dx: number; dy: number }[] {
  const points: { dx: number; dy: number }[] = [];
  const numVertices = 5 + Math.floor(seed * 3); // 5-7 vertices for a gem cut look
  const rng = (i: number) => {
    const x = Math.sin(seed * 1000 + i * 127.1) * 43758.5453;
    return x - Math.floor(x);
  };
  for (let i = 0; i < numVertices; i++) {
    const angle = (i / numVertices) * Math.PI * 2;
    // More angular variation for faceted look
    const r = 0.65 + rng(i) * 0.35;
    points.push({
      dx: Math.cos(angle) * r,
      dy: Math.sin(angle) * r,
    });
  }
  return points;
}

// Generate inner facet lines for a crystal
function generateFacetLines(seed: number, shape: { dx: number; dy: number }[]): { x1: number; y1: number; x2: number; y2: number }[] {
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  const rng = (i: number) => {
    const x = Math.sin(seed * 777 + i * 53.7) * 31415.926;
    return x - Math.floor(x);
  };
  // Connect some non-adjacent vertices to create facet lines
  const n = shape.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 2) % n;
    if (rng(i) > 0.35) {
      lines.push({
        x1: shape[i].dx,
        y1: shape[i].dy,
        x2: shape[j].dx,
        y2: shape[j].dy,
      });
    }
  }
  // Add a line from a vertex toward center
  const ci = Math.floor(rng(42) * n);
  lines.push({
    x1: shape[ci].dx * 0.15,
    y1: shape[ci].dy * 0.15,
    x2: shape[ci].dx,
    y2: shape[ci].dy,
  });
  return lines;
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
  facetLines: { x1: number; y1: number; x2: number; y2: number }[];
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
  facetLines: { x1: number; y1: number; x2: number; y2: number }[];
  shimmerPhase: number;
  targetX: number;
  targetY: number;
}

// Floating particles inside vessel
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: { r: number; g: number; b: number };
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
  const particlesRef = useRef<Particle[]>([]);
  const prevStonesRef = useRef<string[]>([]);
  const timeRef = useRef(0);
  const [ready, setReady] = useState(false);

  // Cylinder vessel dimensions
  const getVessel = useCallback((w: number, h: number) => {
    const vW = w * 0.50;
    const vH = h * 0.85;
    const cx = w / 2;
    const topY = h * 0.03;
    const bottomY = topY + vH;
    const rimRx = vW / 2;
    const rimRy = rimRx * 0.20;
    return { vW, vH, cx, topY, bottomY, rimRx, rimRy };
  }, []);

  const PIECES_PER_STONE = 3;

  const getStoneRadius = useCallback((w: number, h: number) => {
    const { vW } = getVessel(w, h);
    return Math.min(vW * 0.14, 22);
  }, [getVessel]);

  // Handle stone changes — sync refs with selectedStones
  useEffect(() => {
    const prev = prevStonesRef.current;
    // Skip if no actual change (React Strict Mode double-fire guard)
    if (
      prev.length === selectedStones.length &&
      prev.every(s => selectedStones.includes(s)) &&
      selectedStones.every(s => prev.includes(s))
    ) {
      return;
    }

    const added = selectedStones.filter(s => !prev.includes(s));
    const removed = prev.filter(s => !selectedStones.includes(s));
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    // Remove stones for deselected types
    if (removed.length > 0) {
      // Keep settled stones that are still selected, convert them to falling
      const remainingSettled = settledRef.current.filter(o => selectedStones.includes(o.stoneName));
      settledRef.current = [];
      fallingRef.current = fallingRef.current.filter(o => selectedStones.includes(o.stoneName));
      remainingSettled.forEach(s => {
        fallingRef.current.push({
          stoneName: s.stoneName,
          color: s.color,
          x: s.x,
          y: s.y,
          vx: 0,
          vy: 0.5,
          rotation: s.rotation,
          angularVel: 0,
          radius: s.radius,
          shape: s.shape,
          facetLines: s.facetLines,
          opacity: 1,
          phase: 'falling',
          settled: false,
          shimmerPhase: s.shimmerPhase,
          targetX: s.targetX,
          targetY: s.targetY,
        });
      });
    }

    const stoneR = getStoneRadius(w, h);
    const vessel = getVessel(w, h);
    const floorY = vessel.bottomY - vessel.rimRy - stoneR - 4;

    // Only add stones for truly new types (not already in falling or settled)
    added.forEach(stoneName => {
      // Guard: skip if pieces for this stone already exist
      const existsInFalling = fallingRef.current.some(o => o.stoneName === stoneName);
      const existsInSettled = settledRef.current.some(o => o.stoneName === stoneName);
      if (existsInFalling || existsInSettled) return;

      const color = STONE_GLOW_COLORS[stoneName] || { r: 200, g: 200, b: 200 };
      const baseSeed = Object.keys(STONE_GLOW_COLORS).indexOf(stoneName) * 0.123 + 0.1;

      for (let p = 0; p < PIECES_PER_STONE; p++) {
        const seed = baseSeed + p * 0.37;
        const startY = -40 - p * 50;
        const startX = vessel.cx + (Math.random() - 0.5) * vessel.vW * 0.4;
        const shape = generateCrystalShape(seed);

        fallingRef.current.push({
          stoneName,
          color,
          x: startX,
          y: startY,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 1.5,
          rotation: Math.random() * Math.PI * 2,
          angularVel: (Math.random() - 0.5) * 0.04,
          radius: stoneR * (0.85 + Math.random() * 0.3),
          shape,
          facetLines: generateFacetLines(seed, shape),
          opacity: 0,
          phase: 'falling',
          settled: false,
          shimmerPhase: Math.random() * Math.PI * 2,
          targetX: vessel.cx + (Math.random() - 0.5) * vessel.vW * 0.35,
          targetY: floorY,
        });
      }
    });

    prevStonesRef.current = [...selectedStones];
  }, [selectedStones, getStoneRadius, getVessel]);

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

    // === Draw a faceted crystal stone ===
    const drawStone = (
      x: number, y: number, r: number, rotation: number,
      shape: { dx: number; dy: number }[],
      facetLines: { x1: number; y1: number; x2: number; y2: number }[],
      color: { r: number; g: number; b: number },
      alpha: number, shimmer: number, t: number
    ) => {
      const cr = color.r, cg = color.g, cb = color.b;

      // --- Outer glow (drawn first, behind stone) ---
      const glow = ctx.createRadialGradient(x, y, r * 0.3, x, y, r * 2.5);
      glow.addColorStop(0, `rgba(${cr},${cg},${cb},${0.18 * alpha * shimmer})`);
      glow.addColorStop(0.4, `rgba(${cr},${cg},${cb},${0.06 * alpha * shimmer})`);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      // --- Base crystal body ---
      ctx.beginPath();
      shape.forEach((p, i) => {
        const px = p.dx * r;
        const py = p.dy * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();

      // Multi-stop gradient for depth
      const grad = ctx.createRadialGradient(
        -r * 0.15, -r * 0.2, r * 0.05,
        r * 0.1, r * 0.1, r * 1.1
      );
      grad.addColorStop(0, `rgba(${Math.min(255, cr + 80)},${Math.min(255, cg + 80)},${Math.min(255, cb + 80)},${alpha * shimmer})`);
      grad.addColorStop(0.25, `rgba(${Math.min(255, cr + 30)},${Math.min(255, cg + 30)},${Math.min(255, cb + 30)},${alpha * shimmer})`);
      grad.addColorStop(0.55, `rgba(${cr},${cg},${cb},${alpha * shimmer})`);
      grad.addColorStop(0.8, `rgba(${Math.max(0, cr - 40)},${Math.max(0, cg - 40)},${Math.max(0, cb - 40)},${alpha * shimmer})`);
      grad.addColorStop(1, `rgba(${Math.max(0, cr - 70)},${Math.max(0, cg - 70)},${Math.max(0, cb - 70)},${alpha * 0.8 * shimmer})`);
      ctx.fillStyle = grad;
      ctx.fill();

      // --- Facet lines (internal cuts) ---
      ctx.save();
      ctx.clip(); // clip to crystal body
      facetLines.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(line.x1 * r, line.y1 * r);
        ctx.lineTo(line.x2 * r, line.y2 * r);
        // Each facet line has slightly different brightness
        const lineAlpha = 0.15 + Math.sin(t * 0.5 + line.x1 * 10) * 0.08;
        ctx.strokeStyle = `rgba(255,255,255,${lineAlpha * alpha})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      });

      // --- Facet faces (triangular fills for depth) ---
      for (let i = 0; i < shape.length; i++) {
        const j = (i + 1) % shape.length;
        const facetAlpha = 0.03 + Math.sin(t * 0.7 + i * 1.5 + rotation) * 0.025;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(shape[i].dx * r, shape[i].dy * r);
        ctx.lineTo(shape[j].dx * r, shape[j].dy * r);
        ctx.closePath();
        // Alternate between light and dark to create facet depth
        if (i % 2 === 0) {
          ctx.fillStyle = `rgba(255,255,255,${facetAlpha * alpha})`;
        } else {
          ctx.fillStyle = `rgba(0,0,0,${facetAlpha * 0.6 * alpha})`;
        }
        ctx.fill();
      }
      ctx.restore();

      // --- Crystal edge (sharper, glass-like) ---
      ctx.beginPath();
      shape.forEach((p, i) => {
        const px = p.dx * r;
        const py = p.dy * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.strokeStyle = `rgba(${Math.min(255, cr + 40)},${Math.min(255, cg + 40)},${Math.min(255, cb + 40)},${alpha * 0.5})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // --- Primary specular highlight (top-left) ---
      ctx.beginPath();
      ctx.ellipse(-r * 0.18, -r * 0.25, r * 0.32, r * 0.15, -0.4, 0, Math.PI * 2);
      const specGrad = ctx.createRadialGradient(-r * 0.18, -r * 0.25, 0, -r * 0.18, -r * 0.25, r * 0.32);
      specGrad.addColorStop(0, `rgba(255,255,255,${0.55 * alpha * shimmer})`);
      specGrad.addColorStop(0.5, `rgba(255,255,255,${0.2 * alpha * shimmer})`);
      specGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = specGrad;
      ctx.fill();


      ctx.restore();
    };

    // === Draw premium cylindrical glass vessel ===
    const drawVessel = (w: number, h: number, t: number) => {
      const { vW, cx, topY, bottomY, rimRx, rimRy } = getVessel(w, h);
      const halfW = vW / 2;
      const glassThickness = 3;

      // --- Shadow under vessel ---
      const shadowGrad = ctx.createRadialGradient(cx, bottomY + rimRy + 8, rimRx * 0.3, cx, bottomY + rimRy + 8, rimRx * 1.2);
      shadowGrad.addColorStop(0, 'rgba(0,0,0,0.25)');
      shadowGrad.addColorStop(0.6, 'rgba(0,0,0,0.08)');
      shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.ellipse(cx, bottomY + rimRy + 8, rimRx * 1.2, rimRy * 0.8, 0, 0, Math.PI * 2);
      ctx.fillStyle = shadowGrad;
      ctx.fill();

      // --- Back half of bottom ellipse ---
      ctx.beginPath();
      ctx.ellipse(cx, bottomY, rimRx, rimRy, 0, Math.PI, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // --- Glass body fill with subtle gradient ---
      ctx.save();
      const bodyGrad = ctx.createLinearGradient(cx - halfW, topY, cx + halfW, topY);
      bodyGrad.addColorStop(0, 'rgba(200,220,255,0.03)');
      bodyGrad.addColorStop(0.12, 'rgba(200,220,255,0.08)');
      bodyGrad.addColorStop(0.25, 'rgba(200,220,255,0.02)');
      bodyGrad.addColorStop(0.5, 'rgba(200,220,255,0.04)');
      bodyGrad.addColorStop(0.75, 'rgba(200,220,255,0.02)');
      bodyGrad.addColorStop(0.88, 'rgba(200,220,255,0.08)');
      bodyGrad.addColorStop(1, 'rgba(200,220,255,0.03)');

      ctx.beginPath();
      ctx.ellipse(cx, topY, rimRx, rimRy, 0, Math.PI, Math.PI * 2);
      ctx.lineTo(cx + halfW, bottomY);
      ctx.ellipse(cx, bottomY, rimRx, rimRy, 0, 0, Math.PI);
      ctx.lineTo(cx - halfW, topY);
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // --- Glass thickness effect (double wall) ---
      // Outer left wall
      ctx.beginPath();
      ctx.moveTo(cx - halfW, topY);
      ctx.lineTo(cx - halfW, bottomY);
      ctx.strokeStyle = 'rgba(200,220,255,0.25)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Inner left wall (thickness)
      ctx.beginPath();
      ctx.moveTo(cx - halfW + glassThickness, topY + rimRy * 0.5);
      ctx.lineTo(cx - halfW + glassThickness, bottomY - rimRy * 0.3);
      ctx.strokeStyle = 'rgba(200,220,255,0.10)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Outer right wall
      ctx.beginPath();
      ctx.moveTo(cx + halfW, topY);
      ctx.lineTo(cx + halfW, bottomY);
      ctx.strokeStyle = 'rgba(200,220,255,0.20)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Inner right wall (thickness)
      ctx.beginPath();
      ctx.moveTo(cx + halfW - glassThickness, topY + rimRy * 0.5);
      ctx.lineTo(cx + halfW - glassThickness, bottomY - rimRy * 0.3);
      ctx.strokeStyle = 'rgba(200,220,255,0.08)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // --- Front half of bottom ellipse ---
      ctx.beginPath();
      ctx.ellipse(cx, bottomY, rimRx, rimRy, 0, 0, Math.PI);
      ctx.strokeStyle = 'rgba(200,220,255,0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // --- Bottom inner ellipse (glass thickness at base) ---
      ctx.beginPath();
      ctx.ellipse(cx, bottomY - 2, rimRx - glassThickness, rimRy * 0.75, 0, 0, Math.PI);
      ctx.strokeStyle = 'rgba(200,220,255,0.08)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // --- Glass reflection highlights ---
      // Primary reflection (left)
      const refGrad1 = ctx.createLinearGradient(cx - halfW * 0.7, topY, cx - halfW * 0.6, topY);
      refGrad1.addColorStop(0, 'rgba(255,255,255,0)');
      refGrad1.addColorStop(0.5, 'rgba(255,255,255,0.14)');
      refGrad1.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.beginPath();
      ctx.moveTo(cx - halfW * 0.72, topY + rimRy * 2);
      ctx.lineTo(cx - halfW * 0.68, bottomY - rimRy * 2);
      ctx.lineTo(cx - halfW * 0.58, bottomY - rimRy * 2);
      ctx.lineTo(cx - halfW * 0.62, topY + rimRy * 2);
      ctx.closePath();
      ctx.fillStyle = refGrad1;
      ctx.fill();

      // Secondary reflection (right, thinner)
      ctx.beginPath();
      ctx.moveTo(cx + halfW * 0.55, topY + rimRy * 3);
      ctx.lineTo(cx + halfW * 0.57, bottomY - rimRy * 2.5);
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Curved highlight near top-left
      ctx.beginPath();
      ctx.arc(cx - halfW * 0.4, topY + rimRy * 4, halfW * 0.15, -0.5, 0.8);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();

      // --- Top rim ellipse (full, with thickness) ---
      // Outer rim
      ctx.beginPath();
      ctx.ellipse(cx, topY, rimRx, rimRy, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(200,220,255,0.35)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner rim (glass thickness)
      ctx.beginPath();
      ctx.ellipse(cx, topY, rimRx - glassThickness, rimRy * 0.8, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(200,220,255,0.12)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Rim fill
      ctx.beginPath();
      ctx.ellipse(cx, topY, rimRx, rimRy, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200,220,255,0.04)';
      ctx.fill();

      // --- Rim highlight spot ---
      const rimSpotX = cx - rimRx * 0.5;
      ctx.beginPath();
      ctx.ellipse(rimSpotX, topY - rimRy * 0.1, rimRx * 0.15, rimRy * 0.3, -0.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.15 + Math.sin(t * 0.5) * 0.05})`;
      ctx.fill();

      // --- Ambient sparkles ---
      for (let i = 0; i < 6; i++) {
        const sx = cx + Math.sin(t * 0.35 + i * 1.1) * halfW * 0.6;
        const sy = topY + (bottomY - topY) * (0.25 + Math.cos(t * 0.2 + i * 0.8) * 0.3);
        const sa = 0.03 + Math.sin(t * 0.6 + i * 1.7) * 0.025;
        ctx.beginPath();
        ctx.arc(sx, sy, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,255,${sa})`;
        ctx.fill();
      }
    };

    // === Draw caustic color reflections on vessel floor ===
    const drawCaustics = (w: number, h: number, t: number) => {
      const vessel = getVessel(w, h);
      const settled = settledRef.current;
      if (settled.length === 0) return;

      settled.forEach(stone => {
        const { r, g, b } = stone.color;
        // Colored light pool beneath each stone
        const caustY = vessel.bottomY - vessel.rimRy * 0.5;
        const caustGrad = ctx.createRadialGradient(
          stone.x, caustY, 0,
          stone.x, caustY, stone.radius * 2
        );
        caustGrad.addColorStop(0, `rgba(${r},${g},${b},${0.08 + Math.sin(t * 0.8 + stone.shimmerPhase) * 0.03})`);
        caustGrad.addColorStop(0.5, `rgba(${r},${g},${b},0.03)`);
        caustGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.ellipse(stone.x, caustY, stone.radius * 2, stone.radius * 0.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = caustGrad;
        ctx.fill();
      });
    };

    // === Update and draw floating particles ===
    const updateParticles = (w: number, h: number, t: number) => {
      const vessel = getVessel(w, h);
      const settled = settledRef.current;
      const particles = particlesRef.current;
      const halfW = vessel.vW / 2;

      // Spawn particles from settled stones
      if (settled.length > 0 && particles.length < 30 && Math.random() < 0.15) {
        const src = settled[Math.floor(Math.random() * settled.length)];
        particles.push({
          x: src.x + (Math.random() - 0.5) * src.radius,
          y: src.y - src.radius * 0.5,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -(0.15 + Math.random() * 0.25),
          size: 0.5 + Math.random() * 1.2,
          alpha: 0,
          life: 0,
          maxLife: 120 + Math.random() * 180,
          color: { ...src.color },
        });
      }

      // Update and draw
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx + Math.sin(t * 1.5 + p.y * 0.02) * 0.08;
        p.y += p.vy;
        p.vx *= 0.99;
        p.vy *= 0.998;

        // Keep inside vessel
        const lw = vessel.cx - halfW + 5;
        const rw = vessel.cx + halfW - 5;
        if (p.x < lw) p.x = lw;
        if (p.x > rw) p.x = rw;
        if (p.y < vessel.topY + vessel.rimRy) p.y = vessel.topY + vessel.rimRy;

        // Fade in/out
        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.1) {
          p.alpha = lifeRatio / 0.1;
        } else if (lifeRatio > 0.7) {
          p.alpha = (1 - lifeRatio) / 0.3;
        } else {
          p.alpha = 1;
        }

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle
        const pa = p.alpha * 0.35;
        const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        pGrad.addColorStop(0, `rgba(${p.color.r},${p.color.g},${p.color.b},${pa})`);
        pGrad.addColorStop(0.5, `rgba(${p.color.r},${p.color.g},${p.color.b},${pa * 0.4})`);
        pGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = pGrad;
        ctx.fill();

        // Bright core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${pa * 0.6})`;
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

      // Draw vessel
      drawVessel(w, h, t);

      // Draw caustics on vessel floor
      drawCaustics(w, h, t);

      // === Resolve overlaps between settled stones ===
      const floorY = vessel.bottomY - vessel.rimRy;
      const settled = settledRef.current;
      for (let i = 0; i < settled.length; i++) {
        const a = settled[i];
        const maxY = floorY - a.radius - 2;
        if (a.y > maxY) a.y = maxY;
        const lw = vessel.cx - halfW + a.radius + 3;
        const rw = vessel.cx + halfW - a.radius - 3;
        if (a.x < lw) a.x = lw;
        if (a.x > rw) a.x = rw;
        for (let j = i + 1; j < settled.length; j++) {
          const b = settled[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = a.radius + b.radius;
          if (dist < minDist && dist > 0.1) {
            const nx = dx / dist;
            const ny = dy / dist;
            const push = (minDist - dist) * 0.5;
            a.x += nx * push;
            a.y += ny * push;
            b.x -= nx * push;
            b.y -= ny * push;
          }
        }
      }

      // === Draw settled stones ===
      settled.forEach(stone => {
        stone.shimmerPhase += 0.015;
        const shimmer = 0.78 + Math.sin(stone.shimmerPhase) * 0.22;
        drawStone(stone.x, stone.y, stone.radius, stone.rotation, stone.shape, stone.facetLines, stone.color, 1, shimmer, t);
      });

      // === Floating particles ===
      updateParticles(w, h, t);

      // === Physics for falling stones ===
      const toSettle: FallingStone[] = [];

      fallingRef.current.forEach((stone, si) => {
        if (stone.phase !== 'falling') return;

        stone.opacity = Math.min(1, stone.opacity + 0.04);
        stone.vy += GRAVITY;
        stone.vy *= AIR_RESIST;
        stone.vx *= FRICTION;
        stone.x += stone.vx;
        stone.y += stone.vy;
        stone.rotation += stone.angularVel;
        stone.angularVel *= 0.94;
        if (stone.angularVel > 0.05) stone.angularVel = 0.05;
        if (stone.angularVel < -0.05) stone.angularVel = -0.05;

        stone.vx += Math.sin(t * 2.5 + stone.shimmerPhase) * 0.02;

        const leftWall = vessel.cx - halfW + stone.radius + 3;
        const rightWall = vessel.cx + halfW - stone.radius - 3;
        if (stone.y > vessel.topY) {
          if (stone.x < leftWall) {
            stone.x = leftWall;
            stone.vx = Math.abs(stone.vx) * BOUNCE;
            stone.angularVel *= 0.3;
          }
          if (stone.x > rightWall) {
            stone.x = rightWall;
            stone.vx = -Math.abs(stone.vx) * BOUNCE;
            stone.angularVel *= 0.3;
          }
        }

        const stoneFloor = floorY - stone.radius - 2;
        if (stone.y >= stoneFloor) {
          stone.y = stoneFloor;
          if (Math.abs(stone.vy) < 1.5) {
            stone.phase = 'settled';
            stone.settled = true;
            stone.angularVel = 0;
            toSettle.push(stone);
          } else {
            stone.vy = -Math.abs(stone.vy) * BOUNCE;
            stone.angularVel *= 0.3;
          }
        }

        settled.forEach(other => {
          const dx = stone.x - other.x;
          const dy = stone.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = stone.radius + other.radius;
          if (dist < minDist && dist > 0.1) {
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = minDist - dist;
            stone.x += nx * overlap;
            stone.y += ny * overlap;
            const dot = stone.vx * nx + stone.vy * ny;
            if (dot < 0) {
              stone.vx -= 2 * dot * nx * 0.3;
              stone.vy -= 2 * dot * ny * 0.3;
            }
            stone.angularVel *= 0.2;
            if (Math.abs(stone.vy) < 1.5 && Math.abs(stone.vx) < 1.0) {
              stone.phase = 'settled';
              stone.settled = true;
              stone.angularVel = 0;
              toSettle.push(stone);
            }
          }
        });

        for (let j = si + 1; j < fallingRef.current.length; j++) {
          const other = fallingRef.current[j];
          if (other.settled) continue;
          const dx = stone.x - other.x;
          const dy = stone.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = stone.radius + other.radius;
          if (dist < minDist && dist > 0.1) {
            const nx = dx / dist;
            const ny = dy / dist;
            const push = (minDist - dist) * 0.5;
            stone.x += nx * push;
            stone.y += ny * push;
            other.x -= nx * push;
            other.y -= ny * push;
            const relVx = stone.vx - other.vx;
            const relVy = stone.vy - other.vy;
            const relDot = relVx * nx + relVy * ny;
            if (relDot < 0) {
              stone.vx -= relDot * nx * 0.3;
              stone.vy -= relDot * ny * 0.3;
              other.vx += relDot * nx * 0.3;
              other.vy += relDot * ny * 0.3;
            }
            stone.angularVel *= 0.4;
            other.angularVel *= 0.4;
          }
        }

        // Draw falling stone
        if (!stone.settled) {
          stone.shimmerPhase += 0.03;
          const shimmer = 0.8 + Math.sin(stone.shimmerPhase) * 0.2;

          // Trail glow
          for (let i = 1; i <= 3; i++) {
            const ty = stone.y - stone.vy * i * 2;
            const ta = stone.opacity * (0.1 / i);
            if (ty > 0) {
              ctx.beginPath();
              ctx.arc(stone.x, ty, stone.radius * (0.4 / i), 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${stone.color.r},${stone.color.g},${stone.color.b},${ta})`;
              ctx.fill();
            }
          }

          drawStone(stone.x, stone.y, stone.radius, stone.rotation, stone.shape, stone.facetLines, stone.color, stone.opacity, shimmer, t);
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
          facetLines: s.facetLines,
          shimmerPhase: s.shimmerPhase,
          targetX: s.x,
          targetY: s.y,
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
