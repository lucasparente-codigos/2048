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
            value = randomInt(1, 10) <= 9 ? 2 : 4; // 90% chance de 2, 10% de 4
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
        tile.isNew = true; // Marca como nova para animação
        this.grid[row][col] = tile;
        this.tiles.push(tile);
        return true;
    }

    move(direction) {
        let moved = false;
        let scoreDelta = 0;

        // Prepara uma cópia da grid para processar
        const oldGrid = this.grid.map(row => [...row]);

        // Processa cada linha/coluna baseado na direção
        if (direction === 'left') {
            for (let r = 0; r < this.size; r++) {
                const result = this.processLine(this.grid[r]);
                if (result.moved) moved = true;
                scoreDelta += result.score;
                this.grid[r] = result.line;
            }
        } else if (direction === 'right') {
            for (let r = 0; r < this.size; r++) {
                const result = this.processLine([...this.grid[r]].reverse());
                if (result.moved) moved = true;
                scoreDelta += result.score;
                this.grid[r] = result.line.reverse();
            }
        } else if (direction === 'up') {
            for (let c = 0; c < this.size; c++) {
                const column = [];
                for (let r = 0; r < this.size; r++) {
                    column.push(this.grid[r][c]);
                }
                const result = this.processLine(column);
                if (result.moved) moved = true;
                scoreDelta += result.score;
                for (let r = 0; r < this.size; r++) {
                    this.grid[r][c] = result.line[r];
                }
            }
        } else if (direction === 'down') {
            for (let c = 0; c < this.size; c++) {
                const column = [];
                for (let r = 0; r < this.size; r++) {
                    column.push(this.grid[r][c]);
                }
                const result = this.processLine([...column].reverse());
                if (result.moved) moved = true;
                scoreDelta += result.score;
                const reversedLine = result.line.reverse();
                for (let r = 0; r < this.size; r++) {
                    this.grid[r][c] = reversedLine[r];
                }
            }
        }

        // Atualiza lista de tiles removendo as que foram fundidas
        this.tiles = [];
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c]) {
                    this.tiles.push(this.grid[r][c]);
                }
            }
        }

        // Atualiza posições das tiles
        this.updateTilePositions();

        // Adiciona nova tile se houve movimento
        if (moved) {
            this.addTile();
        }

        return { moved, scoreDelta };
    }

    /**
     * Processa uma linha (movimento para a esquerda)
     * @param {Array} line - Array de tiles
     * @returns {Object} { line, moved, score }
     */
    processLine(line) {
        let moved = false;
        let score = 0;

        // Remove nulls e mantém apenas tiles
        const tiles = line.filter(tile => tile !== null);
        const original = [...tiles];

        // Faz merge de tiles adjacentes iguais
        const merged = [];
        let i = 0;
        while (i < tiles.length) {
            if (i + 1 < tiles.length && tiles[i].value === tiles[i + 1].value) {
                // Merge
                const newValue = tiles[i].value * 2;
                tiles[i].value = newValue;
                tiles[i].mergedFrom = [tiles[i + 1]];
                score += newValue;
                merged.push(tiles[i]);
                i += 2; // Pula a próxima tile que foi fundida
                moved = true;
            } else {
                merged.push(tiles[i]);
                i++;
            }
        }

        // Preenche com nulls no final
        while (merged.length < line.length) {
            merged.push(null);
        }

        // Verifica se houve movimento comparando com a linha original
        if (!moved) {
            for (let j = 0; j < line.length; j++) {
                if (line[j] !== merged[j]) {
                    moved = true;
                    break;
                }
            }
        }

        return { line: merged, moved, score };
    }

    updateTilePositions() {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                const tile = this.grid[r][c];
                if (tile) {
                    tile.updatePosition(r, c);
                }
            }
        }
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
        // Limpa tiles antigas
        const oldTiles = container.querySelectorAll('.tile');
        oldTiles.forEach(tile => tile.remove());

        // Renderiza tiles atuais
        this.tiles.forEach(tile => {
            const el = tile.createElement();
            container.appendChild(el);
            
            // Força reflow para animação
            el.offsetHeight;
            
            // Atualiza posição
            tile.updatePosition(tile.row, tile.col);
        });
    }

    isGameOver() {
        // Sem moves possíveis: full grid sem merges adjacentes
        return this.tiles.length === this.size * this.size && !this.hasMove();
    }

    hasMove() {
        // Verifica se há células vazias
        if (this.tiles.length < this.size * this.size) return true;

        // Check horizontal/vertical adjacentes iguais
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                const tile = this.grid[r][c];
                if (!tile) return true;
                
                // Verifica à direita
                if (c < this.size - 1) {
                    const rightTile = this.grid[r][c + 1];
                    if (rightTile && tile.value === rightTile.value) return true;
                }
                
                // Verifica abaixo
                if (r < this.size - 1) {
                    const bottomTile = this.grid[r + 1][c];
                    if (bottomTile && tile.value === bottomTile.value) return true;
                }
            }
        }
        return false;
    }

    hasWon() {
        return this.tiles.some(tile => tile.value >= 2048);
    }

    clear() {
        this.grid = Array.from({ length: this.size }, () => Array(this.size).fill(null));
        this.tiles = [];
    }

    // Serialize para storage
    serialize() {
        return this.tiles.map(tile => ({ 
            value: tile.value, 
            row: tile.row, 
            col: tile.col 
        }));
    }
}
