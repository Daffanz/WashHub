import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getInitials } from '../utils/helpers';
import {
  LayoutDashboard, Users, Shield, Settings, LogOut, Menu, X,
  ChevronDown, Droplets, Bell,
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Roles', path: '/admin/roles', icon: Shield },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const roleName = user?.roles?.[0]?.name || 'User';

  return (
    <div className="min-h-screen bg-navy-900 flex">
      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-navy-950 border-r border-white/5 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Logo */}
        <div className="h-16 lg:h-20 flex items-center gap-3 px-6 border-b border-white/5">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white">WashHub</span>
            <p className="text-[10px] text-surface-200 -mt-0.5">Admin Panel</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-surface-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1">
          <p className="text-[10px] font-semibold text-surface-700 uppercase tracking-wider px-3 mb-3">Menu</p>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500/15 text-primary-400 shadow-sm shadow-primary-500/10'
                    : 'text-surface-200 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
              {getInitials(user?.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-surface-200 truncate">{roleName}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 lg:h-20 bg-navy-900/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-surface-200 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-white">Welcome back 👋</h1>
              <p className="text-xs text-surface-200">Here's what's happening today</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-surface-200 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center">3</span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                  {getInitials(user?.name)}
                </div>
                <span className="hidden sm:block text-sm text-surface-200">{user?.name}</span>
                <ChevronDown className="w-4 h-4 text-surface-200" />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-navy-800 rounded-xl border border-white/10 shadow-xl shadow-black/30 py-2 z-50 animate-fade-in">
                    <NavLink to="/admin/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-surface-200 hover:text-white hover:bg-white/5 transition-colors">
                      <Settings className="w-4 h-4" /> Profile Settings
                    </NavLink>
                    <hr className="border-white/5 my-1" />
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 w-full transition-colors">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
