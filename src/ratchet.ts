import {
  IstanbulCoverage,
  IstanbulCoverageCategories,
  IstanbulCoverageCategory,
  JestCoverage,
  JestCoverageCategory,
} from './interfaces';

export function setCoverage(
  source: JestCoverage,
  result: JestCoverage,
): void {
  for (const key of Object.keys(source)) {
    for (const type of ['branches', 'functions', 'lines', 'statements']) {
      const keyValue = source[key][type];
      const resultValue = result[key][type];
      if (typeof keyValue === 'number' && typeof resultValue === 'number') {
        source[key][type] = resultValue;
      }
    }
  }
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
