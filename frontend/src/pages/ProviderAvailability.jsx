import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import ProviderSidebar from '../components/ProviderSidebar';
import styles from './Dashboard.module.css';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const ProviderAvailability = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [schedule, setSchedule] = useState([
    { day: 'Monday', available: true, slots: [{ startTime: '09:00', endTime: '17:00' }] },
    { day: 'Tuesday', available: true, slots: [{ startTime: '09:00', endTime: '17:00' }] },
    { day: 'Wednesday', available: true, slots: [{ startTime: '09:00', endTime: '17:00' }] },
    { day: 'Thursday', available: true, slots: [{ startTime: '09:00', endTime: '17:00' }] },
    { day: 'Friday', available: true, slots: [{ startTime: '09:00', endTime: '17:00' }] },
    { day: 'Saturday', available: false, slots: [{ startTime: '09:00', endTime: '13:00' }] },
    { day: 'Sunday', available: false, slots: [{ startTime: '09:00', endTime: '13:00' }] }
  ]);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const { data } = await api.get(`/providers/${user?._id}/availability`);
        if (data.data && data.data.schedule && data.data.schedule.length > 0) {
          // Merge fetched schedule with defaults to ensure all 7 days exist
          const fetchedSchedule = data.data.schedule;
          const mergedSchedule = schedule.map(defaultDay => {
            const fetchedDay = fetchedSchedule.find(d => d.day === defaultDay.day);
            return fetchedDay ? fetchedDay : defaultDay;
          });
          setSchedule(mergedSchedule);
        }
      } catch (error) {
        // If 404, it means no availability set yet, which is fine, we use defaults
        if (error.response?.status !== 404) {
          toast.error('Failed to load availability');
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchAvailability();
  }, [user]);

  const handleToggleDay = (index) => {
    const newSchedule = [...schedule];
    newSchedule[index].available = !newSchedule[index].available;
    setSchedule(newSchedule);
  };

  const handleTimeChange = (dayIndex, slotIndex, field, value) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].slots[slotIndex][field] = value;
    setSchedule(newSchedule);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/providers/availability', { schedule });
      toast.success('Availability saved successfully');
    } catch (error) {
      toast.error('Failed to save availability');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading schedule...</div>;

  return (
    <div className={`container ${styles.dashboardContainer}`}>
      <ProviderSidebar />
      <main className={styles.mainContent}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className={styles.pageTitle}>Availability Schedule</h1>
          <button 
            onClick={handleSave} 
            disabled={saving}
            style={{ padding: '0.8rem 1.5rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
          >
            {saving ? 'Saving...' : 'Save Schedule'}
          </button>
        </div>
        
        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
          Set your working hours for each day. Customers will only be able to book you during these time slots.
        </p>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          {schedule.map((dayData, dayIndex) => (
            <div key={dayData.day} style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid #eee' }}>
              <div style={{ width: '150px', display: 'flex', alignItems: 'center' }}>
                <label className={styles.switch} style={{ marginRight: '1rem' }}>
                  <input 
                    type="checkbox" 
                    checked={dayData.available} 
                    onChange={() => handleToggleDay(dayIndex)} 
                  />
                  <span className={styles.slider}></span>
                </label>
                <span style={{ fontWeight: dayData.available ? '600' : '400', color: dayData.available ? 'var(--text-color)' : 'var(--text-light)' }}>
                  {dayData.day}
                </span>
              </div>
              
              <div style={{ flex: 1 }}>
                {dayData.available ? (
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {dayData.slots.map((slot, slotIndex) => (
                      <div key={slotIndex} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input 
                          type="time" 
                          value={slot.startTime} 
                          onChange={(e) => handleTimeChange(dayIndex, slotIndex, 'startTime', e.target.value)}
                          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px' }}
                        />
                        <span>to</span>
                        <input 
                          type="time" 
                          value={slot.endTime} 
                          onChange={(e) => handleTimeChange(dayIndex, slotIndex, 'endTime', e.target.value)}
                          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px' }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <span style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>Unavailable</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProviderAvailability;
