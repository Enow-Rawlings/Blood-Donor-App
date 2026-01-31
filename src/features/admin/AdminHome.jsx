import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminHome = () => {
    const navigate = useNavigate();

    return (
        <div className="admin-home">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="admin-welcome-card card"
            >
                <div className="admin-icon">🛡️</div>
                <h1>Admin Control Panel</h1>
                <p>Welcome back, Administrator. Please sign in to manage the platform and verify rescue requests.</p>

                <button
                    onClick={() => navigate('/login')}
                    className="btn btn-primary"
                    style={{ marginTop: '2rem', width: '100%', padding: '1rem' }}
                >
                    Sign In to Dashboard
                </button>
            </motion.div>

            <style>{`
                .admin-home {
                    min-height: 80vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    background: var(--bg-light);
                }
                .admin-welcome-card {
                    max-width: 450px;
                    text-align: center;
                    padding: 3rem 2rem;
                    background: white;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-md);
                }
                .admin-icon {
                    font-size: 4rem;
                    margin-bottom: 1.5rem;
                }
                h1 {
                    font-size: 1.8rem;
                    margin-bottom: 1rem;
                    color: var(--text-dark);
                }
                p {
                    color: var(--text-medium);
                    line-height: 1.6;
                }
            `}</style>
        </div>
    );
};

export default AdminHome;
