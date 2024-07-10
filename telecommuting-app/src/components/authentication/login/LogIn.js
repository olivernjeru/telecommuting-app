import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../authContext/AuthContext';

export default function LogIn() {
  const { login } = useAuth(); // Access the login function from the authentication context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const logIn = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading to true when submitting the form

    // Clear previous error messages
    setEmailError('');
    setPasswordError('');

    // Form validation
    if (!email.trim()) {
      setEmailError('Enter your email.');
      setLoading(false); // Set loading to false if validation fails
      return;
    } else if (!isValidEmail(email.trim())) {
      setEmailError('Enter a valid email address.');
      setLoading(false); // Set loading to false if validation fails
      return;
    } else if (!password.trim()) {
      setPasswordError('Enter your password.');
      setLoading(false); // Set loading to false if validation fails
      return;
    }

    try {
      // Call the login function from the authentication context
      await login(email, password);
    } catch (error) {
      console.error('Login Error:', error.message);
      if (error.code === 'auth/user-not-found') {
        setEmailError('User not found.');
      } else {
        setPasswordError('Invalid email or password.');
      }
    } finally {
      setLoading(false); // Set loading to false after login attempt
    }
  };

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
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
          justifyContent: 'center',
          height: '50vh',
        }}
      >
        {loading ? ( // Render loading indicator if loading is true
          <CircularProgress sx={{ mt: 3 }} />
        ) : (
          <>
            <Typography component="h1" variant="h5">
              LOG IN
            </Typography>
            <Box component="form" onSubmit={logIn} noValidate sx={{ mt: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoFocus
                error={!!emailError}
                helperText={emailError}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                error={!!passwordError}
                helperText={passwordError}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Log In
              </Button>
            </Box>
          </>
        )}
        {/* Conditionally render forgot password and sign up links */}
        {!loading && (
          <Grid container>
            <Grid item xs>
              <Link href="/reset-password" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/sign-up" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
}
