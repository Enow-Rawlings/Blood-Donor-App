import { showToast } from './notifications.js';

export function renderProfile() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="profile-page fade-in">
            <header class="section-header">
                <h2>My Profile</h2>
                <p>Manage your account and preferences</p>
            </header>

            <div class="profile-card card">
                <div class="profile-header">
                    <div class="profile-avatar">👤</div>
                    <div class="profile-info">
                        <h4>John Doe</h4>
                        <p>Donor | A+ Blood</p>
                    </div>
                </div>
            </div>

            <section class="preferences-section">
                <div class="section-title">
                    <h4>Notifications</h4>
                </div>
                <div class="preference-card card">
                    <div class="pref-item">
                        <span>Push Notifications</span>
                        <label class="switch">
                            <input type="checkbox" id="push-notif-toggle">
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <p class="pref-desc">Get notified about urgent requests near you even when the app is closed.</p>
                </div>
                
                <div class="preference-card card">
                    <div class="pref-item">
                        <span>Quiet Hours</span>
                        <label class="switch">
                            <input type="checkbox">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </section>

            <section class="account-section" style="margin-top: 1.5rem;">
                <button class="btn btn-secondary" style="color: var(--primary-red); margin-bottom: 0.75rem;" id="btn-logout">Logout</button>
                <button class="btn btn-secondary" style="color: var(--text-light); border-color: transparent;">Delete Account</button>
            </section>
        </div>
    `;

    if (!document.getElementById('profile-styles')) {
        const style = document.createElement('style');
        style.id = 'profile-styles';
        style.innerHTML = `
            .profile-header { display: flex; align-items: center; gap: 1rem; }
            .profile-avatar { width: 60px; height: 60px; background: var(--secondary-red); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; }
            .pref-item { display: flex; justify-content: space-between; align-items: center; }
            .pref-desc { font-size: 0.8rem; color: var(--text-light); margin-top: 0.5rem; }
            .preference-card { padding: 1rem; margin-bottom: 0.75rem; }
        `;
        document.head.appendChild(style);
    }

    // Push notification toggle logic
    const pushToggle = document.getElementById('push-notif-toggle');
    pushToggle.addEventListener('change', async () => {
        if (pushToggle.checked) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                showToast('Notifications Enabled', 'You will now receive push alerts for urgent requests.');
            } else {
                pushToggle.checked = false;
                showToast('Permission Denied', 'Please enable notifications in your browser settings.');
            }
        }
    });

    document.getElementById('btn-logout').addEventListener('click', () => {
        window.location.hash = '';
        location.reload();
    });
}
