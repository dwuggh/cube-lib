import 'ts-mocha'
import * as Mocha from 'mocha'
import { expect } from 'chai'

import { parser } from '../src/parser/parser'
import { moveBuilder } from '../src/utils'




Mocha.describe('simple cube parser',
               () => {
                 it('handle faces correctly', () => {
                   const input = "L U B d r x z M S"
                   const result = parser(input, 3)
                   const supposedResult = [
                     moveBuilder('L', 1, 1),
                     moveBuilder('U', 1, 1),
                     moveBuilder('B', 1, 1),
                     moveBuilder('D', 2, 1),
                     moveBuilder('R', 2, 1),
                     moveBuilder('R', 3, 1),
                     moveBuilder('F', 3, 1),
                     moveBuilder('R', 1, 1, 1),
                     moveBuilder('F', 1, 1, 1),
                   ]
                   expect(result).to.deep.equal(supposedResult)
                 })
                 it("handle 'w' and heights correctly", () => {
                   const input = "L' Dw2 Lw 3Fw2 D 3Rw2"
                   const result = parser(input, 6)
                   const supposedResult = [
                     moveBuilder('L', 1, -1),
                     moveBuilder('D', 2, 2),
                     moveBuilder('L', 2, 1),
                     moveBuilder('F', 3, 2),
                     moveBuilder('D', 1, 1),
                     moveBuilder('R', 3, 2),
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
                   const input = "RUR'U' R'FR2U'R'U'RUR'F'"
                   const result = parser(input, 3)
                   const supposedResult = [
                     moveBuilder('R'),
                     moveBuilder('U'),
                     moveBuilder('R', 1, -1),
                     moveBuilder('U', 1, -1),
                     moveBuilder('R', 1, -1),
                     moveBuilder('F'),
                     moveBuilder('R', 1, 2),
                     moveBuilder('U', 1, -1),
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
                 it('parse Ub perm(with S) correctly', () => {
                   const input = "R2 UR2'SR2S'UR2'"
                   const result = parser(input, 3)
                   const supposedResult = [
                     moveBuilder('R', 1, 2),
                     moveBuilder('U'),
                     moveBuilder('R', 1, -2),
                     moveBuilder('F', 1, 1, 1),
                     moveBuilder('R', 1, 2),
                     moveBuilder('F', 1, -1, 1),
                     moveBuilder('U'),
                     moveBuilder('R', 1, -2)
                   ]
                   expect(result).to.deep.equal(supposedResult)
                 })
                 it('handle MR, SF... correctly', () => {
                   const input = "MR 4SF'ED2"
                   const result = parser(input, 6)
                   const supposedResult = [
                     moveBuilder('R', 1, 1, 2),
                     moveBuilder('F', 4, -1, 2),
                     moveBuilder('D', 1, 2, 2),
                   ]
                   expect(result).to.deep.equal(supposedResult)
                 })
                 it('throw error of MR, SF... when height too large', () => {
                   expect(parser.bind(parser, "MR 6SF'ED2", 6)).to.throw(
                     "Height too large: 8 is larger than layer 6 at 6SF'ED2"
                   )
                 })
               })
