import { Config } from './interfaces';

export const NAME = 'jest-ratchet';

export function getLastError(config: Config) {
  const errors: string[] = [];
  const { collectCoverage, coverageReporters} = config;
  if ((coverageReporters || []).indexOf('json-summary') === -1) {
    errors.push(
      `'json-summary' needs to be listed as a coverageReporter in order for ${ NAME } to work appropriately.`,
    );
  }
  if (!collectCoverage) {
    errors.push(
      `'collectCoverage' option needs to be enabled in order for ${ NAME } to work appropriately.`,
    );
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }
}
