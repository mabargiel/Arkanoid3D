/// <reference path="../typings/index.d.ts" />

namespace Arkanoid3D {
    export interface Game {
        run(): void
    }

    export class StaticLevelGame implements Game {
        run(): void {
            throw new Error("Method not implemented.");
        }
        
    }

    let game = new StaticLevelGame();
    game.run();
}