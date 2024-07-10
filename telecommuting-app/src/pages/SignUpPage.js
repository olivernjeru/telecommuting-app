import React from 'react';
import MainLayout from '../layout/NotLoggedInMainLayout';
import SignUp from '../components/authentication/signUp/SignUp';

export default function SignUpPage() {
    return (
        <div className="SignUpPage">
            <MainLayout>
                <SignUp />
            </MainLayout>
        </div>

    );
}
