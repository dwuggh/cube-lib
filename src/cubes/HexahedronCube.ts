import * as THREE from 'three'
import { Move } from '../utils'
import { HexahedronBaseCubelet } from './Cubelets/HexahedronBaseCubelet'
import { BaseCube, RotationProgress } from './BaseCube'


const axisX = new THREE.Vector3(1, 0, 0)
const axisY = new THREE.Vector3(0, 1, 0)
const axisZ = new THREE.Vector3(0, 0, 1)


/*
  Hexahedron cubes. From 2x2x2 to NxNxN cubes.
  A cube can perform an or a sequence of order, and render it on the canvas using webGL.
  Scrambling and solving should handled by other program, as well parsing the order.
  The only algorithm-related method is the restore() method.
 */
export class HexahedronCube<T extends HexahedronBaseCubelet> extends BaseCube<T> {
  // the layer of this hexahedron cube. Could be any positive integer.
  layer: number

  constructor(private _cubeletType: new (coordinate: number[]) => T, layer: number) {
    super()
    this.layer = layer

    // set up cubelets
    for (let i = 0; i < layer; i++) {
      for (let j = 0; j < layer; j++) {
        for (let k = 0; k < layer; k++) {
          const cubelet = new this._cubeletType([i, j, k, layer])
          this.add(cubelet)
        }
      }
    }
  }

  protected _perform(): RotationProgress<T> {
    // control rotation speed, faster when there are too many orders
    let anglePerFrame = this.moves.length >= 1 ? 1.0 : 0.38
    anglePerFrame = this._rotationProgress.remainAngle > 0 ? anglePerFrame : - anglePerFrame
    if (Math.abs(this._rotationProgress.remainAngle) < Math.abs(anglePerFrame)) {
      // in case the remaining angle is too small
      this._rotate(this._rotationProgress.group, this._rotationProgress.axis, this._rotationProgress.remainAngle)
      // error correction
      for (const cubelet of this.children) cubelet.round()
      // when finished, set current status to null
      this._rotationProgress = null
    } else {
      this._rotate(this._rotationProgress.group, this._rotationProgress.axis, anglePerFrame)
      this._rotationProgress.remainAngle -= anglePerFrame
    }
    return this._rotationProgress
  }

  // rotate elements in array
  private _rotate(group: Array<T>, axis: THREE.Vector3, angle: number): void {
    for (const cubelet of group) {
      cubelet.rotateOnCubeAxis(axis, angle)
    }
  }

  protected _setupRotationProgress(move: Move): RotationProgress<T> {
    const rotationGroup = new Array<T>()
    let axis: THREE.Vector3
    let inf1 = 0
    let sup1 = move.height
    let inf2 = this.layer - move.height
    let sup2 = this.layer
    if (move.start != undefined) {
      inf1 = move.start
      sup1 = move.start + move.height
      inf2 = this.layer - move.start - move.height
      sup2 = this.layer - move.start
    }
    switch (move.face) {
      case 'R':
        axis = axisX.clone().negate()
        for (const cubelet of this.children) {
          if (cubelet.positionFilter(0, inf2, sup2)) {
            rotationGroup.push(cubelet)
          }
        }
        break
      case 'L':
        axis = axisX
        for (const cubelet of this.children) {
          if (cubelet.positionFilter(0, inf1, sup1)) {
            rotationGroup.push(cubelet)
          }
        }
        break
      case 'U':
        axis = axisY.clone().negate()
        for (const cubelet of this.children) {
          if (cubelet.positionFilter(1, inf2, sup2)) {
            rotationGroup.push(cubelet)
          }
        }
        break
      case 'D':
        axis = axisY
        for (const cubelet of this.children) {
          if (cubelet.positionFilter(1, inf1, sup1)) {
            rotationGroup.push(cubelet)
          }
        }
        break
      case 'F':
        axis = axisZ.clone().negate()
        for (const cubelet of this.children) {
          if (cubelet.positionFilter(2, inf2, sup2)) {
            rotationGroup.push(cubelet)
          }
        }
        break
      case 'B':
        axis = axisZ
        for (const cubelet of this.children) {
          if (cubelet.positionFilter(2, inf1, sup1)) {
            rotationGroup.push(cubelet)
          }
        }
        break
      default:
        throw new Error('ERROR: unknown move.face')
    }
    this._rotationProgress = {
      move: move,
      axis: axis,
      remainAngle: move.angle,
      group: rotationGroup,
    }
    return this._rotationProgress
  }

  /*
    get current permutation
    NOTE this do not contain whole information of this permutation group, but as a direct subgroup
  */
  public getPosPerm(): Array<T> {
    const perm = new Array<T>()
    for (let i = 0; i < this.layer; i++) {
      for (let j = 0; j < this.layer; j++) {
        for (let k = 0; k < this.layer; k++) {
          for (const cubelet of this.children) {
            const center = (this.layer - 1) / 2
            const vec = new THREE.Vector3(i - center, j - center, k - center)
            if (cubelet.position.equals(vec))
              perm.push(cubelet)
          }
        }
      }
    }
    if (perm.length != this.layer ** 3) throw new Error('cannot call getPosPerm when rotating')
    return perm
  }
}
