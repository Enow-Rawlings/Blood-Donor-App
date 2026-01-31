import { renderChat } from './components/chat.js';
import { renderAdminDashboard } from './components/admin-dashboard.js';
import { initNotificationCenter, showToast } from './components/notifications.js';
import { renderProfile } from './components/profile.js';

// App entry point
document.addEventListener('DOMContentLoaded', () => {
    console.log('BloodConnect Initialized');
    initNotificationCenter();
    
    // Simple router based on hash
    const handleRoute = () => {
        const hash = window.location.hash;
        const bottomNav = document.getElementById('bottom-nav');
        
        // Update active nav state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('href') === hash);
        });

        if (hash === '#register-donor') {
            renderDonorRegistration();
            bottomNav.style.display = 'none';
        } else if (hash === '#register-recipient') {
            renderRecipientRegistration();
            bottomNav.style.display = 'none';
        } else if (hash === '#login') {
            renderLogin();
            bottomNav.style.display = 'none';
        } else if (hash === '#donor-dashboard' || hash === '#home') {
            renderDonorDashboard();
            bottomNav.style.display = 'flex';
        } else if (hash.startsWith('#chat')) {
            const recipientId = hash.split('=')[1] || '9902';
            renderChat(recipientId);
            bottomNav.style.display = 'none';
        } else if (hash === '#admin-dashboard') {
            renderAdminDashboard();
            bottomNav.style.display = 'none';
        } else if (hash === '#search') {
            renderDonorSearch();
            bottomNav.style.display = 'flex';
        } else if (hash === '#profile') {
            renderProfile();
            bottomNav.style.display = 'flex';
        } else {
            renderLandingPage();
            bottomNav.style.display = 'none';
        }
    };

    window.addEventListener('hashchange', handleRoute);
    handleRoute();
});

function initApp() {
    renderLandingPage();
}

function renderLandingPage() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="landing-page fade-in">
            <div class="hero-section text-center">
                <div class="hero-image">
                    <span style="font-size: 4rem;">🤝</span>
                </div>
                <h2 style="margin-top: 1rem; font-size: 1.75rem;">Your donation can save someone's life today.</h2>
                <p style="color: var(--text-medium); margin: 1rem 0 2.5rem;">Connecting generous donors with those in urgent need. Simple, fast, and secure.</p>
            </div>
            
            <div class="auth-box">
                <button class="btn btn-primary" id="btn-donor-reg" style="margin-bottom: 1rem;" onclick="window.location.hash='register-donor'">Register as Donor</button>
                <button class="btn btn-secondary" id="btn-recipient-reg" style="background: var(--accent-red); color: var(--primary-red);" onclick="window.location.hash='register-recipient'">Request Blood</button>
                
                <p style="text-align: center; margin-top: 2rem; font-size: 0.9rem;">
                    Already have an account? <a href="#login" style="color: var(--primary-red); font-weight: 600; text-decoration: none;">Login</a>
                </p>
            </div>
        </div>
    `;
    
    // Add simple animation styles dynamically for demonstration
    if (!document.getElementById('landing-styles')) {
        const style = document.createElement('style');
        style.id = 'landing-styles';
        style.innerHTML = `
            .fade-in { animation: fadeIn 0.5s ease-out; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .text-center { text-align: center; }
            .hero-section { padding: 2rem 0; }
        `;
        document.head.appendChild(style);
    }
}
