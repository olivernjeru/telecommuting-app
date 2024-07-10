import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress
import { useAuth } from '../authentication/authContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, Divider, TextField, Typography } from '@mui/material';

export default function Profile() {
    const { userData, updateProfilePicture, updateUserProfile } = useAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [selectedProfilePicture, setSelectedProfilePicture] = useState(null);
    const [loading, setLoading] = useState(false); // State for loading
    const [fileError, setFileError] = useState(''); // State for file size error
    const navigate = useNavigate();

    useEffect(() => {
        if (userData) {
            const fullName = userData.displayName || '';
            const [firstNameFromDisplayName, lastNameFromDisplayName] = fullName.split(' ');
            setFirstName(firstNameFromDisplayName || '');
            setLastName(lastNameFromDisplayName || '');
            setPhoneNumber(userData.phoneNumber || '');
            setProfilePicture(userData.profilePictureUrl || null);
        }
    }, [userData]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // Check if file size exceeds 5MB
                setFileError('File size should not exceed 5MB');
                return;
            } else {
                setFileError('');
            }
            setSelectedProfilePicture(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfilePicture(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = async () => {
        setLoading(true); // Set loading to true
        const displayName = `${firstName} ${lastName}`;
        await updateUserProfile(displayName, username, phoneNumber);
        if (selectedProfilePicture) {
            await updateProfilePicture(selectedProfilePicture);
            setSelectedProfilePicture(null); // Clear the selected file after upload
        }
        setLoading(false); // Set loading to false after completion
        navigate('/');
    };

    return (
        <Box sx={{ width: '100vw', height: '92.4vh', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 0 }}>
            {loading ? (
                <CircularProgress size={60} /> // Show CircularProgress when loading
            ) : (
                <>
                    {/* Render other components only when not loading */}
                    <Box>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            height: '92.4vh',
                            borderRadius: 0
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                backgroundColor: '#0A192F',
                                width: '40%',
                                height: '40%',
                            }}>
                                <Typography variant='h4' sx={{ textAlign: 'center' }}>Profile</Typography>
                                {profilePicture && (
                                    <img src={profilePicture} alt="Profile" style={{ width: 80, height: 80, borderRadius: '100%', marginTop: '2%' }} />
                                )}
                                {userData && <Typography variant="h6" sx={{ mt: "3%", mb: "15%" }}>{userData.displayName}</Typography>}
                                <Divider sx={{ backgroundColor: 'white', width: '100%' }} />
                                <input
                                    accept="image/*"
                                    id="upload-button"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="upload-button">
                                    <Button variant="outlined" component="span" sx={{ mt: '15%' }}>
                                        Upload Picture
                                    </Button>
                                </label>
                                {fileError && <Typography color="error" sx={{ mt: 2 }}>{fileError}</Typography>} {/* Show file size error */}
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                // backgroundColor: '#0A192F',
                                width: '50%',
                                height: '40%',
                                mr: 5
                            }}>
                                <Box sx={{
                                    mt: 3,
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <TextField
                                        margin="normal"
                                        required
                                        id="firstName"
                                        label="First Name"
                                        name="first-name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        sx={{ margin: 1 }}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        id="last-name"
                                        label="Last Name"
                                        name="last-name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        sx={{ margin: 1 }}
                                    />
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <TextField
                                        margin="normal"
                                        required
                                        id="username"
                                        label="Username"
                                        name="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        sx={{ margin: 1 }}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        id="phoneNumber"
                                        label="Phone Number"
                                        name="phoneNumber"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        sx={{ margin: 1 }}
                                    />
                                </Box>
                                <Divider sx={{ backgroundColor: 'white', width: '100%' }} />
                                <Button
                                    type="button"
                                    variant="contained"
                                    onClick={handleUpdateProfile}
                                    sx={{ mb: 2 }}
                                    disabled={loading} // Disable button when loading
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : "UPDATE"} {/* Show CircularProgress when loading */}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    )
}
