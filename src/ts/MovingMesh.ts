import { Vector2 } from "three";

export interface Item {
    x: number;
    y: number;
}

export abstract class MovingItem {
    speedVector: Vector2;
    
    SetSpeedVect(vector: Vector2): void {
        this.speedVector = vector;
    }

    Accelerate(accFactor: number) {
        if(accFactor < 1)
            console.error("values less than 1.0 are not allowed");

        this.speedVector.multiplyScalar(accFactor);
    }

    SlowDown(accFactor: number) {
        if(accFactor < 1)
            console.error("values less than 1.0 are not allowed");
        
        this.speedVector.multiplyScalar(1/accFactor);
    }
}