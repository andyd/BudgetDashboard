import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SourceCitation } from '../SourceCitation';

describe('SourceCitation', () => {
  it('renders source name and link', () => {
    render(
      <SourceCitation
        source="USAspending.gov"
        url="https://www.usaspending.gov/"
      />
    );

    const link = screen.getByRole('link', { name: /USAspending\.gov/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://www.usaspending.gov/');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders with date when provided', () => {
    render(
      <SourceCitation
        source="Treasury Department"
        url="https://fiscaldata.treasury.gov/"
        date="January 2025"
      />
    );

    expect(screen.getByText(/Last updated January 2025/i)).toBeInTheDocument();
  });

  it('does not render date when not provided', () => {
    render(
      <SourceCitation
        source="NASA"
        url="https://www.nasa.gov/"
      />
    );

    expect(screen.queryByText(/Last updated/i)).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <SourceCitation
        source="Example"
        url="https://example.com"
        className="custom-class"
      />
    );

    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('custom-class');
  });

  it('maintains default classes with custom className', () => {
    const { container } = render(
      <SourceCitation
        source="Example"
        url="https://example.com"
        className="justify-end"
      />
    );

    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('justify-end');
    expect(element).toHaveClass('flex');
    expect(element).toHaveClass('items-center');
  });
});
