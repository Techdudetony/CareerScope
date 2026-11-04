import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import MotionProvider from '../components/motion/MotionProvider';
import Reveal from '../components/motion/Reveal';

function renderReveal(props = {}) {
  return render(
    <MotionProvider>
      <Reveal {...props}>
        <h2>Career opportunities</h2>
      </Reveal>
    </MotionProvider>
  );
}

describe('Reveal', () => {
  it('renders its children', () => {
    renderReveal();

    expect(
      screen.getByRole('heading', {
        name: 'Career opportunities',
      })
    ).toBeInTheDocument();
  });

  it('supports animation variants', () => {
    renderReveal({ variant: 'scaleIn' });

    expect(
      screen.getByRole('heading', {
        name: 'Career opportunities',
      })
    ).toBeInTheDocument();
  });

  it('supports custom class names', () => {
    const { container } = renderReveal({
      className: 'custom-reveal',
    });

    expect(container.querySelector('.custom-reveal')).toBeInTheDocument();
  });

  it('falls back safely for unknown variants', () => {
    renderReveal({ variant: 'unknown' });

    expect(
      screen.getByRole('heading', {
        name: 'Career opportunities',
      })
    ).toBeInTheDocument();
  });
});
