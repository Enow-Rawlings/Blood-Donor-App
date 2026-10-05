import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChatList = () => {
    const { currentUser } = useAuth();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) return;

        const chatsQuery = query(
            collection(db, "chats"),
            where("participants", "array-contains", currentUser.uid)
        );

        const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
            const results = snapshot.docs.map(chatDoc => ({
                id: chatDoc.id,
                ...chatDoc.data(),
                chatType: chatDoc.data().donorId === currentUser.uid ? 'donor' : 'recipient'
            })).filter(chat => chat.status === 'accepted');
            results.sort((a, b) => (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0));
            setChats(results);
            setLoading(false);
        }, (error) => {
            console.error('Chats could not be loaded:', error);
            setChats([]);
            setLoading(false);
        });

        return unsubscribe;
    }, [currentUser]);

    if (loading) return <div className="chat-loader">Loading connections...</div>;

    return (
        <div className="chat-list-container fade-in">
            {chats.length === 0 ? (
                <div className="empty-chats card">
                    <p>No active connections found. Start a request to begin messaging.</p>
                </div>
            ) : (
                chats.map(chat => (
                    <div
                        key={chat.id}
                        className="chat-item card"
                        onClick={() => navigate(`/chat/${chat.id}`)}
                    >
                        <div className="chat-avatar">
                            {chat.chatType === 'recipient' ? (chat.donorName?.[0] || 'D') : (chat.recipientName?.[0] || 'R')}
                        </div>
                        <div className="chat-info">
                            <div className="chat-header-row">
                                <strong>
                                    {chat.chatType === 'recipient' ? chat.donorName : chat.recipientName}
                                </strong>
                                <span className={`status-tag ${chat.status}`}>{chat.status}</span>
                            </div>
                            <p className="chat-meta">
                                {chat.bloodTypeNeeded} Blood | {chat.city}
                            </p>
                        </div>
                        <div className="chat-arrow">→</div>
                    </div>
                ))
            )}

            <style>{`
                .chat-list-container { display: flex; flex-direction: column; gap: 0.75rem; padding-bottom: 2rem; }
                .chat-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; cursor: pointer; transition: transform 0.2s; border-left: 4px solid var(--primary-red); }
                .chat-item:hover { transform: translateX(5px); background: #FFF9F9; }
                
                .chat-avatar { 
                    width: 50px; height: 50px; background: var(--secondary-red); 
                    border-radius: 50%; display: flex; align-items: center; 
                    justify-content: center; font-weight: 700; color: var(--primary-red);
                    font-size: 1.2rem;
                }
                
                .chat-info { flex: 1; }
                .chat-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; }
                .chat-meta { font-size: 0.8rem; color: var(--text-light); margin: 0; }
                
                .status-tag { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; }
                .status-tag.pending { background: #FFF3E0; color: #F57C00; }
                .status-tag.approved { background: #E8F5E9; color: #2E7D32; }
                
                .chat-arrow { color: var(--text-light); font-size: 1.2rem; }
                .empty-chats { text-align: center; padding: 3rem 1rem; color: var(--text-light); }
            `}</style>
        </div>
    );
};

export default ChatList;
