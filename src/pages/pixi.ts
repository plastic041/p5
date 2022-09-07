import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";

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
