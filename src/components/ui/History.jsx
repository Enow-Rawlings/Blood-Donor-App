import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

const History = () => {
    const { userData } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userData) return;

        // Query both donations (for donors) or requests (for recipients)
        const collectionName = userData.role === 'donor' ? 'donations' : 'requests';
        const fieldName = userData.role === 'donor' ? 'donorId' : 'recipientId';

        const q = query(
            collection(db, collectionName),
            where(fieldName, "==", userData.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setHistory(data);
            setLoading(false);
        });

        return unsubscribe;
    }, [userData]);

    return (
        <div className="history-page fade-in">
            <header className="section-header">
                <h2>Activity History</h2>
                <p>Track your {userData?.role === 'donor' ? 'donations' : 'blood requests'}</p>
            </header>

            <div className="history-list">
                {loading ? (
                    <p>Loading history...</p>
                ) : history.length === 0 ? (
                    <div className="empty-state card">
                        <p>No activity records found yet.</p>
                    </div>
                ) : (
                    history.map(item => (
                        <div key={item.id} className="history-card card">
                            <div className="history-main">
                                <div className="blood-icon">🩸</div>
                                <div className="history-details">
                                    <strong>{userData?.role === 'donor' ? 'Donated Blood' : 'Blood Request'}</strong>
                                    <span>{item.bloodTypeNeeded || item.bloodType} Unit</span>
                                </div>
                            </div>
                            <div className="history-meta">
                                <span className={`status-pill ${item.status}`}>{item.status}</span>
                                <span className="date">{item.createdAt?.toDate().toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
        .history-list { display: flex; flex-direction: column; gap: 1rem; }
        .history-card { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem; }
        .history-main { display: flex; align-items: center; gap: 1rem; }
        .blood-icon { font-size: 1.5rem; background: var(--bg-light); width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
        .history-details { display: flex; flex-direction: column; gap: 0.1rem; }
        .history-details strong { font-size: 1rem; }
        .history-details span { font-size: 0.8rem; color: var(--text-medium); }

        .history-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 0.4rem; }
        .status-pill { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; padding: 2px 8px; border-radius: 12px; }
        .status-pill.pending { background: #FFF4E5; color: #B26B00; }
        .status-pill.approved { background: #E6F7ED; color: #1E7E34; }
        .status-pill.rejected { background: #FEF2F2; color: #DC2626; }
        .date { font-size: 0.75rem; color: var(--text-light); }
      `}</style>
        </div>
    );
};

export default History;
