
/*
  Order describes how a cube should rotate.
  Every cube instance has a method called 'perform'.
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
    in a megaminx, height still can be 1, 2 or 3. It follows conventions, strict physics
    wouldn't be necessary.
  */
  height: number
  // the rotation angle due to the face. can be any real number.
  angle: number
}
