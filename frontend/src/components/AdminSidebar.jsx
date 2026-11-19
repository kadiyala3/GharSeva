import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from '../pages/Dashboard.module.css';

const AdminSidebar = () => {
  const { user } = useContext(AuthContext);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.profileInfo}>
        <div className={styles.avatar} style={{ backgroundColor: '#1e293b' }}>A</div>
        <h3>{user?.name || 'Admin'}</h3>
        <p>{user?.email}</p>
        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: '#fef2f2', color: '#ef4444', display: 'inline-block' }}>
          Administrator
        </div>
      </div>
      <nav className={styles.sidebarNav}>
        <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? styles.active : '')}>
          Dashboard
        </NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => (isActive ? styles.active : '')}>
          Customers
        </NavLink>
        <NavLink to="/admin/providers" className={({ isActive }) => (isActive ? styles.active : '')}>
          Providers & Verification
        </NavLink>
        <NavLink to="/admin/categories" className={({ isActive }) => (isActive ? styles.active : '')}>
          Categories
        </NavLink>
        <NavLink to="/admin/services" className={({ isActive }) => (isActive ? styles.active : '')}>
          Services
        </NavLink>
        <NavLink to="/admin/bookings" className={({ isActive }) => (isActive ? styles.active : '')}>
          All Bookings
        </NavLink>
        <NavLink to="/admin/complaints" className={({ isActive }) => (isActive ? styles.active : '')}>
          Resolution Center
        </NavLink>
        <NavLink to="/admin/payouts" className={({ isActive }) => (isActive ? styles.active : '')}>
          Provider Payouts
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
