
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ThemeProvider from '../context/ThemeProvider';
import ThemeToggle from '../components/ui/ThemeToggle';
import { act } from 'react';

let darkMode = false;
let listeners = new Set();

function mockMatchMedia() {
  vi.stubGlobal('matchMedia', vi.fn(() => ({
    get matches() {
      return darkMode;
    },
    media: '(prefers-color-scheme: dark)',
    addEventListener: (_event, callback) => {
      listeners.add(callback);
    },
    removeEventListener: (_event, callback) => {
      listeners.delete(callback);
    },
  })));
}

function changeSystemTheme(isDark) {
  act(() => {
    darkMode = isDark;

    listeners.forEach((callback) => {
      callback({ matches: isDark });
    });
  });
}

function renderToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    darkMode = false;
    listeners = new Set();
    localStorage.clear();
    delete document.documentElement.dataset.theme;
    mockMatchMedia();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it('defaults to system preference', () => {
    renderToggle();

    expect(
      screen.getByRole('combobox', {
        name: 'Appearance preference',
      })
    ).toHaveValue('system');
  });

  it('switches to dark mode and saves the preference', async () => {
    renderToggle();

    fireEvent.change(
      screen.getByRole('combobox'),
      { target: { value: 'dark' } }
    );

    await waitFor(() => {
      expect(document.documentElement)
        .toHaveAttribute('data-theme', 'dark');
    });

    expect(localStorage.getItem('careerscope-theme'))
      .toBe('dark');
  });

  it('restores a saved light preference', async () => {
    localStorage.setItem('careerscope-theme', 'light');
    darkMode = true;

    renderToggle();

    expect(screen.getByRole('combobox'))
      .toHaveValue('light');

    await waitFor(() => {
      expect(document.documentElement)
        .toHaveAttribute('data-theme', 'light');
    });
  });

  it('follows system changes when set to system', async () => {
    renderToggle();

    await waitFor(() => {
      expect(document.documentElement)
        .toHaveAttribute('data-theme', 'light');
    });

    fireEvent.change(
      screen.getByRole('combobox'),
      { target: { value: 'dark' } }
    );

    fireEvent.change(
      screen.getByRole('combobox'),
      { target: { value: 'system' } }
    );

    await waitFor(() => {
      expect(document.documentElement)
        .toHaveAttribute('data-theme', 'light');
    });

    fireEvent.change(
      screen.getByRole('combobox'),
      { target: { value: 'light' } }
    );

    changeSystemTheme(true);

    fireEvent.change(
      screen.getByRole('combobox'),
      { target: { value: 'system' } }
    );

    await waitFor(() => {
      expect(document.documentElement)
        .toHaveAttribute('data-theme', 'dark');
    });
  });
  
  it('initializes in dark mode when the system prefers dark', async () => {
    darkMode = true;

    renderToggle();

    expect(screen.getByRole('combobox')).toHaveValue('system');

    await waitFor(() => {
      expect(document.documentElement)
        .toHaveAttribute('data-theme', 'dark');
    });
  });
  
  it('cycles themes using the mobile button', () => {
    renderToggle();

    const button = screen.getByRole('button', {
      name: /appearance: system/i,
    });

    fireEvent.click(button);

    expect(localStorage.getItem('careerscope-theme'))
      .toBe('light');

    fireEvent.click(button);

    expect(localStorage.getItem('careerscope-theme'))
      .toBe('dark');

    fireEvent.click(button);

    expect(localStorage.getItem('careerscope-theme'))
      .toBe('system');
  });
});
