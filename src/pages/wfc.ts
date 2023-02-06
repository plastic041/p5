import P5 from "p5";

const assert = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(message);
  }
};

const GRID_SIZE = 20;
const SPRITE_SIZE = 8;
const CANVAS_SIZE = GRID_SIZE * SPRITE_SIZE;

const ATLAS_ROWS = 18;
const ATLAS_COLS = 10;

type Tile = {
  id: number;
  name: string;
  spriteIdx: number;
};

const TILES: readonly Tile[] = [
  { id: 0, name: "+", spriteIdx: 148 },
  { id: 1, name: "-", spriteIdx: 101 },
  { id: 2, name: "|", spriteIdx: 110 },
  { id: 3, name: " ", spriteIdx: 179 },
  { id: 4, name: "left end", spriteIdx: 130 },
  { id: 5, name: "top end", spriteIdx: 103 },
  { id: 6, name: "right end", spriteIdx: 132 },
  { id: 7, name: "bottom end", spriteIdx: 123 },
] as const;
const TILES_IDS = TILES.map((t) => t.id);
const BITMAPS = [
  // left, top, right, bottom
  [
    [0, 1, 4],
    [0, 2, 5],
    [0, 1, 6],
    [0, 2, 7],
  ], // +
  [
    [0, 1, 4],
    [3, 1, 4, 6, 7],
    [0, 1, 6],
    [3, 1, 4, 5, 6],
  ], // -
  [
    [2, 3, 5, 7, 6],
    [0, 2, 5],
    [2, 3, 4, 5, 7],
    [0, 2, 7],
  ], // |
  [
    [2, 3, 5, 6, 7],
    [1, 3, 4, 6, 7],
    [2, 3, 4, 5, 7],
    [1, 3, 4, 5, 6],
  ], // space

  [
    [2, 3, 5, 6, 7],
    [1, 3, 4, 6, 7],
    [0, 1, 6],
    [1, 3, 4, 5, 6],
  ], // left end
  [
    [2, 3, 5, 6, 7],
    [1, 3, 4, 6, 7],
    [2, 3, 4, 5, 7],
    [0, 2, 7],
  ], // top end
  [
    [0, 1, 4],
    [1, 3, 4, 6, 7],
    [2, 3, 4, 5, 7],
    [1, 3, 4, 5, 6],
  ], // right end
  [
    [2, 3, 5, 6, 7],
    [0, 2, 5],
    [2, 3, 4, 5, 7],
    [1, 3, 4, 5, 6],
  ], // bottom end
] as const;

class Cell {
  public x: number;
  public y: number;
  public options: Set<number>;
  public p5: P5;
  public isCollapsed = false;
  public atlas: P5.Image;
  public isDrawed = false;

  constructor(x: number, y: number, p5: P5, atlas: P5.Image) {
    this.x = x;
    this.y = y;
    this.options = new Set(TILES_IDS);
    this.p5 = p5;
    this.atlas = atlas;
    this.isDrawed = false;
  }

  get tile() {
    const tileIndex = [...this.options][0];
    return TILES[tileIndex];
  }

  draw() {
    const x = this.x * SPRITE_SIZE;
    const y = this.y * SPRITE_SIZE;

    if (this.isCollapsed) {
      if (!this.isDrawed) {
        const spriteIdx = this.tile.spriteIdx;
        const spriteX = (spriteIdx % ATLAS_COLS) * SPRITE_SIZE;
        const spriteY = Math.floor(spriteIdx / ATLAS_COLS) * SPRITE_SIZE;
        const sprite = this.atlas.get(
          spriteX,
          spriteY,
          SPRITE_SIZE,
          SPRITE_SIZE
        );
        this.p5.set(x, y, sprite);
        this.p5.fill(0);
        // this.p5.text(this.tile.id, x + 8, y + 8);
        this.isDrawed = true;
      }
    } else {
      this.p5.fill(100);
      this.p5.rect(x, y, SPRITE_SIZE, SPRITE_SIZE);

      this.p5.fill(0);
      this.p5.text(this.options.size, x + 5, y + 5);
    }
  }
}

class Grid {
  public cells: Cell[][];
  public p5: P5;
  public atlas: P5.Image;

  constructor(p5: P5, atlas: P5.Image) {
    this.cells = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      this.cells[x] = [];
      for (let y = 0; y < GRID_SIZE; y++) {
        this.cells[x][y] = new Cell(x, y, p5, atlas);
      }
    }

    this.p5 = p5;
    this.atlas = atlas;
  }

  get(x: number, y: number) {
    return this.cells[x][y];
  }

  getNeighbor(cell: Cell, direction: 0 | 1 | 2 | 3) {
    switch (direction) {
      case 0:
        return cell.x > 0 ? this.get(cell.x - 1, cell.y) : null;
      case 1:
        return cell.y > 0 ? this.get(cell.x, cell.y - 1) : null;
      case 2:
        return cell.x < GRID_SIZE - 1 ? this.get(cell.x + 1, cell.y) : null;
      case 3:
        return cell.y < GRID_SIZE - 1 ? this.get(cell.x, cell.y + 1) : null;
    }
  }

  setNeighbor(cell: Cell, direction: 0 | 1 | 2 | 3) {
    const neighbor = this.getNeighbor(cell, direction);
    if (neighbor && !neighbor.isCollapsed) {
      const tileIds = BITMAPS[cell.tile.id][direction];
      neighbor.options = new Set(
        [...neighbor.options].filter((tileId) =>
          tileIds.some((id) => id === tileId)
        )
      );
    }
  }

  collapse() {
    const minOptionsCount = Math.min(
      ...this.cells
        .flat()
        .filter((cell) => !cell.isCollapsed)
        .map((cell) => cell.options.size)
    );
    const minOptionsCells = this.cells
      .flat()
      .filter((cell) => !cell.isCollapsed)
      .filter((cell) => cell.options.size === minOptionsCount);

    const cell =
      minOptionsCells[Math.floor(Math.random() * minOptionsCells.length)];

    const tile = [...cell.options][
      Math.floor(Math.random() * cell.options.size)
    ];

    cell.options = new Set([tile]);

    ([0, 1, 2, 3] as const).forEach((direction) => {
      this.setNeighbor(cell, direction);
    });

    cell.isCollapsed = true;
  }

  draw() {
    this.cells.flat().forEach((cell) => cell.draw());
  }

  get isCollapsed() {
    return this.cells.flat().every((cell) => cell.isCollapsed);
  }
}

export const runWfc = () => {
  const WIDTH = CANVAS_SIZE;
  const HEIGHT = CANVAS_SIZE;

  let grid: Grid;
  let atlas: P5.Image;

  const sketch = (p5: P5) => {
    p5.preload = () => {
      atlas = p5.loadImage("../Station-tileset.png");
    };

    p5.setup = () => {
      grid = new Grid(p5, atlas);
      const canvas = p5.createCanvas(WIDTH, HEIGHT);
      canvas.parent("p5");

      p5.noSmooth();
      p5.noStroke();
      p5.textSize(8);
      p5.textAlign(p5.CENTER, p5.CENTER);

      p5.background(100);
    };

    p5.draw = () => {
      !grid.isCollapsed && grid.collapse();
      !grid.isCollapsed && grid.collapse();
      !grid.isCollapsed && grid.collapse();
      !grid.isCollapsed && grid.collapse();
      grid.draw();
      p5.updatePixels();
      if (grid.isCollapsed) {
        p5.noLoop();
      }
    };
  };

  new P5(sketch);
};
