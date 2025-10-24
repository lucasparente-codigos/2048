import { Tile } from './tile.js';
import { randomInt } from './utils.js';

export class Board {
    constructor(size = 4) {
        this.size = size;
        this.grid = Array.from({ length: size }, () => Array(size).fill(null));
        this.tiles = [];
    }

    addTile(value = null, row = null, col = null) {
        if (value === null) {
            value = randomInt(1, 4) === 4 ? 4 : 2; // 90% 2, 10% 4
        }
        if (row === null || col === null) {
            const emptyCells = [];
            for (let r = 0; r < this.size; r++) {
                for (let c = 0; c < this.size; c++) {
                    if (!this.grid[r][c]) emptyCells.push({ r, c });
                }
            }
            if (emptyCells.length === 0) return false;
            const { r, c } = emptyCells[randomInt(0, emptyCells.length - 1)];
            row = r; col = c;
        }
        const tile = new Tile(value, row, col);
        this.grid[row][col] = tile;
        this.tiles.push(tile);
        return true;
    }

    move(direction) {
        let moved = false;
        // Rotaciona a grid logicamente para mover em uma direção sempre (ex: esquerda)
        let rotatedGrid = this.rotateGrid(direction);
        // Move todas tiles para esquerda na grid rotacionada
        for (let r = 0; r < this.size; r++) {
            const row = rotatedGrid[r].filter(tile => tile); // Remove nulls
            for (let c = 0; c < row.length - 1; c++) {
                if (row[c].value === row[c + 1].value) {
                    // Merge
                    const mergedValue = row[c].merge(row[c + 1]);
                    row[c + 1] = null; // Remove merged tile
                    moved = true;
                    // Atualize score via game.js
                }
            }
            // Slide para esquerda
            const newRow = row.filter(tile => tile !== null);
            while (newRow.length < this.size) newRow.push(null);
            rotatedGrid[r] = newRow;
            if (newRow.join() !== rotatedGrid[r].join()) moved = true; // Simplificado
        }
        // Desrotaciona
        this.grid = this.unrotateGrid(rotatedGrid, direction);
        // Atualiza posições das tiles e remove merged
        this.tiles = this.tiles.filter(tile => !tile.mergedFrom);
        this.updateTilePositions();
        if (moved) {
            this.addTile(); // Spawn novo tile
        }
        return moved;
    }

    rotateGrid(direction) {
        // Implementação de rotação baseada em direction (up=90deg, etc.). Para simplicidade, defina funções para cada dir.
        // Exemplo para left: no rotate. Para up: transpose + reverse columns, etc. (pesquise "2048 board rotation" para otimizar)
        // Placeholder: retorne grid ajustada
        return this.grid; // Expanda com lógica completa
    }

    unrotateGrid(grid, direction) {
        return grid; // Inverso da rotação
    }

    updateTilePositions() {
        this.tiles.forEach(tile => {
            const gridPos = this.findTilePosition(tile);
            if (gridPos) tile.updatePosition(gridPos.row, gridPos.col);
        });
    }

    findTilePosition(tile) {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c] === tile) return { row: r, col: c };
            }
        }
        return null;
    }

    render(container) {
        container.innerHTML = ''; // Limpa
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                const cell = document.createElement('div');
                cell.className = 'tile-empty'; // Célula vazia
                container.appendChild(cell);
            }
        }
        this.tiles.forEach(tile => {
            const el = tile.createElement();
            el.classList.add('move'); // Para animação
            container.appendChild(el);
        });
    }

    isGameOver() {
        // Sem moves possíveis: full grid sem merges adjacentes
        return this.tiles.length === this.size * this.size && !this.hasMove();
    }

    hasMove() {
        // Check horizontal/vertical adjacentes iguais
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                const tile = this.grid[r][c];
                if (!tile) return true;
                if (c < this.size - 1 && tile.value === this.grid[r][c + 1]?.value) return true;
                if (r < this.size - 1 && tile.value === this.grid[r + 1][c]?.value) return true;
            }
        }
        return false;
    }

    hasWon() {
        return this.tiles.some(tile => tile.value >= 2048); // De config.goal
    }

    clear() {
        this.grid = Array.from({ length: this.size }, () => Array(this.size).fill(null));
        this.tiles = [];
    }

    // Serialize para storage
    serialize() {
        return this.tiles.map(tile => ({ value: tile.value, row: tile.row, col: tile.col }));
    }
}