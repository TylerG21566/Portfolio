import { useRef, useEffect } from 'react';

// Dots and lines background component
export default function DotsLinesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = window.devicePixelRatio || 1;
    const DOTS = 60;
    // Assign each dot a color
    const COLORS = [
      '#ff5e5b', // red
      '#fbb13c', // orange
      '#3ec300', // green
      '#00a6ed', // blue
      '#8f2dff', // purple
      '#ff4ecd', // pink
      '#00e6c3', // teal
      '#ffd700', // yellow
    ];
    type Dot = { x: number; y: number; vx: number; vy: number; color: string };
    const dots: Dot[] = [];
    function resize() {
      if (!canvas || !ctx) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    // Initialize dots
    if (dots.length === 0) {
      for (let i = 0; i < DOTS; i++) {
        dots.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          color: COLORS[i % COLORS.length],
        });
      }
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      // Draw lines
      for (let i = 0; i < DOTS; i++) {
        for (let j = i + 1; j < DOTS; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            // Blend the two dot colors for the line
            const grad = ctx.createLinearGradient(dots[i].x, dots[i].y, dots[j].x, dots[j].y);
            grad.addColorStop(0, dots[i].color);
            grad.addColorStop(1, dots[j].color);
            ctx.strokeStyle = grad;
            ctx.globalAlpha = 0.5 * (1 - dist / 120) + 0.2;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
      // Draw dots
      for (let i = 0; i < DOTS; i++) {
        ctx.beginPath();
        ctx.arc(dots[i].x, dots[i].y, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = dots[i].color;
        ctx.shadowColor = dots[i].color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function animate() {
      for (let i = 0; i < DOTS; i++) {
        dots[i].x += dots[i].vx;
        dots[i].y += dots[i].vy;
        if (dots[i].x < 0 || dots[i].x > width) dots[i].vx *= -1;
        if (dots[i].y < 0 || dots[i].y > height) dots[i].vy *= -1;
      }
      draw();
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
