import React from 'react';
import LoggedInMainLayout from '../layout/LoggedInMainLayout';
import Settings from '../components/settings/Settings';

export default function AccountSettingsPage() {
    return (
        <div className="AccountSettings">
            <LoggedInMainLayout>
                <Settings />
            </LoggedInMainLayout>
        </div>
    );
}
