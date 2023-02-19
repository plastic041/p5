import P5 from "p5";

const EMOJIS = {
  0: " ",
  1: "1️⃣",
  2: "2️⃣",
  3: "3️⃣",
  4: "4️⃣",
  5: "5️⃣",
  6: "6️⃣",
  7: "7️⃣",
  8: "8️⃣",
  MINE: "💣",
  FLAG: "🚩",
} as const;

class Cell {
  public x: number;
  public y: number;
  public isMine: boolean;
  public isHidden: boolean;
  public neighborMines: number;
  private p5: P5;

  constructor(p5: P5, x: number, y: number) {
    this.p5 = p5;
    this.x = x;
    this.y = y;

    this.isMine = false;
    this.isHidden = true;
    this.neighborMines = 0;
  }

  public draw() {
    this.p5.textSize(12);
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);

    if (!this.isHidden) {
      this.p5.fill(255);
    } else {
      this.p5.fill(200);
    }

    this.p5.rect(this.x * 20, this.y * 20, 20, 20);

    if (!this.isHidden) {
      if (this.isMine) {
        this.p5.text(EMOJIS.MINE, this.x * 20 + 10, this.y * 20 + 10);
      } else {
        this.p5.text(
          // @ts-ignore
          EMOJIS[this.neighborMines],
          this.x * 20 + 10,
          this.y * 20 + 10
        );
      }
    }
  }
}

class MineField {
  private p5: P5;
  private cells: Cell[][] = [];

  public rows: number;
  public cols: number;

  constructor(p5: P5, rows: number, cols: number) {
    this.p5 = p5;
    this.rows = rows;
    this.cols = cols;
  }

  public init(mineCount: number) {
    for (let y = 0; y < this.rows; y++) {
      this.cells[y] = [];
      for (let x = 0; x < this.cols; x++) {
        this.cells[y][x] = new Cell(this.p5, y, x);
      }
    }

    for (let i = 0; i < mineCount; i++) {
      const x = Math.floor(Math.random() * this.cols);
      const y = Math.floor(Math.random() * this.rows);
      if (this.cells[y][x].isMine) {
        i--;
      } else {
        this.cells[y][x].isMine = true;
      }
    }

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (this.cells[y][x].isMine) {
          continue;
        }

        let neighborMines = 0;
        for (const [newX, newY] of this.getNeighbors(x, y)) {
          if (this.cells[newY][newX].isMine) {
            neighborMines++;
          }
        }

        if (neighborMines > 0) {
          this.cells[y][x].neighborMines = neighborMines;
        }
      }
    }
  }

  public draw() {
    this.cells.forEach((row) => row.forEach((cell) => cell.draw()));
  }

  public click(x: number, y: number) {
    const queue: [number, number][] = [[x, y]];
    const visited = new Set<string>();

    while (queue.length) {
      const [x, y] = queue.shift()!;

      if (!visited.has(`${x},${y}`)) {
        visited.add(`${x},${y}`);

        this.cells[y][x].isHidden = false;
        if (!this.cells[y][x].isMine && this.cells[y][x].neighborMines === 0) {
          for (const [newX, newY] of this.getNeighbors(x, y)) {
            queue.push([newX, newY]);
          }
        }
      }
    }
  }

  private getNeighbors(x: number, y: number) {
    const neighbors = [];

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) {
          continue;
        }

        const newX = x + i;
        const newY = y + j;

        if (newX >= 0 && newX < this.cols && newY >= 0 && newY < this.rows) {
          neighbors.push([newX, newY]);
        }
      }
    }

    return neighbors;
  }
}

export const runMinesweeper = () => {
  const ROWS = 10;
  const COLS = 10;
  const MINES_COUNT = 10;

  let mineField: MineField;

  const sketch = (p5: P5) => {
    p5.setup = () => {
      mineField = new MineField(p5, ROWS, COLS);
      mineField.init(MINES_COUNT);
      const canvas = p5.createCanvas(200, 200);
      canvas.parent("p5");

      p5.background(200);
      mineField.draw();

      mineField.click(0, 0);
      mineField.draw();
    };

    p5.draw = () => {};
  };

  new P5(sketch);
};
