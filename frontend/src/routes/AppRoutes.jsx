import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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

// Modul 2, 3, 4 Pages
import OutletsPage from '../pages/outlets/OutletsPage'
import SuppliersPage from '../pages/suppliers/SuppliersPage'
import KategoriBahanPage from '../pages/kategori-bahan/KategoriBahanPage'
import BahanBakuPage from '../pages/bahan-baku/BahanBakuPage'
import MesinPage from '../pages/mesin/MesinPage'
import JenisLayananPage from '../pages/jenis-layanan/JenisLayananPage'
import KomposisiBahanPage from '../pages/komposisi-bahan/KomposisiBahanPage'
import PurchaseOrdersPage from '../pages/purchase-orders/PurchaseOrdersPage'
import ReceivingsPage from '../pages/receivings/ReceivingsPage'
import DistributionsPage from '../pages/distributions/DistributionsPage'
import StockPage from '../pages/stock/StockPage'
import StockMutasiPage from '../pages/stock-mutasi/StockMutasiPage'
import MinimumStockPage from '../pages/minimum-stock/MinimumStockPage'

const PermissionRoute = ({ children, permission }) => {
  const { hasPermission, loading } = useAuth()
  if (loading) return null
  if (permission && !hasPermission(permission)) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

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
        <Route path="/dashboard" element={
          <PermissionRoute permission="view-dashboard">
            <DashboardPage />
          </PermissionRoute>
        } />
        <Route path="/users" element={
          <PermissionRoute permission="view-users">
            <UsersPage />
          </PermissionRoute>
        } />
        <Route path="/roles" element={
          <PermissionRoute permission="view-roles">
            <RolesPage />
          </PermissionRoute>
        } />
        <Route path="/permissions" element={
          <PermissionRoute permission="view-roles">
            <PermissionsPage />
          </PermissionRoute>
        } />
        
        {/* Modul 2 */}
        <Route path="/outlets" element={
          <PermissionRoute permission="view-outlets">
            <OutletsPage />
          </PermissionRoute>
        } />
        <Route path="/suppliers" element={
          <PermissionRoute permission="view-suppliers">
            <SuppliersPage />
          </PermissionRoute>
        } />
        <Route path="/kategori-bahan" element={
          <PermissionRoute permission="view-kategori-bahan">
            <KategoriBahanPage />
          </PermissionRoute>
        } />
        <Route path="/bahan-baku" element={
          <PermissionRoute permission="view-bahan-baku">
            <BahanBakuPage />
          </PermissionRoute>
        } />
        <Route path="/mesin" element={
          <PermissionRoute permission="view-mesin">
            <MesinPage />
          </PermissionRoute>
        } />
        <Route path="/jenis-layanan" element={
          <PermissionRoute permission="view-jenis-layanan">
            <JenisLayananPage />
          </PermissionRoute>
        } />
        <Route path="/komposisi-bahan" element={
          <PermissionRoute permission="view-komposisi-bahan">
            <KomposisiBahanPage />
          </PermissionRoute>
        } />

        {/* Modul 3 */}
        <Route path="/purchase-orders" element={
          <PermissionRoute permission="view-purchase-orders">
            <PurchaseOrdersPage />
          </PermissionRoute>
        } />
        <Route path="/receivings" element={
          <PermissionRoute permission="view-receivings">
            <ReceivingsPage />
          </PermissionRoute>
        } />
        <Route path="/distributions" element={
          <PermissionRoute permission="view-distributions">
            <DistributionsPage />
          </PermissionRoute>
        } />

        {/* Modul 4 */}
        <Route path="/stock" element={
          <PermissionRoute permission="view-stock">
            <StockPage />
          </PermissionRoute>
        } />
        <Route path="/stock-mutasi" element={
          <PermissionRoute permission="view-stock-mutasi">
            <StockMutasiPage />
          </PermissionRoute>
        } />
        <Route path="/minimum-stock" element={
          <PermissionRoute permission="manage-minimum-stock">
            <MinimumStockPage />
          </PermissionRoute>
        } />

        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
