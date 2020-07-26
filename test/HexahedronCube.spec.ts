import 'ts-mocha'
import * as Mocha from 'mocha'
import { expect } from 'chai'
import { HexahedronCube, Cubelet } from '../src/index'
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
