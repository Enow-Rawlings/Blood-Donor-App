export function renderLogin() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="auth-container fade-in">
            <header class="section-header">
                <button class="back-btn" id="back-to-landing-login">←</button>
                <h2>Welcome Back</h2>
                <p>Login to your account</p>
            </header>

            <form id="login-form" class="auth-form">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" required placeholder="email@example.com">
                </div>

                <div class="form-group">
                    <label>Password</label>
                    <input type="password" name="password" required>
                </div>

                <div style="text-align: right; margin-top: -0.5rem;">
                    <a href="#" style="font-size: 0.85rem; color: var(--primary-red); text-decoration: none;">Forgot Password?</a>
                </div>

                <button type="submit" class="btn btn-primary" style="margin-top: 1.5rem;">Login</button>
            </form>

            <div class="social-login" style="margin-top: 2.5rem; text-align: center;">
                <p style="font-size: 0.9rem; color: var(--text-light); margin-bottom: 1rem;">Or continue with</p>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button class="btn-social">Google</button>
                    <button class="btn-social">Facebook</button>
                </div>
            </div>

            <p style="text-align: center; margin-top: 2rem; font-size: 0.9rem;">
                Don't have an account? <a href="#register-donor" style="color: var(--primary-red); font-weight: 600; text-decoration: none;">Register</a>
            </p>
        </div>
    `;

    if (!document.getElementById('login-extra-styles')) {
        const style = document.createElement('style');
        style.id = 'login-extra-styles';
        style.innerHTML = `
            .btn-social { 
                flex: 1; padding: 0.75rem; border-radius: var(--radius-sm); border: 1.5px solid var(--border-color);
                background: white; cursor: pointer; font-weight: 500; font-family: inherit;
            }
        `;
        document.head.appendChild(style);
    }

    document.getElementById('back-to-landing-login').addEventListener('click', () => {
        window.location.hash = '';
        location.reload();
    });

    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        
        // Mock Login
        const btn = e.target.querySelector('button');
        btn.textContent = 'Verifying...';
        btn.disabled = true;

        setTimeout(() => {
            // Simulate roles for testing
            if (data.email.includes('donor')) {
                window.location.hash = 'donor-dashboard';
            } else if (data.email.includes('admin')) {
                window.location.hash = 'admin-dashboard';
            } else {
                window.location.hash = 'search';
            }
            location.reload();
        }, 1200);
    });
}
