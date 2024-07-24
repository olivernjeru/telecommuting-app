// PatientPrescriptions.js
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { List, ListItem, ListItemText, Typography, Container } from '@mui/material';

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'prescriptions'), where('patientEmail', '==', user.email));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const prescriptionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPrescriptions(prescriptionsData);
      });

      return () => unsubscribe();
    }
  }, [user]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>My Prescriptions</Typography>
      <List>
        {prescriptions.map((prescription) => (
          <ListItem key={prescription.id}>
            <ListItemText
              primary={`Medication: ${prescription.medication}`}
              secondary={`Dosage: ${prescription.dosage}, Instructions: ${prescription.instructions}, Doctor: ${prescription.doctorEmail}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default PatientPrescriptions;