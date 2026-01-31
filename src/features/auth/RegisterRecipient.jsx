import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from './authService';
import FileUpload from './FileUpload';

const CITIES = ["Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan", "Enugu"];

const RegisterRecipient = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        bloodTypeNeeded: '',
        email: '',
        password: '',
        phone: '',
        city: '',
        age: '',
        weight: '',
        prescriptionUrl: '',
        role: 'recipient',
        acceptedTerms: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.city) {
            setError('Please select your city');
            return;
        }

        if (!formData.prescriptionUrl) {
            setError('Please upload your medical prescription or document');
            return;
        }

        setLoading(true);
        const { email, password, ...profileData } = formData;
        profileData.status = 'pending'; // Recipients are now pending until admin verifies documents

        const { error: signUpError } = await signUp(email, password, profileData);

        if (signUpError) {
            setError(signUpError);
            setLoading(false);
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="auth-container fade-in">
            <header className="section-header">
                <h2 style={{ color: 'var(--primary-red)' }}>Recipient Profile</h2>
                <p>Your details will help us find matches</p>
            </header>

            {error && <div className="error-alert card">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="fullName" required placeholder="John Doe" onChange={handleInputChange} />
                </div>

                <div className="form-group">
                    <label>Select Your City</label>
                    <select name="city" required value={formData.city} onChange={handleInputChange}>
                        <option value="">Choose City</option>
                        {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label>Blood Type (If known)</label>
                    <select name="bloodTypeNeeded" onChange={handleInputChange}>
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

                <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" name="phone" required placeholder="+234..." onChange={handleInputChange} />
                </div>

                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" required placeholder="name@email.com" onChange={handleInputChange} />
                </div>

                <div className="form-group-row">
                    <div className="form-group">
                        <label>Age (Years)</label>
                        <input type="number" name="age" min="0" required placeholder="Age" onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Weight (kg)</label>
                        <input type="number" name="weight" min="0" required placeholder="Weight" onChange={handleInputChange} />
                    </div>
                </div>

                <FileUpload
                    label="Medical Prescription/Document (PDF/IMAGE)"
                    onUploadComplete={(url) => setFormData({ ...formData, prescriptionUrl: url })}
                />

                <div className="form-group">
                    <label>Create Password</label>
                    <input type="password" name="password" minLength="8" required onChange={handleInputChange} />
                </div>

                <div className="form-group checkbox-group">
                    <input
                        type="checkbox"
                        id="terms"
                        required
                        checked={formData.acceptedTerms}
                        onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })}
                    />
                    <label htmlFor="terms">
                        I understand that this application only links me with potential donors and does not guarantee a match or donation.
                    </label>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ marginTop: '1rem', background: 'linear-gradient(45deg, var(--primary-red), #E53935)' }}
                >
                    {loading ? 'Creating Account...' : 'Continue to Dashboard'}
                </button>
            </form>

            <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>

            <style>{`
        .auth-form { display: flex; flex-direction: column; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.3rem; }
        .form-group-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-group label { font-size: 0.85rem; font-weight: 600; color: var(--text-medium); }
        .form-group input, .form-group select { padding: 0.8rem; border-radius: 12px; border: 1.5px solid var(--border-color); }
        .checkbox-group { flex-direction: row; align-items: flex-start; gap: 0.5rem; margin-top: 0.5rem; }
        .checkbox-group input { width: auto; margin-top: 0.2rem; }
        .checkbox-group label { font-size: 0.8rem; font-weight: 400; line-height: 1.4; cursor: pointer; }
        .auth-switch { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; }
        .auth-switch a { color: var(--primary-red); font-weight: 600; text-decoration: none; }
      `}</style>
        </div>
    );
};

export default RegisterRecipient;
