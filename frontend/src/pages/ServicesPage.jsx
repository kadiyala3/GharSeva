import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/services');
        setServices(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return <div className="container" style={{padding: '4rem 20px'}}>Loading services...</div>;

  return (
    <div className="container" style={{padding: '4rem 20px'}}>
      <h1 style={{fontSize: '2.5rem', marginBottom: '2rem'}}>Our Services</h1>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem'}}>
        {services.map(service => (
          <div key={service._id} className="card" style={{padding: '2rem'}}>
            <h3 style={{fontSize: '1.5rem', marginBottom: '1rem'}}>{service.name}</h3>
            <p style={{color: 'var(--text-secondary)', marginBottom: '1.5rem'}}>{service.description}</p>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--primary-color)'}}>₹{service.basePrice}</span>
              <button className="btn btn-primary">Book Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
