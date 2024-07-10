import React from 'react';
import LoggedInMainLayout from '../layout/LoggedInMainLayout';
import Profile from '../components/profile/Profile';

export default function AccountProfilePage() {
    return (
        <div className="AccountProfile">
            <LoggedInMainLayout>
                <Profile />
            </LoggedInMainLayout>
        </div>
    );
}
