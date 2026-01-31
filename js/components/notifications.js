export function initNotificationCenter() {
    // Add notification bell to header if not present
    const authStatus = document.getElementById('auth-status');
    if (authStatus && !document.getElementById('notif-trigger')) {
        authStatus.innerHTML = `
            <div class="header-actions">
                <button id="notif-trigger" class="notif-btn">
                    <span class="notif-icon">🔔</span>
                    <span class="notif-badge">3</span>
                </button>
            </div>
        `;
        
        setupNotifListeners();
    }
}

function setupNotifListeners() {
    const trigger = document.getElementById('notif-trigger');
    trigger.addEventListener('click', () => {
        toggleNotificationPanel();
    });
}

export function toggleNotificationPanel() {
    let panel = document.getElementById('notif-panel');
    
    if (panel) {
        panel.classList.toggle('active');
        return;
    }

    // Create panel
    panel = document.createElement('div');
    panel.id = 'notif-panel';
    panel.className = 'notif-panel fade-in active';
    panel.innerHTML = `
        <div class="notif-panel-header">
            <h4>Notifications</h4>
            <button id="close-notifs">✕</button>
        </div>
        <div class="notif-list">
            <div class="notif-item unread">
                <div class="notif-icon-circle" style="background: var(--secondary-red);">🩸</div>
                <div class="notif-body">
                    <p><strong>New Request!</strong> Recipient #4421 needs A+ blood within 5km.</p>
                    <span class="notif-time">2 mins ago</span>
                </div>
            </div>
            <div class="notif-item unread">
                <div class="notif-icon-circle" style="background: #E3F2FD;">📝</div>
                <div class="notif-body">
                    <p><strong>Verification Update:</strong> Your medical report is currently under review.</p>
                    <span class="notif-time">1 hour ago</span>
                </div>
            </div>
            <div class="notif-item">
                <div class="notif-icon-circle" style="background: #E8F5E9;">✅</div>
                <div class="notif-body">
                    <p><strong>Account Active:</strong> You can now start receiving donation requests.</p>
                    <span class="notif-time">Yesterday</span>
                </div>
            </div>
        </div>
        <div class="notif-footer">
            <button>Mark all as read</button>
        </div>
    `;

    document.body.appendChild(panel);

    document.getElementById('close-notifs').addEventListener('click', () => {
        panel.classList.remove('active');
    });

    // Styles for notification panel
    if (!document.getElementById('notif-styles')) {
        const style = document.createElement('style');
        style.id = 'notif-styles';
        style.innerHTML = `
            .header-actions { display: flex; align-items: center; }
            .notif-btn { background: none; border: none; font-size: 1.25rem; cursor: pointer; position: relative; padding: 0.5rem; }
            .notif-badge { 
                position: absolute; top: 2px; right: 2px; background: var(--primary-red); color: white;
                font-size: 0.65rem; padding: 2px 6px; border-radius: 10px; font-weight: 700;
                border: 2px solid white;
            }
            
            .notif-panel {
                position: fixed; top: 0; right: -320px; width: 320px; height: 100vh;
                background: white; z-index: 1000; box-shadow: -5px 0 15px rgba(0,0,0,0.1);
                transition: right 0.3s ease; display: flex; flex-direction: column;
            }
            .notif-panel.active { right: 0; }
            
            .notif-panel-header { padding: 1.25rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); }
            .notif-panel-header h4 { margin: 0; }
            #close-notifs { background: none; border: none; font-size: 1.1rem; cursor: pointer; color: var(--text-light); }
            
            .notif-list { flex: 1; overflow-y: auto; }
            .notif-item { padding: 1.25rem; display: flex; gap: 1rem; border-bottom: 1px solid var(--bg-light); cursor: pointer; transition: background 0.2s; }
            .notif-item:hover { background: var(--bg-light); }
            .notif-item.unread { background: #FFF8F8; }
            
            .notif-icon-circle { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
            .notif-body p { font-size: 0.85rem; margin: 0; line-height: 1.3; }
            .notif-time { font-size: 0.75rem; color: var(--text-light); margin-top: 0.25rem; display: block; }
            
            .notif-footer { padding: 1rem; text-align: center; border-top: 1px solid var(--border-color); }
            .notif-footer button { background: none; border: none; color: var(--primary-red); font-weight: 600; font-size: 0.85rem; cursor: pointer; }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Show a transient toast notification
 * @param {string} title 
 * @param {string} message 
 */
export function showToast(title, message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notif fade-in';
    toast.innerHTML = `
        <div class="toast-content">
            <strong>${title}</strong>
            <p>${message}</p>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.innerHTML = `
            .toast-notif {
                position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                background: rgba(51, 51, 51, 0.95); color: white; padding: 1rem 1.5rem;
                border-radius: var(--radius-md); z-index: 2000; min-width: 280px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            .toast-content strong { display: block; font-size: 0.95rem; margin-bottom: 0.2rem; color: var(--accent-red); }
            .toast-content p { margin: 0; font-size: 0.85rem; opacity: 0.9; }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}
