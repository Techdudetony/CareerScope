import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, createMemoryRouter, RouterProvider } from 'react-router-dom';
import { act } from 'react';

import ThemeProvider from '../context/ThemeProvider';
import NavBar from '../components/Navbar';

function renderNavbar(initialPath = '/') {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <NavBar />
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('Navbar', () => {
  it('renders the CareerScope brand', () => {
    renderNavbar();

    expect(screen.getByRole('link', { name: /careerscope home/i })).toHaveAttribute('href', '/');
  });

  it('closes the mobile menu when the route changes', async () => {
    const router = createMemoryRouter(
      [
        { path: '/', element: <NavBar /> },
        { path: '/occupations', element: <NavBar /> },
      ],
      { initialEntries: ['/'] }
    );

    render(
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );

    await act(async () => {
      await router.navigate('/occupations');
    });

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('renders desktop navigation links', () => {
    renderNavbar();

    const navigation = screen.getByRole('navigation', {
      name: 'Main navigation',
    });

    expect(navigation).toBeInTheDocument();
  });

  it('starts with the mobile menu closed', () => {
    renderNavbar();

    const button = screen.getByRole('button', {
      name: 'Open menu',
    });

    expect(button).toHaveAttribute('aria-expanded', 'false');

    expect(document.getElementById('mobile-navigation')).toHaveAttribute('hidden');
  });

  it('opens and closes the mobile menu', () => {
    renderNavbar();

    const button = screen.getByRole('button', {
      name: 'Open menu',
    });

    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');

    expect(document.getElementById('mobile-navigation')).not.toHaveAttribute('hidden');

    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes the menu when Escape is pressed', () => {
    renderNavbar();

    const button = screen.getByRole('button', {
      name: 'Open menu',
    });

    fireEvent.click(button);
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveFocus();
  });

  it('closes the menu when a navigation link is selected', () => {
    renderNavbar();

    const button = screen.getByRole('button', {
      name: 'Open menu',
    });

    fireEvent.click(button);

    const mobileNavigation = document.getElementById('mobile-navigation');

    const occupationsLink = Array.from(mobileNavigation.querySelectorAll('a')).find((link) =>
      link.textContent.includes('Occupations')
    );

    fireEvent.click(occupationsLink);

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(mobileNavigation).toHaveAttribute('hidden');
  });

  it('marks the active route correctly', () => {
    renderNavbar('/occupations');

    const navigation = screen.getByRole('navigation', {
      name: 'Main navigation',
    });

    const occupationsLink = Array.from(navigation.querySelectorAll('a')).find((link) =>
      link.textContent.includes('Occupations')
    );

    expect(occupationsLink).toHaveAttribute('aria-current', 'page');
  });
});
