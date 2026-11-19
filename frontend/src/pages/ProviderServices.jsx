import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import ProviderSidebar from '../components/ProviderSidebar';
import styles from './Dashboard.module.css';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const ProviderServices = () => {
  const { user } = useContext(AuthContext);
  const [providerProfile, setProviderProfile] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, servicesRes] = await Promise.all([
          api.get(`/providers/${user?._id}`),
          api.get('/services')
        ]);
        
        if (profileRes.data.data) {
          setProviderProfile(profileRes.data.data);
          setSelectedServices(profileRes.data.data.services || []);
        }
        setAllServices(servicesRes.data.data);
      } catch (error) {
        toast.error('Failed to load services data');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchData();
  }, [user]);

  const handleToggleService = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const handleSave = async () => {
    try {
      await api.put('/providers/profile', { services: selectedServices });
      toast.success('Services updated successfully');
      // Update local state to reflect the changes
      setProviderProfile({ ...providerProfile, services: selectedServices });
    } catch (error) {
      toast.error('Failed to update services');
    }
  };

  if (loading) return <div className={styles.loading}>Loading services...</div>;

  // Group services by category for better display
  const groupedServices = allServices.reduce((acc, service) => {
    const categoryName = service.categoryId?.name || 'Uncategorized';
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(service);
    return acc;
  }, {});

  return (
    <div className={`container ${styles.dashboardContainer}`}>
      <ProviderSidebar />
      <main className={styles.mainContent}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className={styles.pageTitle}>My Services</h1>
          <button 
            onClick={handleSave} 
            style={{ padding: '0.8rem 1.5rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
          >
            Save Changes
          </button>
        </div>
        
        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
          Select the services you offer. These will be displayed on your profile and customers can book you for them.
        </p>

        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          {Object.entries(groupedServices).map(([category, services]) => (
            <div key={category} style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>{category}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {services.map(service => (
                  <label 
                    key={service._id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '1rem', 
                      border: selectedServices.includes(service._id) ? '2px solid var(--primary-color)' : '1px solid #ddd',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: selectedServices.includes(service._id) ? '#f8faff' : 'white',
                      transition: 'all 0.2s'
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={selectedServices.includes(service._id)}
                      onChange={() => handleToggleService(service._id)}
                      style={{ marginRight: '1rem', transform: 'scale(1.2)' }}
                    />
                    <div>
                      <div style={{ fontWeight: '500' }}>{service.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>Base: ₹{service.basePrice}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProviderServices;
