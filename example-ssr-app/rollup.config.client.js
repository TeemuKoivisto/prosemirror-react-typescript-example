import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import injectProcessEnv from 'rollup-plugin-inject-process-env'
import nodePolyfills from 'rollup-plugin-node-polyfills'

export default {
  input: ['client/index.tsx'],
  preserveEntrySignatures: false,
  output: [
    {
      file: './client-dist/bundle.js',
      format: 'iife',
      inlineDynamicImports: true,
      sourcemap: true,
    },
  ],
  plugins: [
    json(),
    typescript(),
    postcss(),
    commonjs(),
    injectProcessEnv({ 
      NODE_ENV: 'production',
    }),
    nodePolyfills(),
    nodeResolve({
      browser: true
    }),
  ],
}
