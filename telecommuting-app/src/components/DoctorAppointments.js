// DoctorAppointments.js
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { List, ListItem, ListItemText, Typography, Container } from '@mui/material';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'appointments'), where('doctorEmail', '==', user.email));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const appointmentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAppointments(appointmentsData);
      });

      return () => unsubscribe();
    }
  }, [user]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>My Appointments</Typography>
      <List>
        {appointments.map((appointment) => (
          <ListItem key={appointment.id}>
            <ListItemText
              primary={`Patient: ${appointment.patientEmail}`}
              secondary={`Date: ${appointment.date}, Time: ${appointment.time}, Status: ${appointment.status}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default DoctorAppointments;