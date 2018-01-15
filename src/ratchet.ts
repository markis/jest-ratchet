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
    if (
      typeof source[key].branches === 'number'
      && typeof result[key].branches === 'number'
    ) {
      source[key].branches = result[key].branches;
    }
    if (
      typeof source[key].lines === 'number'
      && typeof result[key].lines === 'number'
    ) {
      source[key].lines = result[key].lines;
    }
    if (
      typeof source[key].functions === 'number'
      && typeof result[key].functions === 'number'
    ) {
      source[key].functions = result[key].functions;
    }
    if (
      typeof source[key].statements === 'number'
      && typeof result[key].statements === 'number'
    ) {
      source[key].statements = result[key].statements;
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
    branches: _ratchetSingleTypeCoverage(branches, summary.branches),
    functions: _ratchetSingleTypeCoverage(functions, summary.functions),
    lines: _ratchetSingleTypeCoverage(lines, summary.lines),
    statements: _ratchetSingleTypeCoverage(statements, summary.statements),
  };
}

function _ratchetSingleTypeCoverage(
  type: number | undefined,
  category: IstanbulCoverageCategory,
) {
  if (typeof type === 'number') {
    if (type > 0) {
      if (type <= category.pct) {
        return category.pct;
      }
    } else if (type < 0) {
      const covered = 0 - category.covered;
      if (type <= covered) {
        return covered;
      }
    }
  }
  return undefined;
}
