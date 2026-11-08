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

function renderOccupationCard(data = occupation) {
  return render(
    <MemoryRouter>
      <OccupationCard occupation={data} />
    </MemoryRouter>
  );
}

describe('OccupationCard', () => {
  it('displays occupation information and formatted salary', () => {
    renderOccupationCard();

    expect(
      screen.getByRole('heading', {
        name: 'Software Developers',
        level: 3,
      })
    ).toBeInTheDocument();

    expect(screen.getByText('OCC 15-1252')).toBeInTheDocument();
    expect(screen.getByText('$135,980')).toBeInTheDocument();
    expect(screen.getByText('National median annual salary')).toBeInTheDocument();
  });

  it('links to the correct occupation details page', () => {
    renderOccupationCard();

    const link = screen.getByRole('link', {
      name: /software developers/i,
    });

    expect(link).toHaveAttribute('href', '/occupations/15-1252');
  });

  it('handles unavailable wage data', () => {
    renderOccupationCard({
      ...occupation,
      wages: [],
    });

    expect(screen.getByText('Not available')).toBeInTheDocument();
  });

  it('handles missing wages property', () => {
    const { wages, ...occupationWithoutWages } = occupation;
    void wages;

    renderOccupationCard(occupationWithoutWages);

    expect(screen.getByText('Not available')).toBeInTheDocument();
  });

  it('selects the 2025 national wage record', () => {
    renderOccupationCard({
      ...occupation,
      wages: [
        {
          year: 2024,
          area_code: '99',
          annual_median: 100000,
        },
        {
          year: 2025,
          area_code: '01',
          annual_median: 110000,
        },
        {
          year: 2025,
          area_code: '99',
          annual_median: 135980,
        },
      ],
    });

    expect(screen.getByText('$135,980')).toBeInTheDocument();
    expect(screen.queryByText('$100,000')).not.toBeInTheDocument();
    expect(screen.queryByText('$110,000')).not.toBeInTheDocument();
  });
});
