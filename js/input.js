import { logDebug } from './utils.js';

// js/input.js - Substituir a função initInput

export function initInput(game) {
    let isProcessing = false;

    const handleMove = async (direction) => {
        if (isProcessing) return;
        isProcessing = true;
        
        logDebug('Input:', direction);
        game.move(direction);
        
        // Pequeno delay para evitar inputs múltiplos
        setTimeout(() => {
            isProcessing = false;
        }, 100);
    };

    // Input de Teclado
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
            e.preventDefault();
            handleMove(direction);
        }
    });

    // Input de Touch
    const gridContainer = document.getElementById('grid-container');
    let startX, startY;
    const minSwipeDistance = 30; // Distância mínima para considerar swipe

    gridContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });

    gridContainer.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });

    gridContainer.addEventListener('touchend', (e) => {
        if (!startX || !startY) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Verifica se o movimento foi significativo
        if (Math.abs(diffX) < minSwipeDistance && Math.abs(diffY) < minSwipeDistance) {
            startX = startY = null;
            return;
        }
        
        let direction = null;
        if (Math.abs(diffX) > Math.abs(diffY)) {
            direction = diffX > 0 ? 'left' : 'right';
        } else {
            direction = diffY > 0 ? 'up' : 'down';
        }

        if (direction) {
            handleMove(direction);
        }

        startX = startY = null;
    }, { passive: true });
}

