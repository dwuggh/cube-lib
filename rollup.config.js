// import typescript from '@rollup/plugin-typescript'
import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
// import resolve from 'rollup-plugin-node-resolve'
import image from '@rollup/plugin-image'
import url from '@rollup/plugin-url'
// import pkg from './package.json'
// import alias from '@rollup/plugin-alias'
// import json from "@rollup/plugin-json";

// const pkg = process.env.LERNA_PACKAGE_NAME &&
//       require(`${process.env.LERNA_PACKAGE_NAME}/package.json`);

// const dependencies = ({ dependencies }) => Object.keys(dependencies || {});

// const pkgdependencies = dependencies(pkg);
// function glsl() {
// 	return {
// 		transform( code, id ) {
// 			if ( /\.glsl.js$/.test( id ) === false ) return;
// 			code = code.replace( /\/\* glsl \*\/`((.|\n)*)`/, function ( match, p1 ) {
// 				return JSON.stringify(
// 					p1
// 						.trim()
// 						.replace( /\r/g, '' )
// 						.replace( /[ \t]*\/\/.*\n/g, '' ) // remove //
// 						.replace( /[ \t]*\/\*[\s\S]*?\*\//g, '' ) // remove /* */
// 						.replace( /\n{2,}/g, '\n' ) // # \n+ to \n
// 				);
// 			} );
// 			return {
// 				code: code,
// 				map: { mappings: '' }
// 			};
// 		}
// 	};
// }
export default {
  input: 'src/index.ts',
  output: [
    {
      file: "build/puzzling-lib.iife.js",
      format: 'iife',
      indent: '\t',
      name: 'test',
      // exports: 'named',
    },
    {
      file: "build/puzzling-lib.js",
      format: 'umd',
      name: 'PUZZLING',
      indent: '\t',
      exports: 'named',
      sourcemap: true
    },
    {
      file: "build/puzzling-lib.module.js",
      format: 'es',
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
               'src/**/*.png']
    }),
    commonjs({
      include: ['node_modules/**']
    })
  ],
  // external: id => pkgdependencies.includes(id)
}
