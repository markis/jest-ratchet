jest.mock('fs');

import fs from 'fs';
import { resolve } from 'path';
import JestRatchet from './index';

const mockConfig = {
  collectCoverage: true,
  coverageDirectory: './example/coverage',
  coverageReporters: ['json-summary'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  rootDir: './example',
};

process.cwd = jest.fn().mockReturnValue(resolve('./example'));

describe('jest-ratchet', () => {

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

  it('will ratchet percentages', () => {
    fs.readFileSync = jest.fn()
      .mockReturnValueOnce(JSON.stringify({
        total: {
          branches: {pct: 100},
          functions: {pct: 100},
          lines: {pct: 100},
          statements: {pct: 100},
        },
      }))
      .mockReturnValueOnce(JSON.stringify({
        coverageThreshold: {
          global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: 50,
          },
        },
      }));

    const jestRatchet = new JestRatchet(mockConfig);
    jestRatchet.onRunComplete();
  });

  it('will ratchet lines', () => {
    fs.readFileSync = jest.fn()
      .mockReturnValueOnce(JSON.stringify({
        total: {
          branches: {covered: 100},
          functions: {covered: 100},
          lines: {covered: 100},
          statements: {covered: 100},
        },
      }))
      .mockReturnValueOnce(JSON.stringify({
        coverageThreshold: {
          global: {
            branches: -50,
            functions: -50,
            lines: -50,
            statements: -50,
          },
        },
      }));

    const jestRatchet = new JestRatchet(mockConfig);
    jestRatchet.onRunComplete();
  });

  it('will respect the --config flag', () => {
    process.argv = ['--config', 'jestconfig.json'];

    const jestRatchet = new JestRatchet(mockConfig);
    jestRatchet.onRunComplete();
  });
});
