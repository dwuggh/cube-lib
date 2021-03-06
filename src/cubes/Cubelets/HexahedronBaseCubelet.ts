import * as THREE from 'three'
import { BaseCubelet } from './BaseCubelet'


/*
  A simple hexahedron cubelet base class.
 */
export class HexahedronBaseCubelet extends BaseCubelet {
  // i, j, k and layer indicate coordinates
  // i, j, k correspond to x, y, z
  i: number
  j: number
  k: number
  // center position
  center : number
  layer: number

  constructor(geometry: THREE.Geometry | THREE.BufferGeometry, materials: THREE.Material | THREE.Material[], coordinate: number[]) {
    super(geometry, materials)
    this.i = coordinate[0]
    this.j = coordinate[1]
    this.k = coordinate[2]
    this.layer = coordinate[3]
    this.center = (this.layer - 1) / 2

    // setting properties
    this.name = `${this.i}+${this.j}+${this.k}`
    this.setInitialPosition()

  }

  public setInitialPosition(): void {
    this.position.set(
      this.i - this.center,
      this.j - this.center,
      this.k - this.center
    )
    this.rotation.set(0, 0, 0)
  }

  public positionFilter(index: number, infimum: number, supremum: number): boolean {
    const pos = this.position.getComponent(index)
    // add error tolerence
    // FIXME maybe modify rotateOnCubeAxis is a better solution?
    // const err = 1E-6
    const val = (this.layer - 1) / 2 + pos                 // center position
    // return infimum - err <= val && val < supremum + err && val != supremum
    return infimum <= val && val < supremum
  }

  public round(): THREE.Vector3 {
    this.position.copy(
      this.position.clone().addScalar(this.center).
        round().
        addScalar(- this.center)
    )
    return this.position
  }
}
