import { readFileSync, watch } from 'fs';

import { getLastError } from './errors';
import { Config, IstanbulCoverage, JestCoverage } from './interfaces';
import { updateFile } from './json';
import {
  findCoveragePath,
  findCoverageSummaryPath,
  findJestConfigPath,
} from './locations';
import { ratchetCoverage } from './ratchet';

export default class JestRatchet {
  constructor(
    private globalConfig: Config,
    // private ratchetOptions: RatchetOptions = {},
  ) {
    this.onRunComplete = this.onRunComplete.bind(this);
    this.getLastError = this.getLastError.bind(this);
  }

  public onRunComplete() {
    try {
      const coverageDirectory = findCoveragePath(this.globalConfig);
      const coverageSummaryPath = findCoverageSummaryPath(coverageDirectory);

      const watcher = watch(coverageDirectory);
      watcher.once('change', () => {
        watcher.close();
        const coverageRaw = readFileSync(coverageSummaryPath, 'utf-8');
        const coverageSummary: IstanbulCoverage = JSON.parse(coverageRaw);
        const coverageThreshold: JestCoverage = this.globalConfig.coverageThreshold!;

        const ratchetResult = ratchetCoverage(coverageThreshold, coverageSummary);

        const jestConfigPath = findJestConfigPath(process.cwd(), process.argv);

        updateFile(jestConfigPath, ratchetResult);
      });
    } catch (e) {
      // tslint:disable-next-line
      console.error(e);
    }
  }

  public getLastError() {
    getLastError(this.globalConfig);
  }
}
