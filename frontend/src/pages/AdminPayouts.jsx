import React, { useState, useEffect } from 'react';
import api from '../services/api';
import AdminSidebar from '../components/AdminSidebar';
import styles from './Dashboard.module.css';
import toast from 'react-hot-toast';

const AdminPayouts = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We'll mock the payout calculation by fetching all bookings 
    // and aggregating them by provider for the sake of the demo.
    const fetchPayouts = async () => {
      try {
        const { data: bookingData } = await api.get('/admin/dashboard');
        // Let's just fetch users and mock their earnings
        const { data: providerData } = await api.get('/admin/users?role=PROVIDER');
        
        const payouts = providerData.data.map(p => ({
          ...p,
          totalEarned: Math.floor(Math.random() * 50000) + 10000,
          pendingPayout: Math.floor(Math.random() * 10000),
          lastPayoutDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString()
        }));
        
        setProviders(payouts);
      } catch (error) {
        toast.error('Failed to load payouts');
      } finally {
        setLoading(false);
      }
    };
    fetchPayouts();
  }, []);

  const handlePay = (providerId) => {
    setProviders(providers.map(p => {
      if (p._id === providerId) {
        toast.success(`Payout of ₹${p.pendingPayout} sent to ${p.name}`);
        return { ...p, pendingPayout: 0, lastPayoutDate: new Date().toLocaleDateString() };
      }
      return p;
    }));
  };

  if (loading) return <div className={styles.loading}>Loading payouts...</div>;

  return (
    <div className={`container ${styles.dashboardContainer}`}>
      <AdminSidebar />
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Provider Payouts</h1>
        
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Total Earned (Lifetime)</th>
                  <th>Pending Payout</th>
                  <th>Last Payout</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {providers.map(provider => (
                  <tr key={provider._id}>
                    <td>
                      <div style={{ fontWeight: '500' }}>{provider.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{provider.email}</div>
                    </td>
                    <td>₹{provider.totalEarned.toLocaleString()}</td>
                    <td style={{ color: provider.pendingPayout > 0 ? '#ea580c' : 'green', fontWeight: 'bold' }}>
                      ₹{provider.pendingPayout.toLocaleString()}
                    </td>
                    <td>{provider.lastPayoutDate}</td>
                    <td>
                      {provider.pendingPayout > 0 ? (
                        <button 
                          onClick={() => handlePay(provider._id)}
                          style={{ padding: '0.5rem 1rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          Send Payout
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-light)' }}>All Settled</span>
                      )}
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

export default AdminPayouts;
