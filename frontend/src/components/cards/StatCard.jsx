import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const Sparkline = ({ color = '#2f74de', type = 'wave' }) => {
  if (type === 'dotted') {
    return (
      <svg width="100%" height="28" viewBox="0 0 120 28" fill="none" preserveAspectRatio="none">
        {Array.from({ length: 14 }).map((_, i) => (
          <circle key={i} cx={i * 9 + 3} cy="14" r="1.5" fill={color} opacity={0.5} />
        ))}
      </svg>
    )
  }

  const paths = {
    wave: 'M0,18 C15,8 30,26 50,16 C70,6 85,22 100,14 C110,10 115,12 120,10',
    flat: 'M0,16 C20,14 40,18 60,16 C80,14 100,18 120,16',
  }

  return (
    <svg width="100%" height="28" viewBox="0 0 120 28" fill="none" preserveAspectRatio="none">
      <path d={paths[type]} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

const StatCard = ({
  title,
  value,
  change,
  changeType = 'up',
  icon: Icon,
  iconColor = '#2f74de',
  iconBg = '#e8f0fd',
  sparklineType = 'wave',
  sparklineColor,
}) => {
  const changeIcons = { up: TrendingUp, down: TrendingDown, neutral: Minus }
  const changeColors = { up: '#10b981', down: '#ef4444', neutral: '#64748b' }
  const ChangeIcon = changeIcons[changeType]

  return (
    <div className="bg-white rounded-xl border border-[#eef1f6] p-4 hover:shadow-sm transition-shadow">
      {/* Top row: icon + change */}
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
          {Icon && <Icon size={17} style={{ color: iconColor }} />}
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1" style={{ color: changeColors[changeType] }}>
            <ChangeIcon size={12} />
            <span className="text-[11px] font-semibold">{change}</span>
          </div>
        )}
      </div>

      {/* Label */}
      <p className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-0.5">{title}</p>

      {/* Value */}
      <p className="text-[22px] font-bold text-[#0f172a] leading-tight mb-3">{value}</p>

      {/* Sparkline */}
      <Sparkline color={sparklineColor || iconColor} type={sparklineType} />
    </div>
  )
}

export default StatCard
