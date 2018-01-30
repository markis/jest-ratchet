import { readFileSync, writeFileSync } from 'fs';
import inplace from 'json-in-place';

import { JestCoverage } from './interfaces';

export function updateFile(fileName: string, result: JestCoverage) {
  const jestConfigRaw = readFileSync(fileName, 'utf-8');
  const jestConfig = JSON.parse(jestConfigRaw);

  const prefix = jestConfig.jest ? 'jest.' : '';
  const newFile = setCoverage(jestConfigRaw, result, prefix);

  writeFileSync(fileName, newFile, 'utf-8');
}

export function setCoverage(
  source: string,
  result: JestCoverage,
  prefix: string,
): string {
  prefix += 'coverageThreshold.';
  const newSource = inplace(source);
  for (const key of Object.keys(result)) {
    if (result[key].branches) {
      newSource.set(prefix + key + '.branches', result[key].branches);
    }
    if (result[key].functions) {
      newSource.set(prefix + key + '.functions', result[key].functions);
    }
    if (result[key].lines) {
      newSource.set(prefix + key + '.lines', result[key].lines);
    }
    if (result[key].statements) {
      newSource.set(prefix + key + '.statements', result[key].statements);
    }
  }
  return newSource.toString();
}
