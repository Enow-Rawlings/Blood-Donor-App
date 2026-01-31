export function renderDonorDashboard() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="dashboard donor-dashboard fade-in">
            <header class="dashboard-header">
                <div class="user-greeting">
                    <h2>Hello, Donor!</h2>
                    <p>You have saved 3 lives so far.</p>
                </div>
                <div class="status-badge active">Verified</div>
            </header>

            <div class="availability-card card">
                <div class="availability-header">
                    <h4>Availability Status</h4>
                    <label class="switch">
                        <input type="checkbox" id="availability-toggle" checked>
                        <span class="slider round"></span>
                    </label>
                </div>
                <p id="availability-text" style="font-size: 0.9rem; color: var(--text-medium); margin-top: 0.5rem;">
                    You are currently <strong>Active</strong> and visible to recipients.
                </p>
            </div>

            <div class="stats-grid">
                <div class="stat-card card">
                    <span class="stat-value">A+</span>
                    <span class="stat-label">Blood Type</span>
                </div>
                <div class="stat-card card">
                    <span class="stat-value">56</span>
                    <span class="stat-label">Days to next</span>
                </div>
                <div class="stat-card card">
                    <span class="stat-value">2</span>
                    <span class="stat-label">Pending</span>
                </div>
            </div>

            <section class="request-queue">
                <div class="section-title">
                    <h4>Active Requests</h4>
                    <a href="#all-requests">View All</a>
                </div>
                
                <div class="request-card card">
                    <div class="request-info">
                        <span class="urgency-badge critical">Critical</span>
                        <p><strong>Recipient #9902</strong> needs A+ blood</p>
                        <p class="request-meta">City Hospital • 2.4 km away</p>
                    </div>
                    <div class="request-actions">
                        <button class="btn btn-primary btn-sm btn-accept">Accept</button>
                        <button class="btn btn-secondary btn-sm btn-decline">Decline</button>
                    </div>
                </div>

                <div class="request-card card">
                    <div class="request-info">
                        <span class="urgency-badge moderate">Moderate</span>
                        <p><strong>Recipient #4421</strong> needs A+ blood</p>
                        <p class="request-meta">Red Cross Center • 5.1 km away</p>
                    </div>
                    <div class="request-actions">
                        <button class="btn btn-primary btn-sm btn-accept">Accept</button>
                        <button class="btn btn-secondary btn-sm btn-decline">Decline</button>
                    </div>
                </div>
            </section>
        </div>
    `;

    if (!document.getElementById('dashboard-styles')) {
        const style = document.createElement('style');
        style.id = 'dashboard-styles';
        style.innerHTML = `
            .dashboard-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
            .status-badge { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; background: var(--secondary-red); color: var(--primary-red); }
            .status-badge.active { background: #E8F5E9; color: #2E7D32; }
            
            .availability-header { display: flex; justify-content: space-between; align-items: center; }
            .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin: 1.5rem 0; }
            .stat-card { text-align: center; padding: 1rem 0.5rem; display: flex; flex-direction: column; gap: 0.25rem; }
            .stat-value { font-size: 1.25rem; font-weight: 700; color: var(--primary-red); }
            .stat-label { font-size: 0.7rem; color: var(--text-light); text-transform: uppercase; }

            .section-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
            .section-title h4 { margin: 0; }
            .section-title a { font-size: 0.85rem; color: var(--primary-red); text-decoration: none; font-weight: 600; }

            .request-card { padding: 1rem; margin-bottom: 0.75rem; }
            .urgency-badge { font-size: 0.7rem; padding: 0.1rem 0.5rem; border-radius: 4px; font-weight: 700; text-transform: uppercase; margin-bottom: 0.5rem; display: inline-block; }
            .urgency-badge.critical { background: var(--error); color: white; }
            .urgency-badge.moderate { background: var(--warning); color: white; }
            
            .request-meta { font-size: 0.85rem; color: var(--text-light); margin-top: 0.25rem; }
            .request-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1rem; }
            .btn-sm { padding: 0.5rem; font-size: 0.9rem; }
            .btn-decline { background: var(--border-color); color: var(--text-medium); }

            /* Toggle Switch */
            .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
            .switch input { opacity: 0; width: 0; height: 0; }
            .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px; }
            .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
            input:checked + .slider { background-color: var(--success); }
            input:checked + .slider:before { transform: translateX(20px); }
        `;
        document.head.appendChild(style);
    }

    // Toggle logic
    const toggle = document.getElementById('availability-toggle');
    const text = document.getElementById('availability-text');
    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            text.innerHTML = 'You are currently <strong>Active</strong> and visible to recipients.';
        } else {
            text.innerHTML = 'You are currently <strong>Inactive</strong>. You will not receive new requests.';
        }
    });

    // Accept/Decline logic
    document.querySelectorAll('.btn-accept').forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.hash = 'chat?id=9902';
        });
    });
}
