import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";
import { random } from "radash";

// type Vector2D = {
//   x: number;
//   y: number;
// };
// class Particle {
//   #vel: Vector2D;
//   #pos: Vector2D;
//   #color: number;

//   constructor(x: number, y: number, color: number) {
//     this.#vel = { x: 0, y: 0 };
//     this.#pos = { x, y };
//     this.#color = color;
//   }
// }

// const rule = (ps1: Graphics[], ps2: Graphics[], g: number) => {
//   for (let i = 0; i < ps1.length; i++) {
//     let fx = 0;
//     let fy = 0;
//     const a = ps1[i];

//     for (let j = 0; j < ps2.length; j++) {
//       const b = ps2[j];

//       const dx = a.x - b.x;
//       const dy = a.y - b.y;
//       const dist = Math.sqrt(dx ** 2 + dy ** 2);
//       // const dist = a.dist(b.pos);
//       if (dist > 0 && dist < 80) {
//         const f = (g * 1) / dist;
//         fx += f * dx;
//         fy += f * dy;
//       }
//     }
//     a.vel.x = (a.vel.x + fx) * 0.5;
//     a.vel.y = (a.vel.y + fy) * 0.5;
//     a.pos.x += a.vel.x;
//     a.pos.y += a.vel.y;

//     if (a.pos.x <= 0 || a.pos.x >= 600) {
//       a.vel.x *= -1;
//     }
//     if (a.pos.y <= 0 || a.pos.y >= 600) {
//       a.vel.y *= -1;
//     }
//   }
// };

const main = () => {
  const app = new PIXI.Application({
    width: 512,
    height: 512,
    antialias: true,
  });

  document.body.querySelector("main")!.appendChild(app.view);
  app.renderer.backgroundColor = 0x061639;

  const rect = new Graphics();
  rect.beginFill(0x66ccff);
  rect.drawCircle(0, 0, 8);
  rect.endFill();
  rect.x = 256;
  rect.y = 256;
  rect.pivot.set(4, 4);

  app.stage.addChild(rect);

  let vx = 0;
  let vy = 0;

  const move = (graphic: Graphics) => {
    const delta = Math.random() - 0.5;
    if (Math.random() > 0.5) {
      vx += delta;
    } else {
      vx -= delta;
    }
    if (Math.random() > 0.5) {
      vy += delta;
    } else {
      vy -= delta;
    }
    graphic.x += vx;
    graphic.y += vy;
    if (graphic.x > 512 || graphic.x < 0 || graphic.y > 512 || graphic.y < 0) {
      graphic.x = 256;
      graphic.y = 256;
      vx = 0;
      vy = 0;
    }
  };

  app.ticker.add(() => {
    move(rect);
  });
};

main();
