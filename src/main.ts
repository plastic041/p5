import P5 from "p5";

type CircleConstructorProps = {
  radius: number;
  x: number;
  y: number;
  color?: number;
};

class Circle {
  #p5: P5;
  #radius: number;
  #multiplier: number;
  #pos: P5.Vector;
  #color: number;

  constructor(p5: P5, { radius, x, y, color = 128 }: CircleConstructorProps) {
    this.#p5 = p5;
    this.#radius = radius;
    this.#multiplier = 1;
    this.#pos = new P5.Vector(x, y);
    this.#color = color;
  }

  draw() {
    const p5 = this.#p5;

    p5.push();

    p5.noStroke();
    p5.fill(this.#color);

    p5.circle(this.#pos.x, this.#pos.y, this.#radius * this.#multiplier);

    p5.pop();
  }

  update() {
    const p5 = this.#p5;

    const frame = p5.frameCount * 0.05;
    const noise = p5.noise(frame);
    const mapped = p5.map(noise, 0, 1, 0.6, 1.4);
    this.#multiplier = mapped;
  }
}

const WIDTH = 600;
const HEIGHT = 600;

const sketch = (p5: P5) => {
  let circles: Circle[] = [];

  p5.setup = () => {
    const canvas = p5.createCanvas(WIDTH, HEIGHT);
    canvas.parent("p5");
    [...new Array(10)].forEach(() => {
      const x = p5.random(0, WIDTH);
      const y = p5.random(0, HEIGHT);
      const radius = p5.random(WIDTH / 10, WIDTH / 4);
      const color = p5.random(0, 255);
      const circle = new Circle(p5, { radius, x, y, color });
      circles.push(circle);
    });
  };

  p5.draw = () => {
    p5.background(200);

    circles.forEach((circle) => {
      circle.update();
      circle.draw();
    });
  };
};

new P5(sketch);
