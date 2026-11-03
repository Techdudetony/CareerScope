
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom';
import OccupationDetails from '../pages/OccupationDetails';
import { getOccupation } from '../api/occupations';

vi.mock('../api/occupations', () => ({
  getOccupation: vi.fn(),
}));

vi.mock('../components/SalaryChart', () => ({
  default: () => <div>Salary chart</div>,
}));

const occupation = {
  code: '15-1252',
  title: 'Software Developers',
  wages: [{
    year: 2025,
    area_code: '99',
    annual_median: 135980,
    annual_mean: 140000,
    annual_p10: 80000,
    annual_p90: 200000,
    employment: 100000,
    source: 'BLS OEWS',
  }],
};

function NavigationButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/occupations/15-1211')}
    >
      Change occupation
    </button>
  );
}

function renderDetails() {
  return render(
    <MemoryRouter initialEntries={['/occupations/15-1252']}>
      <NavigationButton />
      <Routes>
        <Route
          path="/occupations/:code"
          element={<OccupationDetails />}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('OccupationDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads occupation information', async () => {
    getOccupation.mockResolvedValue(occupation);

    renderDetails();

    expect(
      await screen.findByRole('heading', {
        name: 'Software Developers',
      })
    ).toBeInTheDocument();

    expect(screen.getByText('$135,980')).toBeInTheDocument();
  });

  it('handles missing occupation data', async () => {
    getOccupation.mockResolvedValue(null);

    renderDetails();

    expect(
      await screen.findByRole('alert')
    ).toHaveTextContent('Occupation not found.');
  });

  it('handles API failures', async () => {
    getOccupation.mockRejectedValue(new Error('Network error'));

    renderDetails();

    expect(
      await screen.findByRole('alert')
    ).toHaveTextContent('API unavailable');
  });

  
it('does not show stale data after navigation', async () => {
  let resolveSecondRequest;

  getOccupation
    .mockResolvedValueOnce(occupation)
    .mockImplementationOnce(
      () => new Promise((resolve) => {
        resolveSecondRequest = resolve;
      })
    );

  renderDetails();

  await screen.findByRole('heading', {
    name: 'Software Developers',
  });

  // Use React Testing Library to trigger navigation.
  fireEvent.click(
    screen.getByRole('button', {
      name: 'Change occupation',
    })
  );

  // The previous occupation must disappear.
  expect(
    screen.queryByRole('heading', {
      name: 'Software Developers',
    })
  ).not.toBeInTheDocument();

  // The next occupation should be loading.
  expect(
    await screen.findByRole('status')
  ).toHaveTextContent('Loading occupation');

  // Resolve the second API request.
  resolveSecondRequest({
    code: '15-1211',
    title: 'Computer Systems Analysts',
    wages: [],
  });

  // Verify that the new occupation appears.
  await waitFor(() => {
    expect(
      screen.getByRole('heading', {
        name: 'Computer Systems Analysts',
      })
    ).toBeInTheDocument();
  });

  expect(
    screen.queryByRole('heading', {
      name: 'Software Developers',
    })
  ).not.toBeInTheDocument();
});
  });
