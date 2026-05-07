import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';

// Pages
import HomePage        from './pages/HomePage';
import ClubsPage       from './pages/ClubsPage';
import ClubDetailPage  from './pages/ClubDetailPage';
import BookingPage     from './pages/BookingPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import MyBookingsPage  from './pages/MyBookingsPage';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import ProfilePage     from './pages/ProfilePage';

// Admin Pages
import AdminDashboard   from './pages/admin/AdminDashboard';
import AdminBookings    from './pages/admin/AdminBookings';
import AdminTransport   from './pages/admin/AdminTransport';
import AdminClubs       from './pages/admin/AdminClubs';
import AdminUsers       from './pages/admin/AdminUsers';
import AdminAnalytics   from './pages/admin/AdminAnalytics';

// Protected Route wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, token } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  if (adminOnly && !['club_owner', 'super_admin'].includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<MainLayout />}>
        <Route path="/"               element={<HomePage />} />
        <Route path="/clubs"          element={<ClubsPage />} />
        <Route path="/clubs/:id"      element={<ClubDetailPage />} />
        <Route path="/login"          element={<LoginPage />} />
        <Route path="/register"       element={<RegisterPage />} />
      </Route>

      {/* Protected customer routes */}
      <Route element={<MainLayout />}>
        <Route path="/book/:clubId" element={
          <ProtectedRoute><BookingPage /></ProtectedRoute>
        } />
        <Route path="/booking/success" element={
          <ProtectedRoute><BookingSuccessPage /></ProtectedRoute>
        } />
        <Route path="/my-bookings" element={
          <ProtectedRoute><MyBookingsPage /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><ProfilePage /></ProtectedRoute>
        } />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>
      }>
        <Route index           element={<AdminDashboard />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="transport" element={<AdminTransport />} />
        <Route path="clubs"    element={<AdminClubs />} />
        <Route path="users"    element={<AdminUsers />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
