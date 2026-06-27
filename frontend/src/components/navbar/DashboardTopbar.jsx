import { useState } from 'react'
import { Search, Bell, Menu, User, LogOut, Settings } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../common/Toast'

const DashboardTopbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch {
      toast.error('Failed to logout')
    }
  }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD'

  const roleName = user?.roles?.[0]?.name?.toUpperCase() || 'SUPER ADMIN'

  return (
    <header className="h-[60px] bg-white border-b border-[#eef1f6] flex items-center justify-between px-4 lg:px-5 sticky top-0 z-30">
      {/* Left */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded-lg text-[#64748b] hover:bg-[#f1f5f9]"
        >
          <Menu size={18} />
        </button>

        {/* Search */}
        <div className="relative hidden sm:block w-60 lg:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search analytics..."
            className="w-full h-9 pl-8 pr-3 text-[13px] bg-[#f8fafc] border border-[#eef1f6] rounded-lg
              placeholder:text-[#94a3b8] focus:outline-none focus:border-[#2f74de] focus:ring-1 focus:ring-[#2f74de]/20 transition-colors"
          />
        </div>
      </div>

      {/* Right */}
     

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-[#f8fafc] transition-colors"
          >
            <div className="hidden sm:block text-right mr-1">
              <p className="text-[12px] font-semibold text-[#0f172a] leading-tight">{user?.name || 'Alex Sterling'}</p>
              <p className="text-[10px] text-[#94a3b8] font-medium">{roleName}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#2f74de] flex items-center justify-center text-white text-[11px] font-bold">
              {initials}
            </div>
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-[#eef1f6] z-20 py-1">
                <div className="px-3 py-2.5 border-b border-[#f1f5f9]">
                  <p className="text-[12px] font-semibold text-[#0f172a]">{user?.name}</p>
                  <p className="text-[11px] text-[#94a3b8]">{user?.email}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#475569] hover:bg-[#f8fafc] transition-colors"
                >
                  <User size={13} /> My Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#475569] hover:bg-[#f8fafc] transition-colors"
                >
                  <Settings size={13} /> Settings
                </Link>
                <div className="border-t border-[#f1f5f9] mt-0.5 pt-0.5">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[#ef4444] hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={13} /> Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      
    </header>
  )
}

export default DashboardTopbar
