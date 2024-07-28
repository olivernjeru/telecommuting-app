import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import App from './App';
import LogInPage from './pages/LogInPage';
import RegisterPage from './pages/RegisterPage';
import { onAuthChange } from './components/Auth';
import reportWebVitals from './reportWebVitals';

const Index = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthChange((user, role) => {
      setUser(user);
      setUserRole(role);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <LogInPage /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
        <Route
          path="/"
          element={
            user ? (
              <App
                user={user}
                userRole={userRole}
                selectedRoom={selectedRoom}
                setSelectedRoom={setSelectedRoom}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>
);

reportWebVitals();
