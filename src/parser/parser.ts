import { Move } from '../utils'

export { parser }

const reg = / *(\d*)(MR|ML|SF|SB|EU|ED|\w)(w?)('\d*|\d+'|\d*) */

function hexahedronParser(input: string, layer: number) {
  const regexResult = reg.exec(input)
  if (!regexResult) {
    throw new Error(`cannot match: ${input}`)
  }
  const _input = input.substr(regexResult[0].length)

  // Rw or R?
  let height = regexResult[3] == '' ? 1 : layer - 1
  height = regexResult[1] == '' ? height :
    parseInt(regexResult[1]) == 1 ? height : parseInt(regexResult[1])
  if (height > layer)
    throw new Error(`Height too large: ${height} is larger than layer ${layer} at ${input}`)

  /*
    how to parse height:
    1. if has a 'w' right after the face(e.g. Rw, Mw, rw, in the latter 2 case this step wouldn't matter),
       then set height = layer - 1
    2. if has number precedes the face, ignore 1 and set height to this number
    3. if the face is MES or mes, ignore all above and set height to layer - 2.
   */
  let face: string = regexResult[2]
  let start = 0
  if (face.length == 2) {
    switch (face) {
      case 'MR':
        face = 'R'
        break
      case 'ML':
        face = 'L'
        break
      case 'SF':
        face = 'F'
        break
      case 'SB':
        face = 'B'
        break
      case 'EU':
        face = 'U'
        break
      case 'ED':
        face = 'D'
        break
      default:
        throw new Error(`cannot match: ${input}`)
    }
    start = Math.floor((layer - 1) / 2)

  } else switch(face) {
    case 'R': case 'L': case 'U': case 'D': case 'F': case 'B':
      break
    case 'r': case 'l': case 'u': case 'd': case 'f': case 'b':
      face = face.toUpperCase()
      height = layer - 1
      break
    case 'x':
    case 'X':
      face = 'R'
      height = layer
      break
    case 'y':
    case 'Y':
      face = 'U'
      height = layer
      break
    case 'z':
    case 'Z':
      face = 'F'
      height = layer
      break
    case 'M':
    case 'm':
      face = 'R'
      start = 1
      height = layer - 2
      break
    case 'E':
    case 'e':
      face = 'U'
      start = 1
      height = layer - 2
      break
    case 'S':
    case 's':
      face = 'F'
      start = 1
      height = layer - 2
      break
    default:
      throw new Error(`Unknown face: ${face} at ${input}`)
  }

  // assertion
  if (height + start > layer)
    throw new Error(`Height too large: ${height + start} is larger than layer ${layer} at ${input}`)
  const angle = parseAngle(regexResult[4])
  return {
    input: _input,
    order: {
      face: face,
      height: height,
      start: start,
      angle: angle
    }
  }
}

function parser(input: string, layer: number, moves?: Array<Move>): Array<Move> {
  if (moves == undefined) moves = new Array<Move>()
  const result = hexahedronParser(input, layer)
  moves.push(result.order)
  if (result.input == '') return moves
  return parser(result.input, layer, moves)
}

function parseAngle(angle: string): number {
  if (angle.startsWith("'")) return - parseAngle(angle.substr(1))
  if (angle.endsWith("'")) return - parseAngle(angle.slice(0, -1))
  if (angle == '') return Math.PI / 2
  return parseInt(angle) * Math.PI / 2
}

