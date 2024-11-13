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

interface ExplosionParticle extends Particle {
  life: number;        // 粒子生命周期
  maxLife: number;     // 最大生命周期
  gravity: number;     // 重力效果
  isExplosion: true;   // 标记是爆炸粒子
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
    zIndex: 10,
    opacity: 0.1,
    color: getColor(),
    count: 100
  };

  function getColor(): string {
    return isDark.value ? '200,200,200' : '100,100,100';
  }

  function createCanvas() {
    canvas = document.createElement('canvas');
    context = canvas.getContext('2d')!;
  }

  function initCanvas() {
    if (!canvas) return;
    canvas.style.cssText = `position:fixed;top:0;left:0;z-index:${config.zIndex};pointer-events:none`;
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
        color: getColor(),
        twinkle: Math.random() * 0.01,
        glow: size * (Math.random() * 2 + 2),
        max: 6000
      });
    }
  }

  function drawParticles() {
    if (!isActive || !context) return;

    // 清空画布
    context.clearRect(0, 0, width, height);

    // 使用过滤器移除死亡的爆炸粒子
    particles = particles.filter(p => {
      if ('isExplosion' in p) {
        const ep = p as ExplosionParticle;
        return ep.life > 0;
      }
      return true;
    });

    particles.forEach((p) => {
      // 更新位置
      p.x! += p.xa * p.speed;
      p.y! += p.ya * p.speed;

      // 特殊处理爆炸粒子
      if ('isExplosion' in p) {
        const ep = p as ExplosionParticle;
        ep.life--; // 减少生命值
        ep.ya += ep.gravity; // 添加重力效果
        ep.alpha = (ep.life / ep.maxLife) * 0.6; // 爆炸粒子最大透明度 - 逐渐消失
      } else {
        // 原有粒子的边界处理
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

        // 原有粒子的闪烁效果
        p.alpha = 0.2 + Math.sin(Date.now() * p.twinkle) * 0.15;
      }

      // 绘制光晕
      const gradient = context!.createRadialGradient(
        p.x!, p.y!, 0,
        p.x!, p.y!, p.glow
      );
      gradient.addColorStop(0, `rgba(${p.color},${p.alpha * 0.2})`);
      gradient.addColorStop(1, `rgba(${p.color},0)`);

      context!.beginPath();
      context!.fillStyle = gradient;
      context!.arc(p.x!, p.y!, p.glow, 0, Math.PI * 2);
      context!.fill();

      // 绘制粒子核心
      context!.beginPath();
      context!.fillStyle = `rgba(${p.color},${p.alpha * 0.5})`;
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

  // 创建爆炸效果
  function createExplosion(x: number, y: number) {
    const particleCount = 20; // 爆炸粒子数量
    const power = 16; // 爆炸力度

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = (Math.random() * 0.5 + 0.5) * power; // 随机速度
      const size = Math.random() * 2 + 1;

      const explosionParticle: ExplosionParticle = {
        x,
        y,
        xa: Math.cos(angle) * velocity,
        ya: Math.sin(angle) * velocity,
        size,
        alpha: 0.8,// 爆炸粒子初始透明度
        speed: Math.random() * 0.5 + 0.5,
        color: getColor(),
        twinkle: Math.random() * 0.01,
        glow: size * (Math.random() * 1.5 + 1), // 调整爆炸光晕
        max: 6000,
        life: 100,              // 初始生命值
        maxLife: 100,           // 最大生命值
        gravity: 0.1,           // 重力效果
        isExplosion: true
      };

      particles.push(explosionParticle);
    }
  }

  // 处理点击事件
  function handleClick(e: MouseEvent) {
    createExplosion(e.clientX, e.clientY);
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

    window.addEventListener('click', handleClick);
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
