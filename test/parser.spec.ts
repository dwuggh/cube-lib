import 'ts-mocha'
import * as Mocha from 'mocha'
import { expect } from 'chai'

import { parser } from '../src/parser/parser'
import { moveBuilder } from '../src/utils'




Mocha.describe('simple cube parser',
               () => {
                 it('handle faces correctly', () => {
                   const input = "L U B d r x z"
                   const result = parser(input, 3)
                   const supposedResult = [
                     moveBuilder('L', 1, 1),
                     moveBuilder('U', 1, 1),
                     moveBuilder('B', 1, 1),
                     moveBuilder('D', 2, 1),
                     moveBuilder('R', 2, 1),
                     moveBuilder('R', 3, 1),
                     moveBuilder('F', 3, 1),
                   ]
                   expect(result).to.deep.equal(supposedResult)
                 })
                 it('throw an error when height is too large', () => {
                   expect(parser.bind(parser, 'L 123U', 6)).
                     to.throw(
                       'Height too large: 123 is larger than layer 6 at 123U'
                     )
                 })
                 it('can handle angle', () => {
                   const input = "L2 F B4 D14"
                   const result = parser(input, 3)
                   const supposedResult = [
                     moveBuilder('L', 1, 2),
                     moveBuilder('F', 1, 1),
                     moveBuilder('B', 1, 4),
                     moveBuilder('D', 1, 14)
                   ]
                   expect(result).to.deep.equal(supposedResult)
                 })
                 it('can handle primes', () => {
                   const input = "D2' 2B2' B'4 U"
                   const result = parser(input, 3)
                   const supposedResult = [
                     moveBuilder('D', 1, -2),
                     moveBuilder('B', 2, -2),
                     moveBuilder('B', 1, -4),
                     moveBuilder('U', 1, 1)
                   ]
                   expect(result).to.deep.equal(supposedResult)
                 })
                 it('parse correctly without space', () => {
                   const input = "D21'2B13'B'4U"
                   const result = parser(input, 3)
                   const supposedResult = [
                     moveBuilder('D', 1, -21),
                     moveBuilder('B', 2, -13),
                     moveBuilder('B', 1, -4),
                     moveBuilder('U', 1, 1)
                   ]
                   expect(result).to.deep.equal(supposedResult)
                 })
                 it('parse T perm correctly', () => {
                   const input = "RUR'U' R'FR2UR'U'RUR'F'"
                   const result = parser(input, 3)
                   const supposedResult = [
                     moveBuilder('R'),
                     moveBuilder('U'),
                     moveBuilder('R', 1, -1),
                     moveBuilder('U', 1, -1),
                     moveBuilder('R', 1, -1),
                     moveBuilder('F'),
                     moveBuilder('R', 1, 2),
                     moveBuilder('U'),
                     moveBuilder('R', 1, -1),
                     moveBuilder('U', 1, -1),
                     moveBuilder('R'),
                     moveBuilder('U'),
                     moveBuilder('R', 1, -1),
                     moveBuilder('F', 1, -1),
                   ]
                   expect(result).to.deep.equal(supposedResult)
                 })
                 it('parse G perm correctly', () => {
                   const input = "R2'u'RU'RUR'uR2fR'f'"
                   const result = parser(input, 3)
                   const supposedResult = [
                     moveBuilder('R', 1, -2),
                     moveBuilder('U', 2, -1),
                     moveBuilder('R'),
                     moveBuilder('U', 1, -1),
                     moveBuilder('R'),
                     moveBuilder('U'),
                     moveBuilder('R', 1, -1),
                     moveBuilder('U', 2),
                     moveBuilder('R', 1, 2),
                     moveBuilder('F', 2),
                     moveBuilder('R', 1, -1),
                     moveBuilder('F', 2, -1),
                   ]
                   expect(result).to.deep.equal(supposedResult)
                 })
               })
