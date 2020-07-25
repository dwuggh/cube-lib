import * as THREE from 'three';
import { BaseCubelet } from './BaseCubelet';
export declare class HexahedronBaseCubelet extends BaseCubelet {
    i: number;
    j: number;
    k: number;
    layer: number;
    constructor(geometry: THREE.Geometry | THREE.BufferGeometry, materials: THREE.Material | THREE.Material[], coordinate: number[]);
    setInitialPosition(): void;
    positionFilter(index: number, infimum: number, supremum: number): boolean;
}
