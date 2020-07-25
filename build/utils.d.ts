import { BaseCubelet } from "./cubes/Cubelets/BaseCubelet";
export interface Order {
    face: string;
    height: number;
    angle: number;
}
export interface Status<T extends BaseCubelet> {
    order: Order;
    axis: THREE.Vector3;
    remainAngle: number;
    group: Array<T>;
}
