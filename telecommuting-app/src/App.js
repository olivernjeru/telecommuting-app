import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, Tabs, Tab } from '@mui/material';
import Chat from './components/Chat';
import RoomList from './components/RoomList';
import UserProfile from './components/UserProfile';
import DoctorAppointments from './components/DoctorAppointments';
import PatientPrescriptions from './components/PatientPrescriptions';
import AppointmentScheduler from './components/AppointmentScheduler';
import Prescription from './components/Prescription';
import { onAuthChange, logout } from './components/Auth';

const App = ({ user, userRole, selectedRoom, setSelectedRoom, activeTab, setActiveTab }) => {
  const handleSignOut = () => {
    logout();
  };

  if (!user) {
    return null; // Or you can return a loading spinner or placeholder
  }

  return (
    <Container>
      <Typography variant="h4">Welcome, {user.email}</Typography>
      <Button variant="contained" color="secondary" onClick={handleSignOut}>
        Sign Out
      </Button>
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
        <Tab label="Chat" />
        <Tab label="Profile" />
        {userRole === 'patient' && <Tab label="Prescriptions" />}
        {userRole === 'patient' && <Tab label="Schedule Appointment" />}
        {userRole === 'doctor' && <Tab label="Appointments" />}
        {userRole === 'doctor' && <Tab label="Write Prescription" />}
      </Tabs>
      {activeTab === 0 && (
        selectedRoom ? <Chat roomId={selectedRoom} /> : <RoomList selectRoom={setSelectedRoom} />
      )}
      {activeTab === 1 && <UserProfile />}
      {activeTab === 2 && userRole === 'patient' && <PatientPrescriptions />}
      {activeTab === 2 && userRole === 'doctor' && <DoctorAppointments />}
      {activeTab === 3 && userRole === 'patient' && <AppointmentScheduler />}
      {activeTab === 3 && userRole === 'doctor' && <Prescription />}
    </Container>
  );
};

export default App;
