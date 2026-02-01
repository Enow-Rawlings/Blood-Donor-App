import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logIn, resetPassword } from './authService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const { error: loginError } = await logIn(email, password);

        if (loginError) {
            setError(loginError);
            setLoading(false);
        } else {
            navigate('/dashboard');
        }
    };

    const handleResetPassword = async () => {
        if (!email) {
            setError('Please enter your email first to reset password.');
            return;
        }
        setError('');
        setSuccess('');
        try {
            await resetPassword(email);
            setSuccess('Password reset link sent to your email!');
        } catch (err) {
            setError('Failed to send reset email. ' + err.message);
        }
    };

    return (
        <div className="auth-container fade-in">
            <header className="section-header">
                <h2>Welcome Back</h2>
                <p>Login to your account</p>
            </header>

            {error && <div className="error-alert card">{error}</div>}
            {success && <div className="success-alert card">{success}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="email@example.com"
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
                    <button
                        type="button"
                        onClick={handleResetPassword}
                        style={{ background: 'none', border: 'none', color: 'var(--primary-red)', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                        Forgot Password?
                    </button>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ marginTop: '1rem' }}
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem' }}>
                Don't have an account? <Link to="/" style={{ color: 'var(--primary-red)', fontWeight: 600, textDecoration: 'none' }}>Register</Link>
            </p>

            <style>{`
        .auth-form { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-size: 0.9rem; font-weight: 500; color: var(--text-medium); }
        .form-group input { 
          padding: 0.8rem; border-radius: var(--radius-sm); border: 1.5px solid var(--border-color);
          font-family: inherit; font-size: 1rem;
        }
        .form-group input:focus { outline: none; border-color: var(--primary-red); }
        .error-alert { background: #FFEBEE; color: var(--error); border: 1px solid var(--error); font-size: 0.9rem; padding: 0.75rem; }
        .success-alert { background: #E8F5E9; color: #2E7D32; border: 1px solid #2E7D32; font-size: 0.9rem; padding: 0.75rem; margin-bottom: 1rem; }
        .section-header h2 { margin-bottom: 0.25rem; }
        .section-header p { color: var(--text-medium); }
      `}</style>
        </div>
    );
};

export default Login;
