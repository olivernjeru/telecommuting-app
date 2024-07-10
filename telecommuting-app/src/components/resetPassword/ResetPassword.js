import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { auth } from '../../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState('');

    const resetPassword = async (event) => {
        event.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            setSuccess('Password reset email sent!');
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    };
    return (
        <ThemeProvider>
            <Container component="main" maxWidth="sm">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        paddingTop: 4,
                        paddingRight: 8,
                        paddingBottom: 4,
                        paddingLeft: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        RESET PASSWORD
                    </Typography>
                    <Box component="form" onSubmit={resetPassword} noValidate sx={{ mt: 2 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            type='email'
                            autoFocus
                            value={email} onChange={(e) => setEmail(e.target.value)}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Button
                                    size="large"
                                    variant="contained"
                                    fullWidth
                                    component={RouterLink}
                                    to="/login"
                                    sx={{ mt: 4, mb: 2 }}
                                >
                                    BACK
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    type="submit"
                                    size="large"
                                    variant="contained"
                                    fullWidth
                                    sx={{ mt: 4, mb: 2 }}
                                >
                                    RESET
                                </Button>
                            </Grid>
                            {success && <Typography>{success}</Typography>}
                                {error && <Typography>{error}</Typography>}
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
