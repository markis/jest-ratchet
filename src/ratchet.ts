import {
  IstanbulCoverage,
  IstanbulCoverageCategories,
  IstanbulCoverageCategory,
  JestCoverage,
  JestCoverageCategory,
  RatchetOptions,
} from './interfaces';

export function ratchetCoverage(
  threshold: JestCoverage,
  summary: IstanbulCoverage,
  options: RatchetOptions,
): JestCoverage {
  const result: any = {};
  for (const key of Object.keys(threshold)) {
    const summaryKey = key === 'global' ? 'total' : key;
    result[key] = ratchetSingleCoverage(threshold[key], summary[summaryKey], options);
  }
  return result;
}

function ratchetSingleCoverage(
  threshold: JestCoverageCategory,
  summary: IstanbulCoverageCategories,
  options: RatchetOptions,
) {
  const { branches, functions, lines, statements } = threshold;
  return {
    branches: ratchetSingleNumberCoverage(branches, summary.branches, options),
    functions: ratchetSingleNumberCoverage(functions, summary.functions, options),
    lines: ratchetSingleNumberCoverage(lines, summary.lines, options),
    statements: ratchetSingleNumberCoverage(statements, summary.statements, options),
  };
}

function ratchetSingleNumberCoverage(
  num: number | undefined,
  category: IstanbulCoverageCategory,
  options: RatchetOptions,
) {
  if (num && category && num > 0 && num <= category.pct) {
    if (options.ratchetPercentagePadding) {
      return Math.round(category.pct) - options.ratchetPercentagePadding;
    } else {
      return category.pct;
    }
  } else if (num && category && num < 0 && num >= -category.covered) {
    return -category.covered;
  }
}
