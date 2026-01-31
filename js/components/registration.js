import { registerUser } from '../db/firebase-config.js';

export function renderDonorRegistration() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="auth-container fade-in">
            <header class="section-header">
                <button class="back-btn" id="back-to-landing">←</button>
                <h2>Donor Registration</h2>
                <p>Join the life-saving community</p>
            </header>

            <form id="donor-reg-form" class="auth-form">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" name="fullName" required placeholder="John Doe">
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label>Age (18-65)</label>
                        <input type="number" name="age" min="18" max="65" required>
                    </div>
                    <div class="form-group">
                        <label>Gender</label>
                        <select name="gender" required>
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label>Blood Type</label>
                    <select name="bloodType" required class="blood-type-select">
                        <option value="">Select Blood Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Medical Report (PDF/JPG)</label>
                    <div class="file-upload-card">
                        <input type="file" id="medical-report" accept=".pdf,.jpg,.png" required style="display:none">
                        <label for="medical-report" class="file-label">
                            <span class="upload-icon">📄</span>
                            <span id="file-name">Upload medical report</span>
                            <span class="file-hint">Max 5MB</span>
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" required placeholder="email@example.com">
                </div>

                <div class="form-group">
                    <label>Password (Min 8 characters)</label>
                    <input type="password" name="password" minlength="8" required>
                </div>

                <div class="form-check">
                    <input type="checkbox" id="terms" required>
                    <label for="terms">I agree to the <a href="#">Terms & Conditions</a></label>
                </div>

                <button type="submit" class="btn btn-primary" style="margin-top: 1.5rem;">Create Donor Account</button>
            </form>
        </div>
    `;

    // Add CSS for form if not present
    if (!document.getElementById('auth-styles')) {
        const style = document.createElement('style');
        style.id = 'auth-styles';
        style.innerHTML = `
            .auth-form { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem; }
            .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
            .form-group label { font-size: 0.9rem; font-weight: 500; color: var(--text-medium); }
            .form-group input, .form-group select { 
                padding: 0.8rem; border-radius: var(--radius-sm); border: 1.5px solid var(--border-color);
                font-family: inherit; font-size: 1rem;
            }
            .form-group input:focus { outline: none; border-color: var(--primary-red); }
            .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
            .file-upload-card {
                border: 2px dashed var(--border-color); padding: 1.5rem; border-radius: var(--radius-sm);
                text-align: center; cursor: pointer; transition: all 0.2s;
            }
            .file-upload-card:hover { border-color: var(--primary-red); background: var(--secondary-red); }
            .file-label { display: flex; flex-direction: column; gap: 0.5rem; cursor: pointer; }
            .upload-icon { font-size: 1.5rem; }
            .file-hint { font-size: 0.8rem; color: var(--text-light); }
            .section-header { display: flex; flex-direction: column; gap: 0.25rem; }
            .back-btn { 
                background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-dark);
                width: fit-content; margin-bottom: 0.5rem; padding: 0;
            }
            .form-check { display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.9rem; margin-top: 0.5rem; }
            .form-check input { margin-top: 0.2rem; }
        `;
        document.head.appendChild(style);
    }

    // Event Listeners
    document.getElementById('back-to-landing').addEventListener('click', () => {
        window.location.hash = '';
        location.reload(); // Simple routing for now
    });

    document.getElementById('medical-report').addEventListener('change', (e) => {
        const fileName = e.target.files[0]?.name || 'Upload medical report';
        document.getElementById('file-name').textContent = fileName;
    });

    document.getElementById('donor-reg-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.role = 'donor';
        
        const btn = e.target.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Creating Account...';

        setTimeout(() => {
            alert('Donor request submitted! Review expected in 24-48 hours.');
            btn.disabled = false;
            btn.textContent = 'Create Donor Account';
            window.location.hash = '';
        }, 1500);
    });
}

export function renderRecipientRegistration() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="auth-container fade-in">
            <header class="section-header">
                <button class="back-btn" id="back-to-landing-rec">←</button>
                <h2>Request Blood</h2>
                <p>Register to find compatible donors</p>
            </header>

            <form id="recipient-reg-form" class="auth-form">
                <div class="form-group">
                    <label>Patient Full Name</label>
                    <input type="text" name="fullName" required placeholder="Jane Doe">
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label>Patient Age</label>
                        <input type="number" name="age" min="0" max="120" required>
                    </div>
                    <div class="form-group">
                        <label>Urgency Level</label>
                        <select name="urgency" required>
                            <option value="moderate">Moderate</option>
                            <option value="high">High</option>
                            <option value="critical">Critical (Immediate)</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label>Needed Blood Type</label>
                    <select name="bloodType" required class="blood-type-select">
                        <option value="">Select Blood Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Medical Prescription / Doctor's Note</label>
                    <div class="file-upload-card" id="prescription-upload-box">
                        <input type="file" id="prescription" accept=".pdf,.jpg,.png" required style="display:none">
                        <label for="prescription" class="file-label">
                            <span class="upload-icon">🏥</span>
                            <span id="prescription-file-name">Upload doctor's note</span>
                            <span class="file-hint">Mandatory for verification</span>
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label>Secondary Contact Phone</label>
                    <input type="tel" name="phone" required placeholder="+1 234 567 890">
                </div>

                <div class="form-group">
                    <label>Email (for account)</label>
                    <input type="email" name="email" required placeholder="email@example.com">
                </div>

                <div class="form-group">
                    <label>Password</label>
                    <input type="password" name="password" minlength="8" required>
                </div>

                <button type="submit" class="btn btn-primary" style="margin-top: 1rem; background: var(--text-dark);">Register Request</button>
            </form>
        </div>
    `;

    document.getElementById('back-to-landing-rec').addEventListener('click', () => {
        window.location.hash = '';
        location.reload();
    });

    document.getElementById('prescription').addEventListener('change', (e) => {
        const fileName = e.target.files[0]?.name || "Upload doctor's note";
        document.getElementById('prescription-file-name').textContent = fileName;
    });

    document.getElementById('recipient-reg-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Processing...';

        setTimeout(() => {
            import('./notifications.js').then(m => {
                m.showToast('Registration Successful', 'Your request is now being reviewed by our admins.');
            });
            btn.disabled = false;
            btn.textContent = 'Register Request';
            window.location.hash = '';
        }, 1500);
    });
}
