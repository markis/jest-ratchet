import { readFileSync, writeFileSync } from 'fs';
import { getLastError } from './errors';
import { Config, IstanbulCoverage, JestCoverage } from './interfaces';
import { findCoverageSummaryPath, findJestConfigPath } from './locations';
import { ratchetCoverage, setCoverage } from './ratchet';

export default class JestRatchet {
  constructor(
    private globalConfig: Config,
    // private ratchetOptions: RatchetOptions = {},
  ) {
    this.onRunComplete = this.onRunComplete.bind(this);
    this.getLastError = this.getLastError.bind(this);
  }

  public onRunComplete() {
    const coverageDirectory = this.globalConfig.coverageDirectory!;
    const coverageSummaryPath = findCoverageSummaryPath(coverageDirectory);
    const coverageRaw = readFileSync(coverageSummaryPath, 'utf-8');
    const coverageSummary: IstanbulCoverage = JSON.parse(coverageRaw);
    const coverageThreshold: JestCoverage = this.globalConfig.coverageThreshold!;

    const ratchetResult = ratchetCoverage(coverageThreshold, coverageSummary);

    const jestConfigPath = findJestConfigPath(process.cwd(), process.argv);
    const jestConfigRaw = readFileSync(jestConfigPath, 'utf-8');
    const jestConfig = JSON.parse(jestConfigRaw);
    if (jestConfig.jest) {
      setCoverage(jestConfig.jest.coverageThreshold, ratchetResult);
    } else {
      setCoverage(jestConfig.coverageThreshold, ratchetResult);
    }
    writeFileSync(jestConfigPath, JSON.stringify(jestConfig, null, 2), 'utf-8');
  }

  public getLastError() {
    getLastError(this.globalConfig);
  }
}
