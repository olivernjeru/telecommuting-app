import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import Chat from '../Chat';
import { db } from '../../firebase';

// Mock Firebase methods
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: { email: 'testuser@example.com' },
  })),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(() => ({})),
  addDoc: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  onSnapshot: jest.fn(),
}));

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

  test('sends a message when send button is clicked', async () => {
    render(<Chat roomId="123" />);

    fireEvent.change(screen.getByLabelText('Type a message to send'), { target: { value: 'Hello' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledWith(
        collection(db, `rooms/123/messages`),
        expect.objectContaining({
          text: 'Hello',
          user: 'testuser@example.com',
        })
      );
    });
  });

  test('scrolls to the bottom when a new message is added', async () => {
    const mockScrollTo = jest.fn();
    HTMLElement.prototype.scrollTo = mockScrollTo;

    render(<Chat roomId="123" />);

    onSnapshot.mockImplementationOnce((q, callback) => {
      callback({
        docs: [
          { id: '1', data: () => ({ text: 'Old message', user: 'testuser@example.com' }) },
          { id: '2', data: () => ({ text: 'New message', user: 'testuser@example.com' }) },
        ],
      });
      return () => {};
    });

    await waitFor(() => {
      expect(mockScrollTo).toHaveBeenCalledWith({
        top: expect.any(Number),
        behavior: 'smooth',
      });
    });
  });

  test('handles Enter key to send message', async () => {
    render(<Chat roomId="123" />);

    fireEvent.change(screen.getByLabelText('Type a message to send'), { target: { value: 'Hello' } });
    fireEvent.keyDown(screen.getByLabelText('Type a message to send'), { key: 'Enter', code: 'Enter', charCode: 13 });

    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledWith(
        collection(db, `rooms/123/messages`),
        expect.objectContaining({
          text: 'Hello',
          user: 'testuser@example.com',
        })
      );
    });
  });
});
