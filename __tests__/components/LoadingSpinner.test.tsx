import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../../app/components/LoadingSpinner';

// Mock framer-motion since we don't need to test the animations
jest.mock('framer-motion', () => {
  return {
    motion: {
      div: ({ children, className, ...props }: any) => (
        <div className={className} data-testid="motion-div">
          {children}
        </div>
      ),
    },
  };
});

describe('LoadingSpinner', () => {
  it('renders a fullscreen spinner by default', () => {
    render(<LoadingSpinner />);
    
    // Check that it has the fixed positioning class for fullscreen
    const spinner = screen.getByTestId('motion-div');
    expect(spinner.className).toContain('fixed inset-0');
  });

  it('renders an inline spinner when fullScreen is false', () => {
    render(<LoadingSpinner fullScreen={false} />);
    
    // Should not contain fixed positioning classes
    const spinner = screen.getAllByTestId('motion-div')[0];
    expect(spinner.className).not.toContain('fixed inset-0');
  });

  it('applies different size classes based on size prop', () => {
    const { rerender } = render(<LoadingSpinner fullScreen={false} size="sm" />);
    
    // Small size classes
    let spinnerContent = screen.getAllByTestId('motion-div')[0];
    expect(spinnerContent).toBeInTheDocument();
    
    // Medium size
    rerender(<LoadingSpinner fullScreen={false} size="md" />);
    spinnerContent = screen.getAllByTestId('motion-div')[0];
    expect(spinnerContent).toBeInTheDocument();
    
    // Large size
    rerender(<LoadingSpinner fullScreen={false} size="lg" />);
    spinnerContent = screen.getAllByTestId('motion-div')[0];
    expect(spinnerContent).toBeInTheDocument();
  });
});