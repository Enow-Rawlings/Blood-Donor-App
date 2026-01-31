import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DonorDashboard from '../../features/donor/DonorDashboard';
import RecipientDashboard from '../../features/recipient/RecipientDashboard';
import AdminDashboard from '../../features/admin/AdminDashboard';

const DashboardRouter = () => {
    const { userData, currentUser, loading } = useAuth();

    if (loading) return <div className="loading-state">Initializing Dashboard...</div>;

    // If not logged in, go to login
    if (!currentUser) return <Navigate to="/login" />;

    // If logged in but no profile data yet (race condition or slow network), show loading
    // instead of redirecting to login which causes infinite loop
    if (!userData) {
        return (
            <div className="loading-state">
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <h3>Finalizing setup...</h3>
                    <p>Please wait while we load your profile.</p>
                </div>
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
