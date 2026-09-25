import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DonorLayout from './layouts/DonorLayout';
import HospitalLayout from './layouts/HospitalLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import BloodAvailabilityPage from './pages/public/BloodAvailabilityPage';
import AboutPage from './pages/public/AboutPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Donor Pages
import DonorDashboard from './pages/donor/DonorDashboard';
import DonorProfile from './pages/donor/DonorProfile';
import EditDonorProfile from './pages/donor/EditDonorProfile';
import DonationHistory from './pages/donor/DonationHistory';
import DonorNotifications from './pages/donor/DonorNotifications';

// Hospital Pages
import HospitalDashboard from './pages/hospital/HospitalDashboard';
import HospitalProfile from './pages/hospital/HospitalProfile';
import EditHospitalProfile from './pages/hospital/EditHospitalProfile';
import SearchBloodPage from './pages/hospital/SearchBloodPage';
import CreateBloodRequest from './pages/hospital/CreateBloodRequest';
import HospitalRequests from './pages/hospital/HospitalRequests';
import RequestDetails from './pages/hospital/RequestDetails';
import HospitalNotifications from './pages/hospital/HospitalNotifications';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDonors from './pages/admin/AdminDonors';
import AdminHospitals from './pages/admin/AdminHospitals';
import AdminBloodStock from './pages/admin/AdminBloodStock';
import AdminDonations from './pages/admin/AdminDonations';
import AdminRequests from './pages/admin/AdminRequests';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminReports from './pages/admin/AdminReports';

// 404 Page
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/blood-availability" element={<BloodAvailabilityPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Donor Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['donor']} />}>
            <Route element={<DonorLayout />}>
              <Route path="/donor/dashboard" element={<DonorDashboard />} />
              <Route path="/donor/profile" element={<DonorProfile />} />
              <Route path="/donor/profile/edit" element={<EditDonorProfile />} />
              <Route path="/donor/donations" element={<DonationHistory />} />
              <Route path="/donor/notifications" element={<DonorNotifications />} />
            </Route>
          </Route>

          {/* Hospital Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['hospital']} />}>
            <Route element={<HospitalLayout />}>
              <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
              <Route path="/hospital/profile" element={<HospitalProfile />} />
              <Route path="/hospital/profile/edit" element={<EditHospitalProfile />} />
              <Route path="/hospital/search-blood" element={<SearchBloodPage />} />
              <Route path="/hospital/request-blood" element={<CreateBloodRequest />} />
              <Route path="/hospital/requests" element={<HospitalRequests />} />
              <Route path="/hospital/requests/:id" element={<RequestDetails />} />
              <Route path="/hospital/notifications" element={<HospitalNotifications />} />
            </Route>
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/donors" element={<AdminDonors />} />
              <Route path="/admin/hospitals" element={<AdminHospitals />} />
              <Route path="/admin/blood-stock" element={<AdminBloodStock />} />
              <Route path="/admin/donations" element={<AdminDonations />} />
              <Route path="/admin/requests" element={<AdminRequests />} />
              <Route path="/admin/notifications" element={<AdminNotifications />} />
              <Route path="/admin/reports" element={<AdminReports />} />
            </Route>
          </Route>

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
