import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from './Header.module.css';
import { Home, LogOut, User, Menu } from 'lucide-react';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'PROVIDER') return '/provider/dashboard';
    return '/customer/dashboard';
  };

  const getProfileImage = (u) => {
    if (u?.profileImage) {
      return u.profileImage.startsWith('http') 
        ? u.profileImage 
        : `http://localhost:5000${u.profileImage}`;
    }
    return `https://ui-avatars.com/api/?name=${u?.name || 'User'}&background=4f46e5&color=fff`;
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.container}`}>
        <Link to="/" className={styles.logo}>
          <Home className={styles.logoIcon} size={28} />
          <span>GHARSEVA</span>
        </Link>
        
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>Home</Link>
          <Link to="/services" className={styles.navLink}>Services</Link>
          <Link to="/providers" className={styles.navLink}>Providers</Link>
          
          {user ? (
            <div className={styles.userMenu}>
              <Link 
                to={user.role === 'PROVIDER' ? '/provider/notifications' : '/customer/notifications'} 
                style={{ position: 'relative', display: 'flex', alignItems: 'center', marginRight: '1rem', color: 'var(--text-light)' }}
              >
                <div style={{ position: 'absolute', top: '-5px', right: '-5px', width: '8px', height: '8px', backgroundColor: 'red', borderRadius: '50%' }}></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              </Link>
              <Link to={getDashboardLink()} className={styles.dashboardLink} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src={getProfileImage(user)} alt={user.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }} />
                <span>Dashboard</span>
              </Link>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link to="/login" className={styles.loginBtn}>Sign In</Link>
              <Link to="/register" className={styles.registerBtn}>Sign Up</Link>
            </div>
          )}
        </nav>
        
        <button className={styles.mobileMenuBtn}>
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
