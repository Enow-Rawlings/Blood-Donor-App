import React, { useState } from 'react';
import HamburgerMenu from './HamburgerMenu';
import NotificationCenter from '../ui/NotificationCenter';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children }) => {
  const { currentUser } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🩸</span>
            <h1>BloodConnect</h1>
          </div>
          <div className="header-actions">
            {currentUser && (
              <button className="notif-btn" onClick={() => setIsNotifOpen(true)}>
                🔔 <span className="notif-badge"></span>
              </button>
            )}
          </div>
        </div>
      </header>

      <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />

      <main className="container">
        {children}
      </main>

      {currentUser && <HamburgerMenu />}

      <style>{`
        .app-layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .app-header {
          background: var(--bg-white);
          padding: 1rem 1.5rem;
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .logo h1 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary-red);
          letter-spacing: -0.5px;
        }

        .notif-btn { background: none; border: none; font-size: 1.25rem; cursor: pointer; position: relative; }
        .notif-badge { position: absolute; top: -2px; right: -2px; width: 8px; height: 8px; background: var(--primary-red); border-radius: 50%; border: 2px solid white; display: none; }
        .notif-btn:active { transform: scale(0.9); }

        .logo-icon {
          font-size: 1.5rem;
        }

        main {
          flex: 1;
          padding-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default Layout;
