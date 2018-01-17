const typescript = require('rollup-plugin-typescript');

module.exports = {
  input: './src/index.ts',
  output: {
    file: 'index.js',
    format: 'cjs',
  },
  external: [
    'fs',
    'path',
    'json-in-place'
  ],
  plugins: [
    typescript({
      typescript: require('typescript')
    }),
  ]
};
