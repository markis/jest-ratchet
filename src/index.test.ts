import JestRatchet from './index';

const mockConfig = {
  collectCoverage: true,
  coverageDirectory: './coverage-example',
  coverageReporters: ['json-summary'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
const mockJestConfig = `{
  "collectCoverage": true,
  "coverageReporters": [
    "json-summary"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 100,
      "functions": 50,
      "lines": 66.67,
      "statements": 66.67
    }
  }
}`;

const mockCoverage = `{
  "total": {
    "lines": {
      "total": 3,
      "covered": 2,
      "skipped": 0,
      "pct": 66.67
    },
    "statements": {
      "total": 3,
      "covered": 2,
      "skipped": 0,
      "pct": 66.67
    },
    "functions": {
      "total": 2,
      "covered": 1,
      "skipped": 0,
      "pct": 50
    },
    "branches": {
      "total": 0,
      "covered": 0,
      "skipped": 0,
      "pct": 100
    }
  }
}`;

describe('JestRatchet', () => {

  it('will initialize without error', () => {
    const jestRatchet = new JestRatchet(mockConfig);
    jestRatchet.getLastError();
  });
  it.skip('will run ratchet coverage report', () => {
    const jestRatchet = new JestRatchet(mockConfig);
    jestRatchet.onRunComplete();
  });
});
