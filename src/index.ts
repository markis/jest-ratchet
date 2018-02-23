import { closeSync, existsSync, mkdirSync, openSync, readFileSync, watch } from 'fs';

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
import { noop } from './noop';
import { ratchetCoverage } from './ratchet';

export default class JestRatchet {
  public getLastError: () => void = noop;
  public onRunComplete: () => void = noop;

  constructor(
    globalConfig: Config,
    options: RatchetOptions = {},
  ) {
    if (!process.env.DISABLE_JEST_RATCHET) {
      this.onRunComplete = onRunComplete.bind(this, globalConfig, options);
      this.getLastError = getLastError.bind(this, globalConfig);
    }
  }
}

function onRunComplete(globalConfig: Config, options: RatchetOptions) {
  options = options;
  try {
    const coverageDirectory = findCoveragePath(globalConfig);
    const coverageSummaryPath = findCoverageSummaryPath(coverageDirectory);
    const jestConfigPath = findJestConfigPath(process.cwd(), process.argv);

    if (!existsSync(coverageDirectory)) {
      mkdirSync(coverageDirectory);
    }
    if (!existsSync(coverageSummaryPath)) {
      closeSync(openSync(coverageSummaryPath, 'w'));
    }

    const watcher = watch(coverageDirectory);
    watcher.once('change', () => {
      watcher.close();
      const coverageRaw = readFileSync(coverageSummaryPath, 'utf-8');
      const summary: IstanbulCoverage = JSON.parse(coverageRaw);
      const threshold = globalConfig.coverageThreshold!;
      const ratchetResult = ratchetCoverage(threshold, summary, options);

      updateFile(jestConfigPath, ratchetResult);
    });
  } catch (e) {
    // tslint:disable-next-line
    console.error(e);
  }
}
