import { Boid, Flock } from "../classes/boid";
import P5 from "p5";

export const runFlocking = () => {
  const WIDTH = 512;
  const HEIGHT = 512;

  const sketch = (p5: P5) => {
    let flock = new Flock();

    p5.setup = () => {
      const canvas = p5.createCanvas(WIDTH, HEIGHT);
      canvas.parent("p5");

      [...new Array(100)].forEach(() => {
        flock.addBoid(new Boid(p5, p5.width / 2, p5.height / 2));
      });
    };

    p5.draw = () => {
      p5.background(100);

      flock.run();
    };
  };

  new P5(sketch);
};
