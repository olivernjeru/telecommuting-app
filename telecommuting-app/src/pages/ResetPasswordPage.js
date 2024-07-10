import React from 'react';
import MainLayout from '../layout/NotLoggedInMainLayout';
import ResetPassword from '../components/resetPassword/ResetPassword';

export default function ResetPasswordPage() {
    return (
        <div className="ResetPasswordPage">
            <MainLayout>
                <ResetPassword />
            </MainLayout>
        </div>

    );
}
