import { useState, useEffect } from 'react'
import { Users, ShieldCheck, Zap, Plus } from 'lucide-react'
import dashboardService from '../../services/dashboardService'
import { useAuth } from '../../context/AuthContext'
import StatCard from '../../components/cards/StatCard'

const DashboardPage = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await dashboardService.getStats()
        setStats(response.data)
      } catch {
        setError('Failed to load dashboard statistics.')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const firstName = user?.name?.split(' ')[0] || 'Alex'

  const statCards = stats
    ? [
        {
          title: 'Active Users',
          value: stats.kpi?.total_users?.toLocaleString() ?? '24,512',
          change: '8.2%',
          changeType: 'up',
          icon: Users,
          iconColor: '#C46300',
          iconBg: '#fef3e2',
          sparklineType: 'wave',
          sparklineColor: '#C46300',
        },
        {
          title: 'Total Permission',
          value: String(stats.user_stats?.total_permissions ?? '10'),
          change: '1.1%',
          changeType: 'neutral',
          icon: ShieldCheck,
          iconColor: '#6377a2',
          iconBg: '#eef0f7',
          sparklineType: 'flat',
          sparklineColor: '#6377a2',
        },
        {
          title: 'Total Role',
          value: String(stats.user_stats?.total_roles ?? '3'),
          change: '99.9%',
          changeType: 'up',
          icon: Zap,
          iconColor: '#ef4444',
          iconBg: '#fee2e2',
          sparklineType: 'dotted',
          sparklineColor: '#ef4444',
        },
      ]
    : []

  // Skeleton
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl border border-[#eef1f6] p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg skeleton" />
        <div className="w-12 h-4 rounded skeleton" />
      </div>
      <div className="w-16 h-2.5 rounded skeleton mb-1.5" />
      <div className="w-20 h-6 rounded skeleton mb-3" />
      <div className="w-full h-7 rounded skeleton" />
    </div>
  )

  return (
    <div className="relative">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#0f172a]">System Overview</h1>
        <p className="text-[13px] text-[#64748b] mt-0.5">
          Selamat Datang, {firstName}. 
        </p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] px-4 py-3 rounded-xl">
          {error}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>
      )}

      {/* FAB button (matching reference) */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-[#2f74de] hover:bg-[#2563b0] text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-20">
        <Plus size={20} />
      </button>
    </div>
  )
}

export default DashboardPage
