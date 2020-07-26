import 'ts-mocha'
import * as Mocha from 'mocha'
import { expect } from 'chai'
import { HexahedronCube, Cubelet, parser } from '../src/index'
import {Move, moveBuilder} from '../src/utils'
// import * as THREE from 'three'
import { HexahedronSVGCubelet } from '../src/cubes/Cubelets/Cubelet'

function getName(obj: THREE.Object3D): string {
  return obj.name
}

Mocha.describe('basic cube methods',
               () => {
                 const cube = new HexahedronCube(Cubelet.HexahedronSVGCubelet, 3)
                 it('can enqueue one move', () => {
                   const move: Move = moveBuilder('L')
                   cube.enqueue(move)
                   expect(cube.moves).to.deep.equal([move, ])
                 })
                 it('can enqueue multiple moves', () => {
                   const moves = [
                     moveBuilder('L'),
                     moveBuilder('B'),
                     moveBuilder('F'),
                   ]
                   cube.enqueue(moves)
                   moves.unshift(moveBuilder('L'))
                   expect(cube.moves).to.deep.equal(moves)
                 })
                 it('is not dirty before update', () => {
                   console.log(cube.isDirty())
                   expect(!!cube.isDirty()).to.equal(false)
                 })
                 it('is dirty after update', () => {
                   cube.update()
                   expect(!cube.isDirty()).to.equal(false)
                 })
               }
              )

Mocha.describe('hexahedron cube: setting up rotation',
               () => {
                 it('create right group of L', () => {
                   const cube = new HexahedronCube(Cubelet.HexahedronSVGCubelet, 3)
                   const move: Move = moveBuilder('L', 1, 1)
                   cube.enqueue(move)
                   const result = cube.update().group.map(getName)
                   const expected = cube.children.slice(0, 9).map(getName)
                   expect(result).to.deep.equal(expected)
                 })
                 it('create right group of R', () => {
                   const cube = new HexahedronCube(Cubelet.HexahedronSVGCubelet, 3)
                   const move: Move = moveBuilder('R', 1, 1)
                   cube.enqueue(move)
                   const result = cube.update().group.map(getName)
                   const expected = cube.children.slice(18, 27).map(getName)
                   expect(result).to.deep.equal(expected)
                 })
                 it('create right group of M', () => {
                   const cube = new HexahedronCube(Cubelet.HexahedronSVGCubelet, 3)
                   const move: Move = moveBuilder('R', 1, 1, 1)
                   cube.enqueue(move)
                   const result = cube.update().group.map(getName)
                   const expected = cube.children.slice(9, 18).map(getName)
                   expect(result).to.deep.equal(expected)
                 })
               })

