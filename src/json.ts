import { readFileSync, writeFileSync } from 'fs';
import * as _inplace from 'json-in-place';

import { JestCoverage, JestCoverageCategory } from './interfaces';

const FIELDS: Array<keyof JestCoverageCategory> = [
  'branches',
  'functions',
  'lines',
  'statements',
];
const inplace = _inplace as typeof _inplace.default;

export const updateFile = (fileName: string, result: JestCoverage) => {
  const jestConfigRaw = readFileSync(fileName, 'utf-8');
  const jestConfig = JSON.parse(jestConfigRaw);

  const prefix = jestConfig.jest ? 'jest.' : '';
  const newFile = setCoverage(jestConfigRaw, result, prefix);

  writeFileSync(fileName, newFile, 'utf-8');
};

export const setCoverage = (
  source: string,
  result: JestCoverage,
  prefix: string,
): string => {
  prefix += 'coverageThreshold.';
  const newSource = inplace(source);
  for (const key of Object.keys(result)) {
    for (const field of FIELDS) {
      const value = result[key][field];
      if (value) {
        newSource.set(prefix + key + '.' + field, value);
      }
    }
  }
  return newSource.toString();
};
