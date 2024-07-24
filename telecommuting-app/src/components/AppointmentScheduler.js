import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Snackbar, Alert } from '@mui/material';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

const AppointmentScheduler = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const auth = getAuth();
  const user = auth.currentUser;

  const handleSchedule = async () => {
    try {
      // Add appointment to 'appointments' collection
      const appointmentRef = await addDoc(collection(db, 'appointments'), {
        patientEmail: user.email,
        doctorEmail,
        date,
        time,
        status: 'scheduled'
      });

      // Add appointment to doctor's appointments subcollection
      await setDoc(doc(db, 'users', doctorEmail, 'appointments', appointmentRef.id), {
        patientEmail: user.email,
        date,
        time,
        status: 'scheduled'
      });

      // Clear fields after scheduling
      setDate('');
      setTime('');
      setDoctorEmail('');

      // Show success message
      setSnackbarMessage('Appointment scheduled successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error scheduling appointment: ", error);
      setSnackbarMessage('Failed to schedule appointment. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Schedule Appointment</Typography>
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
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSchedule}
        sx={{ mt: 2 }}
      >
        Schedule Appointment
      </Button>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AppointmentScheduler;