const FeatureCard = ({ icon: Icon, title, description, color = '#2f74de', bg = '#e8f0fd' }) => {
  return (
    <div className="group bg-white rounded-2xl p-6 border border-[#f1f5f9] shadow-[0_1px_8px_rgba(0,0,0,0.05)]
      hover:shadow-[0_8px_24px_rgba(47,116,222,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-default">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: bg }}
      >
        <Icon size={22} style={{ color }} />
      </div>
      <h3 className="text-base font-semibold text-[#0f172a] mb-2">{title}</h3>
      <p className="text-sm text-[#64748b] leading-relaxed">{description}</p>
    </div>
  )
}

export default FeatureCard
