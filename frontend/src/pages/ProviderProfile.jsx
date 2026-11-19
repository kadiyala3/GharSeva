import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import ProviderSidebar from '../components/ProviderSidebar';
import styles from './Dashboard.module.css';
import toast from 'react-hot-toast';

const ProviderProfile = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    experience: '',
    skills: '',
    hourlyRate: '',
    city: '',
    state: '',
    pincode: '',
    serviceRadius: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/providers/${user?._id}`);
        if (data.data) {
          const profile = data.data;
          setFormData({
            bio: profile.bio || '',
            experience: profile.experience || '',
            skills: profile.skills ? profile.skills.join(', ') : '',
            hourlyRate: profile.hourlyRate || '',
            city: profile.city || '',
            state: profile.state || '',
            pincode: profile.pincode || '',
            serviceRadius: profile.serviceRadius || ''
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/providers/profile', {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim())
      });
      toast.success('Provider profile updated');
    } catch (error) {
      toast.error('Failed to update provider profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container ${styles.dashboardContainer}`}>
      <ProviderSidebar />
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Provider Profile</h1>
        
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', maxWidth: '800px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Bio / About</label>
              <textarea 
                name="bio" 
                value={formData.bio} 
                onChange={handleChange} 
                rows="4"
                style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', resize: 'vertical' }}
                placeholder="Tell customers about yourself and your services..."
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Years of Experience</label>
              <input 
                type="number" 
                name="experience" 
                value={formData.experience} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Hourly Rate (₹)</label>
              <input 
                type="number" 
                name="hourlyRate" 
                value={formData.hourlyRate} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
              />
            </div>
            
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Skills (comma separated)</label>
              <input 
                type="text" 
                name="skills" 
                value={formData.skills} 
                onChange={handleChange} 
                placeholder="e.g. Plumbing, Pipe repair, Water heater installation"
                style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>City</label>
              <input 
                type="text" 
                name="city" 
                value={formData.city} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>State</label>
              <input 
                type="text" 
                name="state" 
                value={formData.state} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Pincode</label>
              <input 
                type="text" 
                name="pincode" 
                value={formData.pincode} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Service Radius (in km)</label>
              <input 
                type="number" 
                name="serviceRadius" 
                value={formData.serviceRadius} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
              />
            </div>
            
            <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
              <button 
                type="submit" 
                disabled={loading}
                style={{ padding: '1rem 2rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProviderProfile;
