'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  born: number;
}

interface LotusItem {
  id: number;
  x: number;
  y: number;
  type: 'leaf' | 'flower' | 'bud' | 'lilypad';
  scale: number;
  rotation: number;
  driftSpeed: number;
  driftAngle: number;
  bobPhase: number;
}

interface LotusPondProps {
  className?: string;
  variant?: 'dark' | 'aqua';
  parentRef?: React.RefObject<HTMLElement | null>;
}

export function LotusPond({ className = '', variant = 'dark', parentRef }: LotusPondProps) {
  const isAqua = variant === 'aqua';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const lotusRef = useRef<LotusItem[]>([]);
  const mouseRef = useRef({ x: -1, y: -1 });
  const frameRef = useRef(0);
  const lastRippleRef = useRef(0);
  const [isReady, setIsReady] = useState(false);

  // Initialize lotus elements
  const initLotus = useCallback((w: number, h: number) => {
    const items: LotusItem[] = [];
    const count = Math.floor((w * h) / 40000); // Density based on area

    for (let i = 0; i < Math.max(count, 8); i++) {
      items.push({
        id: i,
        x: Math.random() * w,
        y: Math.random() * h,
        type: ['leaf', 'leaf', 'leaf', 'flower', 'bud', 'lilypad', 'lilypad', 'lilypad'][i % 8] as LotusItem['type'],
        scale: 0.5 + Math.random() * 0.6,
        rotation: Math.random() * Math.PI * 2,
        driftSpeed: 0.1 + Math.random() * 0.2,
        driftAngle: Math.random() * Math.PI * 2,
        bobPhase: Math.random() * Math.PI * 2,
      });
    }
    lotusRef.current = items;
  }, []);

  // Draw a lotus leaf (lilypad)
  const drawLilypad = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, rot: number, time: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot + Math.sin(time * 0.3) * 0.05);
    const s = scale * 20;

    // Pad shadow
    ctx.beginPath();
    ctx.arc(2, 2, s, 0, Math.PI * 2);
    ctx.fillStyle = isAqua ? 'rgba(30, 100, 50, 0.25)' : 'rgba(10, 40, 30, 0.15)';
    ctx.fill();

    // Lilypad circle with notch
    ctx.beginPath();
    ctx.arc(0, 0, s, 0.15, Math.PI * 2 - 0.15);
    ctx.lineTo(0, 0);
    ctx.closePath();

    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, s);
    if (isAqua) {
      grad.addColorStop(0, 'rgba(45, 130, 65, 0.8)');
      grad.addColorStop(0.6, 'rgba(38, 115, 55, 0.7)');
      grad.addColorStop(1, 'rgba(30, 100, 45, 0.6)');
    } else {
      grad.addColorStop(0, 'rgba(45, 100, 70, 0.55)');
      grad.addColorStop(0.6, 'rgba(35, 85, 55, 0.45)');
      grad.addColorStop(1, 'rgba(25, 70, 45, 0.35)');
    }
    ctx.fillStyle = grad;
    ctx.fill();

    // Veins
    ctx.strokeStyle = isAqua ? 'rgba(50, 120, 60, 0.35)' : 'rgba(60, 120, 80, 0.2)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + 0.3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * s * 0.85, Math.sin(a) * s * 0.85);
      ctx.stroke();
    }

    ctx.restore();
  }, [isAqua]);

  // Draw lotus flower
  const drawFlower = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, rot: number, time: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    const s = scale * 14;
    const bob = Math.sin(time * 0.4) * 1.5;

    // Petals
    const petalCount = 8;
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      ctx.save();
      ctx.rotate(angle);
      ctx.translate(0, -s * 0.4 + bob * 0.3);

      ctx.beginPath();
      ctx.ellipse(0, -s * 0.3, s * 0.28, s * 0.55, 0, 0, Math.PI * 2);

      const pGrad = ctx.createRadialGradient(0, -s * 0.2, 0, 0, -s * 0.3, s * 0.5);
      if (isAqua) {
        pGrad.addColorStop(0, 'rgba(235, 160, 175, 0.8)');
        pGrad.addColorStop(0.5, 'rgba(220, 140, 160, 0.65)');
        pGrad.addColorStop(1, 'rgba(200, 120, 145, 0.5)');
      } else {
        pGrad.addColorStop(0, 'rgba(230, 180, 190, 0.5)');
        pGrad.addColorStop(0.5, 'rgba(210, 150, 165, 0.4)');
        pGrad.addColorStop(1, 'rgba(190, 130, 150, 0.25)');
      }
      ctx.fillStyle = pGrad;
      ctx.fill();
      ctx.restore();
    }

    // Center
    ctx.beginPath();
    ctx.arc(0, bob * 0.5, s * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = isAqua ? 'rgba(240, 200, 120, 0.7)' : 'rgba(220, 190, 80, 0.45)';
    ctx.fill();

    // Center dots
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * s * 0.1, Math.sin(a) * s * 0.1 + bob * 0.5, 1, 0, Math.PI * 2);
      ctx.fillStyle = isAqua ? 'rgba(220, 180, 90, 0.6)' : 'rgba(180, 150, 50, 0.4)';
      ctx.fill();
    }

    ctx.restore();
  }, [isAqua]);

  // Draw lotus bud
  const drawBud = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, rot: number, time: number) => {
    ctx.save();
    ctx.translate(x, y);
    const s = scale * 10;
    const bob = Math.sin(time * 0.5 + rot) * 2;

    // Stem
    ctx.beginPath();
    ctx.moveTo(0, s * 0.8);
    ctx.quadraticCurveTo(s * 0.15, s * 0.2, 0, -s * 0.5 + bob);
    ctx.strokeStyle = isAqua ? 'rgba(45, 120, 55, 0.45)' : 'rgba(50, 100, 60, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Bud petals
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.ellipse(i * s * 0.12, -s * 0.5 + bob, s * 0.15, s * 0.35, i * 0.15, 0, Math.PI * 2);
      if (isAqua) {
        ctx.fillStyle = i === 0 ? 'rgba(230, 155, 170, 0.75)' : 'rgba(215, 140, 158, 0.6)';
      } else {
        ctx.fillStyle = i === 0 ? 'rgba(220, 170, 180, 0.45)' : 'rgba(200, 155, 165, 0.35)';
      }
      ctx.fill();
    }

    ctx.restore();
  }, [isAqua]);

  // Draw leaf
  const drawLeaf = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, rot: number, time: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot + Math.sin(time * 0.25 + x * 0.01) * 0.08);
    const s = scale * 16;

    // Leaf shape
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * 0.6, -s * 0.6, s * 0.5, s * 0.3, 0, s * 0.8);
    ctx.bezierCurveTo(-s * 0.5, s * 0.3, -s * 0.6, -s * 0.6, 0, -s);

    const lGrad = ctx.createLinearGradient(0, -s, 0, s);
    if (isAqua) {
      lGrad.addColorStop(0, 'rgba(50, 135, 60, 0.75)');
      lGrad.addColorStop(1, 'rgba(40, 120, 50, 0.6)');
    } else {
      lGrad.addColorStop(0, 'rgba(40, 90, 55, 0.4)');
      lGrad.addColorStop(1, 'rgba(30, 75, 45, 0.25)');
    }
    ctx.fillStyle = lGrad;
    ctx.fill();

    // Center vein
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.9);
    ctx.lineTo(0, s * 0.7);
    ctx.strokeStyle = isAqua ? 'rgba(55, 130, 60, 0.35)' : 'rgba(55, 110, 70, 0.2)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    ctx.restore();
  }, [isAqua]);

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      canvas.style.width = `${parent.clientWidth}px`;
      canvas.style.height = `${parent.clientHeight}px`;
      ctx.scale(dpr, dpr);
      initLotus(parent.clientWidth, parent.clientHeight);
    };

    resize();
    setIsReady(true);
    window.addEventListener('resize', resize);

    let animId: number;

    const animate = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const time = frameRef.current * 0.016; // ~60fps time
      frameRef.current++;

      // Clear
      ctx.clearRect(0, 0, w, h);

      // Water base gradient
      const waterGrad = ctx.createLinearGradient(0, 0, 0, h);
      if (isAqua) {
        waterGrad.addColorStop(0, 'rgba(218, 234, 245, 1)');
        waterGrad.addColorStop(0.5, 'rgba(210, 228, 242, 1)');
        waterGrad.addColorStop(1, 'rgba(218, 234, 245, 1)');
      } else {
        waterGrad.addColorStop(0, 'rgba(15, 35, 55, 0.6)');
        waterGrad.addColorStop(0.5, 'rgba(20, 50, 65, 0.5)');
        waterGrad.addColorStop(1, 'rgba(12, 30, 48, 0.6)');
      }
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, 0, w, h);

      // Subtle water caustics / light patterns
      ctx.save();
      ctx.globalAlpha = 0.03;
      for (let i = 0; i < 6; i++) {
        const cx = w * 0.5 + Math.sin(time * 0.1 + i) * w * 0.3;
        const cy = h * 0.5 + Math.cos(time * 0.08 + i * 1.5) * h * 0.3;
        const r = 80 + Math.sin(time * 0.15 + i) * 30;
        const cGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        cGrad.addColorStop(0, 'rgba(90, 142, 174, 1)');
        cGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = cGrad;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.restore();

      // Draw lotus items (behind ripples)
      lotusRef.current.forEach((item) => {
        // Gentle drift
        item.x += Math.cos(item.driftAngle) * item.driftSpeed * 0.3;
        item.y += Math.sin(item.driftAngle) * item.driftSpeed * 0.3;

        // Wrap around
        if (item.x < -40) item.x = w + 40;
        if (item.x > w + 40) item.x = -40;
        if (item.y < -40) item.y = h + 40;
        if (item.y > h + 40) item.y = -40;

        // Push away from cursor
        const dx = item.x - mouseRef.current.x;
        const dy = item.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100 && dist > 0) {
          const force = (100 - dist) / 100 * 0.8;
          item.x += (dx / dist) * force;
          item.y += (dy / dist) * force;
        }

        switch (item.type) {
          case 'lilypad': drawLilypad(ctx, item.x, item.y, item.scale, item.rotation, time); break;
          case 'flower': drawFlower(ctx, item.x, item.y, item.scale, item.rotation, time); break;
          case 'bud': drawBud(ctx, item.x, item.y, item.scale, item.rotation, time); break;
          case 'leaf': drawLeaf(ctx, item.x, item.y, item.scale, item.rotation, time); break;
        }
      });

      // Draw ripples
      const now = Date.now();
      ripplesRef.current = ripplesRef.current.filter((r) => {
        const age = (now - r.born) / 1000;
        if (age > 2) return false;

        const progress = age / 2;
        const radius = r.radius + progress * 80;
        const opacity = r.opacity * (1 - progress) * (1 - progress);

        // Multiple concentric rings
        for (let ring = 0; ring < 3; ring++) {
          const ringR = radius - ring * 8;
          if (ringR <= 0) continue;

          ctx.beginPath();
          ctx.arc(r.x, r.y, ringR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(139, 184, 214, ${opacity * (1 - ring * 0.3)})`;
          ctx.lineWidth = 1.2 - ring * 0.3;
          ctx.stroke();
        }

        return true;
      });

      // Subtle surface shimmer lines
      ctx.save();
      ctx.globalAlpha = 0.02;
      ctx.strokeStyle = 'rgba(139, 184, 214, 1)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 8; i++) {
        const sy = (h / 8) * i + Math.sin(time * 0.2 + i) * 10;
        ctx.beginPath();
        ctx.moveTo(0, sy);
        for (let px = 0; px < w; px += 20) {
          ctx.lineTo(px, sy + Math.sin(px * 0.01 + time * 0.3 + i) * 3);
        }
        ctx.stroke();
      }
      ctx.restore();

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [initLotus, drawLilypad, drawFlower, drawBud, drawLeaf, isAqua]);

  // Forward mouse events from parent element (when canvas is behind z-indexed content)
  useEffect(() => {
    const parent = parentRef?.current;
    if (!parent) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current = { x, y };

      const now = Date.now();
      if (now - lastRippleRef.current > 120) {
        ripplesRef.current.push({
          x, y, radius: 2 + Math.random() * 4, opacity: 0.25 + Math.random() * 0.1, born: now,
        });
        lastRippleRef.current = now;
      }
    };

    const onLeave = () => {
      mouseRef.current = { x: -999, y: -999 };
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      for (let i = 0; i < 3; i++) {
        ripplesRef.current.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          radius: 5 + i * 8,
          opacity: 0.35 - i * 0.08,
          born: Date.now() + i * 100,
        });
      }
    };

    parent.addEventListener('pointermove', onMove);
    parent.addEventListener('pointerleave', onLeave);
    parent.addEventListener('click', onClick);
    return () => {
      parent.removeEventListener('pointermove', onMove);
      parent.removeEventListener('pointerleave', onLeave);
      parent.removeEventListener('click', onClick);
    };
  }, [parentRef]);

  // Mouse/touch handlers
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseRef.current = { x, y };

    const now = Date.now();
    if (now - lastRippleRef.current > 120) {
      ripplesRef.current.push({
        x, y, radius: 2 + Math.random() * 4, opacity: 0.25 + Math.random() * 0.1, born: now,
      });
      lastRippleRef.current = now;
    }
  }, []);

  const handlePointerLeave = useCallback(() => {
    mouseRef.current = { x: -999, y: -999 };
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Bigger ripple on click
    for (let i = 0; i < 3; i++) {
      ripplesRef.current.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        radius: 5 + i * 8,
        opacity: 0.35 - i * 0.08,
        born: Date.now() + i * 100,
      });
    }
  }, []);

  return (
    <div className={`absolute inset-0 ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        style={{ opacity: isReady ? 1 : 0, transition: 'opacity 1s ease' }}
      />
    </div>
  );
}
