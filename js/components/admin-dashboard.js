export function renderAdminDashboard() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="admin-dashboard fade-in">
            <header class="section-header">
                <h2>Admin Panel</h2>
                <p>Verify documents and manage users</p>
            </header>

            <div class="admin-stats stats-grid">
                <div class="stat-card card">
                    <span class="stat-value">12</span>
                    <span class="stat-label">Pending</span>
                </div>
                <div class="stat-card card">
                    <span class="stat-value">84</span>
                    <span class="stat-label">Approved</span>
                </div>
                <div class="stat-card card">
                    <span class="stat-value">92%</span>
                    <span class="stat-label">Reliability</span>
                </div>
            </div>

            <section class="verification-queue">
                <div class="section-title">
                    <h4>Pending Verification</h4>
                </div>

                <div class="verify-card card" id="verify-1">
                    <div class="verify-header">
                        <div class="user-meta">
                            <strong>John Wilson</strong>
                            <span class="user-type">Donor (O+)</span>
                        </div>
                        <span class="time-ago">2h ago</span>
                    </div>
                    <div class="doc-preview">
                        <div class="doc-icon">📄</div>
                        <p>medical_report_john.pdf</p>
                    </div>
                    <div class="verify-actions">
                        <button class="btn btn-primary btn-sm btn-verify" onclick="alert('Document Approved! User notified.')">Approve</button>
                        <button class="btn btn-secondary btn-sm btn-reject">Reject</button>
                    </div>
                </div>

                <div class="verify-card card" id="verify-2">
                    <div class="verify-header">
                        <div class="user-meta">
                            <strong>Sarah Miller</strong>
                            <span class="user-type">Recipient (B-)</span>
                        </div>
                        <span class="time-ago">5h ago</span>
                    </div>
                    <div class="doc-preview">
                        <div class="doc-icon">🏥</div>
                        <p>prescription_sarah.jpg</p>
                    </div>
                    <div class="verify-actions">
                        <button class="btn btn-primary btn-sm btn-verify">Approve</button>
                        <button class="btn btn-secondary btn-sm btn-reject">Reject Reason</button>
                    </div>
                </div>
            </section>
        </div>
    `;

    if (!document.getElementById('admin-styles')) {
        const style = document.createElement('style');
        style.id = 'admin-styles';
        style.innerHTML = `
            .user-meta { display: flex; flex-direction: column; }
            .user-type { font-size: 0.8rem; color: var(--text-medium); }
            .time-ago { font-size: 0.75rem; color: var(--text-light); }
            
            .verify-card { margin-bottom: 1rem; }
            .verify-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
            
            .doc-preview { 
                background: var(--bg-light); border-radius: var(--radius-sm); padding: 1rem;
                display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;
                border: 1px solid var(--border-color);
            }
            .doc-icon { font-size: 1.5rem; }
            .doc-preview p { font-size: 0.9rem; color: var(--text-dark); margin: 0; }
            
            .verify-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
            .btn-verify { background: var(--success); color: white; }
        `;
        document.head.appendChild(style);
    }
}
