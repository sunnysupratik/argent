import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/utils/test-utils';
import { InteractiveHoverButton } from '../ui/interactive-hover-button';
import userEvent from '@testing-library/user-event';
import { ArrowRight } from 'lucide-react';

describe('InteractiveHoverButton', () => {
  it('should render with default props', () => {
    render(<InteractiveHoverButton />);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Button')).toBeInTheDocument();
  });

  it('should render with custom text', () => {
    render(<InteractiveHoverButton text="Custom Button" />);
    
    expect(screen.getByText('Custom Button')).toBeInTheDocument();
  });

  it('should render with custom icon', () => {
    render(<InteractiveHoverButton text="Test" icon={<ArrowRight data-testid="custom-icon" />} />);
    
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('should apply black variant styles by default', () => {
    render(<InteractiveHoverButton text="Test" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-gray-800', 'bg-black', 'text-white');
  });

  it('should apply white variant styles', () => {
    render(<InteractiveHoverButton text="Test" variant="white" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-gray-300', 'bg-white', 'text-gray-900');
  });

  it('should apply blue variant styles', () => {
    render(<InteractiveHoverButton text="Test" variant="blue" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-accent-blue', 'bg-accent-blue', 'text-white');
  });

  it('should handle click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<InteractiveHoverButton text="Click me" onClick={handleClick} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<InteractiveHoverButton text="Disabled" disabled />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should apply custom className', () => {
    render(<InteractiveHoverButton text="Test" className="custom-class" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should forward ref correctly', () => {
    const ref = vi.fn();
    render(<InteractiveHoverButton text="Test" ref={ref} />);
    
    expect(ref).toHaveBeenCalled();
  });

  it('should show both text instances (visible and hover state)', () => {
    render(<InteractiveHoverButton text="Hover Test" />);
    
    const textElements = screen.getAllByText('Hover Test');
    expect(textElements).toHaveLength(2); // One visible, one for hover state
  });

  it('should handle form submission when type is submit', async () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());
    const user = userEvent.setup();
    
    render(
      <form onSubmit={handleSubmit}>
        <InteractiveHoverButton text="Submit" type="submit" />
      </form>
    );
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});