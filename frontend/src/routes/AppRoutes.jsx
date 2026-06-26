import { Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import DashboardLayout from '../layouts/DashboardLayout'

// Pages
import LandingPage from '../pages/landing/LandingPage'
import LoginPage from '../pages/auth/LoginPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import UsersPage from '../pages/users/UsersPage'
import RolesPage from '../pages/roles/RolesPage'
import PermissionsPage from '../pages/permissions/PermissionsPage'
import ProfilePage from '../pages/profile/ProfilePage'
import SettingsPage from '../pages/settings/SettingsPage'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public — Landing */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected — Dashboard */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/permissions" element={<PermissionsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
