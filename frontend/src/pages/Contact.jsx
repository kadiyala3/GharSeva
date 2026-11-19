import React from 'react';
import styles from './Home.module.css';

const Contact = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.heroSection} style={{ minHeight: '40vh' }}>
        <h1>Contact Us</h1>
        <p>We're here to help! Reach out to the GharSeva team.</p>
      </div>
      
      <div className={styles.container}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '3rem' }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h2>Get in Touch</h2>
            <p style={{ marginTop: '1rem', color: 'var(--text-light)' }}>
              Have a question about our services? Need help with a booking? 
              Our customer support team is available 24/7.
            </p>
            
            <div style={{ marginTop: '2rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Email:</strong> support@gharseva.com
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Phone:</strong> +91 1800 123 4567
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Address:</strong><br/>
                123, Tech Park, Sector 45<br/>
                Gurugram, Haryana 122003<br/>
                India
              </div>
            </div>
          </div>
          
          <div style={{ flex: '1', minWidth: '300px', backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <form>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Name</label>
                <input type="text" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }} placeholder="Your name" />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
                <input type="email" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }} placeholder="Your email" />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Message</label>
                <textarea rows="5" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', resize: 'vertical' }} placeholder="How can we help?"></textarea>
              </div>
              <button type="button" style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
