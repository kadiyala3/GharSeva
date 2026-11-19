import React from 'react';
import styles from './Home.module.css';

const About = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.heroSection} style={{ minHeight: '40vh' }}>
        <h1>About GharSeva</h1>
        <p>Your Trusted Partner for Home Services</p>
      </div>
      
      <div className={styles.container}>
        <div style={{ padding: '4rem 0', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Our Mission</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-color)' }}>
            At GharSeva, our mission is to empower professionals and deliver reliable, high-quality home services to customers. 
            We believe in creating a marketplace that is transparent, efficient, and trustworthy. Whether it's fixing a leaky pipe, 
            wiring a new home, or regular cleaning, we connect you with verified experts who get the job done right.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', margin: '2rem 0 4rem 0' }}>
          <div style={{ flex: '1', minWidth: '300px', textAlign: 'center', padding: '2rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Verified Professionals</h3>
            <p color="var(--text-light)">Every service provider on GharSeva goes through a strict verification process to ensure your safety and satisfaction.</p>
          </div>
          <div style={{ flex: '1', minWidth: '300px', textAlign: 'center', padding: '2rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Transparent Pricing</h3>
            <p color="var(--text-light)">No hidden fees. You get an estimated price before you book, and a final invoice once the job is completed.</p>
          </div>
          <div style={{ flex: '1', minWidth: '300px', textAlign: 'center', padding: '2rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Instant Booking</h3>
            <p color="var(--text-light)">Find and book the right professional in minutes. Choose a time slot that works best for your schedule.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
