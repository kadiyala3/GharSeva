const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const ProviderProfile = require('./models/ProviderProfile');
const ServiceCategory = require('./models/ServiceCategory');
const Service = require('./models/Service');

dotenv.config({ path: '../.env' });

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await ProviderProfile.deleteMany();
    await ServiceCategory.deleteMany();
    await Service.deleteMany();

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@gharseva.com',
      phone: '9999999999',
      password: 'password123',
      role: 'ADMIN'
    });

    const customer = await User.create({
      name: 'Customer User',
      email: 'customer@gharseva.com',
      phone: '8888888888',
      password: 'password123',
      role: 'CUSTOMER'
    });

    const provider = await User.create({
      name: 'Provider User',
      email: 'provider@gharseva.com',
      phone: '7777777777',
      password: 'password123',
      role: 'PROVIDER'
    });

    await ProviderProfile.create({
      userId: provider._id,
      verificationStatus: 'VERIFIED',
      bio: 'Expert Plumber with 10 years of experience.',
      experience: 10,
      skills: ['Plumbing', 'Pipe Repair'],
      city: 'Delhi',
      averageRating: 4.8,
      totalReviews: 50
    });

    const category = await ServiceCategory.create({
      name: 'Plumbing',
      description: 'All your plumbing needs'
    });

    await Service.create({
      categoryId: category._id,
      name: 'Tap Repair',
      description: 'Repair leaking taps',
      basePrice: 300,
      estimatedDuration: 60
    });

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  // destroyData(); // implementation omitted
} else {
  importData();
}
