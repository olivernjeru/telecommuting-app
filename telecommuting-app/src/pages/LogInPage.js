import React from 'react';
import LogIn from "../components/authentication/login/LogIn";
import MainLayout from '../layout/NotLoggedInMainLayout';

function LogInPage() {
    return (
        <div className="LogIn">
            <MainLayout>
                <LogIn className="LogIn" />
            </MainLayout>
        </div>
    )
}

export default LogInPage;
