'use client';

import { useEffect, useRef } from 'react';

interface ParticleFieldProps {
  count?: number;
  className?: string;
}

export default function ParticleField({ count = 65, className = '' }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      maxOpacity: number;
      twinkleSpeed: number;
      twinkleAngle: number;
      color: string;
      isStar: boolean;
    }> = [];

    const goldColors = [
      'rgba(212, 175, 55,',   // Rich Gold (#d4af37)
      'rgba(254, 240, 138,',  // Bright Yellow Gold (#fef08a)
      'rgba(251, 191, 36,',   // Warm Gold (#fbbf24)
      'rgba(245, 158, 11,'    // Deep Amber Gold (#f59e0b)
    ];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const initParticles = () => {
      particles = Array.from({ length: count }, () => {
        const isStar = Math.random() > 0.75;
        return {
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          size: isStar ? Math.random() * 2.2 + 1.2 : Math.random() * 1.8 + 0.6,
          speedX: (Math.random() - 0.5) * 0.25,
          speedY: (Math.random() - 0.5) * 0.25,
          opacity: Math.random() * 0.5 + 0.1,
          maxOpacity: Math.random() * 0.5 + 0.35,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          twinkleAngle: Math.random() * Math.PI * 2,
          color: goldColors[Math.floor(Math.random() * goldColors.length)],
          isStar
        };
      });
    };

    // Draw a glittering 4-point star
    const drawStar = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, color: string, alpha: number) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);

      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }

      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fillStyle = `${color}${alpha})`;
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        // Drift position
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around boundaries
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Twinkle sparkle animation
        p.twinkleAngle += p.twinkleSpeed;
        const currentOpacity = Math.max(0.08, (Math.sin(p.twinkleAngle) * 0.5 + 0.5) * p.maxOpacity);

        if (p.isStar) {
          // Render glittering star sparkle
          drawStar(p.x, p.y, 4, p.size * 2.5, p.size * 0.6, p.color, currentOpacity);
          
          // Soft golden aura around star
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${currentOpacity * 0.25})`;
          ctx.fill();
        } else {
          // Render floating golden dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${currentOpacity})`;
          ctx.fill();

          // Subtle gold halo
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${currentOpacity * 0.18})`;
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();
    initParticles();
    animate();

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
