import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../authentication/authContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';

export default function Settings() {
    const { updatePassword } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true); // Set loading to true when starting the update process

        try {
            // Update password
            await updatePassword(currentPassword, newPassword);
            setLoading(false); // Set loading to false after updating the password
            navigate('/');
        } catch (error) {
            console.error('Error updating password:', error.message);
            setError(error.message);
            setLoading(false); // Set loading to false if there is an error
        }
    };

    return (
        <Container component="main" maxWidth="sm" sx={{ padding: 1 }}>
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '50vh',
                }}
            >
                {loading ? ( // Render loading indicator if loading is true
                    <CircularProgress sx={{ mt: 1 }} />
                ) : (
                    <>
                        <Typography component="h1" variant="h5">
                            UPDATE PASSWORD
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2, display: 'flex', flexDirection: 'column' }}>
                            <TextField
                                margin="normal"
                                required
                                id="currentPassword"
                                label="Current Password"
                                name="current-password"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                id="new password"
                                label="New Password"
                                name="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                id="confirm new password"
                                label="Confirm New Password"
                                name="confirm-new-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {error && <Typography color="error">{error}</Typography>}
                            <Button
                                type="submit"
                                onClick={handleSubmit} // Call handleSubmit on button click
                                variant="contained"
                            >
                                UPDATE
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Container>
    );
}
