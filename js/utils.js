// Funções utilitárias globais

/**
 * Gera um número inteiro aleatório entre min e max (inclusive)
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Formata a pontuação com separadores de milhar
 */
export function formatScore(score) {
    return score.toLocaleString('pt-BR');
}

/**
 * Verifica se está em ambiente de desenvolvimento
 */
export function isDevelopment() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1';
}

/**
 * Log de debug (apenas em desenvolvimento)
 */
export function logDebug(...args) {
    if (isDevelopment()) {
        console.log('%c[2048 Debug]', 'color: #00bcd4; font-weight: bold;', ...args);
    }
}

/**
 * Log de erro
 */
export function logError(...args) {
    console.error('%c[2048 Error]', 'color: #f44336; font-weight: bold;', ...args);
}

/**
 * Log de aviso
 */
export function logWarn(...args) {
    console.warn('%c[2048 Warning]', 'color: #ff9800; font-weight: bold;', ...args);
}

/**
 * Retorna a classe CSS para uma tile baseado no valor
 */
export function getTileClass(value) {
    return `tile tile-${value}`;
}

/**
 * Debounce - Limita a frequência de execução de uma função
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle - Garante que uma função seja executada no máximo uma vez por intervalo
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Cria um array 2D preenchido com um valor
 */
export function create2DArray(rows, cols, fillValue = null) {
    return Array.from({ length: rows }, () => 
        Array(cols).fill(fillValue)
    );
}

/**
 * Verifica se dois arrays são iguais (comparação rasa)
 */
export function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((val, index) => val === arr2[index]);
}

/**
 * Clona profundamente um objeto simples (sem funções ou referências circulares)
 */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}