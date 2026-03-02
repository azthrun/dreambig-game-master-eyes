import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

describe('App', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders root menu with both game modes', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'Speed Tiles' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Number Flash' })).toBeInTheDocument();
  });

  it('enters speed tiles submenu and returns with back button', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Speed Tiles' }));
    expect(screen.getByText('Choose a board size to start the round.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3x3' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('button', { name: 'Speed Tiles' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Number Flash' })).toBeInTheDocument();
  });

  it('plays number flash incorrect path and shows correct sequence', async () => {
    vi.useFakeTimers();
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Number Flash' }));
    fireEvent.click(screen.getByRole('button', { name: '4 Numbers' }));

    act(() => {
      vi.runOnlyPendingTimers();
    });
    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(screen.getByLabelText('Enter the sequence')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Enter the sequence'), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByText('Not Quite')).toBeInTheDocument();
    expect(screen.getByText(/Correct sequence:/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play Again' })).toBeInTheDocument();
  });
});
