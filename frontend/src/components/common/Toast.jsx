import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
}

const styles = {
  success: 'border-l-4 border-[#10b981] bg-white',
  error: 'border-l-4 border-[#ef4444] bg-white',
  warning: 'border-l-4 border-[#f59e0b] bg-white',
  info: 'border-l-4 border-[#3b82f6] bg-white',
}

const iconColors = {
  success: 'text-[#10b981]',
  error: 'text-[#ef4444]',
  warning: 'text-[#f59e0b]',
  info: 'text-[#3b82f6]',
}

let toastId = 0

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    warning: (msg) => addToast(msg, 'warning'),
    info: (msg) => addToast(msg, 'info'),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80">
        {toasts.map((t) => {
          const Icon = icons[t.type]
          return (
            <div
              key={t.id}
              className={`
                flex items-start gap-3 p-4 rounded-xl shadow-lg
                ${styles[t.type]}
              `}
            >
              <Icon size={18} className={`mt-0.5 shrink-0 ${iconColors[t.type]}`} />
              <p className="text-sm text-[#0f172a] flex-1">{t.message}</p>
              <button
                onClick={() => removeToast(t.id)}
                className="text-[#94a3b8] hover:text-[#475569] transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
