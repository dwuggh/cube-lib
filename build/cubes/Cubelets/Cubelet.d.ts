import * as THREE from 'three';
export declare class Cubelet extends THREE.Mesh {
    i: number;
    j: number;
    k: number;
    center: number;
    constructor(i: number, j: number, k: number, layer: number);
    setSticker(sticker: number, face: number): void;
    static setColor(materials: Array<THREE.Material>, color: number, face: number): void;
    setInitialPosition(): void;
    rotateOnCubeAxis(axis: THREE.Vector3, angle: number): void;
}
