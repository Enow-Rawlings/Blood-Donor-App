import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DonorDashboard from '../../features/donor/DonorDashboard';
import RecipientDashboard from '../../features/recipient/RecipientDashboard';
import AdminDashboard from '../../features/admin/AdminDashboard';
import { logOut } from '../../features/auth/authService';

const DashboardRouter = () => {
    const { userData, currentUser, loading, profileError } = useAuth();

    if (loading) return <div className="loading-state">Initializing Dashboard...</div>;

    // If not logged in, go to login
    if (!currentUser) return <Navigate to="/login" />;

    if (profileError) {
        return (
            <div className="error-state">
                <h3>We couldn't load your profile</h3>
                <p>Firestore denied access to this account's profile. Check the Firebase project configured for this deployment and its Firestore rules for the users collection.</p>
                <button className="btn btn-secondary" onClick={logOut}>Sign out</button>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="error-state">
                <h3>Your profile hasn't been created</h3>
                <p>This account is signed in, but its users/{currentUser.uid} profile document is missing from Firestore.</p>
                <button className="btn btn-secondary" onClick={logOut}>Sign out</button>
            </div>
        );
    }

    switch (userData.role) {
        case 'admin':
            return <AdminDashboard />;
        case 'donor':
            return <DonorDashboard />;
        case 'recipient':
            return <RecipientDashboard />;
        default:
            return <div className="error-state">Role unknown. Please update profile.</div>;
    }
};

export default DashboardRouter;
