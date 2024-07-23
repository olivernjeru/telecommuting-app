import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

const Prescription = () => {
  const [patientEmail, setPatientEmail] = useState('');
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');
  const auth = getAuth();
  const user = auth.currentUser;

  const handlePrescribe = async () => {
    await addDoc(collection(db, 'prescriptions'), {
      doctorEmail: user.email,
      patientEmail,
      medication,
      dosage,
      instructions,
      date: new Date()
    });
    // Clear fields after prescribing
    setPatientEmail('');
    setMedication('');
    setDosage('');
    setInstructions('');
  };

  return (
    <Container>
      <Typography variant="h4">Write Prescription</Typography>
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
      <Button variant="contained" color="primary" onClick={handlePrescribe}>
        Write Prescription
      </Button>
    </Container>
  );
};

export default Prescription;