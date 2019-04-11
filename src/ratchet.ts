import {
  IstanbulCoverage,
  IstanbulCoverageCategories,
  IstanbulCoverageCategory,
  JestCoverage,
  JestCoverageCategory,
  RatchetOptions,
} from './interfaces';

export const ratchetCoverage = (
  threshold: JestCoverage,
  summary: IstanbulCoverage,
  options: RatchetOptions,
): JestCoverage => {
  const result: any = {};
  if (threshold) {
    for (const key of Object.keys(threshold)) {
      const summaryKey = key === 'global' ? 'total' : key;
      result[key] = ratchetSingleCoverage(threshold[key], summary[summaryKey], options);
    }
  }
  return result;
};

const ratchetSingleCoverage = (
  threshold: JestCoverageCategory,
  summary: IstanbulCoverageCategories,
  options: RatchetOptions,
) => {
  const { branches, functions, lines, statements } = threshold;
  return {
    branches: ratchetSingleNumberCoverage(branches, summary.branches, options),
    functions: ratchetSingleNumberCoverage(functions, summary.functions, options),
    lines: ratchetSingleNumberCoverage(lines, summary.lines, options),
    statements: ratchetSingleNumberCoverage(statements, summary.statements, options),
  };
};

const ratchetSingleNumberCoverage = (
  num: number | undefined,
  category: IstanbulCoverageCategory,
  options: RatchetOptions,
) => {
  if (category && typeof num === 'number') {
    const tolerance = options.tolerance
      ? Math.round(category.pct) - options.tolerance
      : category.pct;
    if (num >= 0 && num <= tolerance) {
      return options.roundDown ? Math.floor(tolerance) : tolerance;
    } else if (num < 0 && num >= -category.covered) {
      return -category.covered;
    }
  }
};
