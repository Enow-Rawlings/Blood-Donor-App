import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { logOut, updateUserProfile } from '../auth/authService';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../auth/FileUpload';

const Profile = () => {
    const { userData, currentUser } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: userData?.fullName || '',
        phone: userData?.phone || '',
        city: userData?.city || '',
        profilePicUrl: userData?.profilePicUrl || ''
    });

    const handleLogout = async () => {
        const isAdmin = userData?.role === 'admin';
        await logOut();
        if (isAdmin) {
            navigate('/admin-home');
        } else {
            navigate('/login');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateUserProfile(currentUser.uid, formData);
            setIsEditing(false);
            // The userData in context should auto-update if it's using a listener
        } catch (err) {
            console.error("Update failed", err);
            alert("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const cities = ["Buea", "Douala", "Bamenda", "Kumba", "Yaounde", "Muyuka", "Mamfe", "Maroua", "Garoua", "Ebolowa", "Bafoussam"];

    return (
        <div className="profile-page fade-in">
            <header className="section-header">
                <h2>My Profile</h2>
                <p>Manage your account and preferences</p>
            </header>

            <div className="profile-card card">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {formData.profilePicUrl ? (
                            <img src={formData.profilePicUrl} alt="Avatar" className="avatar-img" />
                        ) : (
                            userData?.fullName?.[0] || '👤'
                        )}
                    </div>
                    <div className="profile-info">
                        <h4>{userData?.fullName || 'User'}</h4>
                        <p>{userData?.role?.toUpperCase()} | {userData?.bloodType || userData?.bloodTypeNeeded || 'A+'} Blood</p>
                    </div>
                    {!isEditing && (
                        <button className="btn-edit" onClick={() => setIsEditing(true)}>Edit</button>
                    )}
                </div>

                {isEditing && (
                    <form className="edit-form" onSubmit={handleUpdate}>
                        <FileUpload
                            label="Change Profile Picture"
                            onUploadComplete={(url) => setFormData({ ...formData, profilePicUrl: url })}
                            accept=".jpg,.jpeg,.png"
                        />
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>City</label>
                            <select
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                required
                            >
                                {cities.map(city => <option key={city} value={city}>{city}</option>)}
                            </select>
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                )}
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
        .profile-header { display: flex; align-items: center; gap: 1rem; position: relative; }
        .profile-avatar { 
          width: 60px; height: 60px; background: var(--secondary-red); border-radius: 50%; 
          display: flex; align-items: center; justify-content: center; font-size: 1.5rem; 
          font-weight: 700; color: var(--primary-red); overflow: hidden;
        }
        .avatar-img { width: 100%; height: 100%; object-fit: cover; }
        .btn-edit { position: absolute; right: 0; top: 0; background: var(--bg-light); border: none; padding: 0.4rem 0.8rem; border-radius: 4px; font-size: 0.8rem; cursor: pointer; }
        
        .edit-form { margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem; }
        .edit-form .form-group { display: flex; flex-direction: column; gap: 0.3rem; }
        .edit-form label { font-size: 0.85rem; font-weight: 600; color: var(--text-medium); }
        .edit-form input, .edit-form select { padding: 0.75rem; border-radius: 8px; border: 1.5px solid var(--border-color); }
        .form-actions { display: flex; gap: 1rem; margin-top: 1rem; }
        .form-actions button { flex: 1; }

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
