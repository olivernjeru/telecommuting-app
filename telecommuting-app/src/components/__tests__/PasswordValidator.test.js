import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PasswordValidator from '../inputValidators/PasswordValidator';

describe('PasswordValidator Component', () => {
    let setPasswordMock;
    let setErrorMock;

    beforeEach(() => {
        setPasswordMock = jest.fn();
        setErrorMock = jest.fn();
    });

    test('renders password input field', () => {
        render(<PasswordValidator password="" setPassword={setPasswordMock} error={null} setError={setErrorMock} />);
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    test('calls setPassword and setError on valid password input', () => {
        render(<PasswordValidator password="" setPassword={setPasswordMock} error={null} setError={setErrorMock} />);

        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Valid123!' } });

        expect(setPasswordMock).toHaveBeenCalledWith('Valid123!');
        expect(setErrorMock).toHaveBeenCalledWith(null);
    });

    test('calls setPassword and setError on invalid password input', () => {
        render(<PasswordValidator password="" setPassword={setPasswordMock} error={null} setError={setErrorMock} />);

        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'short' } });

        expect(setPasswordMock).toHaveBeenCalledWith('short');
        expect(setErrorMock).toHaveBeenCalledWith('Password must be at least 8 characters long and include uppercase, lowercase, numeric, and special characters.');
    });

    test('displays error message on invalid password', () => {
        render(<PasswordValidator password="short" setPassword={setPasswordMock} error="Password must be at least 8 characters long and include uppercase, lowercase, numeric, and special characters." setError={setErrorMock} />);

        expect(screen.getByText(/password must be at least 8 characters long and include uppercase, lowercase, numeric, and special characters./i)).toBeInTheDocument();
    });

    test('does not display error message on valid password', () => {
        render(<PasswordValidator password="Valid123!" setPassword={setPasswordMock} error={null} setError={setErrorMock} />);

        expect(screen.queryByText(/password must be at least 8 characters long and include uppercase, lowercase, numeric, and special characters./i)).not.toBeInTheDocument();
    });
});
