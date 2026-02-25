import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

describe('App', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders board size options on menu', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: '3x3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '8x8' })).toBeInTheDocument();
  });

  it('enters countdown after selecting board', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: '3x3' }));
    expect(screen.getByText('Get Ready')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('aborts in-progress game back to menu immediately', async () => {
    vi.useFakeTimers();
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '3x3' }));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByRole('button', { name: 'Quick' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Quick' }));

    expect(screen.getByRole('button', { name: '3x3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '8x8' })).toBeInTheDocument();
  });
});
