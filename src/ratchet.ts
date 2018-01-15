import {
  IstanbulCoverage,
  IstanbulCoverageCategories,
  IstanbulCoverageCategory,
  JestCoverage,
  JestCoverageCategory,
} from './interfaces';

export function setCoverage(
  sourceCoverage: JestCoverage,
  resultCoverage: JestCoverage,
): void {
  for (const key of Object.keys(sourceCoverage)) {
    const source = sourceCoverage[key];
    const result = resultCoverage[key];
    source.branches = setSingleCoverage(source.branches, result.branches);
    source.functions = setSingleCoverage(source.functions, result.functions);
    source.lines = setSingleCoverage(source.lines, result.lines);
    source.statements = setSingleCoverage(source.statements, result.statements);
  }
}

function setSingleCoverage(sourceValue?: number, resultValue?: number) {
  return typeof resultValue === 'number' ? resultValue : sourceValue;
}

export function ratchetCoverage(
  threshold: JestCoverage,
  summary: IstanbulCoverage,
): JestCoverage {
  const result: any = {};
  for (const key of Object.keys(threshold)) {
    const summaryKey = key === 'global' ? 'total' : key;
    result[key] = _ratchetSingleCoverage(threshold[key], summary[summaryKey]);
  }
  return result;
}

function _ratchetSingleCoverage(
  threshold: JestCoverageCategory,
  summary: IstanbulCoverageCategories,
) {
  const { branches, functions, lines, statements } = threshold;
  return {
    branches: _ratchetSingleNumberCoverage(branches, summary.branches),
    functions: _ratchetSingleNumberCoverage(functions, summary.functions),
    lines: _ratchetSingleNumberCoverage(lines, summary.lines),
    statements: _ratchetSingleNumberCoverage(statements, summary.statements),
  };
}

function _ratchetSingleNumberCoverage(
  num: number | undefined,
  category: IstanbulCoverageCategory,
) {
  if (num && num > 0 && num <= category.pct) {
    return category.pct;
  } else if (num && num < 0 && num >= -category.covered) {
    return -category.covered;
  }
}
