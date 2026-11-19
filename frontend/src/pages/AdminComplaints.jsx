import React, { useState, useEffect } from 'react';
import api from '../services/api';
import AdminSidebar from '../components/AdminSidebar';
import styles from './Dashboard.module.css';
import toast from 'react-hot-toast';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await api.get('/admin/complaints');
        setComplaints(data.data || []);
      } catch (error) {
        toast.error('Failed to load complaints');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const handleStatusUpdate = async (id, status, resolutionNotes) => {
    try {
      await api.put(`/admin/complaints/${id}`, { status, resolutionNotes });
      setComplaints(complaints.map(c => c._id === id ? { ...c, status, resolutionNotes } : c));
      toast.success('Complaint status updated');
    } catch (error) {
      toast.error('Failed to update complaint');
    }
  };

  if (loading) return <div className={styles.loading}>Loading complaints...</div>;

  return (
    <div className={`container ${styles.dashboardContainer}`}>
      <AdminSidebar />
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Resolution Center</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {complaints.length === 0 ? (
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
              No complaints found. All good!
            </div>
          ) : (
            complaints.map(complaint => (
              <div key={complaint._id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Booking #{complaint.bookingId?.bookingNumber}</h3>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)' }}>
                      Filed by: <strong>{complaint.customerId?.name}</strong> | Provider: <strong>{complaint.providerId?.name}</strong>
                    </p>
                  </div>
                  <div>
                    <span style={{ 
                      padding: '0.3rem 0.8rem', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem', 
                      fontWeight: '600',
                      backgroundColor: complaint.status === 'RESOLVED' ? '#dcfce7' : '#fee2e2',
                      color: complaint.status === 'RESOLVED' ? '#166534' : '#ef4444'
                    }}>
                      {complaint.status}
                    </span>
                  </div>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Issue Description:</h4>
                  <p style={{ margin: 0, padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '0.9rem' }}>
                    {complaint.description}
                  </p>
                </div>

                {complaint.status === 'PENDING' ? (
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      placeholder="Resolution notes (e.g. Refunded ₹500)" 
                      id={`notes-${complaint._id}`}
                      style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                    <button 
                      onClick={() => {
                        const notes = document.getElementById(`notes-${complaint._id}`).value;
                        handleStatusUpdate(complaint._id, 'RESOLVED', notes);
                      }}
                      style={{ padding: '0.6rem 1.5rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      Mark as Resolved
                    </button>
                  </div>
                ) : (
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Resolution Notes:</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)' }}>
                      {complaint.resolutionNotes || 'Resolved with no additional notes.'}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminComplaints;
