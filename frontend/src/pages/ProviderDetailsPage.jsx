import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import styles from './Home.module.css';
import toast from 'react-hot-toast';

const ProviderDetailsPage = () => {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const [providerRes, reviewsRes] = await Promise.all([
          api.get(`/providers/${id}`),
          api.get(`/reviews/provider/${id}`)
        ]);
        
        setProvider(providerRes.data.data);
        setReviews(reviewsRes.data.data);
      } catch (error) {
        console.error('Error fetching provider details', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProviderData();
  }, [id]);

  const handleFavorite = async () => {
    try {
      await api.post(`/favorites/${id}`);
      toast.success('Added to favorites!');
    } catch (error) {
      toast.error('Already in favorites or please login');
    }
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading provider details...</div>;
  if (!provider) return <div style={{ padding: '4rem', textAlign: 'center' }}>Provider not found</div>;

  const getProfileImage = (u) => {
    if (u?.profileImage) {
      return u.profileImage.startsWith('http') 
        ? u.profileImage 
        : `http://localhost:5000${u.profileImage}`;
    }
    return `https://ui-avatars.com/api/?name=${u?.name || 'Provider'}&background=4f46e5&color=fff`;
  };

  return (
    <div className={styles.pageContainer} style={{ backgroundColor: '#f9fafb' }}>
      {/* Profile Header */}
      <div style={{ backgroundColor: 'var(--primary-color)', height: '200px', width: '100%' }}></div>
      
      <div className={styles.container} style={{ marginTop: '-100px', marginBottom: '4rem', position: 'relative', zIndex: 10 }}>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-end' }}>
          <img 
            src={getProfileImage(provider)} 
            alt={provider.name}
            style={{ 
              width: '150px', height: '150px', borderRadius: '12px', backgroundColor: 'white', 
              objectFit: 'cover', border: '5px solid white', 
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)', marginTop: '-75px'
            }}
          />
          
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {provider.name}
                  {provider.profile?.verificationStatus === 'VERIFIED' && (
                    <span style={{ fontSize: '0.9rem', color: '#166534', backgroundColor: '#dcfce7', padding: '0.2rem 0.5rem', borderRadius: '20px' }}>Verified</span>
                  )}
                </h1>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                  <span>📍 {provider.profile?.city || 'City'}, {provider.profile?.state || 'State'}</span>
                  <span>💼 {provider.profile?.experience || '2'} Years Experience</span>
                  <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>★ {provider.profile?.averageRating?.toFixed(1) || '4.5'} ({provider.profile?.totalReviews || 0} reviews)</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={handleFavorite} style={{ padding: '0.8rem 1.5rem', backgroundColor: '#f3f4f6', color: 'var(--text-color)', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                  ♡ Save
                </button>
                <Link to="/book" state={{ providerId: provider._id }} style={{ padding: '0.8rem 2rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '2rem' }}>
          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h2 style={{ marginBottom: '1rem' }}>About Me</h2>
              <p style={{ lineHeight: '1.8', color: 'var(--text-color)' }}>
                {provider.profile?.bio || 'Professional home service provider dedicated to delivering high-quality service and customer satisfaction.'}
              </p>
            </div>
            
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h2 style={{ marginBottom: '1rem' }}>Reviews ({reviews.length})</h2>
              {reviews.length === 0 ? (
                <p style={{ color: 'var(--text-light)' }}>No reviews yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {reviews.map(review => (
                    <div key={review._id} style={{ borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <h4 style={{ margin: 0 }}>{review.customerId?.name || 'Customer'}</h4>
                        <div style={{ color: '#fbbf24' }}>
                          {[1,2,3,4,5].map(s => <span key={s}>{s <= review.rating ? '★' : '☆'}</span>)}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block', marginBottom: '1rem' }}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                      <p style={{ margin: 0, color: 'var(--text-color)' }}>{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Skills & Expertise</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {provider.profile?.skills?.map((skill, index) => (
                  <span key={index} style={{ backgroundColor: '#f3f4f6', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem' }}>
                    {skill}
                  </span>
                )) || <p style={{ color: 'var(--text-light)' }}>No skills listed</p>}
              </div>
            </div>
            
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-light)' }}>Hourly Rate</span>
                  <strong style={{ color: 'var(--primary-color)' }}>₹{provider.profile?.hourlyRate || 'N/A'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-light)' }}>Jobs Completed</span>
                  <strong>{provider.profile?.completedJobs || 0}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-light)' }}>Service Radius</span>
                  <strong>{provider.profile?.serviceRadius || 10} km</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetailsPage;
