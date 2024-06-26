import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import Auth from './components/Auth';
import Chat from './components/Chat';
import RoomList from './components/RoomList';
import { Button, Container, Typography } from '@mui/material';

const App = () => {
  const [user, setUser] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth);
  };

  return (
    <Container>
      {user ? (
        <>
          <Typography variant="h4">Welcome, {user.email}</Typography>
          <Button variant="contained" color="secondary" onClick={handleSignOut}>
            Sign Out
          </Button>
          {selectedRoom ? (
            <Chat roomId={selectedRoom} />
          ) : (
            <RoomList selectRoom={setSelectedRoom} />
          )}
        </>
      ) : (
        <Auth />
      )}
    </Container>
  );
};

export default App;
