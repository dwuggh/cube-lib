import 'ts-mocha'
import * as Mocha from 'mocha'
import { expect } from 'chai'

import { parser } from '../src/parser/parser'
import { Order } from '../src/utils'



function orderBuilder(face: string, height = 1, angle = 1): Order {
  return {
    face: face,
    height: height,
    angle: angle * Math.PI / 2
  }
}
const R = orderBuilder('R')
const L = orderBuilder('L')
const U = orderBuilder('U')
const D = orderBuilder('D')
const F = orderBuilder('F')
const B = orderBuilder('B')

const r = orderBuilder('r', 2)

Mocha.describe('parser test',
               () => {
                 it('basic', () => {
                   const input = "L U B d r x z"
                   const result = parser(input, 3)
                   const supposedResult = [
                     orderBuilder('L', 1, 1),
                     orderBuilder('U', 1, 1),
                     orderBuilder('B', 1, 1),
                     orderBuilder('D', 2, 1),
                     orderBuilder('R', 2, 1),
                     orderBuilder('R', 3, 1),
                     orderBuilder('F', 3, 1),
                   ]
                   expect(result).to.deep.equal(supposedResult)
                 })
                 it('too large', () => {
                   expect(parser.bind(parser, 'L 123U', 6)).
                     to.throw(
                       'Height too large: 123 is larger than layer 6 at 123U'
                     )
                 })
                 it('with angle', () => {
                   const input = "L2 F B4 D14"
                   const result = parser(input, 3)
                   const supposedResult = [
                     orderBuilder('L', 1, 2),
                     orderBuilder('F', 1, 1),
                     orderBuilder('B', 1, 4),
                     orderBuilder('D', 1, 14)
                   ]
                   expect(result).to.deep.equal(supposedResult)
                 })
                 it('with prime', () => {
                   const input = "D2' 2B2' B'4 U"
                   const result = parser(input, 3)
                   const supposedResult = [
                     orderBuilder('D', 1, -2),
                     orderBuilder('B', 2, -2),
                     orderBuilder('B', 1, -4),
                     orderBuilder('U', 1, 1)
                   ]
                   expect(result).to.deep.equal(supposedResult)
                 })
                 it('with prime, no space', () => {
                   const input = "D21'2B13'B'4U"
                   const result = parser(input, 3)
                   const supposedResult = [
                     orderBuilder('D', 1, -21),
                     orderBuilder('B', 2, -13),
                     orderBuilder('B', 1, -4),
                     orderBuilder('U', 1, 1)
                   ]
                   expect(result).to.deep.equal(supposedResult)
                 })
                 it('real case: T perm', () => {
                   const input = "RUR'U' R'FR2UR'U'RUR'F'"
                   const result = parser(input, 3)
                   const supposedResult = [
                     orderBuilder('R'),
                     orderBuilder('U'),
                     orderBuilder('R', 1, -1),
                     orderBuilder('U', 1, -1),
                     orderBuilder('R', 1, -1),
                     orderBuilder('F'),
                     orderBuilder('R', 1, 2),
                     orderBuilder('U'),
                     orderBuilder('R', 1, -1),
                     orderBuilder('U', 1, -1),
                     orderBuilder('R'),
                     orderBuilder('U'),
                     orderBuilder('R', 1, -1),
                     orderBuilder('F', 1, -1),
                   ]
                   expect(result).to.deep.equal(supposedResult)
                 })
                 it('real case: G perm', () => {
                   const input = "R2'u'RU'RUR'uR2fR'f'"
                   const result = parser(input, 3)
                   const supposedResult = [
                     orderBuilder('R', 1, -2),
                     orderBuilder('U', 2, -1),
                     orderBuilder('R'),
                     orderBuilder('U', 1, -1),
                     orderBuilder('R'),
                     orderBuilder('U'),
                     orderBuilder('R', 1, -1),
                     orderBuilder('U', 2),
                     orderBuilder('R', 1, 2),
                     orderBuilder('F', 2),
                     orderBuilder('R', 1, -1),
                     orderBuilder('F', 2, -1),
                   ]
                   expect(result).to.deep.equal(supposedResult)
                 })
               })
