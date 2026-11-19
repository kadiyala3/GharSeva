import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminProviders from './pages/AdminProviders';
import AdminCategories from './pages/AdminCategories';
import AdminServices from './pages/AdminServices';
import AdminBookings from './pages/AdminBookings';
import AdminComplaints from './pages/AdminComplaints';
import AdminPayouts from './pages/AdminPayouts';
import ServicesPage from './pages/ServicesPage';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import BookingDetailsPage from './pages/BookingDetailsPage';
import ProvidersPage from './pages/ProvidersPage';
import ProviderDetailsPage from './pages/ProviderDetailsPage';
import ProviderRegister from './pages/ProviderRegister';
import Contact from './pages/Contact';
import About from './pages/About';
import CustomerProfile from './pages/CustomerProfile';
import CustomerAddresses from './pages/CustomerAddresses';
import CustomerBookings from './pages/CustomerBookings';
import CustomerFavorites from './pages/CustomerFavorites';
import CustomerMessages from './pages/CustomerMessages';
import CustomerNotifications from './pages/CustomerNotifications';
import CustomerComplaints from './pages/CustomerComplaints';
import ProviderProfile from './pages/ProviderProfile';
import ProviderVerification from './pages/ProviderVerification';
import ProviderServices from './pages/ProviderServices';
import ProviderAvailability from './pages/ProviderAvailability';
import ProviderEarnings from './pages/ProviderEarnings';
import ProviderBookings from './pages/ProviderBookings';
import ProviderReviews from './pages/ProviderReviews';
import ProviderNotifications from './pages/ProviderNotifications';
import ProviderMessages from './pages/ProviderMessages';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/providers" element={<ProvidersPage />} />
              <Route path="/providers/:id" element={<ProviderDetailsPage />} />
              <Route path="/book" element={<BookingPage />} />
              <Route path="/payment/:id" element={<PaymentPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/provider/register" element={<ProviderRegister />} />
              
              {/* Customer Routes */}
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />
              <Route path="/customer/profile" element={<CustomerProfile />} />
              <Route path="/customer/addresses" element={<CustomerAddresses />} />
              <Route path="/customer/bookings" element={<CustomerBookings />} />
              <Route path="/customer/bookings/:id" element={<BookingDetailsPage />} />
              <Route path="/customer/favorites" element={<CustomerFavorites />} />
              <Route path="/customer/messages" element={<CustomerMessages />} />
              <Route path="/customer/notifications" element={<CustomerNotifications />} />
              <Route path="/customer/complaints" element={<CustomerComplaints />} />
              
              {/* Provider Routes */}
              <Route path="/provider/dashboard" element={<ProviderDashboard />} />
              <Route path="/provider/profile" element={<ProviderProfile />} />
              <Route path="/provider/verification" element={<ProviderVerification />} />
              <Route path="/provider/services" element={<ProviderServices />} />
              <Route path="/provider/availability" element={<ProviderAvailability />} />
              <Route path="/provider/earnings" element={<ProviderEarnings />} />
              <Route path="/provider/bookings" element={<ProviderBookings />} />
              <Route path="/provider/reviews" element={<ProviderReviews />} />
              <Route path="/provider/messages" element={<ProviderMessages />} />
              <Route path="/provider/notifications" element={<ProviderNotifications />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/providers" element={<AdminProviders />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/services" element={<AdminServices />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/admin/complaints" element={<AdminComplaints />} />
              <Route path="/admin/payouts" element={<AdminPayouts />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;
