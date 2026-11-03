import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OccupationCard from '../components/OccupationCard';

const occupation = {
  code: '15-1252',
  title: 'Software Developers',
  group: 'detailed',
  wages: [
    {
      year: 2025,
      area_code: '99',
      annual_median: 135980,
    },
  ],
};

describe('OccupationCard', () => {
  it('displays occupation information', () => {
    render(
      <MemoryRouter>
        <OccupationCard occupation={occupation} />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('href', '/occupations/15-1252');
  });

  it('handles unavailable wage data', () => {
    render(
      <MemoryRouter>
        <OccupationCard occupation={{ ...occupation, wages: [] }} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Not available')).toBeInTheDocument();
  });
});
