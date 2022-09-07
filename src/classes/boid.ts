import P5, { Vector } from "p5";

export class Boid {
  #p5: P5;
  pos: Vector;
  vel: Vector;
  acc: Vector;
  r: number;
  maxForce: number;
  maxSpeed: number;

  constructor(p5: P5, x: number, y: number) {
    this.#p5 = p5;

    this.acc = new Vector(0, 0);

    const angle = this.#p5.random(this.#p5.TWO_PI);
    this.vel = new Vector(this.#p5.cos(angle), this.#p5.sin(angle));

    this.pos = new Vector(x, y);
    this.r = 2;
    this.maxSpeed = 2;
    this.maxForce = 0.03;
  }

  run(boids: Boid[]) {
    this.flock(boids);
    this.update();
    this.borders();
    this.draw();
  }

  applyForce(force: Vector) {
    this.acc.add(force);
  }

  flock(boids: Boid[]) {
    const sep: Vector = this.seperate(boids);
    const ali: Vector = this.align(boids);
    const coh: Vector = this.cohesion(boids);

    sep.mult(1.5);
    ali.mult(1);
    coh.mult(1);

    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  seek(target: Vector): Vector {
    const desired = Vector.sub(target, this.pos);
    desired.normalize();
    desired.mult(this.maxSpeed);

    const steer = Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);

    return steer;
  }

  draw() {
    const p5 = this.#p5;

    p5.push();
    p5.fill(200);
    p5.noStroke();
    p5.circle(this.pos.x, this.pos.y, 4);
    p5.pop();
  }

  borders() {
    const p5 = this.#p5;
    if (this.pos.x < -this.r) this.pos.x = p5.width + this.r;
    if (this.pos.y < -this.r) this.pos.y = p5.height + this.r;

    if (this.pos.x > p5.width + this.r) this.pos.x = -this.r;
    if (this.pos.y > p5.height + this.r) this.pos.y = -this.r;
  }

  seperate(boids: Boid[]) {
    const desiredSeperation = 25;
    const steer = new Vector(0, 0);
    let count = 0;

    for (const other of boids) {
      const d = Vector.dist(this.pos, other.pos);

      if (d > 0 && d < desiredSeperation) {
        const diff = Vector.sub(this.pos, other.pos);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count += 1;
      }
    }

    if (count > 0) {
      steer.div(count);
    }

    if (steer.mag() > 0) {
      steer.normalize();
      steer.mult(this.maxSpeed);
      steer.sub(this.vel);
      steer.limit(this.maxForce);
    }
    return steer;
  }

  align(boids: Boid[]) {
    const neighborDist = 50;
    const sum = new Vector(0, 0);
    let count = 0;
    for (const other of boids) {
      const d = Vector.dist(this.pos, other.pos);
      if (d > 0 && d < neighborDist) {
        sum.add(other.vel);
        count += 1;
      }
    }

    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxSpeed);
      const steer = Vector.sub(sum, this.vel);
      steer.limit(this.maxForce);

      return steer;
    } else {
      return new Vector(0, 0);
    }
  }

  cohesion(boids: Boid[]) {
    const neighborDist = 50;
    const sum = new Vector(0, 0);
    let count = 0;
    for (const other of boids) {
      const d = Vector.dist(this.pos, other.pos);
      if (d > 0 && d < neighborDist) {
        sum.add(other.pos);
        count += 1;
      }
    }

    if (count > 0) {
      sum.div(count);
      return this.seek(sum);
    } else {
      return new Vector(0, 0);
    }
  }
}

export class Flock {
  boids: Boid[];
  constructor() {
    this.boids = [];
  }

  run() {
    for (const boid of this.boids) {
      boid.run(this.boids);
    }
  }

  addBoid(boid: Boid) {
    this.boids.push(boid);
  }
}
