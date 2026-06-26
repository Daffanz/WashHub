import { Settings, Bell, Globe, Shield } from 'lucide-react'

const SettingsPage = () => {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">Settings</h1>
        <p className="text-sm text-[#64748b] mt-1">Manage your application preferences</p>
      </div>

      <div className="flex flex-col gap-4">
        {[
          { icon: Bell, title: 'Notifications', desc: 'Configure email and push notification preferences' },
          { icon: Globe, title: 'Language & Region', desc: 'Set your preferred language and timezone' },
          { icon: Shield, title: 'Security', desc: 'Two-factor authentication and session management' },
          { icon: Settings, title: 'General', desc: 'Application-wide settings and configurations' },
        ].map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.title}
              className="bg-white rounded-2xl border border-[#e2e8f0] p-5 flex items-center gap-4
                hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-shadow cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#e8f0fd] flex items-center justify-center shrink-0">
                <Icon size={18} className="text-[#2f74de]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#0f172a]">{item.title}</p>
                <p className="text-xs text-[#94a3b8] mt-0.5">{item.desc}</p>
              </div>
              <div className="text-[#94a3b8]">›</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SettingsPage
