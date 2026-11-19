import React, { useState, useEffect } from 'react';
import api from '../services/api';
import AdminSidebar from '../components/AdminSidebar';
import styles from './Dashboard.module.css';
import toast from 'react-hot-toast';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/services');
        setServices(data.data);
      } catch (error) {
        toast.error('Failed to load services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return <div className={styles.loading}>Loading services...</div>;

  return (
    <div className={`container ${styles.dashboardContainer}`}>
      <AdminSidebar />
      <main className={styles.mainContent}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className={styles.pageTitle}>Manage Services</h1>
          <button style={{ padding: '0.8rem 1.5rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            + Add Service
          </button>
        </div>
        
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Service Name</th>
                  <th>Category</th>
                  <th>Base Price</th>
                  <th>Est. Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {services.map(service => (
                  <tr key={service._id}>
                    <td>
                      <div style={{ fontWeight: '500' }}>{service.name}</div>
                    </td>
                    <td>{service.categoryId?.name || 'Uncategorized'}</td>
                    <td>₹{service.basePrice}</td>
                    <td>{service.estimatedDuration} mins</td>
                    <td>
                      <span style={{ color: service.isActive ? 'green' : 'red' }}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminServices;
