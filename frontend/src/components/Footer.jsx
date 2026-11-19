import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.brand}>
          <h3>GHARSEVA</h3>
          <p>All Your Home Services. One Trusted Place.</p>
        </div>
        <div className={styles.links}>
          <div className={styles.column}>
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>
          <div className={styles.column}>
            <h4>Legal</h4>
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} GharSeva. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