Mocha.describe('hexahedron cube: scrambles',
               () => {
                 it('have correct state after scramble', () => {
                   const cube = new HexahedronCube(Cubelet.HexahedronSVGCubelet, 3)
                   const scramble = "F2 D' U R' F' U2 B2 F' U2 R2 D U L2 R2 B2 F2 L R2 U' F L2 B' F2 D' R'"
                   cube.enqueue(parser(scramble, 3))
                   cube.update()
                   while (cube.isDirty() || cube.moves.length != 0) {
                     cube.update()
                   }
                   const finalState = []
                   for (const cubelet of cube.getPosPerm()) {
                     finalState.push(cubelet.name)
                   }
                   const expected = [
                     "0+0+0",
                     "1+2+0",
                     "2+0+2",
                     "1+0+2",
                     "0+1+1",
                     "0+1+0",
                     "0+2+2",
                     "2+1+2",
                     "0+0+2",
                     "2+1+0",
                     "1+0+1",
                     "2+2+1",
                     "1+1+0",
                     "1+1+1",
                     "1+1+2",
                     "0+1+2",
                     "1+2+1",
                     "0+2+1",
                     "0+2+0",
                     "0+0+1",
                     "2+0+0",
                     "1+0+0",
                     "2+1+1",
                     "1+2+2",
                     "2+2+2",
                     "2+0+1",
                     "2+2+0",
                   ]
                   expect(finalState).to.deep.equal(expected)
                 })
                 it('have correct state after scramble if is a 6x6x6 cube', () => {
                   const cube = new HexahedronCube(Cubelet.HexahedronSVGCubelet, 6)
                   const scramble = "3Fw L 3Fw L' Uw F' Lw Fw L2 R B' 3Fw' 3Rw2 3Fw Dw2 Rw' R' B L2 D2 3Fw' R F' Rw2 F D L' F Uw2 Lw' B U2 Dw2 3Rw D2 3Rw2 Rw Lw' F' 3Fw2 3Uw Rw2 R' U F 3Uw' Rw U' Lw2 D2 Bw2 Lw' Bw2 R' U Lw' 3Rw' F2 Rw Bw' L Bw2 L Fw2 F R2 B2 D2 Lw' Fw 3Fw' D Lw' 3Uw Fw' 3Fw' F' U2 3Uw Dw"
                   cube.enqueue(parser(scramble, 6))
                   cube.update()
                   while (cube.isDirty() || cube.moves.length != 0) {
                     cube.update()
                   }
                   const finalState = []
                   for (const cubelet of cube.getPosPerm()) {
                     finalState.push(cubelet.name)
                   }
                   const expected = [
                     "0+0+5",
                     "0+0+4",
                     "0+0+3",
                     "5+3+5",
                     "5+0+1",
                     "0+0+0",
                     "0+1+0",
                     "1+4+5",
                     "5+3+4",
                     "0+4+2",
                     "1+0+4",
                     "5+5+1",
                     "5+2+5",
                     "1+5+3",
                     "0+3+2",
                     "3+5+2",
                     "2+5+4",
                     "5+0+2",
                     "0+2+0",
                     "2+1+5",
                     "5+2+3",
                     "2+5+3",
                     "0+2+1",
                     "3+5+0",
                     "5+1+5",
                     "4+5+4",
                     "3+4+0",
                     "5+1+3",
                     "1+1+0",
                     "4+0+0",
                     "5+5+0",
                     "5+0+4",
                     "5+5+3",
                     "0+0+2",
                     "5+1+0",
                     "0+5+0",
                     "4+0+5",
                     "5+4+4",
                     "0+3+4",
                     "5+2+1",
                     "0+1+1",
                     "0+4+0",
                     "4+0+4",
                     "1+1+1",
                     "3+1+4",
                     "1+1+3",
                     "1+4+4",
                     "4+4+0",
                     "3+0+4",
                     "3+4+4",
                     "2+4+3",
                     "1+3+2",
                     "2+4+4",
                     "0+1+3",
                     "5+3+1",
                     "3+1+1",
                     "3+1+3",
                     "2+2+4",
                     "4+2+1",
                     "2+4+0",
                     "5+4+1",
                     "1+4+1",
                     "4+1+3",
                     "4+4+3",
                     "4+1+1",
                     "4+1+0",
                     "0+0+1",
                     "4+4+5",
                     "2+0+1",
                     "4+3+5",
                     "4+0+1",
                     "1+5+5",
                     "0+2+5",
                     "0+1+2",
                     "5+3+2",
                     "3+3+0",
                     "4+5+2",
                     "5+2+0",
                     "3+1+5",
                     "2+1+1",
                     "3+2+4",
                     "2+4+2",
                     "1+1+2",
                     "5+4+2",
                     "2+2+0",
                     "4+3+3",
                     "2+2+2",
                     "3+2+3",
                     "1+2+2",
                     "2+0+3",
                     "5+2+2",
                     "4+2+2",
                     "3+3+2",
                     "3+3+3",
                     "3+4+2",
                     "3+0+3",
                     "4+2+5",
                     "1+4+3",
                     "4+2+3",
                     "2+3+4",
                     "4+1+2",
                     "1+3+0",
                     "3+0+0",
                     "3+0+1",
                     "2+2+5",
                     "2+3+5",
                     "3+1+0",
                     "5+3+0",
                     "0+3+5",
                     "1+2+5",
                     "3+0+2",
                     "2+3+0",
                     "4+0+2",
                     "2+5+0",
                     "1+5+2",
                     "1+3+1",
                     "2+1+3",
                     "3+4+3",
                     "4+2+4",
                     "5+4+3",
                     "5+3+3",
                     "2+2+1",
                     "2+2+3",
                     "3+2+2",
                     "3+3+4",
                     "0+2+3",
                     "0+2+2",
                     "4+3+2",
                     "2+3+3",
                     "2+3+2",
                     "3+3+1",
                     "3+3+5",
                     "2+0+4",
                     "4+3+1",
                     "2+3+1",
                     "1+2+3",
                     "1+2+1",
                     "0+3+1",
                     "5+0+3",
                     "1+3+5",
                     "0+3+3",
                     "2+0+2",
                     "1+0+2",
                     "2+0+0",
                     "4+5+5",
                     "0+4+4",
                     "0+4+3",
                     "5+1+2",
                     "1+5+1",
                     "0+1+5",
                     "5+1+4",
                     "4+4+4",
                     "4+4+2",
                     "1+2+4",
                     "4+4+1",
                     "4+1+5",
                     "2+4+5",
                     "1+4+2",
                     "1+3+3",
                     "3+1+2",
                     "1+3+4",
                     "4+3+0",
                     "1+0+3",
                     "3+4+1",
                     "3+2+1",
                     "2+1+2",
                     "2+1+4",
                     "2+5+1",
                     "1+0+1",
                     "4+1+4",
                     "4+3+4",
                     "2+4+1",
                     "1+1+4",
                     "5+1+1",
                     "0+4+5",
                     "4+5+1",
                     "4+2+0",
                     "3+5+1",
                     "0+1+4",
                     "1+5+0",
                     "5+0+5",
                     "0+5+1",
                     "2+0+5",
                     "0+5+3",
                     "5+5+4",
                     "5+5+5",
                     "1+0+5",
                     "1+1+5",
                     "3+5+4",
                     "1+2+0",
                     "0+4+1",
                     "5+4+0",
                     "3+5+5",
                     "0+2+4",
                     "3+5+3",
                     "3+2+5",
                     "2+1+0",
                     "0+3+0",
                     "3+0+5",
                     "5+2+4",
                     "3+2+0",
                     "2+5+2",
                     "4+5+3",
                     "0+5+2",
                     "5+4+5",
                     "1+5+4",
                     "3+4+5",
                     "4+0+3",
                     "1+4+0",
                     "0+5+4",
                     "5+0+0",
                     "4+5+0",
                     "2+5+5",
                     "5+5+2",
                     "1+0+0",
                     "0+5+5"
                   ]
                   expect(finalState).to.deep.equal(expected)
                 })
               })
