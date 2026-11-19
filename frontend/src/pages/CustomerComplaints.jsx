import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CustomerSidebar from '../components/CustomerSidebar';
import styles from './Dashboard.module.css';
import toast from 'react-hot-toast';

const CustomerComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Need bookings for the complaint form
  const [bookings, setBookings] = useState([]);
  
  const [formData, setFormData] = useState({
    bookingId: '',
    category: 'Service Quality',
    description: ''
  });

  const fetchComplaints = async () => {
    try {
      const { data } = await api.get('/complaints/my');
      setComplaints(data.data);
    } catch (error) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my');
      // Only allow complaints for completed or confirmed bookings usually, but we'll show all for now
      setBookings(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchBookings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.bookingId) return toast.error('Please select a booking');
    
    // Find providerId from the selected booking
    const selectedBooking = bookings.find(b => b._id === formData.bookingId);
    if (!selectedBooking) return toast.error('Invalid booking');
    
    try {
      await api.post('/complaints', {
        ...formData,
        providerId: selectedBooking.providerId
      });
      toast.success('Complaint submitted successfully');
      setShowForm(false);
      setFormData({ bookingId: '', category: 'Service Quality', description: '' });
      fetchComplaints();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    }
  };

  if (loading) return <div className={styles.loading}>Loading complaints...</div>;

  return (
    <div className={`container ${styles.dashboardContainer}`}>
      <CustomerSidebar />
      <main className={styles.mainContent}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className={styles.pageTitle}>My Complaints</h1>
          <button 
            onClick={() => setShowForm(!showForm)} 
            style={{ padding: '0.8rem 1.5rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            {showForm ? 'Cancel' : 'Raise Complaint'}
          </button>
        </div>

        {showForm && (
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
            <h3>Raise a New Complaint</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Select Booking</label>
                <select name="bookingId" value={formData.bookingId} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                  <option value="">-- Select a Booking --</option>
                  {bookings.map(booking => (
                    <option key={booking._id} value={booking._id}>
                      {booking.bookingNumber} - {booking.serviceId?.name} ({new Date(booking.bookingDate).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Category</label>
                <select name="category" value={formData.category} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                  <option value="Service Quality">Service Quality</option>
                  <option value="Late Arrival">Late Arrival</option>
                  <option value="Provider Behaviour">Provider Behaviour</option>
                  <option value="Incorrect Price">Incorrect Price</option>
                  <option value="Payment Issue">Payment Issue</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  required 
                  rows="4"
                  placeholder="Please describe your issue in detail..."
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', resize: 'vertical' }}
                ></textarea>
              </div>
              
              <button type="submit" style={{ padding: '1rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                Submit Complaint
              </button>
            </form>
          </div>
        )}

        {complaints.length === 0 && !showForm ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <p style={{ color: 'var(--text-light)' }}>You haven't raised any complaints.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {complaints.map(complaint => (
              <div key={complaint._id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>{complaint.category}</h4>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                      Booking ID: {complaint.bookingId?.bookingNumber || 'Unknown'} | Provider: {complaint.providerId?.name || 'Unknown'}
                    </p>
                  </div>
                  <span style={{ 
                    padding: '0.3rem 0.8rem', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold',
                    backgroundColor: complaint.status === 'RESOLVED' || complaint.status === 'CLOSED' ? '#dcfce7' : '#fef9c3',
                    color: complaint.status === 'RESOLVED' || complaint.status === 'CLOSED' ? '#166534' : '#854d0e'
                  }}>
                    {complaint.status}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {complaint.description}
                </p>
                <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                  Submitted on {new Date(complaint.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerComplaints;
