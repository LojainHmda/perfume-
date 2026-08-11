import React, { useEffect, useRef } from 'react';

interface CinematicCanvasProps {
  type: 'ruby_essence' | 'liquid_amber' | 'noir_ripples' | 'chess_monochrome' | 'white_velvet' | 'golden_suede' | 'crimson_smoke' | 'raw_honey';
  className?: string;
  isHovered?: boolean;
}

export const CinematicCanvas: React.FC<CinematicCanvasProps> = ({ type, className = '', isHovered = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle / Fluid simulation state
    const particlesCount = 45;
    const particles = Array.from({ length: particlesCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 40 + 10,
      alpha: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }));

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Base atmospheric color gradient depending on video type
      const baseGrad = ctx.createLinearGradient(0, 0, width, height);

      if (type === 'ruby_essence' || type === 'crimson_smoke') {
        baseGrad.addColorStop(0, '#100204');
        baseGrad.addColorStop(0.5, '#2e040a');
        baseGrad.addColorStop(1, '#050001');
      } else if (type === 'white_velvet') {
        baseGrad.addColorStop(0, '#121214');
        baseGrad.addColorStop(0.5, '#222126');
        baseGrad.addColorStop(1, '#0c0c0e');
      } else if (type === 'golden_suede' || type === 'raw_honey') {
        baseGrad.addColorStop(0, '#140d04');
        baseGrad.addColorStop(0.5, '#2a1a08');
        baseGrad.addColorStop(1, '#080501');
      } else {
        // Noir / Chess monochrome
        baseGrad.addColorStop(0, '#09090b');
        baseGrad.addColorStop(0.5, '#16161a');
        baseGrad.addColorStop(1, '#050506');
      }

      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // Render procedural animated fluid motion waves
      particles.forEach((p, idx) => {
        p.x += p.vx + Math.sin(time + p.phase) * 0.3;
        p.y += p.vy + Math.cos(time + p.phase) * 0.3;

        if (p.x < -50) p.x = width + 50;
        if (p.x > width + 50) p.x = -50;
        if (p.y < -50) p.y = height + 50;
        if (p.y > height + 50) p.y = -50;

        const pulseScale = isHovered ? 1.4 : 1.0;
        const currentRad = (p.radius + Math.sin(time * 2 + idx) * 8) * pulseScale;

        const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRad * 2);

        if (type === 'ruby_essence') {
          pGrad.addColorStop(0, `rgba(200, 16, 46, ${p.alpha * 0.7})`);
          pGrad.addColorStop(0.5, `rgba(120, 0, 20, ${p.alpha * 0.3})`);
          pGrad.addColorStop(1, 'rgba(0,0,0,0)');
        } else if (type === 'crimson_smoke') {
          pGrad.addColorStop(0, `rgba(180, 20, 50, ${p.alpha * 0.6})`);
          pGrad.addColorStop(0.6, `rgba(50, 10, 20, ${p.alpha * 0.2})`);
          pGrad.addColorStop(1, 'rgba(0,0,0,0)');
        } else if (type === 'white_velvet') {
          pGrad.addColorStop(0, `rgba(240, 235, 225, ${p.alpha * 0.5})`);
          pGrad.addColorStop(0.6, `rgba(180, 175, 170, ${p.alpha * 0.2})`);
          pGrad.addColorStop(1, 'rgba(0,0,0,0)');
        } else if (type === 'golden_suede' || type === 'raw_honey') {
          pGrad.addColorStop(0, `rgba(230, 180, 60, ${p.alpha * 0.65})`);
          pGrad.addColorStop(0.5, `rgba(140, 90, 20, ${p.alpha * 0.25})`);
          pGrad.addColorStop(1, 'rgba(0,0,0,0)');
        } else {
          // Noir chess monochrome
          pGrad.addColorStop(0, `rgba(255, 255, 255, ${p.alpha * 0.35})`);
          pGrad.addColorStop(0.5, `rgba(80, 80, 90, ${p.alpha * 0.15})`);
          pGrad.addColorStop(1, 'rgba(0,0,0,0)');
        }

        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRad * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Overlay synchronized light sweep effect across all 4 panels
      const sweepX = (Math.sin(time * 0.8) * 0.5 + 0.5) * width;
      const sweepGrad = ctx.createLinearGradient(sweepX - 80, 0, sweepX + 80, height);
      sweepGrad.addColorStop(0, 'rgba(255,255,255,0)');
      sweepGrad.addColorStop(0.5, 'rgba(255,255,255,0.04)');
      sweepGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = sweepGrad;
      ctx.fillRect(0, 0, width, height);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [type, isHovered]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full block pointer-events-none transition-transform duration-700 ${className}`}
    />
  );
};
