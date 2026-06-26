import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  KeyRound,
  Settings,
  LogOut,
  Waves,
  X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../common/Toast'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Users', icon: Users, path: '/users' },
  { label: 'Role', icon: ShieldCheck, path: '/roles' },
  { label: 'Permission', icon: KeyRound, path: '/permissions' },
]

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const toast = useToast()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch {
      toast.error('Failed to logout')
    }
  }

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-[200px] bg-white   border-r border-[#eef1f6] z-50
          flex flex-col transition-transform duration-300
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-[60px]">
          <Link to="/dashboard" className="flex flex-col">
            <span className="text-[15px] font-bold text-[#0f172a] leading-tight">WashHub</span>
            <span className="text-[10px] text-[#94a3b8]">Enterprise Admin</span>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1 text-[#94a3b8] hover:text-[#475569]">
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pt-4">
          <ul className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium
                      transition-colors duration-150
                      ${active
                        ? 'bg-[#eef3fc] text-[#2f74de]'
                        : 'text-[#64748b] hover:bg-[#f8fafc] hover:text-[#1e293b]'
                      }
                    `}
                  >
                    {active && <div className="absolute left-0 w-[3px] h-5 bg-[#2f74de] rounded-r-full" />}
                    <Icon size={16} className={active ? 'text-[#2f74de]' : 'text-[#94a3b8]'} />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 flex flex-col gap-0.5">
          <Link
            to="/settings"
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors
              ${isActive('/settings') ? 'bg-[#eef3fc] text-[#2f74de]' : 'text-[#64748b] hover:bg-[#f8fafc] hover:text-[#1e293b]'}`}
          >
            <Settings size={16} className="text-[#94a3b8]" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium
              text-[#ef4444] hover:bg-red-50 transition-colors w-full text-left"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
