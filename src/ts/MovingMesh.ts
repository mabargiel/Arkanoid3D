import { Vector2 } from "three";

export interface Item {
    x: number;
    y: number;
}

import * as THREE from "three"

export abstract class MovingMesh extends THREE.Mesh {
    speedVector: Vector2;
    
    setSpeedVect(vector: Vector2): void {
        this.speedVector = vector;
    }

    move(): void {
        this.position.x += this.speedVector.x;
        this.position.y += this.speedVector.y;
    }

    accelerate(accFactor: number) {
        if(accFactor < 1)
            console.error("values less than 1.0 are not allowed");

        this.speedVector.multiplyScalar(accFactor);
    }

    slowDown(accFactor: number) {
        if(accFactor < 1)
            console.error("values less than 1.0 are not allowed");
        
        this.speedVector.multiplyScalar(1/accFactor);
    }
}