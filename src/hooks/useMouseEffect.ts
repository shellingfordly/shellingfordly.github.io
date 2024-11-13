import { isDark } from "~/utils";

interface CanvasConfig {
  zIndex: number;
  opacity: number;
  color: string;
  count: number;
}

interface Point {
  x: number | null;
  y: number | null;
  max: number;
}

interface Particle extends Point {
  xa: number;
  ya: number;
}

let animationFrameId: number | null = null;
let isActive = true;
let canvas: HTMLCanvasElement | null = null;
let context: CanvasRenderingContext2D | null = null;

export function useMouseEffect() {
  let width: number;
  let height: number;
  let particles: Particle[] = [];
  let mousePosition: Point = { x: null, y: null, max: 20000 };
  const config: CanvasConfig = {
    zIndex: -1,
    opacity: 0.4,
    color: isDark.value ? '255,255,255' : '0,0,0',
    count: 99
  };

  function createCanvas() {
    canvas = document.createElement('canvas');
    context = canvas.getContext('2d')!;
  }

  function initCanvas() {
    if (!canvas) return;
    canvas.style.cssText = `position:fixed;top:0;left:0;z-index:${config.zIndex};opacity:${config.opacity};pointer-events:none`;
    document.body.appendChild(canvas);
  }

  function updateSize() {
    if (!canvas) return;
    width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    canvas.width = width;
    canvas.height = height;
  }


  function initParticles() {
    particles = [];
    for (let i = 0; i < config.count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        xa: 2 * Math.random() - 1,
        ya: 2 * Math.random() - 1,
        max: 6000
      });
    }
  }

  function drawParticles() {
    if (!isActive) return;
    if (!context) return;

    context.clearRect(0, 0, width, height);

    const allParticles = [...particles, mousePosition];

    particles.forEach((p, idx) => {
      p.x! += p.xa;
      p.y! += p.ya;
      p.xa *= p.x! > width || p.x! < 0 ? -1 : 1;
      p.ya *= p.y! > height || p.y! < 0 ? -1 : 1;

      context?.fillRect(p.x! - 0.5, p.y! - 0.5, 1, 1);

      for (let i = idx + 1; i < allParticles.length; i++) {
        const p2 = allParticles[i];
        if (p2.x === null || p2.y === null) continue;

        const dx = p.x! - p2.x;
        const dy = p.y! - p2.y;
        const dist = dx * dx + dy * dy;

        if (dist < p2.max) {
          if (p2 === mousePosition && dist >= p2.max / 2) {
            p.x! -= 0.03 * dx;
            p.y! -= 0.03 * dy;
          }

          const ratio = (p2.max - dist) / p2.max;
          if (!context) return;
          context.beginPath();
          context.lineWidth = ratio / 2;
          context.strokeStyle = `rgba(${isDark.value ? '255,255,255' : '0,0,0'},${ratio + 0.2})`;
          context.moveTo(p.x!, p.y!);
          context.lineTo(p2.x, p2.y);
          context.stroke();
        }
      }
    });

    animationFrameId = requestAnimationFrame(drawParticles);
  }

  // 暂停动画
  function pauseMouseEffect() {
    isActive = false;
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  // 恢复动画
  function resumeMouseEffect() {
    isActive = true;
    init();
  }

  // 清理函数
  function cleanupMouseEffect() {
    pauseMouseEffect();
    if (canvas) canvas.remove();
  }

  function init() {
    createCanvas();
    updateSize();
    initCanvas();
    initParticles();

    window.onresize = updateSize;
    window.onmousemove = (e: MouseEvent) => {
      mousePosition.x = e.clientX;
      mousePosition.y = e.clientY;
    };
    window.onmouseout = () => {
      mousePosition.x = null;
      mousePosition.y = null;
    };

    drawParticles();
  }

  const handleVisibilityChange = () => {
    if (document.hidden) {
      pauseMouseEffect();
    } else {
      resumeMouseEffect();
    }
  };

  onMounted(() => {
    init();
    document.addEventListener('visibilitychange', handleVisibilityChange);
  });
  onUnmounted(() => {
    cleanupMouseEffect();
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  });
}
