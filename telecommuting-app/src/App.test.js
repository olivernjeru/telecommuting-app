import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

// Mock the necessary functions and components if required
jest.mock('./components/Auth', () => ({
  onAuthChange: (callback) => callback({ email: 'test@example.com' }, 'patient'),
  logout: jest.fn(),
}));

test('renders login page when user is not authenticated', () => {
  render(
    <Router>
      <App
        user={{ email: 'test@example.com' }}
        userRole="patient"
        selectedRoom={null}
        setSelectedRoom={() => {}}
        activeTab={0}
        setActiveTab={() => {}}
      />
    </Router>
  );
});
