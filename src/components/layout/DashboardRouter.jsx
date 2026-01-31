import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DonorDashboard from '../../features/donor/DonorDashboard';
import RecipientDashboard from '../../features/recipient/RecipientDashboard';
import AdminDashboard from '../../features/admin/AdminDashboard';

const DashboardRouter = () => {
    const { userData, loading } = useAuth();

    if (loading) return <div className="loading-state">Initializing Dashboard...</div>;

    if (!userData) return <Navigate to="/login" />;

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
