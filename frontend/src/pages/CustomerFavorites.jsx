import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CustomerSidebar from '../components/CustomerSidebar';
import styles from './Dashboard.module.css';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const CustomerFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const { data } = await api.get('/favorites');
      setFavorites(data.data);
    } catch (error) {
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (providerId) => {
    try {
      await api.delete(`/favorites/${providerId}`);
      toast.success('Removed from favorites');
      fetchFavorites();
    } catch (error) {
      toast.error('Failed to remove favorite');
    }
  };

  if (loading) return <div className={styles.loading}>Loading favorites...</div>;

  return (
    <div className={`container ${styles.dashboardContainer}`}>
      <CustomerSidebar />
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>My Favorites</h1>
        
        {favorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '1rem' }}>No favorites yet</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>You haven't added any service providers to your favorites.</p>
            <Link to="/providers" style={{ padding: '0.8rem 2rem', backgroundColor: 'var(--primary-color)', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: '500' }}>
              Find Providers
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {favorites.map(favorite => (
              <div key={favorite._id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '1rem' }}>
                  {favorite.providerId?.name?.charAt(0) || 'P'}
                </div>
                <h3 style={{ marginBottom: '0.5rem' }}>{favorite.providerId?.name}</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Provider</p>
                
                <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                  <Link to={`/providers/${favorite.providerId?._id}`} style={{ flex: 1, padding: '0.6rem', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem' }}>
                    View Profile
                  </Link>
                  <button onClick={() => handleRemove(favorite.providerId?._id)} style={{ flex: 1, padding: '0.6rem', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerFavorites;
