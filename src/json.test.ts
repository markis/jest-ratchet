import { setCoverage } from './json';

const mockThreshold = {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
};

describe('json', () => {
  it('will ratchet percents', () => {
    const json = `
    {
      "coverageThreshold": {
        "global": {
          "branches": 50, "functions": 50,
          "lines": 50, "statements": 50
        }
      }
    }`;
    const result = setCoverage(json, mockThreshold, '');

    expect(result).toEqual(`
    {
      "coverageThreshold": {
        "global": {
          "branches": 80, "functions": 80,
          "lines": 80, "statements": 80
        }
      }
    }`);
  });

});
