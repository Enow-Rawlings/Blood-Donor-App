import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ONBOARDING_STEPS = [
    {
        icon: "🩸",
        title: "Save Lives",
        description: "Connect with patients in urgent need of life-saving blood donations.",
        color: "#C62828"
    },
    {
        icon: "🔍",
        title: "Find Donors",
        description: "Easily search and match with compatible donors in your city instantly.",
        color: "#D32F2F"
    },
    {
        icon: "🛡️",
        title: "Verified & Safe",
        description: "Every donor goes through a medical verification process for your safety.",
        color: "#E53935"
    }
];

const LandingPage = () => {
    const [step, setStep] = useState(0);
    const navigate = useNavigate();

    const nextStep = () => {
        if (step < ONBOARDING_STEPS.length - 1) {
            setStep(step + 1);
        } else {
            // Last step reached, show registration options
            setStep(ONBOARDING_STEPS.length);
        }
    };

    return (
        <div className="landing-page">
            <AnimatePresence mode="wait">
                {step < ONBOARDING_STEPS.length ? (
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="onboarding-step"
                    >
                        <div className="step-content">
                            <div className="pulse-wrapper">
                                <div className="pulse-bg" style={{ background: ONBOARDING_STEPS[step].color }}></div>
                                <span className="step-icon">{ONBOARDING_STEPS[step].icon}</span>
                            </div>
                            <h2>{ONBOARDING_STEPS[step].title}</h2>
                            <p>{ONBOARDING_STEPS[step].description}</p>
                        </div>

                        <div className="onboarding-dots">
                            {ONBOARDING_STEPS.map((_, i) => (
                                <div key={i} className={`dot ${i === step ? 'active' : ''}`}></div>
                            ))}
                        </div>

                        <button className="btn btn-primary next-btn" onClick={nextStep}>
                            {step === ONBOARDING_STEPS.length - 1 ? 'Get Started' : 'Next'}
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="actions"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="landing-actions"
                    >
                        <div className="hero-compact">
                            <h1>Welcome to <span>BloodConnect</span></h1>
                            <p>Choose your role to continue</p>
                        </div>

                        <div className="action-cards">
                            <div className="action-card recipient-card" onClick={() => navigate('/register-recipient')}>
                                <div className="card-icon">🆘</div>
                                <div className="card-text">
                                    <h3>I Need Blood</h3>
                                    <p>Register as a recipient & find matches</p>
                                </div>
                            </div>

                            <div className="action-card donor-card-link" onClick={() => navigate('/register-donor')}>
                                <div className="card-icon">🤝</div>
                                <div className="card-text">
                                    <h3>I Want to Donate</h3>
                                    <p>Join our life-saving donor community</p>
                                </div>
                            </div>
                        </div>

                        <div className="auth-footer" onClick={() => navigate('/login')}>
                            Existing member? <strong>Login</strong>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
        .landing-page { 
          min-height: 85vh; 
          display: flex; 
          flex-direction: column; 
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(180deg, #FFFFFF 0%, #FFF5F5 100%);
        }

        .onboarding-step { text-align: center; }
        .step-content { margin-bottom: 3rem; }
        .pulse-wrapper { position: relative; width: 120px; height: 120px; margin: 0 auto 2rem; display: flex; align-items: center; justify-content: center; }
        .step-icon { font-size: 3.5rem; z-index: 2; }
        .pulse-bg { 
          position: absolute; width: 90px; height: 90px; border-radius: 50%; opacity: 0.2;
          animation: onboarding-pulse 2s infinite; 
        }
        @keyframes onboarding-pulse { 0% { scale: 1; opacity: 0.2; } 50% { scale: 1.5; opacity: 0.1; } 100% { scale: 1.8; opacity: 0; } }

        h2 { font-size: 1.8rem; margin-bottom: 1rem; color: var(--text-dark); }
        h2 + p { color: var(--text-medium); line-height: 1.6; }

        .onboarding-dots { display: flex; justify-content: center; gap: 0.75rem; margin-bottom: 2rem; }
        .dot { width: 8px; height: 8px; border-radius: 50%; background: #E0E0E0; transition: all 0.3s; }
        .dot.active { width: 24px; border-radius: 4px; background: var(--primary-red); }

        .next-btn { width: 100%; padding: 1rem; border-radius: 30px; }

        .landing-actions { display: flex; flex-direction: column; gap: 2rem; }
        .hero-compact { text-align: center; }
        .hero-compact h1 span { color: var(--primary-red); }

        .action-cards { display: flex; flex-direction: column; gap: 1rem; }
        .action-card { 
          background: white; padding: 1.25rem; border-radius: var(--radius-lg); 
          display: flex; align-items: center; gap: 1rem; cursor: pointer;
          box-shadow: var(--shadow-sm); border: 1px solid var(--border-color);
        }
        .recipient-card { border-left: 5px solid var(--primary-red); }
        .card-icon { font-size: 2.2rem; }

        .auth-footer { text-align: center; margin-top: 1rem; font-size: 0.9rem; }
        .auth-footer strong { color: var(--primary-red); margin-left: 0.2rem; }
      `}</style>
        </div>
    );
};

export default LandingPage;
