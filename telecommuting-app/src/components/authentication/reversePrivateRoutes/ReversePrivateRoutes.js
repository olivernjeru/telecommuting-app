import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth, firestoredb } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function ReversePrivateRoutes() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(firestoredb, 'user-details', user.uid));
                setUser(userDoc.data());
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Show loading indicator while checking authentication state
    }

    if (!user) {
        return <Outlet />;
    }

    if (user.registrationNo.startsWith('D')) {
        return <Navigate to="/doctor" />;
    } else if (user.registrationNo.startsWith('P')) {
        return <Navigate to="/patient" />;
    }

    return <Navigate to="/" />;
}
