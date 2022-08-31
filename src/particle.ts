import P5 from "p5";

type ParticleProps = {
  x: number;
  y: number;
  color: P5.Color;
};
export class Particle {
  #p5: P5;
  #color: P5.Color;

  pos: P5.Vector;
  vel: P5.Vector;

  constructor(p5: P5, { x, y, color }: ParticleProps) {
    this.#p5 = p5;
    this.pos = this.#p5.createVector(x, y);
    this.vel = this.#p5.createVector(0, 0);
    this.#color = color;
  }

  draw() {
    const p5 = this.#p5;
    p5.push();
    p5.fill(this.#color);
    p5.noStroke();
    p5.circle(this.pos.x, this.pos.y, 5);
    p5.pop();
  }
}

type ParticlesConstructorProps = {
  count: number;
  color: P5.Color;
};
export class Particles {
  #p5: P5;
  particles: Particle[];

  constructor(p5: P5, { count, color }: ParticlesConstructorProps) {
    this.#p5 = p5;

    this.particles = [...new Array(count)].map(
      () =>
        new Particle(p5, {
          x: p5.random() * 500 + 50,
          y: p5.random() * 500 + 50,
          color,
        })
    );
  }

  draw() {
    this.particles.forEach((p) => p.draw());
  }

  static rule(ps1: Particles, ps2: Particles, g: number) {
    for (let i = 0; i < ps1.particles.length; i++) {
      let fx = 0;
      let fy = 0;
      const a = ps1.particles[i];

      for (let j = 0; j < ps2.particles.length; j++) {
        const b = ps2.particles[j];

        const dx = a.pos.x - b.pos.x;
        const dy = a.pos.y - b.pos.y;
        const dist = a.pos.dist(b.pos);
        if (dist > 0 && dist < 80) {
          const f = (g * 1) / dist;
          fx += f * dx;
          fy += f * dy;
        }
      }
      a.vel.x = (a.vel.x + fx) * 0.5;
      a.vel.y = (a.vel.y + fy) * 0.5;
      a.pos.x += a.vel.x;
      a.pos.y += a.vel.y;

      if (a.pos.x <= 0 || a.pos.x >= 600) {
        a.vel.x *= -1;
      }
      if (a.pos.y <= 0 || a.pos.y >= 600) {
        a.vel.y *= -1;
      }
    }
  }
}
