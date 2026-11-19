require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import all models
const User = require('./src/models/User');
const ServiceCategory = require('./src/models/ServiceCategory');
const Service = require('./src/models/Service');
const ProviderProfile = require('./src/models/ProviderProfile');
const Address = require('./src/models/Address');
const Booking = require('./src/models/Booking');
const Review = require('./src/models/Review');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gharseva';

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      ServiceCategory.deleteMany({}),
      Service.deleteMany({}),
      ProviderProfile.deleteMany({}),
      Address.deleteMany({}),
      Booking.deleteMany({}),
      Review.deleteMany({})
    ]);

    console.log('Creating Admin...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@gharseva.com',
      phone: '9999999999',
      password: 'password123',
      role: 'ADMIN',
      isVerified: true
    });

    console.log('Creating Customers...');
    const customer1 = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '9876543210',
      password: 'password123',
      role: 'CUSTOMER',
      isVerified: true
    });

    const customer2 = await User.create({
      name: 'Priya Singh',
      email: 'priya@example.com',
      phone: '9876543211',
      password: 'password123',
      role: 'CUSTOMER',
      isVerified: true
    });

    console.log('Creating Categories...');
    const cleaningCategory = await ServiceCategory.create({
      name: 'Cleaning',
      description: 'Professional cleaning services for home and office.',
      icon: 'FaBroom',
      isActive: true
    });

    const repairCategory = await ServiceCategory.create({
      name: 'Repair',
      description: 'Expert repair services for appliances and home.',
      icon: 'FaWrench',
      isActive: true
    });

    console.log('Creating Services...');
    const service1 = await Service.create({
      name: 'Deep Home Cleaning',
      description: 'Intensive cleaning of all rooms, bathrooms, and kitchen.',
      categoryId: cleaningCategory._id,
      basePrice: 2499,
      estimatedDuration: 240,
      isActive: true,
      features: ['Dusting', 'Mopping', 'Bathroom Deep Clean', 'Kitchen Degreasing']
    });

    const service2 = await Service.create({
      name: 'AC Servicing',
      description: 'Comprehensive AC servicing and cleaning.',
      categoryId: repairCategory._id,
      basePrice: 599,
      estimatedDuration: 60,
      isActive: true,
      features: ['Filter Cleaning', 'Gas check', 'Coil washing']
    });

    const service3 = await Service.create({
      name: 'Washing Machine Repair',
      description: 'Fixing all types of washing machines.',
      categoryId: repairCategory._id,
      basePrice: 499,
      estimatedDuration: 90,
      isActive: true,
      features: ['Diagnosis', 'Parts replacement (extra cost)', 'Testing']
    });

    console.log('Creating Providers...');
    const provider1 = await User.create({
      name: 'Amit Kumar',
      email: 'amit@provider.com',
      phone: '9876543212',
      password: 'password123',
      role: 'PROVIDER',
      isVerified: true
    });

    const provider2 = await User.create({
      name: 'Suresh Electric & Repair',
      email: 'suresh@provider.com',
      phone: '9876543213',
      password: 'password123',
      role: 'PROVIDER',
      isVerified: true
    });

    console.log('Creating Provider Profiles...');
    await ProviderProfile.create({
      userId: provider1._id,
      bio: 'Expert in deep cleaning with 5 years of experience in top-tier hotels.',
      skills: ['Deep Cleaning', 'Sanitization', 'Carpet Cleaning'],
      experience: 5,
      hourlyRate: 300,
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      serviceRadius: 15,
      services: [service1._id],
      verificationStatus: 'VERIFIED',
      averageRating: 4.8,
      totalReviews: 24,
      completedJobs: 45
    });

    await ProviderProfile.create({
      userId: provider2._id,
      bio: 'Certified technician for all home appliances. Quick and reliable service.',
      skills: ['AC Repair', 'Washing Machine', 'Refrigerator'],
      experience: 8,
      hourlyRate: 500,
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110002',
      serviceRadius: 20,
      services: [service2._id, service3._id],
      verificationStatus: 'VERIFIED',
      averageRating: 4.5,
      totalReviews: 12,
      completedJobs: 30
    });

    console.log('Creating Addresses...');
    const address1 = await Address.create({
      userId: customer1._id,
      label: 'Home',
      addressLine: 'A-123, Vasant Kunj',
      area: 'South Delhi',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110070',
      isDefault: true
    });

    console.log('Creating Bookings...');
    const booking1 = await Booking.create({
      bookingNumber: 'BKG' + Date.now(),
      customerId: customer1._id,
      providerId: provider1._id,
      serviceId: service1._id,
      addressId: address1._id,
      bookingDate: new Date(Date.now() + 86400000), // Tomorrow
      startTime: '10:00',
      status: 'PENDING',
      paymentStatus: 'PENDING',
      estimatedPrice: 2499,
      problemDescription: 'Need full house deep cleaning before a party.'
    });

    const booking2 = await Booking.create({
      bookingNumber: 'BKG' + (Date.now() + 1),
      customerId: customer1._id,
      providerId: provider2._id,
      serviceId: service2._id,
      addressId: address1._id,
      bookingDate: new Date(Date.now() - 86400000), // Yesterday
      startTime: '14:00',
      status: 'COMPLETED',
      paymentStatus: 'SUCCESS',
      estimatedPrice: 599,
      finalPrice: 599,
      problemDescription: 'AC is not cooling properly.'
    });

    console.log('Creating Reviews...');
    await Review.create({
      bookingId: booking2._id,
      customerId: customer1._id,
      providerId: provider2._id,
      serviceId: service2._id,
      rating: 5,
      comment: 'Excellent service! Fixed the AC cooling issue in just 30 minutes.'
    });

    console.log('Database Seeding Completed Successfully! 🌱');
    console.log('Test Accounts:');
    console.log('- Admin: admin@gharseva.com / password123');
    console.log('- Customer: rahul@example.com / password123');
    console.log('- Provider: amit@provider.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
