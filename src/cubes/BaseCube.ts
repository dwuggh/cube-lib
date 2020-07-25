import * as THREE from 'three'
import { Order, RotationProgress } from '../utils'
import { BaseCubelet } from './Cubelets/BaseCubelet'

export abstract class BaseCube<T extends BaseCubelet> extends THREE.Group {

  // the order queue waiting to be performed.
  // for some reason, Collections and rollup conflicts. Array would just do the job.
  // orders: Collections.Queue<Order> = new Collections.Queue<Order>()
  orders: Array<Order> = new Array<Order>()

  // store rotationProgress when rotating. Should be null otherwise.
  protected _rotationProgress: RotationProgress<T>

  //overwrite threejs's children to avoid type error
  children: Array<T>

  constructor() {
    super()
    this.children = new Array<T>()
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
    this.children.forEach((cubelet) => {
      cubelet.setInitialPosition()
    })
  }

  /*
    Update the cube for one frame.
    This method should be called inside animation loop.
  */
  public update(): void {
    if (this._rotationProgress) {
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
  protected abstract _perform(): RotationProgress<T>
  /*
    Mainly set up for rotation group.
    Use the cubelet's positionFilter function to do the job, since it would not affected by group scaling.
    Axes must be cloned, or the origin value may be changed.
    Still, I need to specify six faces and handle them respectively. This should be the only repeat job.
  */
  protected abstract _setupRotationStatus(order: Order): RotationProgress<T>


}
