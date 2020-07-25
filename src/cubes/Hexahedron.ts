import * as THREE from 'three'
import { Order, Status } from '../utils'
// import * as Collections from 'typescript-collections'
// import { Cubelet } from './Cubelets/Cubelet'
// import Cubelets from './Cubelets/Cubelets'
import { HexahedronBaseCubelet } from './Cubelets/HexahedronBaseCubelet'



const axisX = new THREE.Vector3(1, 0, 0)
const axisY = new THREE.Vector3(0, 1, 0)
const axisZ = new THREE.Vector3(0, 0, 1)

// type status<T extends HexahedronBaseCubelet> = {
//   order: Order,
//   axis: THREE.Vector3,
//   remainAngle: number,
//   group: Array<T>
// }

/*
  Hexahedron cubes. From 2x2x2 to NxNxN cubes.
  A cube can perform an or a sequence of order, and render it on the canvas using webGL.
  Scrambling and solving should handled by other program, as well parsing the order.
  The only algorithm-related method is the restore() method.
 */
export class Hexahedron<T extends HexahedronBaseCubelet> {
  // the layer of this hexahedron cube. Could be any positive integer.
  layer: number
  // the THREE.Group. Used to render on the scene, could be helpful when having multiple cubes.
  groupT: THREE.Group = new THREE.Group()
  // the array of cubelets. easier to manipulate.
  group: Array<T>

  // the order queue waiting to be performed.
  // for some reason, Collections and rollup conflicts. Array would just do the job.
  // orders: Collections.Queue<Order> = new Collections.Queue<Order>()
  orders: Array<Order> = new Array<Order>()

  // store status when rotating. Should be undefined otherwise.
  private _status: Status<T>

  constructor(layer: number, private _cubeletType: new (coordinate: number[]) => T) {
    this.layer = layer
    this.group = new Array<T>()
    this.restore()

    // set up cubelets
    for (let i = 0; i < layer; i++) {
      for (let j = 0; j < layer; j++) {
        for (let k = 0; k < layer; k++) {
          const cubelet = new this._cubeletType([i, j, k, layer])
          this.groupT.add(cubelet)
          this.group.push(cubelet)
        }
      }
    }
  }

  /*
    Enqueue an order. The order may not be perform instantly.
    Should be used whenever the user wants to perform an order.
   */
  public enqueue(order: Order): void {
    this.orders.push(order)
  }


  // restore the cube to initial state immadiately.
  public restore(): void {
    this.group.forEach((cubelet) => {
      cubelet.setInitialPosition()
    })
  }

  /*
    Update the cube for one frame.
    This method should be called inside animation loop.
   */
  public update(): void {
    if (this._status) {
      this._perform()
    } else {
      if (this.orders.length == 0) {
        return
      }
      else {
        // dequeue an order and setup some basic info
        const order = this.orders.shift()
        this._setupRotationStatus(order)
      }
    }
  }

  /*
    Perform an order by updating one frame.
    only used when this._status is not null.
   */
  private _perform(): Status<T> {
    // control rotation speed, faster when there are too many orders
    const anglePerFrame = this.orders.length >= 1 ? 1.0 : 0.38
    if (Math.abs(this._status.remainAngle) < anglePerFrame) {
      // in case the remaining angle is too small
      this._rotate(this._status.group, this._status.axis, this._status.remainAngle)
      // when finished, set current status to undefined (or null, whatever)
      this._status = undefined
    } else {
      this._rotate(this._status.group, this._status.axis, anglePerFrame)
      this._status.remainAngle -= anglePerFrame
    }
    return this._status
  }

  // rotate elements in array
  private _rotate(group: Array<T>, axis: THREE.Vector3, angle: number): void {
    for (const cubelet of group) {
      cubelet.rotateOnCubeAxis(axis, angle)
    }
  }

  /*
    Mainly set up for rotation group.
    Use the cubelet's positionFilter function to do the job, since it would not affected by group scaling.
    Axes must be cloned, or the origin value may be changed.
    Still, I need to specify six faces and handle them respectively. This should be the only repeat job.
   */
  private _setupRotationStatus(order: Order): Status<T> {

    const rotationGroup = new Array<T>()
    let axis: THREE.Vector3
    switch (order.face) {
      case 'R':
        axis = axisX.clone().negate()
        for (const cubelet of this.group) {
          if (cubelet.positionFilter(0, this.layer - order.height, this.layer)) {
            rotationGroup.push(cubelet)
          }
        }
        break
      case 'L':
        axis = axisX
        for (const cubelet of this.group) {
          if (cubelet.positionFilter(0, 0, order.height)) {
            rotationGroup.push(cubelet)
          }
        }
        break
      case 'U':
        axis = axisY.clone().negate()
        for (const cubelet of this.group) {
          if (cubelet.positionFilter(1, this.layer - order.height, this.layer)) {
            rotationGroup.push(cubelet)
          }
        }
        break
      case 'D':
        axis = axisY
        for (const cubelet of this.group) {
          if (cubelet.positionFilter(1, 0, order.height)) {
            rotationGroup.push(cubelet)
          }
        }
        break
      case 'F':
        axis = axisZ.clone().negate()
        for (const cubelet of this.group) {
          if (cubelet.positionFilter(2, this.layer - order.height, this.layer)) {
            rotationGroup.push(cubelet)
          }
        }
        break
      case 'B':
        axis = axisZ
        for (const cubelet of this.group) {
          if (cubelet.positionFilter(2, 0, order.height)) {
            rotationGroup.push(cubelet)
          }
        }
        break
      default:
        throw new Error('ERROR: unknown order.face')
    }
    this._status = {
      order: order,
      axis: axis,
      remainAngle: order.angle,
      group: rotationGroup,
    }
    return this._status
  }
}
