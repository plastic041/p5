export class Vector {
  #x: number;
  #y: number;
  constructor(x: number, y: number) {
    this.#x = x;
    this.#y = y;
  }

  public get x(): number {
    return this.#x;
  }

  public set x(v: number) {
    this.#x = v;
  }

  public get y(): number {
    return this.#y;
  }

  public set y(v: number) {
    this.#y = v;
  }

  add(v: Vector) {
    this.#x += v.x;
    this.#y += v.y;
  }

  sub(v: Vector) {
    this.#x -= v.x;
    this.#y -= v.y;
  }

  mult(multiplier: number) {
    this.#x *= multiplier;
    this.#y *= multiplier;
  }

  static sub(v1: Vector, v2: Vector): Vector {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  }

  static dist(v1: Vector, v2: Vector): number {
    const dx = v1.x - v2.x;
    const dy = v1.y - v2.y;
    return Math.sqrt(dx ** 2 + dy ** 2);
  }
}
