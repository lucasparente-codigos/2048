import { getTileClass } from './utils.js';

const TILE_SIZE = 100; // pixels
const GAP = 12; // pixels
const TILE_SIZE_WITH_GAP = TILE_SIZE + GAP;

export class Tile {
    constructor(value, row, col) {
        this.value = value;
        this.row = row;
        this.col = col;
        this.mergedFrom = null; // Para rastrear fusão
        this.element = null;
        this.isNew = false; // Para animação de spawn
    }
    
    createElement() {
        const div = document.createElement('div');
        div.className = getTileClass(this.value);
        div.textContent = this.value;
        
        // Adiciona classes de animação
        if (this.mergedFrom) {
            div.classList.add('merge');
            this.mergedFrom = null; // Reset após criar elemento
        } else if (this.isNew) {
            div.classList.add('new');
            this.isNew = false; // Reset após criar elemento
        }
        
        div.dataset.row = this.row;
        div.dataset.col = this.col;
        
        // Define posição inicial
        const x = this.col * TILE_SIZE_WITH_GAP + GAP;
        const y = this.row * TILE_SIZE_WITH_GAP + GAP;
        div.style.transform = `translate(${x}px, ${y}px)`;
        
        this.element = div;
        return div;
    }

    updatePosition(row, col) {
        this.row = row;
        this.col = col;
        
        if (this.element) {
            const x = col * TILE_SIZE_WITH_GAP + GAP;
            const y = row * TILE_SIZE_WITH_GAP + GAP;
            
            this.element.style.transform = `translate(${x}px, ${y}px)`;
            this.element.dataset.row = row;
            this.element.dataset.col = col;
        }
    }

    merge(tile) {
        this.value += tile.value;
        this.mergedFrom = [tile];
        return this.value;
    }

    equals(other) {
        return this.value === other.value && this.row === other.row && this.col === other.col;
    }
}

