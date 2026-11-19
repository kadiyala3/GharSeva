import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from './Auth.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'CUSTOMER'
  });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.title}>Create an Account</h2>
        <p className={styles.subtitle}>Join GharSeva today</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
          </div>
          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required />
          </div>
          <div className={styles.formGroup}>
            <label>Phone Number</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit number" required />
          </div>
          <div className={styles.formGroup}>
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a strong password" required />
          </div>
          <div className={styles.formGroup}>
            <label>I want to join as</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="CUSTOMER">Customer (Book Services)</option>
              <option value="PROVIDER">Service Provider (Provide Services)</option>
            </select>
          </div>
          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
            Create Account
          </button>
        </form>
        
        <div className={styles.footer}>
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
