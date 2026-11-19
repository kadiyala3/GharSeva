import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CustomerSidebar from '../components/CustomerSidebar';
import styles from './Dashboard.module.css';
import toast from 'react-hot-toast';

const CustomerAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    label: 'Home',
    addressLine: '',
    area: '',
    city: '',
    state: '',
    pincode: ''
  });

  const fetchAddresses = async () => {
    try {
      const { data } = await api.get('/addresses');
      setAddresses(data.data);
    } catch (error) {
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/addresses', formData);
      toast.success('Address added successfully');
      setShowForm(false);
      fetchAddresses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add address');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/addresses/${id}`);
      toast.success('Address deleted');
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  if (loading) return <div className={styles.loading}>Loading addresses...</div>;

  return (
    <div className={`container ${styles.dashboardContainer}`}>
      <CustomerSidebar />
      <main className={styles.mainContent}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className={styles.pageTitle}>My Addresses</h1>
          <button 
            onClick={() => setShowForm(!showForm)} 
            style={{ padding: '0.8rem 1.5rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            {showForm ? 'Cancel' : 'Add New Address'}
          </button>
        </div>

        {showForm && (
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
            <h3>Add New Address</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label>Label (Home, Work, Other)</label>
                <select name="label" value={formData.label} onChange={handleChange} style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label>Address Line</label>
                <input type="text" name="addressLine" value={formData.addressLine} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }} />
              </div>
              <div>
                <label>Area / Locality</label>
                <input type="text" name="area" value={formData.area} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }} />
              </div>
              <div>
                <label>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }} />
              </div>
              <div>
                <label>State</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }} />
              </div>
              <div>
                <label>Pincode</label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }} />
              </div>
              <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                <button type="submit" style={{ padding: '0.8rem 2rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Save Address</button>
              </div>
            </form>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {addresses.map(address => (
            <div key={address._id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'relative' }}>
              <span style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', backgroundColor: '#eef2ff', color: 'var(--primary-color)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                {address.label}
              </span>
              <p style={{ marginTop: '1rem', fontWeight: '500' }}>{address.addressLine}</p>
              <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>{address.area}, {address.city}</p>
              <p style={{ color: 'var(--text-light)' }}>{address.state} - {address.pincode}</p>
              
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button style={{ color: 'var(--primary-color)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}>Edit</button>
                <button onClick={() => handleDelete(address._id)} style={{ color: 'var(--danger-color)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}>Delete</button>
              </div>
            </div>
          ))}
          
          {addresses.length === 0 && !showForm && (
            <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '12px' }}>
              <p style={{ color: 'var(--text-light)' }}>You haven't added any addresses yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerAddresses;
