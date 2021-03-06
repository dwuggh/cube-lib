// import typescript from '@rollup/plugin-typescript'
import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
// import resolve from 'rollup-plugin-node-resolve'
import image from '@rollup/plugin-image'
// import url from '@rollup/plugin-url'
import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'Cubelib',
      indent: '\t',
      exports: 'named',
      sourcemap: true
    }
  ],
  plugins: [
    external(),
    resolve(),
    image(),
    // url(),
    typescript({
      // rollupCommonJSResolveHack: true,
      exclude: '**/__tests__/**',
      // clean: true
      include: ['src/**/*.ts',
               ]
    }),
    commonjs({
      include: ['node_modules/**']
    })
  ],
  // external: id => pkgdependencies.includes(id)
}
