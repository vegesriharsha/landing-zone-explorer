import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Layout from '../components/Layout.jsx';

describe('Layout accessibility', () => {
  it('has a skip link that focuses main without changing the hash route', () => {
    window.location.hash = '#home';
    render(<Layout current="home">content</Layout>);
    const link = screen.getByText('Skip to content');
    fireEvent.click(link);
    expect(document.activeElement?.id).toBe('main-content');
    expect(window.location.hash).toBe('#home');
  });

  it('moves focus to main when the page changes, not on first render', () => {
    const { rerender } = render(<Layout current="home">a</Layout>);
    expect(document.activeElement?.id).not.toBe('main-content');
    rerender(<Layout current="journey">b</Layout>);
    expect(document.activeElement?.id).toBe('main-content');
  });
});
