import sucrase from '@rollup/plugin-sucrase';

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
    sucrase({
      exclude: ['node_modules/**'],
      transforms: ['typescript']
    })
  ],
};
