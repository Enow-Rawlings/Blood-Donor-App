import React, { useState } from 'react';
import { db } from '../../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import FileUpload from '../auth/FileUpload';

const BloodRequestForm = ({ donor, onClose, onSuccess }) => {
    const { currentUser, userData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [prescriptionUrl, setPrescriptionUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prescriptionUrl) {
            setError('Please upload a valid prescription to verify your request.');
            return;
        }

        setLoading(true);
        try {
            const chatId = `${currentUser.uid}_${donor.id}_${Date.now()}`;
            await addDoc(collection(db, "requests"), {
                recipientId: currentUser.uid,
                recipientName: userData.fullName,
                donorId: donor.id,
                donorName: donor.fullName,
                bloodTypeNeeded: donor.bloodType,
                prescriptionUrl: prescriptionUrl,
                status: 'pending_admin_approval',
                city: userData.city,
                chatId: chatId,
                createdAt: serverTimestamp()
            });
            // We'll notify admin via the Admin Dashboard's real-time listener or a system notification

            onSuccess();
        } catch (err) {
            console.error("Request failed", err);
            setError("Failed to submit request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="request-modal card fade-in">
                <header className="modal-header">
                    <h3>Request {donor.fullName}</h3>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </header>

                <form onSubmit={handleSubmit}>
                    <p className="hint">To protect our donors, please upload a medical prescription or doctor's note for this request.</p>

                    <FileUpload
                        label="Medical Prescription (PDF/JPG)"
                        onUploadComplete={(url) => setPrescriptionUrl(url)}
                    />

                    {error && <p className="error-text">{error}</p>}

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading || !prescriptionUrl}>
                            {loading ? 'Submitting...' : 'Send Request 🩸'}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1.5rem; }
                .request-modal { width: 100%; max-width: 450px; padding: 1.5rem; }
                .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
                .hint { font-size: 0.85rem; color: var(--text-medium); margin-bottom: 1.5rem; line-height: 1.4; }
                .error-text { color: var(--error); font-size: 0.85rem; margin-top: 0.5rem; }
                .modal-actions { display: flex; gap: 1rem; margin-top: 2rem; }
                .modal-actions button { flex: 1; }
                .close-btn { background: none; border: none; font-size: 1.25rem; color: var(--text-light); }
            `}</style>
        </div>
    );
};

export default BloodRequestForm;
