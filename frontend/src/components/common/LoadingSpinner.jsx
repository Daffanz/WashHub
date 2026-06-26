import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ size = 'md', text = 'Loading...', fullPage = false }) => {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 36,
  }

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={sizes[size]} className="animate-spin text-[#2f74de]" />
          {text && <p className="text-sm text-[#475569] font-medium">{text}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <Loader2 size={sizes[size]} className="animate-spin text-[#2f74de]" />
      {text && <p className="text-sm text-[#475569]">{text}</p>}
    </div>
  )
}

export default LoadingSpinner
