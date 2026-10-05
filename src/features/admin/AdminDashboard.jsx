import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot, doc, getDoc, writeBatch, addDoc, serverTimestamp } from 'firebase/firestore';

const AdminDashboard = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Listen to pending users
        const usersQ = query(collection(db, "users"), where("status", "==", "pending"));
        const unsubscribeUsers = onSnapshot(usersQ, (snapshot) => {
            const users = snapshot.docs.map(doc => ({ id: doc.id, type: 'user', ...doc.data() }));
            setPendingUsers(users);
            setLoading(false);
        }, (error) => {
            console.error('Pending users listener failed:', error);
            setLoadError('Firestore denied access to the verification queue. Confirm this account has admin access to the users and requests collections.');
            setLoading(false);
        });

        // Listen to pending blood requests (those awaiting admin review)
        const requestsQ = query(collection(db, "requests"), where("status", "==", "pending_admin_approval"));
        const unsubscribeRequests = onSnapshot(requestsQ, (snapshot) => {
            const reqs = snapshot.docs.map(doc => ({ id: doc.id, type: 'request', ...doc.data() }));
            setPendingRequests(reqs);
        }, (error) => {
            console.error('Pending requests listener failed:', error);
            setLoadError('Firestore denied access to the verification queue. Confirm this account has admin access to the users and requests collections.');
            setLoading(false);
        });

        return () => {
            unsubscribeUsers();
            unsubscribeRequests();
        };
    }, []);

    const handleVerify = async (id, type, approve) => {
        try {
            const newStatus = approve
                ? (type === 'user' ? 'approved' : 'approved_by_admin')
                : 'rejected';
            const batch = writeBatch(db);

            if (type === 'user') {
                const user = pendingUsers.find((item) => item.id === id);
                batch.update(doc(db, 'users', id), { status: newStatus });
                if (user?.role === 'donor') {
                    batch.set(doc(db, 'donorDirectory', id), {
                        uid: id,
                        role: 'donor',
                        fullName: user.fullName,
                        bloodType: user.bloodType,
                        city: user.city,
                        profilePicUrl: user.profilePicUrl || '',
                        availabilityStatus: user.availabilityStatus || 'inactive',
                        status: newStatus
                    }, { merge: true });
                }
            } else {
                const request = pendingRequests.find((item) => item.id === id);
                if (!request) return;
                batch.update(doc(db, 'requests', id), { status: newStatus });
                batch.set(doc(db, 'chats', request.chatId), {
                    requestId: id,
                    recipientId: request.recipientId,
                    donorId: request.donorId,
                    participants: [request.recipientId, request.donorId],
                    status: newStatus
                }, { merge: true });
            }

            await batch.commit();

            if (type === 'request' && approve) {
                const reqData = pendingRequests.find(r => r.id === id);
                if (reqData) {
                    await addDoc(collection(db, "notifications"), {
                        recipientId: reqData.donorId,
                        title: "Blood Request Approved by Admin",
                        body: `${reqData.recipientName} needs your help. View the request details.`,
                        createdAt: serverTimestamp()
                    });
                }
            }
        } catch (error) {
            console.error(`${type} verification update failed`, error);
        }
    };

    const handleViewDocument = async (item) => {
        try {
            const documentSnapshot = await getDoc(doc(db, 'verificationDocuments', item.id));
            if (!documentSnapshot.exists()) {
                window.alert('The verification document is unavailable.');
                return;
            }
            const { documentUrl } = documentSnapshot.data();
            const title = item.type === 'user'
                ? `${item.fullName} - Medical Report`
                : `${item.recipientName} - Prescription`;
            navigate(`/document-viewer?url=${encodeURIComponent(documentUrl)}&title=${encodeURIComponent(title)}`);
        } catch (error) {
            console.error('Verification document could not be loaded:', error);
            window.alert('You do not have permission to view this verification document.');
        }
    };

    const allPending = [...pendingUsers, ...pendingRequests];

    return (
        <div className="admin-dashboard fade-in">
            <header className="section-header">
                <h2>Verification Queue</h2>
                <p>Review documents for new signups and blood requests</p>
            </header>

            <div className="queue-list">
                {loadError ? (
                    <div className="error-alert card" role="alert">{loadError}</div>
                ) : loading ? (
                    <p>Loading queue...</p>
                ) : allPending.length === 0 ? (
                    <div className="empty-state card">
                        <p>Queue is empty. All clear! ✅</p>
                    </div>
                ) : (
                    allPending.map(item => (
                        <div key={item.id} className={`verification-card card ${item.type}-type`}>
                            <div className="user-brief">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className={`role-tag ${item.type}`}>
                                        {item.type === 'user' ? 'User Signup' : 'Blood Request'}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                                        {item.role || (item.type === 'request' ? 'Urgent' : '')}
                                    </span>
                                </div>

                                {item.type === 'user' ? (
                                    <>
                                        <strong style={{ fontSize: '1.1rem', margin: '0.5rem 0' }}>{item.fullName}</strong>
                                        <div className="item-meta">
                                            <span>Blood: {item.bloodType || item.bloodTypeNeeded}</span>
                                            <span>Age: {item.age} | Weight: {item.weight}kg</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ margin: '0.5rem 0' }}>
                                            <strong style={{ fontSize: '1.1rem' }}>{item.recipientName}</strong>
                                            <span style={{ margin: '0 0.5rem', color: 'var(--text-light)' }}>→</span>
                                            <strong>{item.donorName}</strong>
                                        </div>
                                        <div className="item-meta">
                                            <span>Seeking: {item.bloodTypeNeeded}</span>
                                            <span>Location: {item.city}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="docs-preview">
                                {item.hasVerificationDocument ? (
                                    <button
                                        onClick={() => handleViewDocument(item)}
                                        className="btn-view-doc"
                                    >
                                        View Verification Document 📄
                                    </button>
                                ) : (
                                    <div className="no-doc-warning">
                                        ⚠️ No document uploaded
                                    </div>
                                )}
                            </div>

                            <div className="action-btns">
                                <button className="btn-approve" onClick={() => handleVerify(item.id, item.type, true)}>Approve</button>
                                <button className="btn-reject" onClick={() => handleVerify(item.id, item.type, false)}>Reject</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
        .role-tag { font-size: 0.65rem; text-transform: uppercase; background: var(--bg-light); padding: 2px 8px; border-radius: 10px; color: var(--text-medium); font-weight: 700; }
        .role-tag.user { background: #E3F2FD; color: #1976D2; }
        .role-tag.request { background: #FFF3E0; color: #F57C00; }
        
        .verification-card { display: flex; flex-direction: column; gap: 1rem; border-left: 4px solid var(--warning); }
        .verification-card.user-type { border-left-color: #2196F3; }
        .verification-card.request-type { border-left-color: #FF9800; }
        
        .user-brief { display: flex; flex-direction: column; }
        .item-meta { display: flex; gap: 1rem; font-size: 0.85rem; color: var(--text-medium); margin-top: 0.25rem; }
        
        .btn-view-doc { display: block; width: 100%; padding: 0.75rem; background: var(--bg-light); text-align: center; color: var(--text-dark); border-radius: var(--radius-sm); font-size: 0.9rem; font-weight: 500; border: 1.5px solid var(--border-color); cursor: pointer; transition: all 0.2s; }
        .btn-view-doc:hover { background: var(--secondary-red); border-color: var(--primary-red); color: var(--primary-red); }
        .no-doc-warning { padding: 0.75rem; background: #FFF3E0; text-align: center; color: #F57C00; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 500; border: 1.5px solid #FFE0B2; }
        
        .action-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .btn-approve { background: var(--success); color: white; border: none; padding: 0.6rem; border-radius: var(--radius-sm); font-weight: 600; cursor: pointer; }
        .btn-reject { background: var(--error); color: white; border: none; padding: 0.6rem; border-radius: var(--radius-sm); font-weight: 600; cursor: pointer; }
      `}</style>
        </div>
    );
};

export default AdminDashboard;
