import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

describe('Button', () => {
  it('renders with button semantics', () => {
    render(<Button>Search careers</Button>);

    expect(screen.getByRole('button', { name: 'Search careers' })).toHaveAttribute(
      'type',
      'button'
    );
  });

  it('handles clicks', () => {
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Search</Button>);

    fireEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not activate when disabled', () => {
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick}>
        Continue
      </Button>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies visual variants', () => {
    render(<Button variant="secondary">Cancel</Button>);

    expect(screen.getByRole('button')).toHaveClass('ui-button--secondary');
  });
});

describe('Card', () => {
  it('supports semantic HTML elements', () => {
    render(
      <Card as="article" elevated>
        Career information
      </Card>
    );

    expect(screen.getByRole('article')).toHaveClass('ui-card--elevated');
  });
});

describe('Badge', () => {
  it('renders meaningful status text', () => {
    render(<Badge variant="success">Connected</Badge>);

    expect(screen.getByText('Connected')).toHaveClass('ui-badge--success');
  });
});
