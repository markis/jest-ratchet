import { readFileSync, writeFileSync } from 'fs';
import * as jsonInplace from 'json-in-place';

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
  const inplace = jsonInplace as any;
  const newSource = inplace(source);
  for (const key of Object.keys(result)) {
    newSource.set(prefix + key + '.branches', result[key].branches);
    newSource.set(prefix + key + '.functions', result[key].functions);
    newSource.set(prefix + key + '.lines', result[key].lines);
    newSource.set(prefix + key + '.statements', result[key].statements);
  }
  return newSource.toString();
}
