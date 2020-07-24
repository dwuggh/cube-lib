// import typescript from '@rollup/plugin-typescript'
import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
// import resolve from 'rollup-plugin-node-resolve'
import image from '@rollup/plugin-image'

import pkg from './package.json'

export default {
  input: 'src/cubes/Hexahedron.ts',
  output: [
    {
      file: "puzzling.iife.js",
      format: 'iife',
      indent: '\t',
      name: 'test',
      // exports: 'named',
    },
    {
      file: pkg.main,
      format: 'umd',
      name: 'PUZZLING',
      indent: '\t',
      // exports: 'named',
      // sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      // sourcemap: true
    }
  ],
  plugins: [
    typescript({
      // rollupCommonJSResolveHack: true,
      exclude: '**/__tests__/**',
      // clean: true
      // include: ['src/**/*.ts']
    }),
    external(),
    resolve(),
    image(),
    commonjs({
      include: ['node_modules/**']
    })
  ]
}
