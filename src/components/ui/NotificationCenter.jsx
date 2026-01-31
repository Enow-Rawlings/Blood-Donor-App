import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

const NotificationCenter = ({ isOpen, onClose }) => {
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!currentUser) return;

        // In a real app, you'd have a notifications collection
        // For now, we simulate by listening to requests or status changes
        const q = query(collection(db, "notifications"), where("recipientId", "==", currentUser.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotifications(notifs);
        });

        return unsubscribe;
    }, [currentUser]);

    return (
        <div className={`notif-panel ${isOpen ? 'active' : ''}`}>
            <div className="notif-panel-header">
                <h4>Notifications</h4>
                <button onClick={onClose}>✕</button>
            </div>
            <div className="notif-list">
                {notifications.length === 0 ? (
                    <div className="empty-notifs">No new notifications</div>
                ) : (
                    notifications.map(notif => (
                        <div key={notif.id} className="notif-item unread">
                            <div className="notif-icon-circle">🩸</div>
                            <div className="notif-body">
                                <p><strong>{notif.title}</strong> {notif.body}</p>
                                <span className="notif-time">Just now</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
        .notif-panel {
          position: fixed; top: 0; right: -320px; width: 320px; height: 100vh;
          background: white; z-index: 1000; box-shadow: -5px 0 15px rgba(0,0,0,0.1);
          transition: right 0.3s ease; display: flex; flex-direction: column;
        }
        .notif-panel.active { right: 0; }
        
        .notif-panel-header { padding: 1.25rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); }
        .notif-panel-header h4 { margin: 0; }
        
        .notif-list { flex: 1; overflow-y: auto; }
        .notif-item { padding: 1.25rem; display: flex; gap: 1rem; border-bottom: 1px solid var(--bg-light); cursor: pointer; transition: background 0.2s; }
        .notif-item:hover { background: var(--bg-light); }
        .notif-item.unread { background: #FFF8F8; }
        
        .notif-icon-circle { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; background: var(--secondary-red); }
        .notif-body p { font-size: 0.85rem; margin: 0; line-height: 1.3; }
        .notif-time { font-size: 0.75rem; color: var(--text-light); margin-top: 0.25rem; display: block; }
        .empty-notifs { text-align: center; color: var(--text-light); padding: 3rem 1rem; font-size: 0.9rem; }
      `}</style>
        </div>
    );
};

export default NotificationCenter;
