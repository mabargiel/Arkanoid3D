import * as THREE from "three"

export class GroundMesh extends THREE.Mesh {
    constructor(widht:number, height:number, depth:number, color:THREE.Color) {
        super();
        this.geometry = new THREE.CubeGeometry(widht, height, depth);
        this.material = new THREE.MeshLambertMaterial({color})
    }
}