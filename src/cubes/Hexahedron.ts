import * as THREE from 'three'
import { Order } from '../utils'
import * as Collections from 'typescript-collections'
import { Cubelet } from './meshs/Cubelet'


const axisX = new THREE.Vector3(1, 0, 0)
const axisY = new THREE.Vector3(0, 1, 0)
const axisZ = new THREE.Vector3(0, 0, 1)

type status = {
  order: Order,
  axis: THREE.Vector3,
  remainAngle: number,
  group: Array<Cubelet>
}

export class Hexahedron {
  // the layer of this hexahedron cube. Could be any positive integer.
  layer: number
  // the cube meshs.
  groupT: THREE.Group = new THREE.Group()
  group: Array<Cubelet>

  // the order queue waiting to be performed.
  orders: Collections.Queue<Order> = new Collections.Queue<Order>()
  state: number[]
  dirty = false

  private _status: status

  constructor(layer: number) {
    this.layer = layer
    this.state = new Array(layer ** 3)
    this.group = new Array<Cubelet>()
    this.restore()

    // setting meshs
    for (let i = 0; i < layer; i++) {
      for (let j = 0; j < layer; j++) {
        for (let k = 0; k < layer; k++) {
          const mesh = new Cubelet(i, j, k, layer)
          this.groupT.add(mesh)
          this.group.push(mesh)
        }
      }
    }
  }

  // append an order in the queue
  public append(order: Order) {
    this.orders.enqueue(order)
  }

  /*
    perform an arbitary order.
    if the order is illegal, an error should be raised. However, this process should've been done by the parser
    As a result, only raise implicit error is enough.
   */
  // public perform(order: Order): void {

  //   const anglePerFrame = this.orders.size() > 1 ? 1.0 : 0.38

  //   // assert height
  //   if (order.height > this.layer || order.height < 0)
  //     throw new Error('ERROR: uncorrect order.height')

  // }

  // restore the cube to initial state immadiately.
  public restore(): void {
    for (let i = 0; i < this.state.length; i++) {
      this.state[i] = i
    }
    this.groupT.children.forEach((cubelet) => {
      (cubelet as Cubelet).setInitialPosition()
    })
  }

  // update the cube for one frame.
  public update(): void {
    // retrieve current order
    if (this._status == undefined) {
      if (this.orders.isEmpty()) {
        return
      }
      else {
        // dequeue an order and setup some basic info
        const order = this.orders.dequeue()
        this._setupRotationStatus(order)
      }
    }

    this._perform()

  }

  // only used when this._status is not null
  private _perform(): void {
    const anglePerFrame = this.orders.size() > 1 ? 1.0 : 0.38
    if (Math.abs(this._status.remainAngle) < anglePerFrame) {
      this._rotate(this._status.group, this._status.axis, this._status.remainAngle)
      this._status = undefined
    } else {
      this._rotate(this._status.group, this._status.axis, anglePerFrame)
      this._status.remainAngle -= anglePerFrame
    }
  }

  // rotate elements in array
  private _rotate(group: Array<Cubelet>, axis: THREE.Vector3, angle: number) {
    for (const cubelet of group) {
      cubelet.rotateOnCubeAxis(axis, angle)
    }
  }

  private _setupRotationStatus(order: Order): void {
    
    const rotationGroup = new Array<Cubelet>()
    let axis: THREE.Vector3
    switch (order.face) {
      case 'R':
        axis = axisX.clone().negate()
        for (const cubelet of this.group) {
          if (this.layer - order.height < cubelet.i && cubelet.i < this.layer) {
            rotationGroup.push(cubelet)
          }
        }
        break
      case 'L':
        axis = axisX
        for (const cubelet of this.group) {
          if (this.layer - order.height < cubelet.i && cubelet.i < this.layer) {
            rotationGroup.push(cubelet)
          }
        }
        break
      case 'U':
        axis = axisY.clone().negate()
        for (const cubelet of this.group) {
          if (this.layer - order.height < cubelet.j && cubelet.j < this.layer) {
            rotationGroup.push(cubelet)
          }
        }
        break
      case 'D':
        axis = axisY
        for (const cubelet of this.group) {
          if (this.layer - order.height < cubelet.j && cubelet.j < this.layer) {
            rotationGroup.push(cubelet)
          }
        }
        break
      case 'F':
        axis = axisZ.clone().negate()
        for (const cubelet of this.group) {
          if (this.layer - order.height < cubelet.k && cubelet.k < this.layer) {
            rotationGroup.push(cubelet)
          }
        }
        break
      case 'B':
        axis = axisZ
        for (const cubelet of this.group) {
          if (this.layer - order.height < cubelet.k && cubelet.k < this.layer) {
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
  }
}
