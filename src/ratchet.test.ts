import { ratchetCoverage, setCoverage } from './ratchet';

const mockCoverage = {
  total: {
    branches: { covered: 800, pct: 80 },
    functions: { covered: 800, pct: 80 },
    lines: { covered: 800, pct: 80 },
    statements: { covered: 800, pct: 80 },
  },
};

describe('ratchet', () => {
  it('will ratchet percents', () => {
    const mockThresholdPercents = {
      global: {
        branches: 50,
        functions: 50,
        lines: 50,
        statements: 50,
      },
    };
    const result = ratchetCoverage(mockThresholdPercents, mockCoverage);

    expect(result).toEqual({
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    });
  });
  it('will ratchet lines', () => {
    const mockThresholdLines = {
      global: {
        branches: -500,
        functions: -500,
        lines: -500,
        statements: -500,
      },
    };
    const result = ratchetCoverage(mockThresholdLines, mockCoverage);

    expect(result).toEqual({
      global: {
        branches: -800,
        functions: -800,
        lines: -800,
        statements: -800,
      },
    });
  });

  it('will set coverage', () => {
    const mockSource = {
      global: {
        branches: 50,
        functions: 50,
        lines: 50,
        statements: 50,
      },
    };
    const mockResult = {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    };
    setCoverage(mockSource, mockResult);

    expect(mockSource.global.branches).toBe(80);
    expect(mockSource.global.functions).toBe(80);
    expect(mockSource.global.lines).toBe(80);
    expect(mockSource.global.statements).toBe(80);
  });

  it('will set coverage for partial source', () => {
    const mockSource: any = {
      global: {
        branches: 50,
      },
    };
    const mockResult = {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    };
    setCoverage(mockSource, mockResult);

    expect(mockSource.global.branches).toBe(80);
    expect(mockSource.global.functions).toBe(80);
    expect(mockSource.global.lines).toBe(80);
    expect(mockSource.global.statements).toBe(80);
  });
});
