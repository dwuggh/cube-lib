import * as THREE from 'three'
import { Move } from '../utils'
import { BaseCubelet } from './Cubelets/BaseCubelet'

/*
  RotationProgress store informations of the cube for the performing order.
  Only used when performing an order.
*/
export interface RotationProgress<T extends BaseCubelet> {
  move: Move,
  // in most case, a rotation of a cube is focused on one axis.
  // This may change due to some weird cubes.
  axis: THREE.Vector3,
  // how much work left to do. This value may not be percise, could have errors of 1E-10 and above.
  remainAngle: number,
  // the roation group. normally, the roation is an operation of groups.
  // TODO Three.Group?
  group: Array<T>
}

export abstract class BaseCube<T extends BaseCubelet> extends THREE.Group {

  // the moves queue waiting to be performed.
  moves: Array<Move> = new Array<Move>()

  // store rotationProgress when rotating. Should be null otherwise.
  protected _rotationProgress: RotationProgress<T>

  //overwrite threejs's children to avoid type error
  children: Array<T>

  constructor() {
    super()
    this.children = new Array<T>()
  }

  /*
    Enqueue an move. The move may not be perform instantly.
    Should be used whenever the user wants to perform an move.
  */
  public enqueue(move: Move | Array<Move>): Array<Move> {
    if (move instanceof Array) {
      for (const m of move) {
        this.moves.push(m)
      }
    }
    else {
      this.moves.push(move)
    }
    return this.moves
  }

  public dequeue(): Move {
    if (this.moves.length == 0) return null
    else return this.moves.shift()
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
  public update(): RotationProgress<T> {
    if (this._rotationProgress) {
      return this._perform()
    } else {
      if (this.moves.length == 0) {
        return null
      }
      else {
        // dequeue an move and setup some basic info
        const move = this.moves.shift()
        this._setupRotationProgress(move)
        return this._perform()
      }
    }
  }

  // whether the cube is rotating, return this._rotationProgress if is rotating
  // possible value: undefined, null or RotationProgress
  public isDirty(): RotationProgress<T> {
    return this._rotationProgress
  }

  /*
    Perform an move by updating one frame.
    only used when this._status is not null.
  */
  protected abstract _perform(): RotationProgress<T>

  /*
    Mainly set up for rotation group.
    Use the cubelet's positionFilter function to do the job, since it would not affected by group scaling.
    Axes must be cloned, or the origin value may be changed.
    Still, I need to specify six faces and handle them respectively. This should be the only repeat job.
  */
  protected abstract _setupRotationProgress(move: Move): RotationProgress<T>


}
