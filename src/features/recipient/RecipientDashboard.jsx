import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import ChatList from '../chat/ChatList';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RecipientDashboard = () => {
    const { userData } = useAuth();
    const [recentRequests, setRecentRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const navigate = useNavigate();

    useEffect(() => {
        if (!userData) return;
        const q = query(collection(db, "requests"), where("recipientId", "==", userData.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const reqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRecentRequests(reqs);
            setLoading(false);
        });
        return unsubscribe;
    }, [userData]);

    return (
        <div className="recipient-dashboard fade-in">
            <header className="dashboard-header">
                <div className="welcome-text">
                    <h1>Hello, {userData?.fullName?.split(' ')[0]} 👋</h1>
                    <p>Need life-saving blood? Find matches now.</p>
                </div>
                <div className="status-badge pulse">Recipient</div>
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
                    <div className="action-hub card">
                        <h3>Quick Search</h3>
                        <p>Find blood donors available in your area instantly.</p>
                        <button className="btn btn-primary" onClick={() => navigate('/search')}>
                            Find Nearby Donors 🔍
                        </button>
                    </div>

                    <section className="stats-grid">
                        <div className="stat-card card">
                            <span className="stat-val">{recentRequests.length}</span>
                            <span className="stat-label">Active Requests</span>
                        </div>
                        <div className="stat-card card">
                            <span className="stat-val">{userData?.city || 'Set City'}</span>
                            <span className="stat-label">Current City</span>
                        </div>
                    </section>

                    <section className="history-section">
                        <div className="section-header-compact">
                            <h4>Recent Activity</h4>
                            <button className="text-btn" onClick={() => navigate('/history')}>View All</button>
                        </div>
                        {loading ? (
                            <p>Loading activity...</p>
                        ) : recentRequests.length === 0 ? (
                            <div className="empty-state">
                                <p>No recent blood requests found.</p>
                            </div>
                        ) : (
                            recentRequests.map(req => (
                                <div key={req.id} className="history-item card">
                                    <div className="history-info">
                                        <strong>Request for {req.bloodTypeNeeded}</strong>
                                        <span>Status: <span className={`status-tag ${req.status}`}>{req.status}</span></span>
                                    </div>
                                    <span className="date">{new Date(req.createdAt?.toDate?.() || 0).toLocaleDateString()}</span>
                                </div>
                            ))
                        )}
                    </section>
                </>
            ) : (
                <ChatList />
            )}

            <style>{`
        .recipient-dashboard { display: flex; flex-direction: column; gap: 1.5rem; }
        .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .welcome-text h1 { font-size: 1.5rem; margin-bottom: 0.2rem; }
        .welcome-text p { font-size: 0.9rem; color: var(--text-medium); }
        .status-badge { background: var(--bg-light); color: var(--primary-red); padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 0.75rem; border: 1px solid var(--border-color); }
        
        .action-hub { background: linear-gradient(135deg, var(--primary-red) 0%, #D32F2F 100%); color: white; border: none; }
        .action-hub h3 { color: white; margin-bottom: 0.5rem; }
        .action-hub p { color: rgba(255,255,255,0.8); margin-bottom: 1.25rem; font-size: 0.9rem; }
        .action-hub .btn-primary { background: white; color: var(--primary-red); border: none; font-weight: 700; }

        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .stat-card { text-align: center; padding: 1rem; display: flex; flex-direction: column; gap: 0.2rem; }
        .stat-val { font-size: 1.35rem; font-weight: 800; color: var(--primary-red); }
        .stat-label { font-size: 0.75rem; color: var(--text-light); text-transform: uppercase; font-weight: 600; }

        .section-header-compact { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
        .text-btn { background: none; border: none; color: var(--primary-red); font-weight: 600; font-size: 0.85rem; cursor: pointer; }
        
        .history-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem; margin-bottom: 0.75rem; }
        .history-info { display: flex; flex-direction: column; gap: 0.2rem; }
        .status-tag { font-size: 0.75rem; font-weight: 700; text-transform: capitalize; }
        .status-tag.pending { color: var(--warning); }
        .status-tag.approved { color: var(--success); }
        .date { font-size: 0.75rem; color: var(--text-light); }

        .dashboard-tabs { display: flex; gap: 1rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); }
        .tab-btn { background: none; border: none; padding: 0.75rem 0.5rem; font-weight: 600; color: var(--text-light); cursor: pointer; position: relative; }
        .tab-btn.active { color: var(--primary-red); }
        .tab-btn.active::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px; background: var(--primary-red); }
      `}</style>
        </div>
    );
};

export default RecipientDashboard;
