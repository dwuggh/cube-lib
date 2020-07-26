import * as THREE from 'three'
import { Move, RotationProgress } from '../utils'
import { BaseCubelet } from './Cubelets/BaseCubelet'

export abstract class BaseCube<T extends BaseCubelet> extends THREE.Group {

  // the moves queue waiting to be performed.
  // for some reason, Collections and rollup conflicts. Array would just do the job.
  // move: Collections.Queue<Move> = new Collections.Queue<Move>()
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
  public enqueue(move: Move): void {
    this.moves.push(move)
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
      if (this.moves.length == 0) {
        return
      }
      else {
        // dequeue an move and setup some basic info
        const move = this.moves.shift()
        this._setupRotationStatus(move)
      }
    }
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
  protected abstract _setupRotationStatus(move: Move): RotationProgress<T>


}
