import { readFileSync, watch } from 'fs';

import { getLastError } from './errors';
import {
  Config,
  IstanbulCoverage,
  RatchetOptions,
} from './interfaces';
import { updateFile } from './json';
import {
  findCoveragePath,
  findCoverageSummaryPath,
  findJestConfigPath,
} from './locations';
import { ratchetCoverage } from './ratchet';

export default class JestRatchet {
  public getLastError: () => void;
  public onRunComplete: () => void;

  constructor(
    globalConfig: Config,
    options: RatchetOptions = {},
  ) {
    this.onRunComplete = onRunComplete.bind(this, globalConfig, options);
    this.getLastError = getLastError.bind(this, globalConfig);
  }
}

function onRunComplete(globalConfig: Config, options: RatchetOptions) {
  options = options;
  try {
    const coverageDirectory = findCoveragePath(globalConfig);
    const coverageSummaryPath = findCoverageSummaryPath(coverageDirectory);
    const jestConfigPath = findJestConfigPath(process.cwd(), process.argv);

    const watcher = watch(coverageDirectory);
    watcher.once('change', () => {
      watcher.close();
      const coverageRaw = readFileSync(coverageSummaryPath, 'utf-8');
      const summary: IstanbulCoverage = JSON.parse(coverageRaw);
      const threshold = globalConfig.coverageThreshold!;
      const ratchetResult = ratchetCoverage(threshold, summary);

      updateFile(jestConfigPath, ratchetResult);
    });
  } catch (e) {
    // tslint:disable-next-line
    console.error(e);
  }
}
