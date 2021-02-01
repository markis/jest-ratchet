import {
  IstanbulCoverage,
  IstanbulCoverageCategories,
  IstanbulCoverageCategory,
  JestCoverage,
  JestCoverageCategory,
  RatchetOptions,
} from './interfaces';

import { roundToTwo } from './utils';

export const ratchetCoverage = (
  threshold: JestCoverage,
  summary: IstanbulCoverage,
  options: RatchetOptions,
  rootPath?: string,
): JestCoverage => {
  const result: any = {};
  if (threshold) {
    for (const key of Object.keys(threshold)) {
      const summaryKey = key === 'global' ? 'total' : key;
      if (rootPath && summaryKey.endsWith('/')) {
        result[key] = ratchetFolderCoverage(threshold[key], summaryKey, summary, options, rootPath);
      } else {
        result[key] = ratchetSingleCoverage(threshold[key], summary[summaryKey], options);
      }
    }
  }
  return result;
};

const ratchetFolderCoverage = (
  threshold: JestCoverageCategory,
  fileOrFolderPath: string,
  summary: IstanbulCoverage,
  options: RatchetOptions,
  rootPath: string
) => {
  const path = fileOrFolderPath.replace('./', `${rootPath}/`);
  // slicing to ignore total object
  const jsonKeys = Object.keys(summary).slice(1);
  const calculatedSummary: IstanbulCoverageCategories = {
    branches: {
      total: 0,
      covered: 0,
      skipped: 0,
      pct: 0
    },
    functions: {
      total: 0,
      covered: 0,
      skipped: 0,
      pct: 0
    },
    lines: {
      total: 0,
      covered: 0,
      skipped: 0,
      pct: 0
    },
    statements: {
      total: 0,
      covered: 0,
      skipped: 0,
      pct: 0
    }
  };

  jsonKeys.forEach((value) => {
    if (value.startsWith(path)) {
      const indiReport = summary[value];
      if (indiReport) {
        calculatedSummary.lines.total = (calculatedSummary.lines.total ?? 0) + (indiReport.lines?.total ?? 0);
        calculatedSummary.lines.covered += indiReport.lines?.covered ?? 0;
        calculatedSummary.lines.skipped = (calculatedSummary.lines.skipped ?? 0) + (indiReport.lines?.skipped ?? 0);

        calculatedSummary.branches.total = (calculatedSummary.branches.total ?? 0) + (indiReport.branches?.total ?? 0);
        calculatedSummary.branches.covered += indiReport.branches?.covered ?? 0;
        calculatedSummary.branches.skipped = (calculatedSummary.branches.total ?? 0) + (indiReport.branches?.skipped ?? 0);

        calculatedSummary.statements.total = (calculatedSummary.statements.total ?? 0) + (indiReport.statements?.total ?? 0);
        calculatedSummary.statements.covered += indiReport.statements?.covered ?? 0;
        calculatedSummary.statements.skipped = (calculatedSummary.statements.total ?? 0) + (indiReport.statements?.skipped ?? 0);

        calculatedSummary.functions.total = (calculatedSummary.functions.total ?? 0) + (indiReport.functions?.total ?? 0);
        calculatedSummary.functions.covered += indiReport.functions?.covered ?? 0;
        calculatedSummary.functions.skipped = (calculatedSummary.functions.total ?? 0) + (indiReport.functions?.skipped ?? 0);
      }
    }
  });

  Object.keys(calculatedSummary).forEach((key) => {
    // @ts-ignore
    const value: IstanbulCoverageCategory = calculatedSummary[key];
    if (value.total) {
      value.pct = roundToTwo((value.covered / value.total) * 100);
    }
  });

  const { branches, functions, lines, statements } = threshold;
  return {
    branches: ratchetSingleNumberCoverage(branches, calculatedSummary.branches, options),
    functions: ratchetSingleNumberCoverage(functions, calculatedSummary.functions, options),
    lines: ratchetSingleNumberCoverage(lines, calculatedSummary.lines, options),
    statements: ratchetSingleNumberCoverage(statements, calculatedSummary.statements, options),
  };
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
