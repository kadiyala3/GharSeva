import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from '../pages/Dashboard.module.css';

const ProviderSidebar = () => {
  const { user } = useContext(AuthContext);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.profileInfo}>
        <div className={styles.avatar}>{user?.name?.charAt(0) || 'P'}</div>
        <h3>{user?.name}</h3>
        <p>{user?.email}</p>
        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: '#eef2ff', color: 'var(--primary-color)', display: 'inline-block' }}>
          Provider
        </div>
      </div>
      <nav className={styles.sidebarNav}>
        <NavLink to="/provider/dashboard" className={({ isActive }) => (isActive ? styles.active : '')}>
          Dashboard
        </NavLink>
        <NavLink to="/provider/profile" className={({ isActive }) => (isActive ? styles.active : '')}>
          Profile
        </NavLink>
        <NavLink to="/provider/verification" className={({ isActive }) => (isActive ? styles.active : '')}>
          Verification
        </NavLink>
        <NavLink to="/provider/services" className={({ isActive }) => (isActive ? styles.active : '')}>
          My Services
        </NavLink>
        <NavLink to="/provider/availability" className={({ isActive }) => (isActive ? styles.active : '')}>
          Availability
        </NavLink>
        <NavLink to="/provider/bookings" className={({ isActive }) => (isActive ? styles.active : '')}>
          Bookings
        </NavLink>
        <NavLink to="/provider/earnings" className={({ isActive }) => (isActive ? styles.active : '')}>
          Earnings
        </NavLink>
        <NavLink to="/provider/reviews" className={({ isActive }) => (isActive ? styles.active : '')}>
          Reviews
        </NavLink>
        <NavLink to="/provider/messages" className={({ isActive }) => (isActive ? styles.active : '')}>
          Messages
        </NavLink>
        <NavLink to="/provider/notifications" className={({ isActive }) => (isActive ? styles.active : '')}>
          Notifications
        </NavLink>
      </nav>
    </aside>
  );
};

export default ProviderSidebar;
