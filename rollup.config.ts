import typescript from 'rollup-plugin-typescript';

export default {
  external: [
    'fs',
    'path',
    'json-in-place',
    'yargs-parser',
  ],
  input: 'src/index.ts',
  output: [{
    file: 'index.js',
    format: 'cjs',
  }],
  plugins: [
    typescript({
      typescript: require('typescript'),
    }),
  ],
};
