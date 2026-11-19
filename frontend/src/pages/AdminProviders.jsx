import React, { useState, useEffect } from 'react';
import api from '../services/api';
import AdminSidebar from '../components/AdminSidebar';
import styles from './Dashboard.module.css';
import toast from 'react-hot-toast';

const AdminProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const { data } = await api.get('/admin/users?role=PROVIDER');
        setProviders(data.data);
      } catch (error) {
        toast.error('Failed to load providers');
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  const handleVerification = async (providerId, status) => {
    try {
      await api.put(`/admin/providers/${providerId}/verify`, { status });
      // Update local state
      setProviders(providers.map(p => {
        if (p._id === providerId) {
          return {
            ...p,
            profile: { ...p.profile, verificationStatus: status }
          };
        }
        return p;
      }));
      toast.success(`Provider verification updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update verification status');
    }
  };

  const handleAccountStatus = async (userId, status) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { status });
      setProviders(providers.map(p => p._id === userId ? { ...p, status } : p));
      toast.success('Account status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getProfileImage = (u) => {
    if (u?.profileImage) {
      return u.profileImage.startsWith('http') 
        ? u.profileImage 
        : `http://localhost:5000${u.profileImage}`;
    }
    return `https://ui-avatars.com/api/?name=${u?.name || 'Provider'}&background=f59e0b&color=fff`;
  };

  if (loading) return <div className={styles.loading}>Loading providers...</div>;

  return (
    <div className={`container ${styles.dashboardContainer}`}>
      <AdminSidebar />
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Providers & Verification</h1>
        
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Provider Info</th>
                  <th>Verification</th>
                  <th>Acc Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {providers.map(provider => (
                  <tr key={provider._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <img 
                          src={getProfileImage(provider)} 
                          alt={provider.name} 
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #eee' }} 
                        />
                        <div>
                          <div style={{ fontWeight: '500' }}>{provider.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{provider.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '20px', 
                        fontSize: '0.8rem', 
                        fontWeight: '600',
                        backgroundColor: provider.profile?.verificationStatus === 'VERIFIED' ? '#dcfce7' : 
                                         provider.profile?.verificationStatus === 'PENDING' ? '#fef9c3' : '#fee2e2',
                        color: provider.profile?.verificationStatus === 'VERIFIED' ? '#166534' : 
                               provider.profile?.verificationStatus === 'PENDING' ? '#854d0e' : '#ef4444'
                      }}>
                        {provider.profile?.verificationStatus || 'PENDING'}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: provider.status === 'SUSPENDED' ? 'red' : 'green', fontSize: '0.9rem' }}>
                        {provider.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td>{new Date(provider.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <select 
                          value={provider.profile?.verificationStatus || 'PENDING'} 
                          onChange={(e) => handleVerification(provider._id, e.target.value)}
                          style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.8rem' }}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="VERIFIED">Verified</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                        <select 
                          value={provider.status || 'ACTIVE'} 
                          onChange={(e) => handleAccountStatus(provider._id, e.target.value)}
                          style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.8rem' }}
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="SUSPENDED">Suspend</option>
                        </select>
                      </div>
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

export default AdminProviders;
