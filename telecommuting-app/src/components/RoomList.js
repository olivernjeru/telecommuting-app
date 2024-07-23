import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { TextField, Button, List, ListItem, ListItemText, Container, Typography } from '@mui/material';

const RoomList = ({ selectRoom }) => {
  const [rooms, setRooms] = useState([]);
  const [newRoomEmail, setNewRoomEmail] = useState('');
  const [role, setRole] = useState('');

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        console.log(`Fetching current user document from path: ${userDocRef.path}`);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          } else {
            console.error('Current user role not found.');
          }
        } catch (error) {
          console.error('Error fetching current user role:', error);
        }
      } else {
        console.error('No authenticated user found.');
      }
    };

    fetchUserRole();

    if (user) {
      const unsubscribe = onSnapshot(collection(db, 'rooms'), (snapshot) => {
        const roomsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRooms(roomsData.filter(room => room.participants.includes(user.email)));
      });  
      return () => unsubscribe();
    }
  }, [user]);

  const createRoom = async () => {
    try {
      if (!user) {
        console.error('No authenticated user found.');
        alert('No authenticated user found.');
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      const newUserEmailLower = newRoomEmail.toLowerCase().trim();

      // Query to find user by email
      const newUserQuery = query(collection(db, 'users'), where('email', '==', newUserEmailLower));
      const newUserQuerySnapshot = await getDocs(newUserQuery);

      if (!userDoc.exists()) {
        console.error('Current user document not found.');
        alert('Current user not found.');
        return;
      }

      if (newUserQuerySnapshot.empty) {
        console.error('New room participant document not found.');
        alert('New participant user not found.');
        return;
      }

      const newUserDoc = newUserQuerySnapshot.docs[0];
      const userRole = userDoc.data().role;
      const newUserRole = newUserDoc.data().role;

      if ((userRole === 'doctor' && newUserRole === 'patient') || (userRole === 'patient' && newUserRole === 'doctor')) {
        await addDoc(collection(db, 'rooms'), {
          participants: [user.email, newUserEmailLower],
        });

        setNewRoomEmail('');
      } else {
        alert('Rooms can only be created between a doctor and a patient.');
      }
    } catch (error) {
      console.error('Error creating room:', error);
      alert('An error occurred while creating the room.');
    }
  };

  return (
    <Container>
      <Typography variant="h4">Rooms</Typography>
      <List>
        {rooms.map((room) => (
          <ListItem button key={room.id} onClick={() => selectRoom(room.id)}>
            <ListItemText primary={`Room with: ${room.participants.join(', ')}`} />
          </ListItem>
        ))}
      </List>
      <TextField
        label="Participant Email"
        value={newRoomEmail}
        onChange={(e) => setNewRoomEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={createRoom}>
        Create Room
      </Button>
    </Container>
  );
};

export default RoomList;
