import { Board } from './board.js';
import { StorageManager } from './storage.js';
import { formatScore } from './utils.js';

export class Game {
    constructor(config) {
        this.board = new Board(config.gridSize);
        this.score = 0;
        this.gameOver = false;
        this.won = false;
        this.config = config;
        this.scoreEl = document.getElementById('score');
        this.bestScoreEl = document.getElementById('best-score');
        this.messageEl = document.getElementById('message');
        this.gridContainer = document.getElementById('grid-container');
        StorageManager.updateUI(this.bestScoreEl);
    }

    init() {
        this.board.clear();
        this.board.addTile();
        this.board.addTile();
        this.score = 0;
        this.updateScore();
        this.board.render(this.gridContainer);
        this.gameOver = false;
        this.won = false;
        StorageManager.clearGameState();
    }

    move(direction) {
        if (this.gameOver) return;
        
        // Board.move agora retorna { moved, scoreDelta }
        const { moved, scoreDelta } = this.board.move(direction);

        if (moved) {
            // 1. Atualiza a pontuação
            if (scoreDelta > 0) {
                this.addScore(scoreDelta);
            }

            // 2. Renderiza o tabuleiro (com as novas posições e tiles)
            this.board.render(this.gridContainer); // Com animações via classes

            // 3. Verifica condições de vitória/derrota
            if (this.board.hasWon() && !this.won) { // Verifica se ganhou PELA PRIMEIRA VEZ
                this.won = true;
                this.showMessage('Você venceu! Continue para mais pontos.');
            }
            if (this.board.isGameOver()) {
                this.gameOver = true;
                StorageManager.setBestScore(this.score);
                StorageManager.updateUI(this.bestScoreEl);
                this.showMessage('Game Over! Pontuação final: ' + formatScore(this.score));
            }
        }
    }

    updateScore() {
        this.scoreEl.textContent = formatScore(this.score);
    }

    showMessage(text) {
        this.messageEl.textContent = text;
        this.messageEl.style.display = 'block';
    }

    restart() {
        this.messageEl.style.display = 'none';
        this.init();
    }

    addScore(delta) {
        this.score += delta;
        this.updateScore();
        // Atualiza o melhor score
        if (this.score > StorageManager.getBestScore()) {
            StorageManager.setBestScore(this.score);
            StorageManager.updateUI(this.bestScoreEl);
        }
    }
}
