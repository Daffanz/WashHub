export const API_URL = '/api';

export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  FRANCHISE_MANAGER: 'Franchise Manager',
  OUTLET_STAFF: 'Outlet Staff',
};

export const ROLE_COLORS = {
  'Super Admin': { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  'Franchise Manager': { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
  'Outlet Staff': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
};

export const NAV_LINKS = [
  { name: 'Home', href: '#home' },
  { name: 'Features', href: '#features' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

export const ADMIN_MENU = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: 'LayoutDashboard', permission: 'view-dashboard' },
  { name: 'Users', path: '/admin/users', icon: 'Users', permission: 'view-users' },
  { name: 'Roles', path: '/admin/roles', icon: 'Shield', permission: 'view-roles' },
  { name: 'Settings', path: '/admin/settings', icon: 'Settings', permission: null },
];
