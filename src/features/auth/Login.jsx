import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logIn } from './authService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error: loginError } = await logIn(email, password);

        if (loginError) {
            setError(loginError);
            setLoading(false);
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="auth-container fade-in">
            <header className="section-header">
                <h2>Welcome Back</h2>
                <p>Login to your account</p>
            </header>

            {error && <div className="error-alert card">{error}</div>}

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

                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ marginTop: '1.5rem' }}
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
        .section-header h2 { margin-bottom: 0.25rem; }
        .section-header p { color: var(--text-medium); }
      `}</style>
        </div>
    );
};

export default Login;
