const typescript = require('rollup-plugin-typescript');

module.exports = {
  input: './src/index.ts',
  output: {
    file: 'index.js',
    format: 'cjs',
  },
  context: 'this',
  external: [
    'chai',
    'child_process',
    'fb-watchman',
    'fs',
    'inversify',
    'path',
    'sinon',
    'reflect-metadata',
    'ts-helpers',
    'tslib'
  ],
  plugins: [
    typescript({
      typescript: require('typescript')
    }),
  ]
};
