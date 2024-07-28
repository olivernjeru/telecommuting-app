import React, { useState } from 'react';
import { Button, Container, Typography, Box, Paper } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../utilities/style/Theme';
import { login } from '../Auth';
import EmailValidator from '../inputValidators/EmailValidator';
import PasswordValidator from '../inputValidators/PasswordValidator';

export default function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        // Validate email and password before attempting to login
        if (!email) {
            setEmailError('Email is required');
            return;
        }
        if (!password) {
            setPasswordError('Password is required');
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
        } catch (error) {
            setEmailError(error.message);
            setPasswordError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        handleLogin();
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
                            Login
                        </Typography>
                        <form onSubmit={handleSubmit}>
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
                            <Button
                                type='submit'
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                fullWidth
                                sx={{ mt: 2, mb: 2 }}
                            >
                                {loading ? 'Processing...' : 'Login'}
                            </Button>
                        </form>
                        <Button
                            onClick={() => window.location.href = '/register'}
                            fullWidth
                            sx={{ mt: 1 }}
                        >
                            Don't have an account? Register
                        </Button>
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    );
}
