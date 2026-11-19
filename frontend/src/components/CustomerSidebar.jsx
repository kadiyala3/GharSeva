import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from '../pages/Dashboard.module.css';

const CustomerSidebar = () => {
  const { user } = useContext(AuthContext);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.profileInfo}>
        <div className={styles.avatar}>{user?.name?.charAt(0) || 'U'}</div>
        <h3>{user?.name}</h3>
        <p>{user?.email}</p>
      </div>
      <nav className={styles.sidebarNav}>
        <NavLink to="/customer/dashboard" className={({ isActive }) => (isActive ? styles.active : '')}>
          Dashboard
        </NavLink>
        <NavLink to="/customer/profile" className={({ isActive }) => (isActive ? styles.active : '')}>
          Profile
        </NavLink>
        <NavLink to="/customer/bookings" className={({ isActive }) => (isActive ? styles.active : '')}>
          My Bookings
        </NavLink>
        <NavLink to="/customer/addresses" className={({ isActive }) => (isActive ? styles.active : '')}>
          Addresses
        </NavLink>
        <NavLink to="/customer/favorites" className={({ isActive }) => (isActive ? styles.active : '')}>
          Favorites
        </NavLink>
        <NavLink to="/customer/messages" className={({ isActive }) => (isActive ? styles.active : '')}>
          Messages
        </NavLink>
        <NavLink to="/customer/notifications" className={({ isActive }) => (isActive ? styles.active : '')}>
          Notifications
        </NavLink>
        <NavLink to="/customer/complaints" className={({ isActive }) => (isActive ? styles.active : '')}>
          Complaints
        </NavLink>
      </nav>
    </aside>
  );
};

export default CustomerSidebar;
