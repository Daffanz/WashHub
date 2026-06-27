const Input = ({
  label,
  error,
  hint,
  icon: Icon,
  rightElement,
  className = '',
  id,
  required,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#0f172a]">
          {label}
          {required && <span className="text-[#ef4444] ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
            <Icon size={16} />
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-[#0f172a]
            placeholder:text-[#94a3b8] transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-[#2f74de]/30 focus:border-[#2f74de]
            disabled:bg-[#f8fafc] disabled:cursor-not-allowed
            ${error ? 'border-[#ef4444] focus:ring-[#ef4444]/30 focus:border-[#ef4444]' : 'border-[#e2e8f0]'}
            ${Icon ? 'pl-9' : ''}
            ${rightElement ? 'pr-10' : ''}
          `}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-[#ef4444]">{error}</p>}
      {hint && !error && <p className="text-xs text-[#94a3b8]">{hint}</p>}
    </div>
  )
}

export default Input
