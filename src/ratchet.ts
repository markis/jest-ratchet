import {
  IstanbulCoverage,
  IstanbulCoverageCategories,
  IstanbulCoverageCategory,
  JestCoverage,
  JestCoverageCategory,
} from './interfaces';

export function ratchetCoverage(
  threshold: JestCoverage,
  summary: IstanbulCoverage,
): JestCoverage {
  const result: any = {};
  for (const key of Object.keys(threshold)) {
    const summaryKey = key === 'global' ? 'total' : key;
    result[key] = ratchetSingleCoverage(threshold[key], summary[summaryKey]);
  }
  return result;
}

function ratchetSingleCoverage(
  threshold: JestCoverageCategory,
  summary: IstanbulCoverageCategories,
) {
  const { branches, functions, lines, statements } = threshold;
  return {
    branches: ratchetSingleNumberCoverage(branches, summary.branches),
    functions: ratchetSingleNumberCoverage(functions, summary.functions),
    lines: ratchetSingleNumberCoverage(lines, summary.lines),
    statements: ratchetSingleNumberCoverage(statements, summary.statements),
  };
}

function ratchetSingleNumberCoverage(
  num: number | undefined,
  category: IstanbulCoverageCategory,
) {
  if (num && category && num > 0 && num <= category.pct) {
    return category.pct;
  } else if (num && category && num < 0 && num >= -category.covered) {
    return -category.covered;
  }
}
