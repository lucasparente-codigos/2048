import { Game } from './game.js';
import { initInput } from './input.js';
import { StorageManager } from './storage.js';
import { logDebug } from './utils.js';

/**
 * Classe responsável pela inicialização e gerenciamento da aplicação
 * Versão compatível com o código original
 */
class App {
    constructor() {
        this.game = null;
        this.config = null;
        this.defaultConfig = {
            gridSize: 4,
            goal: 2048,
            animationSpeed: 120,
            theme: 'light'
        };
    }

    /**
     * Carrega a configuração do arquivo JSON
     */
    async loadConfig() {
        try {
            const response = await fetch('data/config.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.config = await response.json();
            logDebug('Configuração carregada:', this.config);
            
        } catch (error) {
            console.warn('Erro ao carregar config.json, usando configuração padrão:', error.message);
            this.config = this.defaultConfig;
            logDebug('Usando configuração padrão:', this.config);
        }
    }

    /**
     * Inicializa o jogo
     */
    initGame() {
        try {
            this.game = new Game(this.config);
            this.game.init();
            logDebug('Jogo inicializado');
        } catch (error) {
            console.error('Erro ao inicializar o jogo:', error);
            throw error;
        }
    }

    /**
     * Configura os event listeners
     */
    setupEventListeners() {
        // Botão Restart
        const restartBtn = document.getElementById('restart');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.game.restart();
                logDebug('Jogo reiniciado');
            });
        }

        // Inicializa controles de input (teclado e touch)
        initInput(this.game);

        // Atalho R para restart
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                this.game.restart();
            }
        });

        logDebug('Event listeners configurados');
    }

    /**
     * Método principal de inicialização
     */
    async initialize() {
        try {
            logDebug('Inicializando aplicação...');
            
            // 1. Carrega configuração
            await this.loadConfig();
            
            // 2. Inicializa o jogo
            this.initGame();
            
            // 3. Configura event listeners
            this.setupEventListeners();
            
            logDebug('Aplicação inicializada com sucesso!');
            
        } catch (error) {
            console.error('Erro crítico na inicialização:', error);
            alert('Erro ao carregar o jogo. Por favor, recarregue a página.');
            throw error;
        }
    }
}

/**
 * Ponto de entrada da aplicação
 */
async function init() {
    try {
        // Aguarda o DOM estar completamente carregado
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }
        
        // Cria e inicializa a aplicação
        const app = new App();
        await app.initialize();
        
        // Expõe a instância globalmente para debug (apenas em desenvolvimento)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            window.game2048 = app;
            logDebug('Aplicação disponível em window.game2048 para debug');
        }
        
    } catch (error) {
        console.error('Erro fatal:', error);
    }
}

// Inicializa
init();