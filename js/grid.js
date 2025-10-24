// js/grid.js

export default class Grid {
  constructor(size = 4) {
    this.size = size;
    this.cells = this.emptyGrid();
  }

  emptyGrid() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(null));
  }

  randomEmptyCell() {
    const emptyCells = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.cells[r][c] === null) {
          emptyCells.push({ r, c });
        }
      }
    }
    if (emptyCells.length === 0) return null;
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  clone() {
    const newGrid = new Grid(this.size);
    newGrid.cells = this.cells.map(row =>
      row.map(cell => (cell ? { ...cell } : null))
    );
    return newGrid;
  }

  forEachCell(callback) {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        callback(r, c, this.cells[r][c]);
      }
    }
  }
}
