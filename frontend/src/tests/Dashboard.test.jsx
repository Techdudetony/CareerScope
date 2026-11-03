
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import {
  checkApiHealth,
  getTopPayingOccupations,
} from '../api/occupations';

vi.mock('../api/occupations', () => ({
  checkApiHealth: vi.fn(),
  getTopPayingOccupations: vi.fn(),
}));

function renderDashboard() {
  return render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );
}

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays connected status and occupation data', async () => {
    checkApiHealth.mockResolvedValue({ status: 'ok' });
    getTopPayingOccupations.mockResolvedValue([{
      code: '15-1252',
      title: 'Software Developers',
      wages: [{
        year: 2025,
        area_code: '99',
        annual_median: 135980,
      }],
    }]);

    renderDashboard();

    expect(
      await screen.findByText('Connected')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Software Developers')
    ).toBeInTheDocument();
  });

  it('handles backend failures', async () => {
    checkApiHealth.mockRejectedValue(new Error('Offline'));
    getTopPayingOccupations.mockResolvedValue([]);

    renderDashboard();

    expect(
      await screen.findByText('Unavailable')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('alert')
    ).toHaveTextContent('Unable to load career data');
  });
});
