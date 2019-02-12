
export interface IstanbulCoverage {
  total: IstanbulCoverageCategories;
  [fileName: string]: IstanbulCoverageCategories;
}

export interface IstanbulCoverageCategories {
  lines: IstanbulCoverageCategory;
  statements: IstanbulCoverageCategory;
  functions: IstanbulCoverageCategory;
  branches: IstanbulCoverageCategory;
}

export interface IstanbulCoverageCategory {
  total?: number;
  covered: number;
  skipped?: number;
  pct: number;
}

export interface JestCoverage {
  global: JestCoverageCategory;
  [fileName: string]: JestCoverageCategory;
}

export interface JestCoverageCategory {
  branches?: number;
  functions?: number;
  lines?: number;
  statements?: number;

  [key: string]: number | undefined;
}

export interface RatchetOptions {
  /** Pad the ratchet percentage by a specified number. */
  ratchetPercentagePadding?: number;

  /** After set period timeout waiting for changes. Default: wait forever */
  timeout?: number;

  /** Round percentage thresholds down to the nearest percentage. */
  roundPct?: boolean;
}

export interface Config {
  collectCoverage?: boolean;
  coverageDirectory?: string;
  coverageReporters?: string[];
  coverageThreshold?: JestCoverage;
  rootDir?: string;
}
