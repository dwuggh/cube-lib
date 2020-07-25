import * as THREE from 'three'
import { Order, Status } from '../utils'
import { HexahedronBaseCubelet } from './Cubelets/HexahedronBaseCubelet'
import { BaseCube } from './BaseCube'


const axisX = new THREE.Vector3(1, 0, 0)
const axisY = new THREE.Vector3(0, 1, 0)
const axisZ = new THREE.Vector3(0, 0, 1)


/*
  Hexahedron cubes. From 2x2x2 to NxNxN cubes.
  A cube can perform an or a sequence of order, and render it on the canvas using webGL.
  Scrambling and solving should handled by other program, as well parsing the order.
  The only algorithm-related method is the restore() method.
 */
export class Hexahedron<T extends HexahedronBaseCubelet> extends BaseCube<T> {
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

  protected _perform(): Status<T> {
    // control rotation speed, faster when there are too many orders
    const anglePerFrame = this.orders.length >= 1 ? 1.0 : 0.38
    if (Math.abs(this._progress.remainAngle) < anglePerFrame) {
      // in case the remaining angle is too small
      this._rotate(this._progress.group, this._progress.axis, this._progress.remainAngle)
      // when finished, set current status to undefined (or null, whatever)
      this._progress = undefined
    } else {
      this._rotate(this._progress.group, this._progress.axis, anglePerFrame)
      this._progress.remainAngle -= anglePerFrame
    }
    return this._progress
  }

  // rotate elements in array
  private _rotate(group: Array<T>, axis: THREE.Vector3, angle: number): void {
    for (const cubelet of group) {
      cubelet.rotateOnCubeAxis(axis, angle)
    }
  }

  protected _setupRotationStatus(order: Order): Status<T> {

    const rotationGroup = new Array<T>()
    let axis: THREE.Vector3
    switch (order.face) {
      case 'R':
        axis = axisX.clone().negate()
        for (const cubelet of this.children) {
          if (cubelet.positionFilter(0, this.layer - order.height, this.layer)) {
            rotationGroup.push(cubelet)
          }
        }
        break
      case 'L':
        axis = axisX
        for (const cubelet of this.children) {
          if (cubelet.positionFilter(0, 0, order.height)) {
            rotationGroup.push(cubelet)
          }
        }
        break
      case 'U':
        axis = axisY.clone().negate()
        for (const cubelet of this.children) {
          if (cubelet.positionFilter(1, this.layer - order.height, this.layer)) {
            rotationGroup.push(cubelet)
          }
        }
        break
      case 'D':
        axis = axisY
        for (const cubelet of this.children) {
          if (cubelet.positionFilter(1, 0, order.height)) {
            rotationGroup.push(cubelet)
          }
        }
        break
      case 'F':
        axis = axisZ.clone().negate()
        for (const cubelet of this.children) {
          if (cubelet.positionFilter(2, this.layer - order.height, this.layer)) {
            rotationGroup.push(cubelet)
          }
        }
        break
      case 'B':
        axis = axisZ
        for (const cubelet of this.children) {
          if (cubelet.positionFilter(2, 0, order.height)) {
            rotationGroup.push(cubelet)
          }
        }
        break
      default:
        throw new Error('ERROR: unknown order.face')
    }
    this._progress = {
      order: order,
      axis: axis,
      remainAngle: order.angle,
      group: rotationGroup,
    }
    return this._progress
  }
}
