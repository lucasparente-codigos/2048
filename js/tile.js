import { getTileClass } from './utils.js';

const TILE_SIZE_WITH_GAP = 112; // 100px (tamanho) + 12px (gap)
const GAP_OFFSET = 12; // O offset inicial é o gap


export class Tile {
    constructor(value, row, col) {
        this.value = value;
        this.row = row;
        this.col = col;
        this.mergedFrom = null; // Para rastrear fusão
        this.element = null;
    }
    
    createElement() {
        const div = document.createElement('div');
        div.className = getTileClass(this.value);
        div.textContent = this.value;
        if (this.mergedFrom) {
            div.classList.add('merge'); // Animação de fusão
        } else if (this.isNew) {
            div.classList.add('new'); // Animação de spawn
        }
        div.dataset.row = this.row;
        div.dataset.col = this.col;
        this.element = div;
        return div;
    }

    updatePosition(row, col) {
        this.row = row;
        this.col = col;
        if (this.element) {
            // Novo cálculo: col * (tile + gap) + gap
            const x = col * TILE_SIZE_WITH_GAP + GAP_OFFSET;
            const y = row * TILE_SIZE_WITH_GAP + GAP_OFFSET;
            
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

