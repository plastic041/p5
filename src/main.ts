import P5 from "p5";

class Circle {
  #p5: P5;
  #radius: number;
  #multiplier: number;

  constructor(p5: P5, { radius = 10 }: { radius: number }) {
    this.#p5 = p5;
    this.#radius = radius;
    this.#multiplier = 1;
  }

  draw() {
    const p5 = this.#p5;

    p5.push();

    p5.noStroke();
    p5.fill(255);

    p5.circle(100, 100, this.#radius * this.#multiplier);

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

const sketch = (p5: P5) => {
  let circles: Circle[] = [];

  p5.setup = () => {
    const canvas = p5.createCanvas(200, 200);
    canvas.parent("app");
    circles.push(new Circle(p5, { radius: 50 }));
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
