
import * as THREE from 'three'


/*
  A cubelet.
 */
export abstract class BaseCubelet extends THREE.Mesh {

  constructor(geometry: THREE.Geometry | THREE.BufferGeometry, material: THREE.Material | THREE.Material[]) {
    super(geometry, material)
  }

  abstract setInitialPosition(): void

  public rotateOnCubeAxis(axis: THREE.Vector3, angle: number): void {
    const pos = this.position.clone()
    pos.applyAxisAngle(axis, angle)
    this.rotateOnWorldAxis(axis, angle)
    // TODO understand why do this
    this.position.copy(pos)
  }
}
