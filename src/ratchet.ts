import {
  IstanbulCoverage,
  IstanbulCoverageCategories,
  JestCoverage,
  JestCoverageCategory,
  RatchetOptions,
} from './interfaces';

export const ratchetCoverage = (
  threshold: JestCoverage,
  summary: IstanbulCoverage,
  options: RatchetOptions
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
  options: RatchetOptions
) => {
  return {
    branches: ratchetSingleNumberCoverage('branches', threshold, summary, options),
    functions: ratchetSingleNumberCoverage('functions', threshold, summary, options),
    lines: ratchetSingleNumberCoverage('lines', threshold, summary, options),
    statements: ratchetSingleNumberCoverage('statements', threshold, summary, options),
  };
};

const ratchetSingleNumberCoverage = (
  categoryName: string,
  threshold: JestCoverageCategory,
  summary: IstanbulCoverageCategories,
  options: RatchetOptions
) => {
  const categoryThreshold = threshold[categoryName];
  const categoryResult = summary[categoryName];

  if (categoryResult && typeof categoryThreshold === 'number') {
    const categoryResultPercent = categoryResult.pct - (options.tolerance || 0);

    if (categoryThreshold >= 0 && categoryThreshold <= categoryResultPercent) {
      return calculateThresholdPercent(categoryName, categoryResultPercent, options);
    } else if (categoryThreshold < 0 && -categoryThreshold >= categoryResult.total - categoryResult.covered) {
      return calculateThresholdCount(categoryName, categoryResult.total - categoryResult.covered, options);
    }
  }
};

const calculateThresholdPercent = (categoryName: string, categoryResultPercent: number, options: RatchetOptions) => {
  const categoryPct = options.roundDown ? Math.floor(categoryResultPercent) : categoryResultPercent;
  let maxValue: number | undefined;

  if (typeof options.maxThresholds === 'number') {
    maxValue = options.maxThresholds;
  }

  if (typeof options.maxThresholds === 'object') {
    maxValue = options.maxThresholds[categoryName];
  }

  if (maxValue && categoryPct > maxValue) {
    return maxValue;
  }
  return categoryPct;
};

const calculateThresholdCount = (categoryName: string, categoryResultUncovered: number, options: RatchetOptions) => {
  let maxValue: number | undefined;

  if (typeof options.maxThresholds === 'number' && options.maxThresholds < 0) {
    maxValue = options.maxThresholds;
  }

  if (typeof options.maxThresholds === 'object') {
    maxValue = options.maxThresholds[categoryName];
    if (typeof maxValue !== 'number' || maxValue >= 0) {
      maxValue = undefined;
    }
  }

  if (maxValue && categoryResultUncovered < -maxValue) {
    return maxValue;
  }

  return -categoryResultUncovered;
};
