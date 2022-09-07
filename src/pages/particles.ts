import P5 from "p5";
import { Particles } from "../classes/particle";

export const runParticles = () => {
  const WIDTH = 600;
  const HEIGHT = 600;

  const sketch = (p5: P5) => {
    let yellow: Particles;
    let red: Particles;
    let blue: Particles;

    p5.setup = () => {
      const canvas = p5.createCanvas(WIDTH, HEIGHT);
      canvas.parent("p5");

      yellow = new Particles(p5, { count: 100, color: p5.color(255, 204, 0) });
      red = new Particles(p5, { count: 100, color: p5.color("red") });
      blue = new Particles(p5, { count: 100, color: p5.color("aliceblue") });
    };

    p5.draw = () => {
      p5.background(100, 220);

      Particles.rule(blue, blue, -0.32);
      Particles.rule(blue, red, -0.17);
      Particles.rule(blue, yellow, 0.34);
      Particles.rule(red, red, -0.1);
      Particles.rule(red, blue, -0.34);
      Particles.rule(yellow, yellow, 0.15);
      Particles.rule(yellow, blue, -0.2);
      yellow.draw();
      red.draw();
      blue.draw();
    };
  };

  new P5(sketch);
};
