import 'setimmediate';
import { render, screen, fireEvent } from '@testing-library/react';
import Register from '../register/Register'; // Adjust the import according to your file structure
import '@testing-library/jest-dom';

test('should display the input labels and not be empty when the register button is pressed', () => {
  render(<Register />);

  // Check if the email input is rendered
  const emailInput = screen.getByLabelText(/email/i);
  expect(emailInput).toBeInTheDocument();

  // Check if the password input is rendered
  const passwordInput = screen.getByLabelText(/password/i);
  expect(passwordInput).toBeInTheDocument();

  // Check if the role dropdown is rendered
  const roleDropdown = screen.getByRole('combobox');
  expect(roleDropdown).toBeInTheDocument();

  // Simulate user entering data
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  // Find the "Register" button and simulate a click
  const registerButton = screen.getByRole('button', { name: /register/i });
  fireEvent.click(registerButton);

  // Assertions to check if the inputs are not empty
  expect(emailInput.value).toBe('test@example.com');
  expect(passwordInput.value).toBe('password123');
});
