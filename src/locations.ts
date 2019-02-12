import { isAbsolute, resolve } from 'path';
import { Config } from './interfaces';

import _parser = require('yargs-parser');
const parser = _parser as any;
type Argv = typeof process.argv;

export function findJestConfigPath(cwd: string, argv: Argv) {
  let configLocation = 'package.json';
  const args = parser(argv.slice(2));
  if (args && args.config) {
    configLocation = args.config;
  }
  if (!isAbsolute(configLocation)) {
    configLocation = resolve(cwd, configLocation);
  }

  return configLocation;
}

export function findCoveragePath(config: Config) {
  if (config.coverageDirectory) {
    return config.coverageDirectory;
  }
  if (config.rootDir) {
    return resolve(config.rootDir, 'coverage');
  }
  return resolve(process.cwd(), 'coverage');
}

export function findCoverageSummaryPath(coverageDirectory: string) {
  return resolve(coverageDirectory, 'coverage-summary.json');
}
