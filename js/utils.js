// Funções utilitárias globais
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatScore(score) {
    return score.toLocaleString(); // Formatação com separadores de milhar
}

export function logDebug(...args) {
    if (process.env.NODE_ENV === 'development') { // Para debug; defina via config se quiser
        console.log('[2048 Debug]:', ...args);
    }
}

export function getTileClass(value) {
    return `tile tile-${value}`;
}

// Expanda para mais utils conforme necessário (ex: debounce para input)