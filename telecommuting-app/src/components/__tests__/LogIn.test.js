import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import LogIn from '../logIn/LogIn';
import { login } from '../Auth';

// Mock the login function
jest.mock('../Auth', () => ({
    login: jest.fn(),
}));

describe('LogIn Component Test', () => {
    test('should not call the login function if email and password fields are empty', async () => {
        await act(async () => {
            render(<LogIn />);
        });

        // Find the login button
        const loginButton = screen.getByRole('button', { name: /login/i });

        // Click the login button without filling in the fields
        await act(async () => {
            fireEvent.click(loginButton);
        });

        // Expect login function not to be called
        expect(login).not.toHaveBeenCalled();
    });

    test('should call the login function with email and password when the login button is clicked', async () => {
        await act(async () => {
            render(<LogIn />);
        });

        // Find the email and password input fields
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);

        // Simulate user input
        await act(async () => {
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
        });

        // Find the login button
        const loginButton = screen.getByRole('button', { name: /login/i });

        // Click the login button
        await act(async () => {
            fireEvent.click(loginButton);
        });

        // Expect login function to be called with the correct values
        expect(login).toHaveBeenCalledWith('test@example.com', 'password123');
    });
});
