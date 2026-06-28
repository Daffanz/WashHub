import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  KeyRound,
  Settings,
  LogOut,
  Warehouse,
  Truck,
  Tag,
  Package,
  Cpu,
  Activity,
  Ruler,
  ShoppingCart,
  Inbox,
  ArrowLeftRight,
  FileSpreadsheet,
  AlertTriangle,
  X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../common/Toast'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, hasPermission } = useAuth()
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

  const sections = [
    {
      title: 'Main',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', permission: 'view-dashboard' },
      ]
    },
    {
      title: 'System',
      items: [
        { label: 'Users', icon: Users, path: '/users', permission: 'view-users' },
        { label: 'Role', icon: ShieldCheck, path: '/roles', permission: 'view-roles' },
        { label: 'Permission', icon: KeyRound, path: '/permissions', permission: 'view-roles' },
      ]
    },
    {
      title: 'Master Data',
      items: [
        { label: 'Outlets', icon: Warehouse, path: '/outlets', permission: 'view-outlets' },
        { label: 'Suppliers', icon: Truck, path: '/suppliers', permission: 'view-suppliers' },
        { label: 'Kategori Bahan', icon: Tag, path: '/kategori-bahan', permission: 'view-kategori-bahan' },
        { label: 'Bahan Baku', icon: Package, path: '/bahan-baku', permission: 'view-bahan-baku' },
        { label: 'Mesin', icon: Cpu, path: '/mesin', permission: 'view-mesin' },
        { label: 'Jenis Layanan', icon: Activity, path: '/jenis-layanan', permission: 'view-jenis-layanan' },
        { label: 'Komposisi Bahan', icon: Ruler, path: '/komposisi-bahan', permission: 'view-komposisi-bahan' },
      ]
    },
    {
      title: 'Transactions',
      items: [
        { label: 'Purchase Order', icon: ShoppingCart, path: '/purchase-orders', permission: 'view-purchase-orders' },
        { label: 'Receiving', icon: Inbox, path: '/receivings', permission: 'view-receivings' },
        { label: 'Distribution', icon: ArrowLeftRight, path: '/distributions', permission: 'view-distributions' },
      ]
    },
    {
      title: 'Inventory',
      items: [
        { label: 'Stock', icon: Warehouse, path: '/stock', permission: 'view-stock' },
        { label: 'Stock Mutasi', icon: FileSpreadsheet, path: '/stock-mutasi', permission: 'view-stock-mutasi' },
        { label: 'Minimum Stock', icon: AlertTriangle, path: '/minimum-stock', permission: 'manage-minimum-stock' },
      ]
    }
  ]

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-[220px] bg-white border-r border-[#eef1f6] z-50
          flex flex-col transition-transform duration-300
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-[60px] border-b border-[#f1f5f9] shrink-0">
          <Link to="/dashboard" className="flex flex-col">
            <span className="text-[15px] font-bold text-[#0f172a] leading-tight">WashHub</span>
            <span className="text-[10px] text-[#94a3b8]">Enterprise Admin</span>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1 text-[#94a3b8] hover:text-[#475569]">
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {sections.map((section, sIdx) => {
            const visibleItems = section.items.filter(item => !item.permission || hasPermission(item.permission))
            if (visibleItems.length === 0) return null

            return (
              <div key={sIdx} className="mb-4">
                <span className="px-3 text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider block mb-1.5">
                  {section.title}
                </span>
                <ul className="flex flex-col gap-0.5">
                  {visibleItems.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.path)
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          onClick={onClose}
                          className={`
                            flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium
                            transition-all duration-150 relative
                            ${active
                              ? 'bg-[#eef3fc] text-[#2f74de]'
                              : 'text-[#64748b] hover:bg-[#f8fafc] hover:text-[#1e293b]'
                            }
                          `}
                        >
                          {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#2f74de] rounded-r-full" />}
                          <Icon size={16} className={active ? 'text-[#2f74de]' : 'text-[#94a3b8]'} />
                          {item.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 border-t border-[#f1f5f9] pt-3 shrink-0 flex flex-col gap-0.5">
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
              text-[#ef4444] hover:bg-red-50 transition-colors w-full text-left cursor-pointer"
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
