import { isAbsolute, resolve } from 'path';

type Argv = typeof process.argv;

export function findJestConfigPath(cwd: string, argv: Argv) {
  let configLocation = 'package.json';
  const idxConfig = argv && argv.indexOf('--config');
  if (idxConfig > -1) {
    configLocation = argv[idxConfig + 1];
  }
  if (!isAbsolute(configLocation)) {
    configLocation = resolve(cwd, configLocation);
  }

  return configLocation;
}

export function findCoverageSummaryPath(coverageDirectory: string) {
  return resolve(coverageDirectory, 'coverage-summary.json');
}
