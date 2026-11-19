import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import styles from './BookingPage.module.css';
import toast from 'react-hot-toast';

const BookingPage = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  // State from previous pages if they clicked "Book Now"
  const preSelectedServiceId = location.state?.serviceId || null;
  const preSelectedProviderId = location.state?.providerId || null;
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    services: [],
    providers: [],
    addresses: [],
  });

  const [bookingData, setBookingData] = useState({
    serviceId: preSelectedServiceId,
    providerId: preSelectedProviderId,
    date: '',
    time: '',
    addressId: '',
    problemDescription: '',
    estimatedPrice: 0
  });

  useEffect(() => {
    if (!user) {
      toast.error('Please login to book a service');
      navigate('/login', { state: { from: '/book' } });
      return;
    }

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [servicesRes, addressesRes] = await Promise.all([
          api.get('/services'),
          api.get('/addresses')
        ]);
        
        setData(prev => ({
          ...prev,
          services: servicesRes.data.data,
          addresses: addressesRes.data.data
        }));

        // If service is pre-selected, find its price
        if (preSelectedServiceId) {
          const service = servicesRes.data.data.find(s => s._id === preSelectedServiceId);
          if (service) {
            setBookingData(prev => ({ ...prev, estimatedPrice: service.basePrice }));
          }
        }
      } catch (error) {
        toast.error('Failed to load required data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, [user, navigate, preSelectedServiceId]);

  // Fetch providers when service changes
  useEffect(() => {
    if (bookingData.serviceId) {
      const fetchProviders = async () => {
        try {
          const { data: provData } = await api.get('/providers');
          // In a real app, filter providers by service area and who offer this service
          // For now, assume backend returns all or we just filter locally
          const filteredProviders = provData.data.filter(p => p.services && p.services.includes(bookingData.serviceId));
          setData(prev => ({ ...prev, providers: filteredProviders.length > 0 ? filteredProviders : provData.data }));
        } catch (error) {
          console.error(error);
        }
      };
      fetchProviders();
      
      // Update estimated price
      const service = data.services.find(s => s._id === bookingData.serviceId);
      if (service) {
        setBookingData(prev => ({ ...prev, estimatedPrice: service.basePrice }));
      }
    }
  }, [bookingData.serviceId, data.services]);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const payload = {
        serviceId: bookingData.serviceId,
        providerId: bookingData.providerId,
        addressId: bookingData.addressId,
        bookingDate: bookingData.date,
        startTime: bookingData.time,
        problemDescription: bookingData.problemDescription,
        estimatedPrice: bookingData.estimatedPrice
      };

      const { data: bookingRes } = await api.post('/bookings', payload);
      
      toast.success('Booking confirmed successfully!');
      
      // We could move to payment step, or just navigate to dashboard
      // Let's navigate to payment mock step
      navigate(`/payment/${bookingRes.data._id}`, { state: { amount: bookingData.estimatedPrice }});
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className={styles.stepContainer}>
            <h2>Select Service</h2>
            <div className={styles.grid}>
              {data.services.map(s => (
                <div 
                  key={s._id} 
                  className={`${styles.card} ${bookingData.serviceId === s._id ? styles.selected : ''}`}
                  onClick={() => setBookingData({...bookingData, serviceId: s._id})}
                >
                  <h3>{s.name}</h3>
                  <p>Starting from ₹{s.basePrice}</p>
                </div>
              ))}
            </div>
            <button 
              className={styles.nextBtn} 
              disabled={!bookingData.serviceId} 
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        );
      
      case 2:
        return (
          <div className={styles.stepContainer}>
            <h2>Select Provider</h2>
            {data.providers.length === 0 ? <p>No providers available for this service.</p> : (
              <div className={styles.grid}>
                {data.providers.map(p => (
                  <div 
                    key={p._id} 
                    className={`${styles.card} ${bookingData.providerId === p._id ? styles.selected : ''}`}
                    onClick={() => setBookingData({...bookingData, providerId: p._id})}
                  >
                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
                      <div className={styles.avatar}>{p.name?.charAt(0)}</div>
                      <div>
                        <h3 style={{margin: 0}}>{p.name}</h3>
                        <p style={{margin: 0, color: 'var(--text-light)', fontSize: '0.9rem'}}>★ {p.profile?.averageRating?.toFixed(1) || '4.5'} ({p.profile?.totalReviews || 0} reviews)</p>
                      </div>
                    </div>
                    <p>Experience: {p.profile?.experience || '2'} years</p>
                  </div>
                ))}
              </div>
            )}
            <div className={styles.btnGroup}>
              <button className={styles.backBtn} onClick={handleBack}>Back</button>
              <button className={styles.nextBtn} disabled={!bookingData.providerId} onClick={handleNext}>Next</button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className={styles.stepContainer}>
            <h2>Select Date & Time</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
              <div>
                <label>Date</label>
                <input 
                  type="date" 
                  value={bookingData.date} 
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setBookingData({...bookingData, date: e.target.value})}
                  className={styles.input}
                />
              </div>
              <div>
                <label>Time Slot</label>
                <select 
                  value={bookingData.time}
                  onChange={e => setBookingData({...bookingData, time: e.target.value})}
                  className={styles.input}
                >
                  <option value="">-- Select Time --</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="17:00">05:00 PM</option>
                </select>
              </div>
            </div>
            <div className={styles.btnGroup}>
              <button className={styles.backBtn} onClick={handleBack}>Back</button>
              <button className={styles.nextBtn} disabled={!bookingData.date || !bookingData.time} onClick={handleNext}>Next</button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className={styles.stepContainer}>
            <h2>Select Address</h2>
            {data.addresses.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <p>You have no addresses saved.</p>
                <button onClick={() => navigate('/customer/addresses')} className={styles.nextBtn} style={{marginTop: '1rem'}}>Add Address in Profile</button>
              </div>
            ) : (
              <div className={styles.grid}>
                {data.addresses.map(a => (
                  <div 
                    key={a._id} 
                    className={`${styles.card} ${bookingData.addressId === a._id ? styles.selected : ''}`}
                    onClick={() => setBookingData({...bookingData, addressId: a._id})}
                  >
                    <h4>{a.label}</h4>
                    <p>{a.addressLine}</p>
                    <p>{a.area}, {a.city}, {a.pincode}</p>
                  </div>
                ))}
              </div>
            )}
            <div className={styles.btnGroup}>
              <button className={styles.backBtn} onClick={handleBack}>Back</button>
              <button className={styles.nextBtn} disabled={!bookingData.addressId} onClick={handleNext}>Next</button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className={styles.stepContainer}>
            <h2>Problem Description</h2>
            <textarea 
              rows="5"
              placeholder="Please describe the issue in detail..."
              value={bookingData.problemDescription}
              onChange={e => setBookingData({...bookingData, problemDescription: e.target.value})}
              className={styles.input}
              style={{ resize: 'vertical' }}
            />
            <div className={styles.btnGroup}>
              <button className={styles.backBtn} onClick={handleBack}>Back</button>
              <button className={styles.nextBtn} disabled={!bookingData.problemDescription} onClick={handleNext}>Next</button>
            </div>
          </div>
        );

      case 6:
        const selectedService = data.services.find(s => s._id === bookingData.serviceId);
        const selectedProvider = data.providers.find(p => p._id === bookingData.providerId);
        const selectedAddress = data.addresses.find(a => a._id === bookingData.addressId);
        
        return (
          <div className={styles.stepContainer}>
            <h2>Confirm Booking</h2>
            
            <div className={styles.summaryCard}>
              <div className={styles.summaryRow}>
                <span>Service:</span>
                <strong>{selectedService?.name}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Provider:</span>
                <strong>{selectedProvider?.name}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Date & Time:</span>
                <strong>{bookingData.date} at {bookingData.time}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Address:</span>
                <strong>{selectedAddress?.addressLine}, {selectedAddress?.area}</strong>
              </div>
              
              <hr style={{ margin: '1.5rem 0', borderColor: '#eee' }} />
              
              <div className={styles.summaryRow} style={{ fontSize: '1.2rem' }}>
                <span>Estimated Price:</span>
                <strong style={{ color: 'var(--primary-color)' }}>₹{bookingData.estimatedPrice}</strong>
              </div>
              
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fffbeb', borderRadius: '8px', fontSize: '0.9rem', color: '#b45309' }}>
                Note: This is an estimated price. Final price may vary based on actual work required.
              </div>
            </div>
            
            <div className={styles.btnGroup}>
              <button className={styles.backBtn} onClick={handleBack} disabled={loading}>Back</button>
              <button className={styles.confirmBtn} onClick={handleSubmit} disabled={loading}>
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`container ${styles.pageWrapper}`}>
      <div className={styles.stepperContainer}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${(step / 6) * 100}%` }}></div>
        </div>
        <div className={styles.stepLabels}>
          <span className={step >= 1 ? styles.activeLabel : ''}>Service</span>
          <span className={step >= 2 ? styles.activeLabel : ''}>Provider</span>
          <span className={step >= 3 ? styles.activeLabel : ''}>Schedule</span>
          <span className={step >= 4 ? styles.activeLabel : ''}>Location</span>
          <span className={step >= 5 ? styles.activeLabel : ''}>Details</span>
          <span className={step >= 6 ? styles.activeLabel : ''}>Confirm</span>
        </div>
      </div>
      
      {renderStepContent()}
    </div>
  );
};

export default BookingPage;
