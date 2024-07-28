import React, { useState } from 'react';
import { Button, Container, Typography, Select, MenuItem, FormControl, InputLabel, Box, Paper } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../utilities/style/Theme';
import { register } from '../Auth';
import EmailValidator from '../inputValidators/EmailValidator';
import PasswordValidator from '../inputValidators/PasswordValidator';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setLoading(true);
        try {
            await register(email, password, role);
        } catch (error) {
            // Handle registration error, this is a general error state.
            setEmailError(error.message); // You can set general error message to emailError or handle separately.
            setPasswordError(error.message); // You can set general error message to passwordError or handle separately.
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundImage: 'url("https://example.com/diabetes-bg-image.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <Container maxWidth="sm">
                    <Paper elevation={3} sx={{ padding: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                        <Typography
                            variant="h4"
                            align="center"
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                fontFamily: '"Arial Black", "Helvetica", sans-serif',
                                backgroundImage: 'linear-gradient(45deg, #ff0000, #0000ff)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                                marginBottom: 3,
                            }}
                        >
                            Diabetes Telecommuting App
                        </Typography>
                        <Typography variant="h5" align="center" gutterBottom>
                            Register
                        </Typography>
                        <EmailValidator
                            email={email}
                            setEmail={setEmail}
                            error={emailError}
                            setError={setEmailError}
                        />
                        <PasswordValidator
                            password={password}
                            setPassword={setPassword}
                            error={passwordError}
                            setError={setPasswordError}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <MenuItem value="doctor">Doctor</MenuItem>
                                <MenuItem value="patient">Patient</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleRegister}
                            disabled={loading}
                            fullWidth
                            sx={{ mt: 2, mb: 2 }}
                        >
                            {loading ? 'Processing...' : 'Register'}
                        </Button>
                        <Button
                            onClick={() => window.location.href = '/login'}
                            fullWidth
                            sx={{ mt: 1 }}
                        >
                            Already have an account? Login
                        </Button>
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    );
}
