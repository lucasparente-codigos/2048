import { formatScore } from './utils.js';

const STORAGE_KEYS = {
    bestScore: '2048_bestScore',
    gameState: '2048_gameState' // Para salvar board se quiser pausar
};

export class StorageManager {
    static getBestScore() {
        return parseInt(localStorage.getItem(STORAGE_KEYS.bestScore)) || 0;
    }

    static setBestScore(score) {
        if (score > this.getBestScore()) {
            localStorage.setItem(STORAGE_KEYS.bestScore, score);
        }
    }

    static saveGameState(board) {
        localStorage.setItem(STORAGE_KEYS.gameState, JSON.stringify(board));
    }

    static loadGameState() {
        const saved = localStorage.getItem(STORAGE_KEYS.gameState);
        return saved ? JSON.parse(saved) : null;
    }

    static clearGameState() {
        localStorage.removeItem(STORAGE_KEYS.gameState);
    }

    static updateUI(bestScoreEl) {
        bestScoreEl.textContent = formatScore(this.getBestScore());
    }
}