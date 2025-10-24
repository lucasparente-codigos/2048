import { logDebug } from './utils.js';

export function initInput(game) {
    // 1. Input de Teclado
    document.addEventListener('keydown', (e) => {
        let direction = null;

        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                direction = 'up';
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                direction = 'right';
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                direction = 'down';
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                direction = 'left';
                break;
            default:
                return;
        }

        if (direction) {
            e.preventDefault(); // Previne o scroll
            logDebug('Input de Teclado:', direction);
            game.move(direction);
        }
    });

    // 2. Input de Touch (mantendo a lógica de swipe)
    const gridContainer = document.getElementById('grid-container');
    let startX, startY;

    gridContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });

    gridContainer.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Previne scroll
    }, { passive: false });

    gridContainer.addEventListener('touchend', (e) => {
        if (!startX || !startY) return;
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        let direction = null;
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Movimento Horizontal
            if (diffX > 0) direction = 'left';
            else direction = 'right';
        } else {
            // Movimento Vertical
            if (diffY > 0) direction = 'up';
            else direction = 'down';
        }

        if (direction) {
            logDebug('Input de Touch:', direction);
            game.move(direction);
        }

        startX = startY = null;
    }, { passive: true });
}

