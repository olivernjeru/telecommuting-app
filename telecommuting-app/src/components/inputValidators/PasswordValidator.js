import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const PasswordValidator = ({ password, setPassword, error, setError }) => {
    const validatePassword = (value) => {
        setPassword(value);

        const hasMinLength = value.length >= 8;
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

        if (!hasMinLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
            setError(
                'Password must be at least 8 characters long and include uppercase, lowercase, numeric, and special characters.'
            );
        } else {
            setError(null);
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        validatePassword(value);
    };

    return (
        <div>
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error}
                inputProps={{ 'aria-label': 'password' }}
            />
        </div>
    );
};

export default PasswordValidator;
