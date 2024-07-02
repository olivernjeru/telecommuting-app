import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const UserProfile = () => {
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchProfile = async () => {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setName(userData.name || '');
        setSpecialization(userData.specialization || '');
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleUpdate = async () => {
    await updateDoc(doc(db, 'users', user.uid), { name, specialization });
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container>
      <Typography variant="h4">User Profile</Typography>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Specialization"
        value={specialization}
        onChange={(e) => setSpecialization(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleUpdate}>
        Update Profile
      </Button>
    </Container>
  );
};

export default UserProfile;
