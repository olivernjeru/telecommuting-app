import React from 'react';
import { Box } from '@mui/material';
import LoggedInMainLayout from '../layout/LoggedInMainLayout';
import Chat from '../components/dashboards/patient/Chat';

export default function PatientDashboardPage() {
    return (
        <div className="PatientDashboard">
            <LoggedInMainLayout>
                <div>
                    <Box sx={{ minHeight: '45vh', mt: 7, padding: 1, width: '48vw', borderRadius: 0 }}>
                        <Chat />
                    </Box>
                </div>
            </LoggedInMainLayout>
        </div>
    )
}
