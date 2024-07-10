import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import LogInPage from './pages/LogInPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SignUpPage from './pages/SignUpPage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import PatientDashboardPage from './pages/PatientDashboardPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import AccountProfilePage from './pages/AccountProfilePage';
import PrivateRoutes from './components/authentication/privateRoutes/PrivateRoutes';
import ReversePrivateRoutes from './components/authentication/reversePrivateRoutes/ReversePrivateRoutes';
import { AuthProvider } from './components/authentication/authContext/AuthContext';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Router>
    <AuthProvider>
      <Routes>
        <Route element={<ReversePrivateRoutes />}>
          <Route path="/" element={<App />} />
          <Route path="login" element={<LogInPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="sign-up" element={<SignUpPage />} />
        </Route>
        <Route element={<PrivateRoutes allowedRole="doctor" />}>
          <Route
            path='doctor'
            element={
              <DoctorDashboardPage />
            }
          />
        </Route>
        <Route element={<PrivateRoutes allowedRole="patient" />}>
          <Route path='patient' element={<PatientDashboardPage />} />
        </Route>
        <Route element={<PrivateRoutes allowedRole="both" />}>
          <Route path='account-settings' element={<AccountSettingsPage />} />
          <Route path='account-profile' element={<AccountProfilePage />} />
        </Route>
      </Routes>
    </AuthProvider>
  </Router>
);
