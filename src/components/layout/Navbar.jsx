import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav">
      <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon">🏠</span>
        <span className="nav-label">Home</span>
      </NavLink>
      {userData?.role === 'recipient' && (
        <NavLink to="/search" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🔍</span>
          <span className="nav-label">Search</span>
        </NavLink>
      )}
      <NavLink to="/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon">🕒</span>
        <span className="nav-label">History</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon">👤</span>
        <span className="nav-label">Profile</span>
      </NavLink>
      {userData?.role === 'admin' && (
        <NavLink to="/admin" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🛡️</span>
          <span className="nav-label">Admin</span>
        </NavLink>
      )}

      <style>{`
        .bottom-nav {
          display: flex;
          justify-content: space-around;
          align-items: center;
          background: var(--bg-white);
          padding: 0.75rem 0.5rem;
          box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
          position: fixed;
          bottom: 0;
          width: 100%;
          z-index: 100;
          max-width: 600px;
          left: 50%;
          transform: translateX(-50%);
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          color: var(--text-light);
          gap: 0.25rem;
          transition: all 0.2s ease;
          flex: 1;
        }

        .nav-item.active {
          color: var(--primary-red);
        }

        .nav-icon {
          font-size: 1.25rem;
        }

        .nav-label {
          font-size: 0.75rem;
          font-weight: 500;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
