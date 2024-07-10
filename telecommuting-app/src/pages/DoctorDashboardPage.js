import React from 'react';
import { Box } from '@mui/material';
import LoggedInMainLayout from '../layout/LoggedInMainLayout';
import Chat from '../components/dashboards/doctor/Chat';

export default function DoctorDashboardPage() {
    return (
        <div className="DoctorDashboard">
            <LoggedInMainLayout>
                <div>
                    <Box sx={{ minHeight: '47vh', mt: 7, padding: 1, width: '49vw', borderRadius: 0 }}>
                        <Chat />
                    </Box>
                </div>
            </LoggedInMainLayout >
        </div >
    )
}
