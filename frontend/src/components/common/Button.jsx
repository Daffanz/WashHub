import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-[#2f74de] hover:bg-[#2563b0] text-white',
  secondary: 'bg-[#6377a2] hover:bg-[#4f6390] text-white',
  outline: 'border border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc] bg-white',
  ghost: 'text-[#475569] hover:bg-[#f8fafc] bg-transparent',
  danger: 'bg-[#ef4444] hover:bg-[#dc2626] text-white',
}

const sizes = {
  sm: 'h-7 px-3 text-[11px]',
  md: 'h-8 px-4 text-[12px]',
  lg: 'h-9 px-5 text-[13px]',
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-1.5 font-semibold rounded-lg
        transition-colors duration-150 select-none whitespace-nowrap
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2 size={13} className="animate-spin" />
      ) : (
        Icon && iconPosition === 'left' && <Icon size={13} />
      )}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon size={13} />}
    </button>
  )
}

export default Button
