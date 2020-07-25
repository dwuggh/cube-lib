import * as THREE from 'three';
export declare abstract class BaseCubelet extends THREE.Mesh {
    constructor(geometry: THREE.Geometry | THREE.BufferGeometry, material: THREE.Material | THREE.Material[]);
    abstract setInitialPosition(): void;
    rotateOnCubeAxis(axis: THREE.Vector3, angle: number): void;
}
