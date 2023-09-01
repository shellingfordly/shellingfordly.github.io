---
title: pixi.js学习-制作简单的跑酷小游戏
date: 2022-07-12 18:24:00
tags:
  - pixijs
  - js
  - game
---

# pixi.js学习-制作简单的跑酷小游戏

## 前言

此项目使用pixi.js和vue实现，部分素材来自[爱给网](https://www.aigei.com/)，本项目仅作用于 pixi.js 学习用途，侵权立删。

### 项目地址

[shellingfordly/pixi-games](https://github.com/shellingfordly/pixi-games)

### demo地址

[pixi-games](https://shellingfordly.github.io/pixi-games/#/parkour)

![](/images/blog/pixijs_game.gif)

### 初始化项目

使用vite初始化项目

```
pnpm create vite my-vue-app
```

安装pixi.js和pixi-tweener

[pixi-tweener](https://github.com/theGolyo/PixiTweener)一个做过度动画的开源库

```
pnpm i pixi.js pixi-tweener
```

## 主要逻辑

### useParkour

> 此函数用于创建pixi app，将场景，障碍物，人物添加到app中

- containerRef canvas的容器
- gameStart 开始游戏
- start 开始状态
- score 分数
- hp 血量

```ts
export function useParkour() {
  const containerRef = ref();
  const app = new Application({
    width: BODY_HEIGHT,
    height: BODY_WIDTH,
    backgroundColor: 0xffffff,
  });
  const start = ref(false);

  Tweener.init(app.ticker);

  const container = new Container();
  app.stage.addChild(container);

  const player = new Player();
  const { scene, runScene, stopScene } = useScene();
  const { trap, runHurdle, score, hp } = useHurdle();
  container.addChild(player);
  container.addChild(scene);
  container.addChild(trap);
  container.sortChildren();

  runScene();

  function gameStart() {
    start.value = true;
    player.play();
    const timer = setTimeout(() => {
      runHurdle(player);
      clearTimeout(timer);
    }, 1000);
  }

  watch(hp, (value) => {
    if (value === 0) {
      player.stop();
      stopScene();
      start.value = false;
    }
  });

  onMounted(() => {
    if (containerRef.value) containerRef.value.appendChild(app.view);
  });

  return { containerRef, app, score, hp, gameStart, start };
}
```

### useScene

> 此函数用于创建天空、地面场景

加载天空、地面纹理，创建平铺精灵(TilingSprite)，这个TilingSprite类比较方便做场景的移动

创建ticker递减精灵的x坐标实现场景移动

```ts
export function useScene() {
  const loader = new Loader();
  const scene = new Container();
  scene.height = 130;
  scene.zIndex = 1;
  const ticker = new Ticker();

  loader
    .add("footer", FooterImg)
    .add("sky", SkyImg)
    .load(() => {
      const footer = new TilingSprite(
        loader.resources.footer.texture as Texture,
        BODY_HEIGHT,
        130
      );
      footer.y = BODY_WIDTH - 130;
      footer.zIndex = 2;

      const sky = new TilingSprite(
        loader.resources.sky.texture as Texture,
        BODY_HEIGHT,
        BODY_WIDTH - 80
      );
      sky.tileScale.y = 0.6;
      sky.zIndex = 1;
      sky.y = -30;

      scene.addChild(footer);
      scene.addChild(sky);
      scene.sortChildren();

      const sceneTicker = () => {
        footer.tilePosition.x -= 3;
        sky.tilePosition.x -= 3;
      };

      ticker.add(sceneTicker);
    });

  function runScene() {
    ticker.start();
  }

  function stopScene() {
    ticker.stop();
  }

  return { scene, runScene, stopScene };
}
```

### useHurdle

> 此函数用于创建障碍物

和创建场景其实差不多，只是障碍物是普通的精灵类(Sprite)，创建ticker移动其x

在移动时做和人物的碰撞检测，如果碰撞则减少生命值，如果没有则增加分数

```ts
export function useHurdle() {
  const loader = new Loader();
  const trap = new Container();
  const ticker = new Ticker();
  const textures: Texture[] = [];
  let player: Sprite | null = null;
  const hp = ref(100);
  const score = ref(0);
  let timer: NodeJS.Timer;

  trap.zIndex = 3;

  loader.add("trap", TrapImg).load((_, resources) => {
    TrapTexturePosition.forEach((position) => {
      const t = new Texture(
        resources.trap.texture as any,
        new Rectangle(...position)
      );
      textures.push(t);
    });
  });

  loader.load(() => {
    timer = setInterval(() => {
      const index = Math.floor(Math.random() * 2) + 1;
      const item = new Sprite(textures[index]);
      item.width = 80;
      item.height = 40;
      item.x = BODY_HEIGHT;
      item.y = BODY_WIDTH - 120;
      trap.addChild(item);
      let scoreFlag = true;
      let hpFlag = true;
      let isHit = false;

      function itemTicker() {
        item.x -= 8;

        if (player && !isHit) {
          isHit = hitTestRectangle(player, item);
          if (hpFlag && isHit) {
            hp.value -= 10;
            hpFlag = false;
            if (hp.value === 0) stopGame();
          } else if (scoreFlag && item.x < player.x) {
            score.value++;
            scoreFlag = false;
          }
        }

        if (item.x < -item.width) {
          ticker.remove(itemTicker);
          trap.removeChild(item);
        }
      }

      ticker.add(itemTicker);
    }, 2000);
  });

  function runHurdle(target: Sprite) {
    player = target;
    ticker.start();
  }

  function stopGame() {
    timer && clearInterval(timer);
    ticker.stop();
  }

  return { trap, runHurdle, score, hp };
}

```

### Player

> 玩家类：实现跑动、上跳、滑铲、入场的效果

通过变换Sprite的texture实现跑动效果，监听键盘事件，上键时减y，下键时更换滑铲纹理

```ts
export class Player extends Sprite {
  defaultY = BODY_WIDTH - 160;
  textures: Texture[] = [];
  status: "run" | "jump" | "slide" = "run";
  ticker = new Ticker();

  constructor() {
    super();
    this.width = 80;
    this.height = 80;
    this.x = -120;
    this.y = this.defaultY;
    this.zIndex = 10;
    this.loader();
    this.watchEvent();
  }

  private loader() {
    const loader = new Loader();
    loader.add("player", PlayerImg).load((_, resources) => {
      PlayerTexturePosition.forEach((position, i) => {
        const texture = new Texture(
          resources.player.texture as any,
          new Rectangle(...position)
        );
        this.textures.push(texture);
      });
    });
  }

  private watchEvent() {
    document.addEventListener("keydown", this.keydown);
    document.addEventListener("keyup", this.keyup);
  }

  private clearEvent() {
    document.removeEventListener("keyup", this.keydown);
    document.removeEventListener("keydown", this.keyup);
  }

  private keydown = (e: any) => {
    if (e.code === "ArrowUp") {
      this.status = "jump";
      if (this.y === this.defaultY) {
        Tweener.add(
          { target: this, duration: 0.3, ease: Easing.easeInOutQuint },
          { y: this.y - 120 }
        );
      }
    } else if (e.code === "ArrowDown") {
      this.status = "slide";
      this.texture = this.textures[10];
    }
  };

  private keyup = () => {
    this.status = "run";
  };

  stop() {
    this.ticker.stop();
    this.clearEvent();
  }

  play() {
    this.ticker.autoStart = true;
    const runTicker = () => {
      this.down();
      this.entrance();
      if (this.status === "run") this.run();
      else if (this.status === "jump") this.jump();
    };
    this.ticker.add(runTicker);
  }

  // 跑
  run() {
    this.texture = this.textures[Math.floor(Date.now() / 100) % 8];
  }

  jump() {
    this.texture = this.textures[(Math.floor(Date.now() / 100) % 5) + 11];
  }

  // 下落
  down() {
    if (this.y < this.defaultY) {
      this.status = "jump";
      this.y += 5;
    } else {
      if (this.status === "jump") {
        this.status = "run";
      }
    }
  }

  // 入场
  entrance() {
    if (this.x < 120) this.x += 5;
  }
}
```
