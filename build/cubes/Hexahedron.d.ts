import * as THREE from 'three';
import { Order } from '../utils';
import { HexahedronBaseCubelet } from './Cubelets/HexahedronBaseCubelet';
export declare class Hexahedron<T extends HexahedronBaseCubelet> {
    private _cubeletType;
    layer: number;
    groupT: THREE.Group;
    group: Array<T>;
    orders: Array<Order>;
    private _status;
    constructor(layer: number, _cubeletType: new (coordinate: number[]) => T);
    enqueue(order: Order): void;
    restore(): void;
    update(): void;
    private _perform;
    private _rotate;
    private _setupRotationStatus;
}
