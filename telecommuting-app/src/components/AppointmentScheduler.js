import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

const AppointmentScheduler = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [doctorEmail, setDoctorEmail] = useState('');
  const auth = getAuth();
  const user = auth.currentUser;

  const handleSchedule = async () => {
    await addDoc(collection(db, 'appointments'), {
      patientEmail: user.email,
      doctorEmail,
      date,
      time,
      status: 'scheduled'
    });
    // Clear fields after scheduling
    setDate('');
    setTime('');
    setDoctorEmail('');
  };

  return (
    <Container>
      <Typography variant="h4">Schedule Appointment</Typography>
      <TextField
        label="Doctor's Email"
        value={doctorEmail}
        onChange={(e) => setDoctorEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Time"
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <Button variant="contained" color="primary" onClick={handleSchedule}>
        Schedule Appointment
      </Button>
    </Container>
  );
};

export default AppointmentScheduler;
