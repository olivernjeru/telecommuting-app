import React from 'react';
import LoggedIn from '../components/navigationBars/loggedIn/LoggedIn';

export default function LoggedInMainLayout({ children }) {
    return (
        <div className="LoggedInMainLayout">
            <LoggedIn />
            <div className="content">{children}</div>
        </div>
    );
}
