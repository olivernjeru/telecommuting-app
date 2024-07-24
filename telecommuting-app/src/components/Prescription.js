import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Snackbar, Alert } from '@mui/material';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

const Prescription = () => {
  const [patientEmail, setPatientEmail] = useState('');
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  const handlePrescribe = async () => {
    try {
      const prescriptionRef = await addDoc(collection(db, 'prescriptions'), {
        doctorEmail: user.email,
        patientEmail,
        medication,
        dosage,
        instructions,
        date: new Date()
      });

      // Add prescription to patient's prescriptions subcollection
      await setDoc(doc(db, 'users', patientEmail, 'prescriptions', prescriptionRef.id), {
        doctorEmail: user.email,
        medication,
        dosage,
        instructions,
        date: new Date()
      });

      // Add prescription message to chat
      await addDoc(collection(db, 'chats'), {
        sender: user.email,
        recipient: patientEmail,
        message: `New prescription: ${medication} - ${dosage}`,
        type: 'prescription',
        prescriptionId: prescriptionRef.id,
        timestamp: new Date()
      });

      // Clear fields after prescribing
      setPatientEmail('');
      setMedication('');
      setDosage('');
      setInstructions('');
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error writing prescription: ", error);
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
      <Typography variant="h4" gutterBottom>Write Prescription</Typography>
      <TextField
        label="Patient's Email"
        value={patientEmail}
        onChange={(e) => setPatientEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Medication"
        value={medication}
        onChange={(e) => setMedication(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Dosage"
        value={dosage}
        onChange={(e) => setDosage(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Instructions"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />
      <Button variant="contained" color="primary" onClick={handlePrescribe} sx={{ mt: 2 }}>
        Write Prescription
      </Button>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Prescription sent successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Prescription;