'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulseVal: number;
}

export default function CelestialHeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse tracking for subtle celestial parallax
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Initialize particles
    const particleCount = Math.min(85, Math.floor(width / 18));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.6 + 0.6,
        baseAlpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseVal: Math.random() * Math.PI * 2,
      });
    }

    // Celestial orbital rotation angle
    let orbitAngle = 0;

    const render = () => {
      // Smooth mouse easing
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Central core coordinates
      const centerX = width / 2;
      const centerY = height * 0.48;

      // 1. Draw concentric animated orbital rings
      orbitAngle += 0.0018;

      const orbitalRings = [
        { radius: Math.min(width * 0.38, 340), speed: 1, alpha: 0.12, dash: [4, 8], nodes: 3 },
        { radius: Math.min(width * 0.28, 250), speed: -1.4, alpha: 0.16, dash: [1, 5], nodes: 4 },
        { radius: Math.min(width * 0.18, 160), speed: 1.8, alpha: 0.22, dash: [], nodes: 2 },
        { radius: Math.min(width * 0.09, 80), speed: -2.5, alpha: 0.28, dash: [2, 4], nodes: 1 },
      ];

      orbitalRings.forEach((ring) => {
        ctx.save();
        ctx.translate(centerX, centerY);

        // Ring ellipse with tilt
        ctx.beginPath();
        ctx.arc(0, 0, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(129, 140, 248, ${ring.alpha})`;
        ctx.lineWidth = 1;
        if (ring.dash.length > 0) ctx.setLineDash(ring.dash);
        ctx.stroke();

        // Draw animated orbital nodes on the ring
        const currentAngle = orbitAngle * ring.speed;
        for (let n = 0; n < ring.nodes; n++) {
          const nodeAngle = currentAngle + (n * (Math.PI * 2)) / ring.nodes;
          const nx = Math.cos(nodeAngle) * ring.radius;
          const ny = Math.sin(nodeAngle) * ring.radius;

          ctx.beginPath();
          ctx.arc(nx, ny, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#a5b4fc';
          ctx.shadowColor = '#6366f1';
          ctx.shadowBlur = 10;
          ctx.fill();

          // Connect node to center if innermost
          if (ring.radius < 180) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(nx, ny);
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        ctx.restore();
      });

      // 2. Draw central celestial nucleus
      const nucleusGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        140
      );
      nucleusGradient.addColorStop(0, 'rgba(99, 102, 241, 0.22)');
      nucleusGradient.addColorStop(0.4, 'rgba(79, 70, 229, 0.08)');
      nucleusGradient.addColorStop(1, 'rgba(15, 23, 42, 0)');

      ctx.fillStyle = nucleusGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 140, 0, Math.PI * 2);
      ctx.fill();

      // Core anchor point
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#818cf8';
      ctx.shadowBlur = 15;
      ctx.fill();

      // 3. Update & render constellation particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.pulseVal += p.pulseSpeed;
        const currentAlpha = p.baseAlpha + Math.sin(p.pulseVal) * 0.15;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 231, 255, ${Math.max(0.1, currentAlpha)})`;
        ctx.fill();

        // Connect nearby particles to form constellation graphs
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.14;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(165, 180, 252, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Connect particles near cursor
        const mdx = p.x - mouseX;
        const mdy = p.y - mouseY;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 140) {
          const mLineAlpha = (1 - mdist / 140) * 0.28;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(199, 210, 254, ${mLineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <canvas ref={canvasRef} className="w-full h-full block opacity-90" />
      {/* Vignette gradients to blend seamlessly into background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
    </div>
  );
}
