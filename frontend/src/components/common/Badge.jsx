const variants = {
  success: 'bg-[#d1fae5] text-[#065f46]',
  warning: 'bg-[#fef3c7] text-[#92400e]',
  danger: 'bg-[#fee2e2] text-[#991b1b]',
  info: 'bg-[#dbeafe] text-[#1e40af]',
  primary: 'bg-[#e8f0fd] text-[#1d4ed8]',
  secondary: 'bg-[#eef0f7] text-[#4f6390]',
  neutral: 'bg-[#f1f5f9] text-[#475569]',
}

const Badge = ({ children, variant = 'neutral', className = '' }) => {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}

export default Badge
