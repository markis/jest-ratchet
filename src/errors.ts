/* tslint:disable:max-classes-per-file */

import { Config } from './interfaces';

export const NAME = 'jest-ratchet';

export const getLastError = (config: Config) => {
  const { collectCoverage, coverageReporters} = config;
  if (!collectCoverage) {
    throw new CollectCoverageError();
  }
  if ((coverageReporters || []).indexOf('json-summary') === -1) {
    throw new JsonSummaryError();
  }
};

export const tryOrReject = (reject: (reason?: any) => void, cb: () => void) => {
  try {
    cb();
  } catch (e) {
    reject(e);
  }
};

export class JsonSummaryError extends Error {
  constructor() {
    super(`'json-summary' needs to be listed as a coverageReporter in order for ${ NAME } to work appropriately.`);
  }
}

export class CollectCoverageError extends Error {
  constructor() {
    super(`'collectCoverage' option needs to be enabled in order for ${ NAME } to work appropriately.`);
  }
}

export class TimeoutError extends Error {
  constructor(public coverageDirectory?: string, public timeout?: number) {
    super('Jest-Ratchet timed-out waiting for the Coverage Summary');
  }
}
