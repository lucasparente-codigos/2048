import { Game } from './game.js';
import { initInput } from './input.js';
import { StorageManager } from './storage.js';
import { logDebug } from './utils.js';

async function init() {
    try {
        // Carrega config
        const response = await fetch('data/config.json');
        const config = await response.json();
        logDebug('Config carregada:', config);

        const game = new Game(config);
        game.init();

        // Eventos
        document.getElementById('restart').addEventListener('click', () => game.restart());
        initInput(game);

        // Opcional: auto-save state periodicamente
        // setInterval(() => StorageManager.saveGameState(game.board.serialize()), 5000);

        logDebug('Jogo inicializado');
    } catch (error) {
        console.error('Erro ao carregar config:', error);
        // Fallback config
        const defaultConfig = { gridSize: 4, goal: 2048, animationSpeed: 120, theme: 'light' };
        const game = new Game(defaultConfig);
        game.init();
        // Continue...
    }
}

init();