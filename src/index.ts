import { closeSync, existsSync, FSWatcher, mkdirSync, openSync, readFileSync, watch } from 'fs';

import { getLastError, TimeoutError, tryOrReject } from './errors';
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
  public getLastError: () => Error | void = noop;
  public onRunComplete: () => void = noop;
  public runResult = Promise.resolve();

  constructor(
    globalConfig: Config,
    options: RatchetOptions = {},
  ) {
    if (!process.env.DISABLE_JEST_RATCHET) {
      this.getLastError = getLastError.bind(this, globalConfig);
      this.runResult = onRunComplete(globalConfig, options);
      this.runResult.catch(e => {
        this.getLastError = () => { throw e; };
      });
    }
  }
}

const onSummaryReportComplete = (
  reject: () => void,
  resolve: () => void,
  watcher: FSWatcher,
  timeoutTimer: NodeJS.Timeout | undefined,
  coverageSummaryPath: string,
  jestConfigPath: string,
  globalConfig: Config,
  options: RatchetOptions,
) => () =>
  tryOrReject(reject, () => {
    watcher.close();
    if (timeoutTimer) {
      clearTimeout(timeoutTimer);
    }

    const coverageRaw = readFileSync(coverageSummaryPath, 'utf-8');
    const summary: IstanbulCoverage = JSON.parse(coverageRaw);
    const threshold = globalConfig.coverageThreshold!;
    const ratchetResult = ratchetCoverage(threshold, summary, options, globalConfig.rootDir);

    updateFile(jestConfigPath, ratchetResult);
    resolve();
  });

const onRunComplete = (
  globalConfig: Config,
  options: RatchetOptions,
): Promise<void> => new Promise(
  (resolve, reject) =>
    tryOrReject(reject, () => {
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
      const timeout = options.timeout;

      const timeoutTimer = timeout ? setTimeout(() => {
        watcher.close();
        reject(new TimeoutError(coverageDirectory, timeout));
      }, timeout) : undefined;

      watcher.once('change', onSummaryReportComplete(
        reject,
        resolve,
        watcher,
        timeoutTimer,
        coverageSummaryPath,
        jestConfigPath,
        globalConfig,
        options,
      ));
  }));
