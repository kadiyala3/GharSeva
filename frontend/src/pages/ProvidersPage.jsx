import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import styles from './Home.module.css';

const ProvidersPage = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const { data } = await api.get('/providers');
        setProviders(data.data);
      } catch (error) {
        console.error('Failed to fetch providers', error);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/services');
        setServices(data.data);
      } catch (error) {
        console.error('Failed to fetch services', error);
      }
    };

    fetchProviders();
    fetchServices();
  }, []);

  const filteredProviders = providers.filter(provider => {
    const name = provider.userId?.name || provider.name || '';
    const skills = provider.skills || provider.profile?.skills || [];
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const provServices = provider.services || [];
    const matchesService = selectedService === '' || provServices.some(s => (s._id || s) === selectedService);
    
    return matchesSearch && matchesService;
  });

  const getProfileImage = (u) => {
    const userObj = u?.userId || u;
    if (userObj?.profileImage) {
      return userObj.profileImage.startsWith('http') 
        ? userObj.profileImage 
        : `http://localhost:5000${userObj.profileImage}`;
    }
    return `https://ui-avatars.com/api/?name=${userObj?.name || 'Provider'}&background=4f46e5&color=fff`;
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.heroSection} style={{ minHeight: '40vh', padding: '4rem 1rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Find Trusted Professionals</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
          Browse our network of verified service providers for all your home needs.
        </p>
      </div>

      <div className={styles.container} style={{ marginTop: '3rem', marginBottom: '4rem' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap', backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Search</label>
            <input 
              type="text" 
              placeholder="Search by name or skill..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
            />
          </div>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Filter by Service</label>
            <select 
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white' }}
            >
              <option value="">All Services</option>
              {services.map(service => (
                <option key={service._id} value={service._id}>{service.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Provider Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>Loading providers...</div>
        ) : filteredProviders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'white', borderRadius: '12px' }}>
            <h3>No providers found</h3>
            <p style={{ color: 'var(--text-light)' }}>Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {filteredProviders.map(provider => (
              <div key={provider._id} style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }}>
                <div style={{ height: '120px', backgroundColor: 'var(--primary-color)', position: 'relative' }}>
                  <img 
                    src={getProfileImage(provider)} 
                    alt={provider.userId?.name || provider.name}
                    style={{ 
                      width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover',
                      position: 'absolute', bottom: '-40px', left: '20px', 
                      border: '4px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                </div>
                <div style={{ padding: '3rem 1.5rem 1.5rem 1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{provider.userId?.name || provider.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                        {(provider.verificationStatus === 'VERIFIED' || provider.profile?.verificationStatus === 'VERIFIED') && (
                          <span style={{ fontSize: '0.8rem', color: '#166534', backgroundColor: '#dcfce7', padding: '0.1rem 0.4rem', borderRadius: '10px', fontWeight: 'bold' }}>✓ Verified</span>
                        )}
                        <span style={{ color: '#fbbf24', fontSize: '0.9rem', fontWeight: 'bold' }}>
                          ★ {(provider.averageRating || provider.profile?.averageRating || 4.8).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p style={{ marginTop: '1rem', color: 'var(--text-light)', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {provider.bio || provider.profile?.bio || 'Professional home service provider.'}
                  </p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                    {(provider.skills || provider.profile?.skills || []).slice(0, 3).map((skill, index) => (
                      <span key={index} style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', color: 'var(--text-color)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                        {skill}
                      </span>
                    ))}
                    {(provider.skills || provider.profile?.skills || []).length > 3 && (
                      <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', color: 'var(--text-color)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>+{(provider.skills || provider.profile?.skills || []).length - 3} more</span>
                    )}
                  </div>
                  
                  <div style={{ marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                    <Link to={`/providers/${provider._id}`} style={{ flex: 1, textAlign: 'center', padding: '0.8rem', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', transition: 'all 0.2s' }}>
                      View Profile
                    </Link>
                    <Link to="/book" state={{ providerId: provider._id }} style={{ flex: 1, textAlign: 'center', padding: '0.8rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', transition: 'all 0.2s' }}>
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProvidersPage;
