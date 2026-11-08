import { describe, expect, it } from 'vitest';
import { prepareSalaryComparison } from '../utils/salaryComparison';

describe('prepareSalaryComparison', () => {
  it('sorts valid national salaries from highest to lowest', () => {
    const result = prepareSalaryComparison([
      {
        code: 'A',
        title: 'Occupation A',
        wages: [
          {
            year: 2025,
            area_code: '99',
            annual_median: 95000,
          },
        ],
      },
      {
        code: 'B',
        title: 'Occupation B',
        wages: [
          {
            year: 2025,
            area_code: '99',
            annual_median: 150000,
          },
        ],
      },
    ]);

    expect(result.map((item) => item.code)).toEqual(['B', 'A']);
  });

  it('ignores other years and geographic areas', () => {
    const result = prepareSalaryComparison([
      {
        code: 'A',
        title: 'Occupation A',
        wages: [
          {
            year: 2024,
            area_code: '99',
            annual_median: 90000,
          },
          {
            year: 2025,
            area_code: '01',
            annual_median: 110000,
          },
          {
            year: 2025,
            area_code: '99',
            annual_median: 125000,
          },
        ],
      },
    ]);

    expect(result).toEqual([
      {
        code: 'A',
        title: 'Occupation A',
        salary: 125000,
      },
    ]);
  });

  it('excludes missing or invalid salaries', () => {
    const result = prepareSalaryComparison([
      {
        code: 'A',
        title: 'Missing',
        wages: [],
      },
      {
        code: 'B',
        title: 'Invalid',
        wages: [
          {
            year: 2025,
            area_code: '99',
            annual_median: 'unknown',
          },
        ],
      },
      {
        code: 'C',
        title: 'Valid',
        wages: [
          {
            year: 2025,
            area_code: '99',
            annual_median: 100000,
          },
        ],
      },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].code).toBe('C');
  });

  it('handles empty or malformed collections', () => {
    expect(prepareSalaryComparison([])).toEqual([]);
    expect(prepareSalaryComparison(null)).toEqual([]);
  });
});
