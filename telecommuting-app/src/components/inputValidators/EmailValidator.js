import React from 'react';
import { TextField } from '@mui/material';

const EmailValidator = ({ email, setEmail, error, setError }) => {
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      setError(null);
    } else {
      setError('Invalid email');
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  return (
    <div>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        margin="normal"
        error={!!error}
        helperText={error}
        inputProps={{ 'aria-label': 'email' }}
      />
    </div>
  );
};

export default EmailValidator;
