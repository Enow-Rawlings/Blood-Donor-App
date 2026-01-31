import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import ChatList from '../chat/ChatList';

const DonorDashboard = () => {
    const { userData, currentUser } = useAuth();
    const [isActive, setIsActive] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (userData) {
            setIsActive(userData.availabilityStatus === 'active');
        }
    }, [userData]);

    const toggleAvailability = async () => {
        const newStatus = !isActive ? 'active' : 'inactive';
        setIsActive(!isActive);

        try {
            await updateDoc(doc(db, "users", currentUser.uid), {
                availabilityStatus: newStatus
            });
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    return (
        <div className="dashboard donor-dashboard fade-in">
            <header className="dashboard-header">
                <div className="user-greeting">
                    <h2>Hello, {userData?.fullName?.split(' ')[0] || 'Donor'}!</h2>
                    <p>You have saved {userData?.livesSaved || 0} lives so far.</p>
                </div>
                <div className={`status-badge ${userData?.status}`}>
                    {userData?.status?.toUpperCase() || 'PENDING'}
                </div>
            </header>

            <div className="dashboard-tabs">
                <button
                    className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button
                    className={`tab-btn ${activeTab === 'messaging' ? 'active' : ''}`}
                    onClick={() => setActiveTab('messaging')}
                >
                    Messaging
                </button>
            </div>

            {activeTab === 'overview' ? (
                <>
                    <div className="availability-card card">
                        <div className="availability-header">
                            <h4>Availability Status</h4>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={toggleAvailability}
                                    disabled={userData?.status !== 'approved'}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <p className="availability-desc">
                            {isActive
                                ? "You are currently Active and visible to recipients."
                                : "You are currently Inactive. You will not receive new requests."}
                        </p>
                        {userData?.status !== 'approved' && (
                            <p className="warning-text">Account must be approved by admin to toggle availability.</p>
                        )}
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card card">
                            <span className="stat-value">{userData?.bloodType || '--'}</span>
                            <span className="stat-label">Blood Type</span>
                        </div>
                        <div className="stat-card card">
                            <span className="stat-value">56</span>
                            <span className="stat-label">Days to next</span>
                        </div>
                        <div className="stat-card card">
                            <span className="stat-value">0</span>
                            <span className="stat-label">Requests</span>
                        </div>
                    </div>
                </>
            ) : (
                <ChatList />
            )}

            <style>{`
        .dashboard-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
        .status-badge { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
        .status-badge.pending { background: var(--secondary-red); color: var(--primary-red); }
        .status-badge.approved { background: #E8F5E9; color: #2E7D32; }

        .availability-header { display: flex; justify-content: space-between; align-items: center; }
        .availability-desc { font-size: 0.9rem; color: var(--text-medium); margin-top: 0.5rem; }
        .warning-text { font-size: 0.75rem; color: var(--error); margin-top: 0.5rem; font-weight: 500; }

        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin: 1.5rem 0; }
        .stat-card { text-align: center; padding: 1rem 0.5rem; display: flex; flex-direction: column; gap: 0.25rem; }
        .stat-value { font-size: 1.25rem; font-weight: 700; color: var(--primary-red); }
        .stat-label { font-size: 0.7rem; color: var(--text-light); text-transform: uppercase; }

        .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: var(--success); }
        input:checked + .slider:before { transform: translateX(20px); }
        input:disabled + .slider { opacity: 0.5; cursor: not-allowed; }

        .dashboard-tabs { display: flex; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); }
        .tab-btn { background: none; border: none; padding: 0.75rem 0.5rem; font-weight: 600; color: var(--text-light); cursor: pointer; position: relative; }
        .tab-btn.active { color: var(--primary-red); }
        .tab-btn.active::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px; background: var(--primary-red); }
      `}</style>
        </div>
    );
};

export default DonorDashboard;
