import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProviderSidebar from '../components/ProviderSidebar';
import styles from './Dashboard.module.css';
import toast from 'react-hot-toast';

const ProviderReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  
  // Since we don't have user in context directly accessible without importing AuthContext again,
  // we can get the provider ID by fetching /providers/profile or similar. 
  // Wait, let's just use AuthContext.
  
  useEffect(() => {
    // We fetch the current user's provider profile to get the ID, 
    // or just fetch reviews directly if API supports /reviews/my (which it doesn't currently, it supports /reviews/provider/:id).
    // I will fetch the profile first, then reviews.
    
    const fetchReviewsAndProfile = async () => {
      try {
        const userRes = await api.get('/auth/me'); // Or another endpoint to get current user ID
        const userId = userRes.data.data._id;
        
        const profileRes = await api.get(`/providers/${userId}`);
        setProfile(profileRes.data.data);
        
        const reviewsRes = await api.get(`/reviews/provider/${userId}`);
        setReviews(reviewsRes.data.data);
      } catch (error) {
        toast.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviewsAndProfile();
  }, []);

  if (loading) return <div className={styles.loading}>Loading reviews...</div>;

  return (
    <div className={`container ${styles.dashboardContainer}`}>
      <ProviderSidebar />
      <main className={styles.mainContent}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className={styles.pageTitle}>My Reviews</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'white', padding: '0.5rem 1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: '1.5rem', color: '#fbbf24' }}>★</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{profile?.averageRating?.toFixed(1) || '0.0'}</span>
            <span style={{ color: 'var(--text-light)' }}>({profile?.totalReviews || 0} reviews)</span>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '1rem' }}>No reviews yet</h3>
            <p style={{ color: 'var(--text-light)' }}>Complete jobs to start receiving reviews from customers.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            {reviews.map(review => (
              <div key={review._id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--secondary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {review.customerId?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h4 style={{ margin: 0 }}>{review.customerId?.name || 'Customer'}</h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.2rem', color: '#fbbf24' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star}>{star <= review.rating ? '★' : '☆'}</span>
                    ))}
                  </div>
                </div>
                <p style={{ margin: 0, lineHeight: '1.5', color: 'var(--text-color)' }}>
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProviderReviews;
