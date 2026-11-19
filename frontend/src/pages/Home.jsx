import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import { Search, MapPin, Wrench, Zap, Paintbrush, Droplet, ChefHat } from 'lucide-react';

const Home = () => {
  const services = [
    { name: 'Plumber', icon: <Droplet size={32} /> },
    { name: 'Electrician', icon: <Zap size={32} /> },
    { name: 'Carpenter', icon: <Wrench size={32} /> },
    { name: 'Painter', icon: <Paintbrush size={32} /> },
    { name: 'Chef', icon: <ChefHat size={32} /> },
  ];

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>✨ #1 Home Services App in India</div>
            <h1 className={styles.title}>
              Get <span className={styles.highlight}>Trusted</span> Home Services at Your Doorstep
            </h1>
            <p className={styles.subtitle}>
              From plumbing and electrical work to cleaning, cooking, carpentry and repairs — find trusted professionals in one place.
            </p>
            
            <div className={styles.searchBox}>
              <div className={styles.searchInput}>
                <Search size={20} className={styles.searchIcon} />
                <input type="text" placeholder="What service do you need?" />
              </div>
              <div className={styles.searchInput}>
                <MapPin size={20} className={styles.searchIcon} />
                <input type="text" placeholder="Where do you need it?" />
              </div>
              <button className={styles.searchBtn}>Find Services</button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className={`container ${styles.servicesSection}`}>
        <h2 className={styles.sectionTitle}>Popular Services</h2>
        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <Link to={`/services?category=${service.name}`} key={index} className={styles.serviceCard}>
              <div className={styles.serviceIconWrapper}>
                {service.icon}
              </div>
              <h3 className={styles.serviceName}>{service.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className={styles.howItWorks}>
        <div className={`container ${styles.howContainer}`}>
          <h2 className={styles.sectionTitle}>How GharSeva Works</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNum}>1</div>
              <h3>Choose a service</h3>
              <p>Select from our wide range of home services</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>2</div>
              <h3>Find a professional</h3>
              <p>Browse through trusted and verified providers</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>3</div>
              <h3>Book a time</h3>
              <p>Schedule the service at your convenience</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>4</div>
              <h3>Get the service</h3>
              <p>Enjoy hassle-free service delivery</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
