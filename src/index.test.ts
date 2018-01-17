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

jest.mock('fs');
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

  it.skip('will run ratchet coverage report', () => {
    const jestRatchet = new JestRatchet(mockConfig);
    jestRatchet.onRunComplete();
  });

  it.skip('will respect the --config flag', () => {
    process.argv = ['--config', 'jestconfig.json'];

    const jestRatchet = new JestRatchet(mockConfig);
    jestRatchet.onRunComplete();
  });
});
