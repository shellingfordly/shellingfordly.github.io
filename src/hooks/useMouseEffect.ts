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
  size: number;
  alpha: number;
  speed: number;
  color: string;    // 添加颜色属性
  twinkle: number;  // 闪烁速度
  glow: number;     // 光晕大小
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
    opacity: 0.2,
    color: isDark.value ? '255,255,255' : '0,0,0',
    count: 100
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
      const size = Math.random() * 2 + 0.5; // 0.5-2.5px
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        xa: (Math.random() - 0.5) * 0.5,
        ya: (Math.random() - 0.5) * 0.5,
        size,
        alpha: Math.random() * 0.5 + 0.5,
        speed: Math.random() * 0.5 + 0.2,
        color: isDark.value ? '255,255,255' : '0,0,0',
        twinkle: Math.random() * 0.01,
        glow: size * (Math.random() * 2 + 2),
        max: 6000
      });
    }
  }

  function drawParticles() {
    if (!isActive || !context) return;

    // 创建渐变背景
    context.fillStyle = isDark.value ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
    context.fillRect(0, 0, width, height);

    particles.forEach((p) => {
      // 更新位置
      p.x! += p.xa * p.speed;
      p.y! += p.ya * p.speed;

      // 边界处理 - 让粒子在边界处缓慢消失并在对面重生
      if (p.x! > width + 100) {
        p.x = -50;
        p.xa = Math.abs(p.xa);
      } else if (p.x! < -100) {
        p.x = width + 50;
        p.xa = -Math.abs(p.xa);
      }
      if (p.y! > height + 100) {
        p.y = -50;
        p.ya = Math.abs(p.ya);
      } else if (p.y! < -100) {
        p.y = height + 50;
        p.ya = -Math.abs(p.ya);
      }

      // 闪烁效果
      p.alpha = 0.5 + Math.sin(Date.now() * p.twinkle) * 0.3;

      // 绘制光晕
      const gradient = context!.createRadialGradient(
        p.x!, p.y!, 0,
        p.x!, p.y!, p.glow
      );
      gradient.addColorStop(0, `rgba(${p.color},${p.alpha * 0.3})`);
      gradient.addColorStop(1, `rgba(${p.color},0)`);

      context!.beginPath();
      context!.fillStyle = gradient;
      context!.arc(p.x!, p.y!, p.glow, 0, Math.PI * 2);
      context!.fill();

      // 绘制星星核心
      context!.beginPath();
      context!.fillStyle = `rgba(${p.color},${p.alpha})`;
      context!.arc(p.x!, p.y!, p.size, 0, Math.PI * 2);
      context!.fill();

      // 鼠标交互
      if (mousePosition.x !== null && mousePosition.y !== null) {
        const dx = p.x! - mousePosition.x;
        const dy = p.y! - mousePosition.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) { // 增加影响范围
          const angle = Math.atan2(dy, dx);
          const force = (150 - dist) / 150;

          // 添加轻微的吸引效果
          const attraction = Math.sin(Date.now() * 0.001) * 0.5 + 0.5;
          const forceX = Math.cos(angle) * force * (attraction ? 1 : -1);
          const forceY = Math.sin(angle) * force * (attraction ? 1 : -1);

          p.xa += forceX * 0.2;
          p.ya += forceY * 0.2;

          // 限制最大速度
          const maxSpeed = 2;
          const currentSpeed = Math.sqrt(p.xa * p.xa + p.ya * p.ya);
          if (currentSpeed > maxSpeed) {
            const scale = maxSpeed / currentSpeed;
            p.xa *= scale;
            p.ya *= scale;
          }
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
