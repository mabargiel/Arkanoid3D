import * as THREE from "three";
import { PlatformMeshGroup, PlatformColors } from "./PlatformMeshGroup";
import { PaddleMesh } from "./PaddleMesh";
import { GroundMesh } from "./GroundMesh";

export interface Game {
    run(): void;
}

export class StandardGame implements Game {
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;

    constructor() {
        this.setup();
    }

    run(): void {
        this.gameLoop();
    }

    setup(): void {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.scene.add(this.camera);

        this.camera.position.z = 320;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        const planeWidth: number = 400;
        const planeHeight: number = 200;

        var platformColors = new PlatformColors(new THREE.Color(0x4BD121), new THREE.Color(0x111111));
        var platform: THREE.Object3D = new PlatformMeshGroup(planeWidth * 0.95, planeHeight, 100, 10, platformColors);
        platform.receiveShadow = true;

        this.scene.add(platform);

        var paddleMesh = new PaddleMesh(10, 30, 10, new THREE.Color(0x1B32C0));
        paddleMesh.position.x = platform.position.x - planeWidth * 0.45 + 4;
        paddleMesh.position.y = platform.position.y;
        paddleMesh.position.z = 5;
        paddleMesh.receiveShadow = true;
        paddleMesh.castShadow = true;
        this.scene.add(paddleMesh);

        var ball = new THREE.Mesh(new THREE.SphereGeometry(5, 6, 6), new THREE.MeshLambertMaterial(
            {
                color: 0xD43001
            }));
        
            ball.castShadow = true;
            ball.receiveShadow = true;
            ball.position.z = paddleMesh.position.z;
        this.scene.add(ball);

        var groundMesh = new GroundMesh(1000, 1000, 3, new THREE.Color(0x888888))
        groundMesh.position.x = platform.position.x + 25;
        groundMesh.position.y = platform.position.y + 25;
        groundMesh.position.z = platform.position.z - 100;
        groundMesh.receiveShadow = true;
        this.scene.add(groundMesh);

        // // create a point light
        var pointLight =
            new THREE.PointLight(0xF8D898);

        // set its position
        pointLight.position.x = -1000;
        pointLight.position.y = 0;
        pointLight.position.z = 1000;
        pointLight.intensity = 2.0;
        pointLight.distance = 10000;
        // add to the scene
        this.scene.add(pointLight);
        

        // add a spot light
        // this is important for casting shadows
        var spotLight = new THREE.SpotLight(0xF8D898);
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
    }

    private gameLoop(): void {
        requestAnimationFrame(() => { this.gameLoop; });

        this.update();
        this.render();
    }

    private update(): void {

    }

    private render(): void {
        this.renderer.render(this.scene, this.camera);
    }
}