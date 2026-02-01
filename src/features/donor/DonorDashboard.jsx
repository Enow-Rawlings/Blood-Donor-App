import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { doc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import ChatList from '../chat/ChatList';

const DonorDashboard = () => {
    const { userData, currentUser } = useAuth();
    const [isActive, setIsActive] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        if (userData) {
            setIsActive(userData.availabilityStatus === 'active');
        }
    }, [userData]);

    useEffect(() => {
        if (!currentUser) return;

        // Listen for requests approved by admin but not yet accepted by donor
        const q = query(
            collection(db, "requests"),
            where("donorId", "==", currentUser.uid),
            where("status", "==", "approved_by_admin")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const reqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRequests(reqs);
        });

        return () => unsubscribe();
    }, [currentUser]);

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

    const handleRequestAction = async (requestId, action) => {
        try {
            await updateDoc(doc(db, "requests", requestId), {
                status: action === 'accept' ? 'accepted' : 'declined'
            });
        } catch (error) {
            console.error(`Failed to ${action} request`, error);
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
                    className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
                    onClick={() => setActiveTab('requests')}
                >
                    Requests {requests.length > 0 && <span className="tab-badge">{requests.length}</span>}
                </button>
                <button
                    className={`tab-btn ${activeTab === 'messaging' ? 'active' : ''}`}
                    onClick={() => setActiveTab('messaging')}
                >
                    Messaging
                </button>
            </div>

            {activeTab === 'overview' && (
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
                            <span className="stat-value">{requests.length}</span>
                            <span className="stat-label">New Requests</span>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'requests' && (
                <div className="requests-list">
                    {requests.length === 0 ? (
                        <div className="empty-state card">
                            <p>No new requests at the moment. 🩸</p>
                        </div>
                    ) : (
                        requests.map(req => (
                            <div key={req.id} className="request-card card fade-in">
                                <div className="request-info">
                                    <strong>{req.recipientName}</strong>
                                    <p>Needs {req.bloodTypeNeeded} blood in {req.city}</p>
                                </div>
                                <div className="request-actions">
                                    <button className="btn-accept" onClick={() => handleRequestAction(req.id, 'accept')}>Accept</button>
                                    <button className="btn-decline" onClick={() => handleRequestAction(req.id, 'decline')}>Decline</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'messaging' && (
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
        .tab-btn { background: none; border: none; padding: 0.75rem 0.5rem; font-weight: 600; color: var(--text-light); cursor: pointer; position: relative; display: flex; align-items: center; gap: 0.4rem; }
        .tab-btn.active { color: var(--primary-red); }
        .tab-btn.active::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px; background: var(--primary-red); }
        .tab-badge { background: var(--primary-red); color: white; font-size: 0.7rem; padding: 2px 6px; border-radius: 10px; }

        .request-card { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem; margin-bottom: 1rem; }
        .request-info p { font-size: 0.85rem; color: var(--text-medium); margin-top: 0.25rem; }
        .request-actions { display: flex; gap: 0.5rem; }
        .btn-accept { background: var(--success); color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; font-weight: 600; cursor: pointer; }
        .btn-decline { background: var(--bg-light); color: var(--text-medium); border: none; padding: 0.5rem 1rem; border-radius: 6px; font-weight: 600; cursor: pointer; }
        .empty-state { text-align: center; color: var(--text-light); padding: 2rem; }
      `}</style>
        </div>
    );
};

export default DonorDashboard;
