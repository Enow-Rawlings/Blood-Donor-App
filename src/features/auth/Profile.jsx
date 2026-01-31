import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { logOut } from '../auth/authService';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { userData } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const isAdmin = userData?.role === 'admin';
        await logOut();
        if (isAdmin) {
            navigate('/admin-home');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="profile-page fade-in">
            <header className="section-header">
                <h2>My Profile</h2>
                <p>Manage your account and preferences</p>
            </header>

            <div className="profile-card card">
                <div className="profile-header">
                    <div className="profile-avatar">{userData?.fullName?.[0] || '👤'}</div>
                    <div className="profile-info">
                        <h4>{userData?.fullName || 'User'}</h4>
                        <p>{userData?.role?.toUpperCase()} | {userData?.bloodType || 'A+'} Blood</p>
                    </div>
                </div>
            </div>

            <section className="preferences-section">
                <div className="section-title">
                    <h4>Notifications</h4>
                </div>
                <div className="preference-card card">
                    <div className="pref-item">
                        <span>Push Notifications</span>
                        <label className="switch">
                            <input type="checkbox" defaultChecked />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <p className="pref-desc">Get notified about urgent requests near you even when the app is closed.</p>
                </div>
            </section>

            <section className="account-section" style={{ marginTop: '1.5rem' }}>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ color: 'var(--primary-red)', marginBottom: '0.75rem', border: '1px solid var(--border-color)', background: 'white' }}>Logout</button>
                <button className="btn btn-secondary" style={{ color: 'var(--text-light)', border: 'none', background: 'transparent' }}>Delete Account</button>
            </section>

            <style>{`
        .profile-header { display: flex; align-items: center; gap: 1rem; }
        .profile-avatar { 
          width: 60px; height: 60px; background: var(--secondary-red); border-radius: 50%; 
          display: flex; align-items: center; justify-content: center; font-size: 1.5rem; 
          font-weight: 700; color: var(--primary-red);
        }
        .pref-item { display: flex; justify-content: space-between; align-items: center; }
        .pref-desc { font-size: 0.8rem; color: var(--text-light); margin-top: 0.5rem; }
        .preference-card { padding: 1rem; margin-bottom: 0.75rem; }
        .section-title h4 { margin: 1rem 0; font-size: 0.9rem; text-transform: uppercase; color: var(--text-medium); letter-spacing: 0.5px; }

        .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: #4CAF50; }
        input:checked + .slider:before { transform: translateX(20px); }
      `}</style>
        </div >
    );
};

export default Profile;
