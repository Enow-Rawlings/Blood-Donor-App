import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    where
} from 'firebase/firestore';

const Chat = () => {
    const { chatId } = useParams();
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        if (!chatId) return;

        const q = query(
            collection(db, "messages"),
            where("chatId", "==", chatId),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(msgs);
            setLoading(false);

            // Auto-scroll to bottom
            setTimeout(() => {
                scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        });

        return unsubscribe;
    }, [chatId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await addDoc(collection(db, "messages"), {
                chatId: chatId,
                senderId: currentUser.uid,
                text: newMessage,
                createdAt: serverTimestamp()
            });
            setNewMessage('');
        } catch (error) {
            console.error("Message failed", error);
        }
    };

    return (
        <div className="chat-container fade-in">
            <header className="chat-header">
                <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                <div className="chat-user-info">
                    <h4>Coordination Chat</h4>
                    <span className="online-status">Active Request</span>
                </div>
            </header>

            <div className="message-list">
                {loading ? (
                    <div className="chat-loader">
                        <div className="loader-spinner"></div>
                        <p>Loading conversation...</p>
                        <p className="loader-hint">If this takes too long, please create the required Firestore index.</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="empty-chat">
                        <span className="empty-icon">💬</span>
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map(msg => (
                        <div
                            key={msg.id}
                            className={`message-item ${msg.senderId === currentUser.uid ? 'sent' : 'received'}`}
                        >
                            <div className="message-bubble">
                                <p>{msg.text}</p>
                                <span className="message-time">
                                    {msg.createdAt?.toDate?.()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Sending...'}
                                </span>
                            </div>
                        </div>
                    ))
                )}
                <div ref={scrollRef}></div>
            </div>

            <form className="chat-input-area" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit" disabled={!newMessage.trim()}>Send</button>
            </form>

            <style>{`
        .chat-container { 
            display: flex; 
            flex-direction: column; 
            height: 100vh;
            max-height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: white;
            z-index: 50;
        }
        .chat-header { 
            display: flex; 
            align-items: center; 
            gap: 1rem; 
            padding: 1rem; 
            border-bottom: 1px solid var(--border-color); 
            background: var(--bg-white);
            flex-shrink: 0;
        }
        .back-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--primary-red); }
        .online-status { font-size: 0.75rem; color: var(--success); }

        .message-list { 
            flex: 1; 
            overflow-y: auto; 
            overflow-x: hidden;
            padding: 1rem; 
            display: flex; 
            flex-direction: column; 
            gap: 0.75rem; 
            background: linear-gradient(135deg, #FFF9F9 0%, #FFE8E8 100%);
            background-image: 
                radial-gradient(circle at 20% 30%, rgba(220, 38, 38, 0.03) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(220, 38, 38, 0.03) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(220, 38, 38, 0.02) 0%, transparent 50%);
            -webkit-overflow-scrolling: touch;
        }
        .message-item { display: flex; width: 100%; }
        .message-item.sent { justify-content: flex-end; }
        .message-bubble { max-width: 80%; padding: 0.75rem 1rem; border-radius: 12px; position: relative; word-wrap: break-word; }
        .sent .message-bubble { background: var(--primary-red); color: white; border-bottom-right-radius: 2px; }
        .received .message-bubble { background: var(--bg-white); color: var(--text-dark); border-bottom-left-radius: 2px; box-shadow: var(--shadow-sm); }
        
        .message-bubble p { margin: 0; font-size: 0.95rem; line-height: 1.4; }
        .message-time { font-size: 0.65rem; opacity: 0.7; margin-top: 0.25rem; display: block; text-align: right; }

        .chat-input-area { 
            display: flex; 
            gap: 0.5rem; 
            padding: 1rem; 
            background: var(--bg-white); 
            border-top: 1px solid var(--border-color);
            flex-shrink: 0;
            position: sticky;
            bottom: 0;
        }
        .chat-input-area input { 
            flex: 1; 
            padding: 0.75rem; 
            border-radius: 24px; 
            border: 1.5px solid var(--border-color); 
            outline: none;
            font-size: 1rem;
        }
        .chat-input-area button { 
            background: var(--primary-red); 
            color: white; 
            border: none; 
            padding: 0.75rem 1.25rem; 
            border-radius: 24px; 
            font-weight: 600; 
            cursor: pointer;
            white-space: nowrap;
        }
        .chat-input-area button:disabled { opacity: 0.5; cursor: not-allowed; }
        
        .chat-loader { 
            display: flex; 
            flex-direction: column;
            align-items: center; 
            justify-content: center; 
            padding: 3rem 1rem; 
            color: var(--text-medium);
            gap: 1rem;
        }

        .loader-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--secondary-red);
            border-top-color: var(--primary-red);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .loader-hint {
            font-size: 0.75rem;
            color: var(--text-light);
            text-align: center;
            max-width: 250px;
        }

        .empty-chat {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 3rem 1rem;
            color: var(--text-light);
            gap: 0.5rem;
        }

        .empty-icon {
            font-size: 3rem;
            opacity: 0.5;
        }
      `}</style>
        </div>
    );
};

export default Chat;
