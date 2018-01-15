import { StandardGame } from './src/ts/Game'

const game = new StandardGame();

function gameLoop() {
    requestAnimationFrame(gameLoop);

    game.update();
    game.render();
}

gameLoop();
