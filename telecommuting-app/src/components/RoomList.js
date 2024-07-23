import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { firestoredb } from '../firebase';
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
      const userDoc = await getDoc(doc(firestoredb, 'users', user.uid));
      if (userDoc.exists()) {
        setRole(userDoc.data().role);
      }
    };

    fetchUserRole();

    const unsubscribe = onSnapshot(collection(firestoredb, 'rooms'), (snapshot) => {
      const roomsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRooms(roomsData.filter(room => room.participants.includes(user.email)));
    });

    return () => unsubscribe();
  }, [user]);

  const createRoom = async () => {
    const userDoc = await getDoc(doc(firestoredb, 'users', user.uid));
    const newUserDoc = await getDoc(doc(firestoredb, 'users', newRoomEmail));

    if (userDoc.exists() && newUserDoc.exists()) {
      const userRole = userDoc.data().role;
      const newUserRole = newUserDoc.data().role;

      if ((userRole === 'doctor' && newUserRole === 'patient') || (userRole === 'patient' && newUserRole === 'doctor')) {
        await addDoc(collection(firestoredb, 'rooms'), {
          participants: [user.email, newRoomEmail],
        });

        setNewRoomEmail('');
      } else {
        alert('Rooms can only be created between a doctor and a patient.');
      }
    } else {
      alert('User not found.');
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
