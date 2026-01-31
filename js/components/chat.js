export function renderChat(recipientId) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="chat-page fade-in">
            <header class="section-header chat-header">
                <button class="back-btn" id="back-to-dashboard">←</button>
                <div class="chat-user-info">
                    <h4>Recipient #${recipientId}</h4>
                    <span class="online-indicator">Online</span>
                </div>
            </header>

            <div class="chat-messages" id="chat-messages">
                <div class="message received">
                    <p>Hello! I saw you accepted my request. Thank you so much!</p>
                    <span class="msg-time">10:42 AM</span>
                </div>
                <div class="message sent">
                    <p>You're welcome. I'm happy to help. Which hospital should I go to?</p>
                    <span class="msg-time">10:45 AM</span>
                </div>
                <div class="message received">
                    <p>City General Hospital, Ward 4. When can you make it?</p>
                    <span class="msg-time">10:46 AM</span>
                </div>
            </div>

            <div class="chat-input-area card">
                <button class="attach-btn">📎</button>
                <input type="text" id="chat-input" placeholder="Type a message...">
                <button class="send-btn" id="btn-send-msg">➤</button>
            </div>
        </div>
    `;

    if (!document.getElementById('chat-styles')) {
        const style = document.createElement('style');
        style.id = 'chat-styles';
        style.innerHTML = `
            .chat-page { display: flex; flex-direction: column; height: 85vh; }
            .chat-header { display: flex; align-items: center; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color); }
            .chat-user-info h4 { margin: 0; }
            .online-indicator { font-size: 0.75rem; color: var(--success); }
            
            .chat-messages { flex: 1; overflow-y: auto; padding: 1rem 0; display: flex; flex-direction: column; gap: 1rem; }
            .message { max-width: 80%; padding: 0.75rem 1rem; border-radius: 18px; font-size: 0.95rem; position: relative; }
            .message.received { align-self: flex-start; background: var(--border-color); color: var(--text-dark); border-bottom-left-radius: 4px; }
            .message.sent { align-self: flex-end; background: var(--primary-red); color: white; border-bottom-right-radius: 4px; }
            
            .msg-time { font-size: 0.7rem; opacity: 0.7; display: block; margin-top: 0.25rem; text-align: right; }
            
            .chat-input-area { 
                display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; margin-top: 1rem;
                position: sticky; bottom: 80px; 
            }
            .chat-input-area input { flex: 1; border: none; outline: none; font-family: inherit; font-size: 1rem; }
            .attach-btn, .send-btn { background: none; border: none; font-size: 1.25rem; cursor: pointer; color: var(--text-light); }
            .send-btn { color: var(--primary-red); }
        `;
        document.head.appendChild(style);
    }

    document.getElementById('back-to-dashboard').addEventListener('click', () => {
        window.location.hash = 'donor-dashboard';
    });

    const sendMsg = () => {
        const input = document.getElementById('chat-input');
        if (!input.value.trim()) return;

        const msgContainer = document.getElementById('chat-messages');
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message sent';
        msgDiv.innerHTML = `
            <p>${input.value}</p>
            <span class="msg-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        `;
        msgContainer.appendChild(msgDiv);
        input.value = '';
        msgContainer.scrollTop = msgContainer.scrollHeight;
    };

    document.getElementById('btn-send-msg').addEventListener('click', sendMsg);
    document.getElementById('chat-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMsg();
    });
}
