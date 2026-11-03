import { describe, expect, it } from 'vitest';
import { formatCurrency, formatNumber } from '../utils/formatters';

describe('formatCurrency', () => {
  it('formats annual salary values', () => {
    expect(formatCurrency(135980)).toBe('$135,980');
  });

  it('handles missing values', () => {
    expect(formatCurrency(null)).toBe('Not available');
  });

  it('handles invalid values', () => {
    expect(formatCurrency('invalid')).toBe('Not available');
  });
});

describe('formatNumber', () => {
  it('formats employment counts', () => {
    expect(formatNumber(100000)).toBe('100,000');
  });

  it('handles missing values', () => {
    expect(formatNumber(undefined)).toBe('Not available');
  });
});
