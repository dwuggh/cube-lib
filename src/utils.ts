/*
  Move describes how a cube should rotate in the next few frames.
  The parser should parse the input streams into a Move stream.
 */
export interface Move {
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
    start is used when only middle layers are rotated
    Example:
    in a 3x3x3 cube, '2R' order has height 2, same as 'r'. height > 3 should not be allowed.
    'M' has start = 1, height = 1
    in a megaminx, height still can be 1, 2 or 3, by following conventions.
  */
  start?: number
  height: number
  // the rotation angle due to the face. can be any real number.
  angle: number
}

// a simple wrapper for moves to construct 1-step move
export function moveBuilder(face: string, height = 1, angle = 1, start?: number): Move {
  const move: Move = {
    face: face,
    height: height,
    angle: angle * Math.PI / 2,
  }
  if (start != undefined) move.start = start
  return move
}
