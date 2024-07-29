import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Chat from '../Chat';

describe('Chat Component', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  test('renders chat component correctly', () => {
    render(<Chat roomId="123" />);

    expect(screen.getByText('Chat Room')).toBeInTheDocument();
    expect(screen.getByLabelText('Type a message to send')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });

  test('shows validation error if message is empty and send button is clicked', async () => {
    render(<Chat roomId="123" />);

    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    expect(await screen.findByText('Please type in a message to send')).toBeInTheDocument();
  });
});
