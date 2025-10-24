import { Game } from './game.js'; // Dependente de game

let game; // Instância global ou passe via init

export function initInput(gameInstance) {
    game = gameInstance;
    document.addEventListener('keydown', handleKeydown);
    const gridContainer = document.getElementById('grid-container');
    let startX, startY;
    gridContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    gridContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    gridContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
}

function handleKeydown(e) {
    switch (e.key) {
        case 'ArrowUp': game.move('up'); break;
        case 'ArrowDown': game.move('down'); break;
        case 'ArrowLeft': game.move('left'); break;
        case 'ArrowRight': game.move('right'); break;
    }
    e.preventDefault();
}

function handleTouchStart(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
}

function handleTouchMove(e) {
    e.preventDefault(); // Previne scroll
}

function handleTouchEnd(e) {
    if (!startX || !startY) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = startX - endX;
    const diffY = startY - endY;
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) game.move('left');
        else game.move('right');
    } else {
        if (diffY > 0) game.move('up');
        else game.move('down');
    }
    startX = startY = null;
}