import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '../../test/utils/test-utils';
import { Button } from './Button';
import { Mail } from 'lucide-react';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    // @ts-ignore
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders icon when provided', () => {
    render(<Button icon={Mail}>Email</Button>);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByText('Submit')).toBeInTheDocument();
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('applies disabled state correctly', () => {
    render(<Button disabled>Submit</Button>);
    expect(screen.getByText('Submit')).toHaveAttribute('disabled');
  });

  it('applies full width class when specified', () => {
    const { container } = render(<Button fullWidth>Submit</Button>);
    expect(container.firstChild).toHaveClass('w-full');
  });
});