import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HamburgerMenu = () => {
  const { userData } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button className="hamburger-btn" onClick={toggleMenu} aria-label="Menu">
        <span className={`hamburger-icon ${isOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      {isOpen && <div className="menu-overlay" onClick={closeMenu}></div>}

      <nav className={`side-menu ${isOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <h3>Menu</h3>
          <button className="close-btn" onClick={closeMenu}>✕</button>
        </div>

        <div className="menu-items">
          <NavLink to="/dashboard" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            <span className="menu-icon">🏠</span>
            <span className="menu-label">Home</span>
          </NavLink>

          {userData?.role === 'recipient' && (
            <NavLink to="/search" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} onClick={closeMenu}>
              <span className="menu-icon">🔍</span>
              <span className="menu-label">Search</span>
            </NavLink>
          )}

          <NavLink to="/history" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            <span className="menu-icon">🕒</span>
            <span className="menu-label">History</span>
          </NavLink>

          <NavLink to="/profile" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            <span className="menu-icon">👤</span>
            <span className="menu-label">Profile</span>
          </NavLink>

          {userData?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} onClick={closeMenu}>
              <span className="menu-icon">🛡️</span>
              <span className="menu-label">Admin</span>
            </NavLink>
          )}
        </div>
      </nav>

      <style>{`
        .hamburger-btn {
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 1001;
          background: var(--primary-red);
          border: none;
          border-radius: 8px;
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
          transition: transform 0.2s;
        }

        .hamburger-btn:active {
          transform: scale(0.95);
        }

        .hamburger-icon {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 20px;
        }

        .hamburger-icon span {
          display: block;
          height: 2px;
          background: white;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .hamburger-icon.open span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .hamburger-icon.open span:nth-child(2) {
          opacity: 0;
        }

        .hamburger-icon.open span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        .menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .side-menu {
          position: fixed;
          top: 0;
          right: -280px;
          width: 280px;
          height: 100vh;
          background: var(--bg-white);
          box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          transition: right 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .side-menu.open {
          right: 0;
        }

        .menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .menu-header h3 {
          font-size: 1.25rem;
          color: var(--primary-red);
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: var(--text-light);
          cursor: pointer;
          padding: 0.25rem;
          line-height: 1;
        }

        .menu-items {
          flex: 1;
          padding: 1rem 0;
          overflow-y: auto;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          text-decoration: none;
          color: var(--text-dark);
          transition: all 0.2s ease;
          border-left: 3px solid transparent;
        }

        .menu-item:hover {
          background: var(--bg-light);
        }

        .menu-item.active {
          background: var(--secondary-red);
          border-left-color: var(--primary-red);
          color: var(--primary-red);
        }

        .menu-icon {
          font-size: 1.5rem;
          width: 30px;
          text-align: center;
        }

        .menu-label {
          font-size: 1rem;
          font-weight: 500;
        }
      `}</style>
    </>
  );
};

export default HamburgerMenu;
