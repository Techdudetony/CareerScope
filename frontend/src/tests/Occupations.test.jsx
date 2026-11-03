
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Occupations from '../pages/Occupations';
import { getOccupations } from '../api/occupations';

vi.mock('../api/occupations', () => ({
  getOccupations: vi.fn(),
}));

function makeOccupations(count, start = 0) {
  return Array.from({ length: count }, (_, index) => ({
    code: `15-${String(start + index).padStart(4, '0')}`,
    title: `Occupation ${start + index}`,
    group: 'detailed',
  }));
}

function renderPage() {
  return render(
    <MemoryRouter>
      <Occupations />
    </MemoryRouter>
  );
}

describe('Occupations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads the first page', async () => {
    getOccupations.mockResolvedValue(makeOccupations(26));

    renderPage();

    await screen.findByText('Occupation 0');

    expect(getOccupations).toHaveBeenCalledWith({
      search: '',
      limit: 26,
      offset: 0,
    });

    expect(
      screen.getByRole('button', { name: 'Next' })
    ).toBeEnabled();

    expect(screen.queryByText('Occupation 25')).not.toBeInTheDocument();
  });

  it('disables Next when no additional page exists', async () => {
    getOccupations.mockResolvedValue(makeOccupations(25));

    renderPage();

    await screen.findByText('Occupation 0');

    expect(
      screen.getByRole('button', { name: 'Next' })
    ).toBeDisabled();
  });

  it('loads the next page', async () => {
    getOccupations
      .mockResolvedValueOnce(makeOccupations(26))
      .mockResolvedValueOnce(makeOccupations(5, 25));

    renderPage();

    await screen.findByText('Occupation 0');

    fireEvent.click(
      screen.getByRole('button', { name: 'Next' })
    );

    await screen.findByText('Occupation 25');

    expect(getOccupations).toHaveBeenLastCalledWith({
      search: '',
      limit: 26,
      offset: 25,
    });
  });

  it('handles API errors', async () => {
    getOccupations.mockRejectedValue(new Error('API unavailable'));

    renderPage();

    expect(
      await screen.findByRole('alert')
    ).toHaveTextContent('Could not load occupations');
  });

  it('searches occupations after a debounce', async () => {
    getOccupations.mockResolvedValue([]);

    renderPage();

    await screen.findByText('No occupations found on this page.');

    fireEvent.change(
      screen.getByRole('searchbox'),
      { target: { value: 'software' } }
    );

    await waitFor(() => {
      expect(getOccupations).toHaveBeenCalledWith({
        search: 'software',
        limit: 26,
        offset: 0,
      });
    }, { timeout: 2000 });
  });
});
