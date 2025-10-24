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
        let scoreDelta = 0;

        // 1. Rotaciona a grid para que o movimento seja sempre para a 'esquerda'
        const rotationMap = {
            'left': 0,
            'up': 1,
            'right': 2,
            'down': 3
        };
        const rotations = rotationMap[direction] || 0;
        let rotatedGrid = this._rotate(this.grid, rotations);

        // 2. Processa as linhas (movimento para a esquerda)
        for (let r = 0; r < this.size; r++) {
            // Filtra as tiles válidas (não nulas)
            let row = rotatedGrid[r].filter(tile => tile);
            
            // Combinação (Merge)
            for (let c = 0; c < row.length - 1; c++) {
                if (row[c] && row[c + 1] && row[c].value === row[c + 1].value) {
                    // Merge
                    const mergedValue = row[c].merge(row[c + 1]);
                    scoreDelta += mergedValue;
                    
                    row[c + 1] = null; // Remove merged tile da linha temporária
                    moved = true;
                }
            }

            // Remove as tiles marcadas e desliza
            row = row.filter(tile => tile !== null);
            
            // Preenche com nulls no final
            const newRow = [...row];
            while (newRow.length < this.size) newRow.push(null);
            
            // Verifica se houve movimento (comparação de valores para evitar falsos positivos)
            // A verificação deve ser feita comparando a novaRow com a linha original antes do preenchimento
            // Simplificando a verificação de movimento: se a nova linha for diferente da original, houve movimento.
            const originalRowValues = rotatedGrid[r].map(t => t ? t.value : 0).join(',');
            const newRowValues = newRow.map(t => t ? t.value : 0).join(',');
            if (originalRowValues !== newRowValues) {
                moved = true;
            }

            rotatedGrid[r] = newRow;
        }

        // 3. Desrotaciona
        this.grid = this._rotate(rotatedGrid, (4 - rotations) % 4);

        // 4. Atualiza posições e remove tiles fundidas
        this.tiles = this.tiles.filter(tile => {
            // Mantém apenas as tiles que ainda estão na grid
            for (let r = 0; r < this.size; r++) {
                for (let c = 0; c < this.size; c++) {
                    if (this.grid[r][c] === tile) return true;
                }
            }
            return false;
        });

        this.updateTilePositions();
        
        // 5. Spawn novo tile se houve movimento
        if (moved) {
            this.addTile();
        }

        return { moved, scoreDelta };
    }

    // Helper para rotacionar a matriz (0: 0deg, 1: 90deg, 2: 180deg, 3: 270deg)
    _rotate(grid, times) {
        if (times === 0) return grid;
        
        let newGrid = grid;
        for (let t = 0; t < times; t++) {
            const size = this.size;
            const rotated = Array.from({ length: size }, () => Array(size).fill(null));
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    // Rotação 90 graus: new[c][size-1-r] = old[r][c]
                    rotated[c][size - 1 - r] = newGrid[r][c];
                }
            }
            newGrid = rotated;
        }
        return newGrid;
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
