import typescript from 'rollup-plugin-typescript2'

import pkg from './package.json'

export default {
  input: ['server/index.ts'],
  output: [
    {
      file: './server-dist/index.js',
      format: 'cjs',
    },
    {
      file: './server-dist/index.es.js',
      format: 'es',
    },
  ],
  external: [...Object.keys(pkg.dependencies || {})],
  plugins: [typescript()],
}
