import { getLastError } from './errors';

describe('Error Handler', () => {
  it('will do nothing when setup correctly', () => {
    const config = {
      collectCoverage: true,
      coverageReporters: ['json-summary'],
    };

    expect(() => { getLastError(config); }).not.toThrowError();
  });

  it('will throw error when collectCoverage is not enabled', () => {
    const config = {
      coverageReporters: ['json-summary'],
    };
    const errors: string[] = [];

    expect(() => { getLastError(config, errors); }).toThrowError();
  });

  it('will throw error when reporters does not include json-summary', () => {
    const config = {
      collectCoverage: true,
    };
    const errors: string[] = [];

    expect(() => { getLastError(config, errors); }).toThrowError();
  });
});
