import * as THREE from "three"
import { MeshLambertMaterial, PlaneGeometry, Mesh } from "three";

export class PlatformColors {
    constructor(public planeColor:THREE.Color, public tableColor:THREE.Color) {

    }
}

export class PlatformMeshGroup extends THREE.Group {
    constructor(width:number, height:number, depth:number, quality:number, colors:PlatformColors) {
        super();
        var planeMesh = new THREE.Mesh (
            new THREE.PlaneGeometry (
                width * 0.95,
                height,
                quality,
                quality
            ),
            new THREE.MeshLambertMaterial({color: colors.planeColor})
        );
        var tableMesh = new THREE.Mesh (
            new THREE.CubeGeometry (
                width * 1.05,
                height * 1.03,
                depth,
                quality,
                quality,
                1
            ),
            new THREE.MeshLambertMaterial({color: colors.tableColor})
        );

        planeMesh.receiveShadow = true;

        tableMesh.position.z = -depth / 2 - 1;

        this.add(tableMesh);
        this.add(planeMesh);
    }
}