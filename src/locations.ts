import { isAbsolute, resolve } from 'path';
import * as _parser from 'yargs-parser';

import { Config } from './interfaces';

type Argv = typeof process.argv;
const parser = _parser as typeof _parser.default;

export const findJestConfigPath = (cwd: string, argv: Argv) => {
  let configLocation = 'package.json';
  const args = parser(argv.slice(2));
  if (args && args.config) {
    configLocation = args.config;
  }
  if (!isAbsolute(configLocation)) {
    configLocation = resolve(cwd, configLocation);
  }

  return configLocation;
};

export const findCoveragePath = (config: Config) => {
  if (config.coverageDirectory) {
    return config.coverageDirectory;
  }
  if (config.rootDir) {
    return resolve(config.rootDir, 'coverage');
  }
  return resolve(process.cwd(), 'coverage');
};

export const findCoverageSummaryPath = (coverageDirectory: string) => {
  return resolve(coverageDirectory, 'coverage-summary.json');
};
