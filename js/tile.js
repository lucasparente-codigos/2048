import { getTileClass } from './utils.js';

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
            this.element.style.transform = `translate(calc(${col * 110}px + 10px), calc(${row * 110}px + 10px))`; // Ajuste para grid 4x4, gap/padding
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