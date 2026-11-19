import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import AdminSidebar from '../components/AdminSidebar';
import ProfilePictureUpload from '../components/ProfilePictureUpload';
import styles from './Dashboard.module.css';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const mockChartData = [
  { name: 'Jan', revenue: 4000, bookings: 24 },
  { name: 'Feb', revenue: 3000, bookings: 18 },
  { name: 'Mar', revenue: 5000, bookings: 29 },
  { name: 'Apr', revenue: 8780, bookings: 39 },
  { name: 'May', revenue: 5890, bookings: 48 },
  { name: 'Jun', revenue: 8390, bookings: 38 },
  { name: 'Jul', revenue: 10490, bookings: 53 },
];

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/dashboard');
        setStats(data.data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className={styles.loading}>Loading dashboard...</div>;

  return (
    <div className={`container ${styles.dashboardContainer}`}>
      <AdminSidebar />
      
      <main className={styles.mainContent}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className={styles.pageTitle}>Admin Dashboard</h1>
          <ProfilePictureUpload />
        </div>
        
        <div className={styles.statsGrid}>
          <div className={styles.statCard} style={{ borderLeft: '4px solid var(--primary-color)' }}>
            <h3>Total Customers</h3>
            <p className={styles.statValue}>{stats?.totalCustomers || 0}</p>
          </div>
          <div className={styles.statCard} style={{ borderLeft: '4px solid #10b981' }}>
            <h3>Total Providers</h3>
            <p className={styles.statValue}>{stats?.totalProviders || 0}</p>
          </div>
          <div className={styles.statCard} style={{ borderLeft: '4px solid #f59e0b' }}>
            <h3>Total Bookings</h3>
            <p className={styles.statValue}>{stats?.totalBookings || 0}</p>
          </div>
          <div className={styles.statCard} style={{ borderLeft: '4px solid #8b5cf6' }}>
            <h3>Revenue (Mock)</h3>
            <p className={styles.statValue}>₹{stats?.totalRevenue || 45550}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Revenue Overview (2026)</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Bookings Growth</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bookings" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
