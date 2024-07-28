import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmailValidator from '../inputValidators/EmailValidator';

describe('EmailValidator Component', () => {
  let setEmailMock;
  let setErrorMock;

  beforeEach(() => {
    setEmailMock = jest.fn();
    setErrorMock = jest.fn();
  });

  test('renders email input field', () => {
    render(<EmailValidator email="" setEmail={setEmailMock} error={null} setError={setErrorMock} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  test('calls setEmail and setError on valid email input', () => {
    render(<EmailValidator email="" setEmail={setEmailMock} error={null} setError={setErrorMock} />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });

    expect(setEmailMock).toHaveBeenCalledWith('test@example.com');
    expect(setErrorMock).toHaveBeenCalledWith(null);
  });

  test('calls setEmail and setError on invalid email input', () => {
    render(<EmailValidator email="" setEmail={setEmailMock} error={null} setError={setErrorMock} />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });

    expect(setEmailMock).toHaveBeenCalledWith('invalid-email');
    expect(setErrorMock).toHaveBeenCalledWith('Invalid email');
  });

  test('displays error message on invalid email', () => {
    render(<EmailValidator email="invalid-email" setEmail={setEmailMock} error="Invalid email" setError={setErrorMock} />);

    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });

  test('does not display error message on valid email', () => {
    render(<EmailValidator email="test@example.com" setEmail={setEmailMock} error={null} setError={setErrorMock} />);

    expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
  });
});
