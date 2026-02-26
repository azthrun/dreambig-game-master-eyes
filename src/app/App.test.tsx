import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

describe('App', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders speed tiles button first on menu', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'Speed Tiles' })).toBeInTheDocument();
    expect(screen.getByText('Choose a game mode to continue.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '3x3' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '8x8' })).not.toBeInTheDocument();
  });

  it('enters countdown after selecting board', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Speed Tiles' }));
    await user.click(screen.getByRole('button', { name: '3x3' }));
    expect(screen.getByText('Get Ready')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('returns from board sizes to speed tiles with back button', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Speed Tiles' }));
    expect(screen.getByText('Choose a board size to start the round.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3x3' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('button', { name: 'Speed Tiles' })).toBeInTheDocument();
    expect(screen.getByText('Choose a game mode to continue.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '3x3' })).not.toBeInTheDocument();
  });

  it('aborts in-progress game back to menu immediately', async () => {
    vi.useFakeTimers();
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Speed Tiles' }));
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

    expect(screen.getByRole('button', { name: 'Quit' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Quit' }));

    expect(screen.getByRole('button', { name: 'Speed Tiles' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '3x3' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '8x8' })).not.toBeInTheDocument();
  });
});
