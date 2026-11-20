import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import { sameShape, useLocalState } from '../lib/hooks.js';

function Probe() {
  const [state] = useLocalState('test.key.v1', { level: 0, solved: {} });
  return <p>level {state.level}</p>;
}

describe('tolerant stored state', () => {
  beforeEach(() => window.localStorage.clear());

  it('falls back to the default when the stored shape is wrong', () => {
    window.localStorage.setItem('test.key.v1', JSON.stringify('oops'));
    render(<Probe />);
    expect(screen.getByText('level 0')).toBeTruthy();
  });

  it('keeps a stored value with the right shape', () => {
    window.localStorage.setItem('test.key.v1', JSON.stringify({ level: 2, solved: {} }));
    render(<Probe />);
    expect(screen.getByText('level 2')).toBeTruthy();
  });

  it('checks kinds and keys', () => {
    expect(sameShape([1], [])).toBe(true);
    expect(sameShape({}, [])).toBe(false);
    expect(sameShape({ a: 1 }, {})).toBe(true);
    expect(sameShape(null, {})).toBe(false);
  });
});

describe('ErrorBoundary', () => {
  it('shows a fallback with a link home when a child throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const Boom = () => {
      throw new Error('boom');
    };
    render(
      <ErrorBoundary resetKey="x">
        <Boom />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByText('Go to the home page').getAttribute('href')).toBe('#home');
  });
});
