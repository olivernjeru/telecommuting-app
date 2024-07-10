import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import { firestoredb } from '../../../firebase';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../authContext/AuthContext';

export default function SignUp() {
    const { signup } = useAuth(); // Get the signup function from AuthContext

    // Validate if username is a correct email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [userInput, setUserInput] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        registrationNo: '',
        nationalId: '',
        phoneNumber: '',
        picture: null,
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        registrationNo: '',
        nationalId: '',
        phoneNumber: '',
        picture: '',
    });

    const [loading, setLoading] = useState(false);

    const handleInputChange = (event) => {
        const { name, value, files } = event.target;

        if (name === 'picture') {
            const file = files[0];
            if (file && file.size > 5 * 1024 * 1024) { // Check if the file size exceeds 5MB
                setErrors({ ...errors, picture: 'File size should not exceed 5MB' });
                return;
            } else {
                setErrors({ ...errors, picture: '' });
                setUserInput({ ...userInput, [name]: file });
            }
        } else {
            setUserInput({ ...userInput, [name]: value });
            validateInput(name, value);
        }
    };

    const validateInput = (name, value) => {
        let errorMessage = '';

        switch (name) {
            case 'email':
                errorMessage = emailRegex.test(value)
                    ? ''
                    : 'Please enter a valid email address.';
                break;
            case 'password':
                errorMessage = isValidPassword(value)
                    ? ''
                    : 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
                break;
            case 'confirmPassword':
                errorMessage =
                    value === userInput.password ? '' : 'Passwords do not match.';
                break;
            case 'firstName':
                errorMessage = value ? '' : 'Please enter your first name.';
                break;
            case 'lastName':
                errorMessage = value ? '' : 'Please enter your last name.';
                break;
            case 'registrationNo':
                errorMessage =
                    value && (value.startsWith("D") || value.startsWith("P")) && value.length >= 10
                        ? ''
                        : 'Registration number must start with D or P and have at least 10 characters.';
                break;
            case 'nationalId':
                errorMessage =
                    value && /^\d{1,8}$/.test(value)
                        ? ''
                        : 'Please enter a valid national identification number.';
                break;
            case 'phoneNumber':
                errorMessage = value ? '' : 'Please enter your phone number.';
                break;
            default:
                break;
        }

        setErrors({
            ...errors,
            [name]: errorMessage,
        });
    };

    const signUp = async (event) => {
        event.preventDefault();
        setLoading(true);

        // Check if there are any validation errors
        if (Object.values(errors).some((error) => error !== '')) {
            setLoading(false);
            return;
        }

        try {
            // Check if the email already exists
            const emailQuery = query(collection(firestoredb, 'user-details'), where('email', '==', userInput.email));
            const emailSnapshot = await getDocs(emailQuery);

            if (!emailSnapshot.empty) {
                setErrors((prevState) => ({ ...prevState, email: 'Email address already exists.' }));
                return;
            }

            // Check if the National Identification Number already exists
            const nationalIdQuery = query(collection(firestoredb, 'user-details'), where('nationalId', '==', userInput.nationalId));
            const nationalIdSnapshot = await getDocs(nationalIdQuery);

            if (!nationalIdSnapshot.empty) {
                setErrors((prevState) => ({ ...prevState, nationalId: 'National Identification Number already exists.' }));
                return;
            }

            // Check if the Trading Number already exists
            const registrationNoQuery = query(collection(firestoredb, 'user-details'), where('registrationNo', '==', userInput.registrationNo));
            const registrationNoSnapshot = await getDocs(registrationNoQuery);

            if (!registrationNoSnapshot.empty) {
                setErrors((prevState) => ({ ...prevState, registrationNo: 'Registration Number already exists.' }));
                return;
            }

            // If the email, username, KRA PIN, National Identification Number, and Trading Number exist, proceed with user registration
            // Call the signup function from AuthContext
            await signup(userInput.email, userInput.password, userInput);
            // Navigate or perform any other action after successful signup
        } catch (error) {
            // Handle authentication errors
            if (error.code === 'auth/email-already-in-use') {
                setErrors((prevState) => ({ ...prevState, email: 'Email address is already in use.' }));
            } else if (error.code === '400') {
                // Handle bad request error
                console.error('Bad Request:', error.message);
                setErrors((prevState) => ({ ...prevState, general: 'An error occurred. Please try again later.' }));
            } else {
                console.error(error);
            }
        } finally {
            setLoading(false);
        }
    };

    // Password validation function
    const isValidPassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    return (
            <Container component="main" maxWidth="sm">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        paddingTop: 2,
                        paddingRight: 8,
                        paddingBottom: 2,
                        paddingLeft: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '70vh',
                    }}
                >
                    {loading ? ( // Render loading indicator if loading is true
                        <CircularProgress />
                    ) : (
                        <>
                            <Typography component="h1" variant="h5">
                                CREATE AN ACCOUNT
                            </Typography>
                            <Box component="form" onSubmit={signUp} noValidate sx={{ mt: 1 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="firstName"
                                        label="First Name"
                                        autoFocus
                                        value={userInput.firstName}
                                        onChange={handleInputChange}
                                        error={!!errors.firstName}
                                        helperText={errors.firstName}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="lastName"
                                        label="Last Name"
                                        value={userInput.lastName}
                                        onChange={handleInputChange}
                                        error={!!errors.lastName}
                                        helperText={errors.lastName}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="email"
                                        label="Email Address"
                                        type="email"
                                        autoComplete="email"
                                        value={userInput.email}
                                        onChange={handleInputChange}
                                        error={!!errors.email}
                                        helperText={errors.email}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        autoComplete="new-password"
                                        value={userInput.password}
                                        onChange={handleInputChange}
                                        error={!!errors.password}
                                        helperText={errors.password}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        type="password"
                                        autoComplete="new-password"
                                        value={userInput.confirmPassword}
                                        onChange={handleInputChange}
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="registrationNo"
                                        label="Registration Number"
                                        value={userInput.registrationNo}
                                        onChange={handleInputChange}
                                        error={!!errors.registrationNo}
                                        helperText={errors.registrationNo}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="nationalId"
                                        label="National Identification Number"
                                        value={userInput.nationalId}
                                        onChange={handleInputChange}
                                        error={!!errors.nationalId}
                                        helperText={errors.nationalId}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="phoneNumber"
                                        label="Phone Number"
                                        value={userInput.phoneNumber}
                                        onChange={handleInputChange}
                                        error={!!errors.phoneNumber}
                                        helperText={errors.phoneNumber}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <input
                                            accept="image/*"
                                            id="contained-button-file"
                                            multiple
                                            type="file"
                                            name="picture"
                                            onChange={handleInputChange}
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor="contained-button-file">
                                            <Button variant="contained" component="span" fullWidth>
                                                Upload Picture
                                            </Button>
                                        </label>
                                        {errors.picture && (
                                            <Typography color="error" variant="body2">
                                                {errors.picture}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    SUBMIT
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Container>
    );
}
