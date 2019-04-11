jest.mock('fs');

import * as _fs from 'fs';
import { resolve } from 'path';
import {
  CollectCoverageError,
  JsonSummaryError,
  TimeoutError,
  tryOrReject,
} from './errors';
import JestRatchet from './index';
import { findCoveragePath } from './locations';
import { noop } from './noop';

type extFs = typeof _fs & {
  __addMockFile: (name: RegExp, value: string) => void;
  __resetMockFiles: () => void;
};

const fs: extFs = _fs as any;

const mockConfig = {
  collectCoverage: true,
  coverageReporters: ['json-summary'],
};

const originalArgv = process.argv;
const originalEnv = process.env;

describe('jest-ratchet', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    fs.__resetMockFiles();
    process.cwd = jest.fn().mockReturnValue(resolve('./example'));
    process.argv = originalArgv;
    process.env = { ...originalEnv };
    delete process.env.DISABLE_JEST_RATCHET;
  });

  it('will ratchet percentages', () => {
    const threshold = {
      coverageThreshold: {
        global: {
          branches: 50,
        },
      },
    };
    setCoverageSummaryFile(fs, {
      total: {
        branches: {pct: 100},
      },
    });
    setPackageJson(fs, { ...threshold });

    const jestRatchet = new JestRatchet({
      ...mockConfig,
      ...threshold,
      rootDir: './example',
    });
    jestRatchet.onRunComplete();

    expectCoverageThreshold({
      coverageThreshold: {
        global: {
          branches: 100,
        },
      },
    });
  });

  it('will ratchet coverage set to zero', () => {
    const threshold = {
      coverageThreshold: {
        global: {
          branches: 0,
        },
      },
    };
    setCoverageSummaryFile(fs, {
      total: {
        branches: {pct: 75},
      },
    });
    setPackageJson(fs, { ...threshold });

    const jestRatchet = new JestRatchet({
      ...mockConfig,
      ...threshold,
      rootDir: './example',
    });
    jestRatchet.onRunComplete();

    expectCoverageThreshold({
      coverageThreshold: {
        global: {
          branches: 75,
        },
      },
    });
  });

  it('will ratchet non-global percentages', () => {
    const threshold = {
      coverageThreshold: {
        global: {
          branches: 50,
          functions: 50,
          lines: 50,
          statements: 50,
        },
        specific: {
          branches: 50,
          functions: 50,
          lines: 50,
          statements: 50,
        },
      },
    };
    setCoverageSummaryFile(fs, {
      specific: {
        branches: {pct: 100},
        functions: {pct: 100},
        lines: {pct: 100},
        statements: {pct: 100},
      },
      total: {
        branches: {pct: 100},
        functions: {pct: 100},
        lines: {pct: 100},
        statements: {pct: 100},
      },
    });
    setPackageJson(fs, { ...threshold });

    const jestRatchet = new JestRatchet({
      ...mockConfig,
      ...threshold,
      rootDir: './example',
    });
    jestRatchet.onRunComplete();

    expectCoverageThreshold({
      coverageThreshold: {
        global: {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100,
        },
        specific: {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100,
        },
      },
    });
  });

  it('will round down percentages', () => {
    const threshold = {
      coverageThreshold: {
        global: {
          branches: 50,
          functions: 50,
          lines: 50,
          statements: 50,
        },
      },
    };
    setCoverageSummaryFile(fs, {
      total: {
        branches: {pct: 98.7},
        functions: {pct: 51.3},
        lines: {pct: 70.6},
        statements: {pct: 75.8},
      },
    });
    setPackageJson(fs, { ...threshold });

    const jestRatchet = new JestRatchet({
      ...mockConfig,
      ...threshold,
      rootDir: './example',
    }, {
      roundDown: true,
    });
    jestRatchet.onRunComplete();

    expectCoverageThreshold({
      coverageThreshold: {
        global: {
          branches: 98,
          functions: 51,
          lines: 70,
          statements: 75,
        },
      },
    });
  });

  it('will pad the ratchet percentages', () => {
    const TOLERANCE = 2;
    const threshold = {
      coverageThreshold: {
        global: {
          branches: 50,
        },
      },
    };
    setCoverageSummaryFile(fs, {
      total: {
        branches: {pct: 100},
      },
    });
    setPackageJson(fs, { ...threshold });

    const jestRatchet = new JestRatchet({
      ...mockConfig,
      ...threshold,
    }, {
      tolerance: TOLERANCE,
    });
    jestRatchet.onRunComplete();

    expectCoverageThreshold({
      coverageThreshold: {
        global: {
          branches: 98,
        },
      },
    });
  });

  it('will respect the --config flag', () => {
    process.argv = ['', '', '--config', 'jestconfig.json'];
    const threshold = {
      coverageThreshold: {
        global: {
          branches: -50,
          functions: -50,
          lines: -50,
          statements: -50,
        },
      },
    };
    setCoverageSummaryFile(fs, {
      total: {
        branches: {covered: 100},
        functions: {covered: 100},
        lines: {covered: 100},
        statements: {covered: 100},
      },
    });
    setJestConfig(fs, { ...threshold });

    const jestRatchet = new JestRatchet({ ...mockConfig, ...threshold });
    jestRatchet.onRunComplete();

    expectCoverageThreshold({
      coverageThreshold: {
        global: {
          branches: -100,
          functions: -100,
          lines: -100,
          statements: -100,
        },
      },
    });
  });

  const setCoverageSummaryFile = (mockfs: extFs, json: any) => {
    mockfs.__addMockFile(
      /\/coverage-summary\.json$/,
      JSON.stringify(json),
    );
  };

  const setPackageJson = (mockfs: extFs, json: any) => {
    mockfs.__addMockFile(
      /\/package\.json$/,
      JSON.stringify(json),
    );
  };

  const setJestConfig = (mockfs: extFs, json: any) => {
    mockfs.__addMockFile(
      /\/jestconfig\.json$/,
      JSON.stringify(json),
    );
  };

  const expectCoverageThreshold = (threshold: any) => {
    const writeFileSync = fs.writeFileSync as jest.Mock;
    expect(writeFileSync).toHaveBeenCalledWith(
      expect.anything(),
      JSON.stringify({...threshold}),
      expect.anything(),
    );
  };

  it('will initialize without error', () => {
    const config = {
      ...mockConfig,
      collectCoverage: true,
      coverageReporters: ['json-summary'],
    };
    const jestRatchet = new JestRatchet(config);

    expect(jestRatchet.getLastError).not.toThrowError();
  });

  it('will throw error when json-summary is not enabled', () => {
    const config = {
      ...mockConfig,
      collectCoverage: true,
      coverageReporters: undefined,
    };
    const jestRatchet = new JestRatchet(config);

    expect(jestRatchet.getLastError).toThrowError(JsonSummaryError);
  });

  it('will throw error when collectCoverage is not enabled', () => {
    const config = {
      ...mockConfig,
      collectCoverage: false,
    };
    const jestRatchet = new JestRatchet(config);

    expect(jestRatchet.getLastError).toThrowError(CollectCoverageError);
  });

  it('will do nothing when ratchet is disabled', () => {
    process.env.DISABLE_JEST_RATCHET = 'true';

    const jestRatchet = new JestRatchet(mockConfig);
    expect(jestRatchet.onRunComplete).toBe(noop);
    expect(jestRatchet.getLastError).toBe(noop);
  });

  it('will throw a timeout error', async () => {
    fs.watch = () => ({
      close: jest.fn(),
      on: jest.fn(),
      once: jest.fn(),
    }) as any;

    const jestRatchet = new JestRatchet({ ...mockConfig }, { timeout: 5 });
    await expect(jestRatchet.runResult).rejects.toBeInstanceOf(TimeoutError);
    expect(jestRatchet.getLastError).toThrowError(TimeoutError);
  });

  it('will cleanup timeout', () => {
    jest.useFakeTimers();
    fs.watch = () => ({
      close: jest.fn(),
      once: jest.fn().mockImplementation((_: string, cb: () => void) => { cb(); }),
    }) as any;

    const jestRatchet = new JestRatchet({ ...mockConfig }, { timeout: 100 });
    jestRatchet.onRunComplete();

    expect(clearTimeout).toBeCalled();
  });
});

describe('edges', () => {
  it('tryOrReject will reject', () => {
    const reject = jest.fn();
    tryOrReject(reject, () => { throw new Error(); });
    expect(reject).toBeCalled();
  });

  it('findCoveragePath will return coverageDirectory', () => {
    const coverageDirectory = 'COVERAGE_DIRECTORY';
    expect(findCoveragePath({coverageDirectory})).toBe(coverageDirectory);
  });

  it('findCoveragePath will return rootDir', () => {
    const rootDir = 'COVERAGE_DIRECTORY';
    expect(findCoveragePath({rootDir})).toBe(resolve(rootDir, 'coverage'));
  });
});
