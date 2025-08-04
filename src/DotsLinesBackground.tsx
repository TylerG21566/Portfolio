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
  
  const DOTS = 6;
  const MIN_LINE_DIST = 120;
  const MIN_LINE_DIST_SQUARED = MIN_LINE_DIST * MIN_LINE_DIST; // Avoid sqrt
  
  // Pre-calculate constants
  const DOT_RADIUS = 2.8;
  const PI_2 = Math.PI * 2;
  const LINE_WIDTH = 1.2;
  const SHADOW_BLUR = 8;
  
  const COLORS = [
    '#ff5e5b', '#fbb13c', '#3ec300', '#00a6ed',
    '#8f2dff', '#ff4ecd', '#00e6c3ff', '#ffd700',
  ];

  type Dot = { x: number; y: number; vx: number; vy: number; color: string };
  const dots: Dot[] = [];

  // Pre-create gradients cache to avoid recreating them each frame
  const gradientCache = new Map<string, CanvasGradient>();

  function getGradient(x1: number, y1: number, x2: number, y2: number, color1: string, color2: string): CanvasGradient | string {
    const key = `${Math.round(x1)},${Math.round(y1)},${Math.round(x2)},${Math.round(y2)},${color1},${color2}`;
    let grad = gradientCache.get(key);
    if (!grad) {
      if (!ctx) {
        // Fallback: just return color1 if ctx is null
        return color1;
      }
      grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, color1);
      grad.addColorStop(1, color2);
      gradientCache.set(key, grad);
      // Limit cache size
      if (gradientCache.size > 100) {
        const firstKey = gradientCache.keys().next().value;
        if (typeof firstKey === 'string') {
          gradientCache.delete(firstKey);
        }
      }
    }
    return grad;
  }

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
    
    // Clear gradient cache on resize
    gradientCache.clear();
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Initialize dots only once
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
    
    // Clear with a single operation
    ctx.clearRect(0, 0, width, height);
    
    // Batch similar drawing operations
    ctx.lineWidth = LINE_WIDTH;
    /*
    // Draw lines first (behind dots)
    for (let i = 0; i < DOTS; i++) {
      const dot1 = dots[i];
      for (let j = i + 1; j < DOTS; j++) {
        const dot2 = dots[j];
       
        const dx = dot1.x - dot2.x;
        const dy = dot1.y - dot2.y;
        const distSquared = dx * dx + dy * dy; // Avoid expensive sqrt
        
        if (distSquared < MIN_LINE_DIST_SQUARED) {
          const dist = Math.sqrt(distSquared); // Only calculate sqrt when needed
          
          ctx.strokeStyle = getGradient(dot1.x, dot1.y, dot2.x, dot2.y, dot1.color, dot2.color);
          ctx.globalAlpha = 0.5 * (1 - dist / MIN_LINE_DIST) + 0.2;
          
          ctx.beginPath();
          ctx.moveTo(dot1.x, dot1.y);
          ctx.lineTo(dot2.x, dot2.y);
          ctx.stroke();
        }
          
      }
        
    }
    
    // Reset alpha and set shadow properties once
    ctx.globalAlpha = 1;
    ctx.shadowBlur = SHADOW_BLUR;
    */
    // Draw all dots
    for (let i = 0; i < DOTS; i++) {
      const dot = dots[i];
      ctx.fillStyle = dot.color;
      ctx.shadowColor = dot.color;
      
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, PI_2);
      ctx.fill();
    }
    
    // Reset shadow
    ctx.shadowBlur = 0;
  }

  function animate() {
    // Update positions
    for (let i = 0; i < DOTS; i++) {
      const dot = dots[i];
      dot.x += dot.vx;
      dot.y += dot.vy;
      
      // Boundary collision with proper bouncing
      if (dot.x <= 0 || dot.x >= width) {
        dot.vx *= -1;
        dot.x = Math.max(0, Math.min(width, dot.x)); // Keep in bounds
      }
      if (dot.y <= 0 || dot.y >= height) {
        dot.vy *= -1;
        dot.y = Math.max(0, Math.min(height, dot.y)); // Keep in bounds
      }
    }
    
    draw();
    animationFrameId = requestAnimationFrame(animate);
  }

  animate();

  return () => {
    window.removeEventListener('resize', resize);
    cancelAnimationFrame(animationFrameId);
    gradientCache.clear();
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
