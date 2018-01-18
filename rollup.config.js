import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: [{
    file: 'index.js',
    format: 'cjs'
  }],
  external: [
    'fs',
    'path',
    'json-in-place'
  ],
  plugins: [
    typescript({
      typescript: require('typescript')
    })
  ]
}
