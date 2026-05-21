import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { formatCurrency, formatNumber } from '../../utils/helpers';
import { Users, Building2, DollarSign, ShoppingBag, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await dashboardService.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 animate-pulse">
              <div className="w-10 h-10 bg-white/5 rounded-xl mb-3" />
              <div className="h-4 bg-white/5 rounded w-20 mb-2" />
              <div className="h-7 bg-white/5 rounded w-28" />
            </div>
          ))}
        </div>
        <div className="glass-card rounded-2xl p-6 h-80 animate-pulse" />
      </div>
    );
  }

  const kpiCards = [
    { title: 'Total Users', value: stats?.kpi?.total_users || 0, icon: Users, color: 'from-primary-500 to-primary-600', change: '+12%', up: true },
    { title: 'Active Outlets', value: stats?.kpi?.active_outlets || 0, icon: Building2, color: 'from-accent-500 to-accent-600', change: '+3', up: true },
    { title: 'Monthly Revenue', value: formatCurrency(stats?.kpi?.monthly_revenue || 0), icon: DollarSign, color: 'from-emerald-500 to-emerald-600', change: '+8.5%', up: true },
    { title: 'Total Orders', value: formatNumber(stats?.kpi?.total_orders || 0), icon: ShoppingBag, color: 'from-amber-500 to-amber-600', change: '+24%', up: true },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-navy-800 border border-white/10 rounded-xl p-3 shadow-xl">
          <p className="text-xs text-surface-200 mb-1">{label}</p>
          {payload.map((entry, i) => (
            <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'revenue' ? formatCurrency(entry.value) : formatNumber(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <div key={card.title} className="glass-card rounded-2xl p-5 group">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} bg-opacity-20 flex items-center justify-center`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <span className={`inline-flex items-center gap-1 text-xs font-medium ${card.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {card.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {card.change}
              </span>
            </div>
            <p className="text-xs text-surface-200 mb-1">{card.title}</p>
            <p className="text-2xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-semibold">Revenue Overview</h3>
              <p className="text-xs text-surface-200">Monthly revenue trend</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-primary-400"><span className="w-2 h-2 rounded-full bg-primary-400" /> Revenue</span>
              <span className="flex items-center gap-1.5 text-accent-400"><span className="w-2 h-2 rounded-full bg-accent-400" /> Orders</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={stats?.revenue_chart || []}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `${v / 1000000}M`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#colorRevenue)" name="revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-primary-400" />
            <h3 className="text-white font-semibold">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {(stats?.recent_activities || []).map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-400 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white">{activity.action}</p>
                  <p className="text-xs text-surface-200">{activity.outlet} · {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Outlet Performance */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-semibold">Outlet Performance</h3>
            <p className="text-xs text-surface-200">Top performing franchise outlets</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-medium text-surface-200 pb-3 pr-4">Outlet</th>
                <th className="text-left text-xs font-medium text-surface-200 pb-3 pr-4">Orders</th>
                <th className="text-left text-xs font-medium text-surface-200 pb-3 pr-4">Revenue</th>
                <th className="text-left text-xs font-medium text-surface-200 pb-3">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(stats?.outlet_performance || []).map((outlet, i) => (
                <tr key={i} className="hover:bg-white/3 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-xs font-bold text-primary-400">
                        {i + 1}
                      </div>
                      <span className="text-sm text-white font-medium">{outlet.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-sm text-surface-200">{formatNumber(outlet.orders)}</td>
                  <td className="py-3 pr-4 text-sm text-emerald-400 font-medium">{formatCurrency(outlet.revenue)}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium">
                      ⭐ {outlet.rating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
