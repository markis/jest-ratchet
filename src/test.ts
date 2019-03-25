jest.mock('fs');

import * as _fs from 'fs';
import { resolve } from 'path';
import JestRatchet from './index';
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

  it('will initialize without error', () => {
    const config = {
      ...mockConfig,
      collectCoverage: true,
      coverageReporters: ['json-summary'],
    };
    const jestRatchet = new JestRatchet(config);

    expect(jestRatchet.getLastError).not.toThrowError();
  });

  it('will throw error when collectCoverage is not enabled', () => {
    const config = {
      ...mockConfig,
      collectCoverage: false,
      coverageReporters: undefined,
    };
    const jestRatchet = new JestRatchet(config);

    expect(jestRatchet.getLastError).toThrowError(/collectCoverage/);
  });

  it('will handle errors from onRunComplete', () => {
    // tslint:disable-next-line
    console.error = jest.fn();

    const jestRatchet = new JestRatchet(mockConfig);
    jestRatchet.onRunComplete();
  });

  it('will do nothing when ratchet is disabled', () => {
    process.env.DISABLE_JEST_RATCHET = 'true';

    const jestRatchet = new JestRatchet(mockConfig);

    expect(jestRatchet.onRunComplete).toBe(noop);
  });

  it('will ratchet percentages', () => {
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
    fs.__addMockFile(
      /\/coverage-summary\.json$/,
      JSON.stringify({
        total: {
          branches: {pct: 100},
          functions: {pct: 100},
          lines: {pct: 100},
          statements: {pct: 100},
        },
      }),
    );
    fs.__addMockFile(
      /\/package\.json$/,
      JSON.stringify({ ...threshold }),
    );

    const jestRatchet = new JestRatchet({
      ...mockConfig,
      ...threshold,
      rootDir: './example',
    });
    jestRatchet.onRunComplete();

    const writeFileSync = fs.writeFileSync as jest.Mock;
    expect(writeFileSync.mock.calls[0][1])
      .toEqual(
        JSON.stringify({
          coverageThreshold: {
            global: {
              branches: 100,
              functions: 100,
              lines: 100,
              statements: 100,
            },
          },
        }));
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
    fs.__addMockFile(
      /\/coverage-summary\.json$/,
      JSON.stringify({
        total: {
          branches: {pct: 98.7},
          functions: {pct: 51.3},
          lines: {pct: 70.6},
          statements: {pct: 75.8},
        },
      }),
    );
    fs.__addMockFile(
      /\/package\.json$/,
      JSON.stringify({ ...threshold }),
    );

    const jestRatchet = new JestRatchet({
      ...mockConfig,
      ...threshold,
      rootDir: './example',
    }, {
      roundDown: true,
    });
    jestRatchet.onRunComplete();

    const writeFileSync = fs.writeFileSync as jest.Mock;
    expect(writeFileSync).toHaveBeenCalledWith(expect.anything(), JSON.stringify({
      coverageThreshold: {
        global: {
          branches: 98,
          functions: 51,
          lines: 70,
          statements: 75,
        },
      },
    }), expect.anything());
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
    fs.__addMockFile(
      /\/coverage-summary\.json$/,
      JSON.stringify({
        total: {
          branches: {pct: 100},
        },
      }),
    );
    fs.__addMockFile(
      /\/package\.json$/,
      JSON.stringify({ ...threshold }),
    );

    const jestRatchet = new JestRatchet({
      ...mockConfig,
      ...threshold,
      rootDir: './example',
    }, {
      tolerance: TOLERANCE,
    });
    jestRatchet.onRunComplete();

    const writeFileSync = fs.writeFileSync as jest.Mock;
    expect(writeFileSync.mock.calls[0][1])
      .toEqual(
        JSON.stringify({
          coverageThreshold: {
            global: {
              branches: 98,
            },
          },
        }));
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
    fs.__addMockFile(
      /\/coverage-summary\.json$/,
      JSON.stringify({
        total: {
          branches: {covered: 100},
          functions: {covered: 100},
          lines: {covered: 100},
          statements: {covered: 100},
        },
      }),
    );
    fs.__addMockFile(
      /\/jestconfig\.json$/,
      JSON.stringify({ ...threshold }),
    );

    const jestRatchet = new JestRatchet({ ...mockConfig, ...threshold });
    jestRatchet.onRunComplete();

    const writeFileSync = fs.writeFileSync as jest.Mock;
    expect(writeFileSync.mock.calls[0][1])
      .toEqual(
        JSON.stringify({
          coverageThreshold: {
            global: {
              branches: -100,
              functions: -100,
              lines: -100,
              statements: -100,
            },
          },
        }));
  });

  it('will handle edge cases', () => {
    const threshold = {
      coverageThreshold: {
        global: { bogus: {}},
      },
    } as any;
    fs.__addMockFile(
      /\/coverage-summary\.json$/,
      JSON.stringify({
        total: { bogus: {} },
      }),
    );
    fs.__addMockFile(
      /\/jestconfig\.json$/,
      JSON.stringify({ ...threshold }),
    );
    fs.existsSync = () => true;

    const jestRatchet = new JestRatchet({ ...mockConfig, ...threshold });
    jestRatchet.onRunComplete();
  });
});
