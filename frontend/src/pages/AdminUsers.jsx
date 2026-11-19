import React, { useState, useEffect } from 'react';
import api from '../services/api';
import AdminSidebar from '../components/AdminSidebar';
import styles from './Dashboard.module.css';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/admin/users?role=CUSTOMER');
        setUsers(data.data);
      } catch (error) {
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { status: newStatus });
      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
      toast.success('User status updated');
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
    return `https://ui-avatars.com/api/?name=${u?.name || 'User'}&background=4f46e5&color=fff`;
  };

  if (loading) return <div className={styles.loading}>Loading users...</div>;

  return (
    <div className={`container ${styles.dashboardContainer}`}>
      <AdminSidebar />
      <main className={styles.mainContent}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className={styles.pageTitle}>Manage Customers</h1>
        </div>
        
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <img 
                          src={getProfileImage(user)} 
                          alt={user.name} 
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #eee' }} 
                        />
                        <span style={{ fontWeight: '500' }}>{user.name}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>
                      <span style={{ 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '20px', 
                        fontSize: '0.8rem', 
                        fontWeight: '600',
                        backgroundColor: user.status === 'ACTIVE' ? '#dcfce7' : '#fee2e2',
                        color: user.status === 'ACTIVE' ? '#166534' : '#ef4444'
                      }}>
                        {user.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select 
                        value={user.status || 'ACTIVE'} 
                        onChange={(e) => handleStatusChange(user._id, e.target.value)}
                        style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #ddd' }}
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="SUSPENDED">Suspend</option>
                      </select>
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

export default AdminUsers;
