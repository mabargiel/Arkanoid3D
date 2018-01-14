import * as THREE from 'three';

export class PaddleMesh extends THREE.Mesh{
    constructor(width:number, height:number, depth:number, color:THREE.Color){
        super();
        this.geometry = new THREE.CubeGeometry(width, height, depth, 1, 1);
        this.material = new THREE.MeshLambertMaterial({color});
    }
}