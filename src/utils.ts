import { BaseCubelet } from "./cubes/Cubelets/BaseCubelet"

/*
  Order describes how a cube should rotate in the next few frames.
  The parser should parse the input streams into a Order stream.
 */
export interface Order {
  /*
    the rotation face.
    positive/negative or in angle?
    Example:
    in a 3x3x3 cube, axis can be 'R', 'L', 'U', 'D', 'F' and 'B'.
    in a megaminx, axis can be 'U', 'bR', 'bL'...
   */
  face: string
  /*
    the height defines how many layers will be rotate.
    Example:
    in a 3x3x cube, '2R' order has height 2, same as 'r'. height > 3 should not be allowed.
    in a megaminx, height still can be 1, 2 or 3, by following conventions.
  */
  height: number
  // the rotation angle due to the face. can be any real number.
  angle: number
}

/*
  RotationProgress store informations of the cube for the performing order.
  Only used when performing an order.
 */
export interface RotationProgress<T extends BaseCubelet> {
  order: Order,
  // in most case, a rotation of a cube is focused on one axis.
  // This may change due to some weird cubes.
  axis: THREE.Vector3,
  // how much work left to do. This value may not be percise, could have errors of 1E-10 and above.
  remainAngle: number,
  // the roation group. normally, the roation is an operation of groups.
  // TODO Three.Group?
  group: Array<T>
}
