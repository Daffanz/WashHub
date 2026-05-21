import { Routes, Route, Navigate } from 'react-router-dom';
import LandingLayout from '../layouts/LandingLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import HomePage from '../pages/landing/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/admin/DashboardPage';
import UsersPage from '../pages/admin/UsersPage';
import RolesPage from '../pages/admin/RolesPage';
import SettingsPage from '../pages/admin/SettingsPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingLayout><HomePage /></LandingLayout>} />
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={
          <ProtectedRoute permission="view-users"><UsersPage /></ProtectedRoute>
        } />
        <Route path="roles" element={
          <ProtectedRoute permission="view-roles"><RolesPage /></ProtectedRoute>
        } />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
