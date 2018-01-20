import * as THREE from "three";
import * as keyboardJS from "keyboardjs";
import { PlatformMeshGroup, PlatformColors } from "./PlatformMeshGroup";
import { PaddleMesh } from "./PaddleMesh";
import { GroundMesh } from "./GroundMesh";

export interface Game {
    update(): void;
    render(): void;
}

export class GameState {
    ballDirY: number;
    ballDirX: number;
    fieldHeight: number = 200;
    fieldWidth: number = 400;
    paddleDirY: number = 0;
}

export class StandardGame implements Game {
    paddleMeshPC: PaddleMesh;
    ballMesh: THREE.Mesh;
    paddleMesh: PaddleMesh;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    gameState: GameState;

    constructor() {
        this.gameState = new GameState();
        this.setup();
    }

    private setup(): void {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.scene.add(this.camera);

        this.camera.position.z = 320;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        var planeWidth = this.gameState.fieldWidth;
        var planeHeight = this.gameState.fieldHeight;

        var platformColors = new PlatformColors(new THREE.Color(0x4BD121), new THREE.Color(0x111111));
        var platform: THREE.Object3D = new PlatformMeshGroup(planeWidth, planeHeight, 100, 10, platformColors);
        platform.receiveShadow = true;

        this.scene.add(platform);

        this.paddleMesh = new PaddleMesh(10, 30, 10, new THREE.Color(0x1B32C0));
        this.paddleMesh.position.x = platform.position.x - planeWidth * 0.45 + 4;
        this.paddleMesh.position.y = platform.position.y;
        this.paddleMesh.position.z = 5;
        this.paddleMesh.receiveShadow = true;
        this.paddleMesh.castShadow = true;
        this.scene.add(this.paddleMesh);

        this.paddleMeshPC = new PaddleMesh(10, 30, 10, new THREE.Color(0x1B32C0));
        this.paddleMeshPC.position.x = platform.position.x + planeWidth * 0.45 + 4;
        this.paddleMeshPC.position.y = platform.position.y;
        this.paddleMeshPC.position.z = 5;
        this.paddleMeshPC.receiveShadow = true;
        this.paddleMeshPC.castShadow = true;
        this.scene.add(this.paddleMeshPC);

        this.ballMesh = new THREE.Mesh(new THREE.SphereGeometry(5, 6, 6), new THREE.MeshLambertMaterial(
            {
                color: 0xD43001
            }));
        
            this.ballMesh.castShadow = true;
            this.ballMesh.receiveShadow = true;
            this.ballMesh.position.z = this.paddleMesh.position.z;
        this.scene.add(this.ballMesh);

        var groundMesh = new GroundMesh(1000, 1000, 3, new THREE.Color(0x888888))
        groundMesh.position.x = platform.position.x + 25;
        groundMesh.position.y = platform.position.y + 25;
        groundMesh.position.z = platform.position.z - 100;
        groundMesh.receiveShadow = true;
        this.scene.add(groundMesh);

        var pointLight =
            new THREE.PointLight(0xF8D898);

        pointLight.position.x = -1000;
        pointLight.position.y = 0;
        pointLight.position.z = 1000;
        pointLight.intensity = 2.0;
        pointLight.distance = 10000;
        this.scene.add(pointLight);

        var spotLight = 
            new THREE.SpotLight(0xF8D898);

        spotLight.position.set(0, 0, 300);
        spotLight.intensity = 1.5;
        spotLight.castShadow = true;
        this.scene.add(spotLight);

        this.camera.position.x = platform.position.x - 300;
        this.camera.position.y = (platform.position.y - this.camera.position.y) * 0.05;
        this.camera.position.z = platform.position.z + 100;

        this.camera.rotation.x = -0.01 * (platform.position.y) * Math.PI / 180;
        this.camera.rotation.y = -60 * Math.PI / 180;
        this.camera.rotation.z = -90 * Math.PI / 180;

        this.renderer.shadowMap.enabled = true;

        this.keyboardPhysics();
    }

    public update(): void {
        this.paddlePhysics();
        this.paddlePhysicsPC();
        this.ballPhysics();
    }

    private paddlePhysicsPC(): void {
        if(this.ballMesh.position.y > this.paddleMeshPC.position.y - 15 && this.ballMesh.position.y < this.paddleMeshPC.position.y + 15 && this.ballMesh.position.x > this.paddleMeshPC.position.x - 5) {
            this.gameState.ballDirX = -this.gameState.ballDirX;
        }

        if(this.paddleMeshPC.position.y <= this.ballMesh.position.y){
            this.paddleMeshPC.position.y += 3 * 0.8;

        }
        else if(this.paddleMeshPC.position.y > this.ballMesh.position.y) {
            this.paddleMeshPC.position.y += -3 * 0.8;
        }
    }

    private ballPhysics() {

        if(this.ballMesh.position.y + this.gameState.ballDirY >= this.gameState.fieldHeight * 0.45 || 
            this.ballMesh.position.y + this.gameState.ballDirY <= -this.gameState.fieldHeight * 0.45) {
                this.gameState.ballDirY = -this.gameState.ballDirY
        }
        else if(this.ballMesh.position.x < -this.gameState.fieldWidth * 0.45 ||
            this.ballMesh.position.x > this.gameState.fieldWidth * 0.45) {
                this.gameState.ballDirX = 0;
                this.gameState.ballDirY = 0;
                this.ballMesh.position.x = 0;
                this.ballMesh.position.y = 0;
        }

        this.ballMesh.position.x += this.gameState.ballDirX;
        this.ballMesh.position.y += this.gameState.ballDirY;
    }

    private paddlePhysics(): void {
        if(this.paddleMesh.position.y + this.gameState.paddleDirY <= this.gameState.fieldHeight * 0.45 && 
            this.paddleMesh.position.y + this.gameState.paddleDirY >= -this.gameState.fieldHeight * 0.45) {
            this.paddleMesh.position.y += this.gameState.paddleDirY;
        }

        if(this.ballMesh.position.y > this.paddleMesh.position.y - 15 && this.ballMesh.position.y < this.paddleMesh.position.y + 15 && this.ballMesh.position.x < this.paddleMesh.position.x + 5) {
            this.gameState.ballDirX = -this.gameState.ballDirX;

            this.gameState.ballDirY = (this.paddleMesh.position.y - this.ballMesh.position.y) * -0.3
        }
    }

    private keyboardPhysics(): void {
        keyboardJS.bind('d', () => {
            this.gameState.paddleDirY = -3 * 0.5;
        }, () => {
            this.gameState.paddleDirY = 0;
        });

        keyboardJS.bind('a', () => {
            this.gameState.paddleDirY = 3 * 0.5;
        }, () => {
            this.gameState.paddleDirY = 0;
        });

        keyboardJS.bind('r', () => {
            this.ballMesh.position.x = 0;
            this.ballMesh.position.y = 0;
            this.gameState.ballDirY = 1.5;
            this.gameState.ballDirX = -2;
        }, () => null);
    }

    public render(): void {
        this.renderer.render(this.scene, this.camera);
    }
}