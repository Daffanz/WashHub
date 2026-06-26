import { Inbox } from 'lucide-react'
import Button from './Button'

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No data found',
  description = 'There is nothing to display here yet.',
  action,
  actionLabel,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#f1f5f9] flex items-center justify-center mb-4">
        <Icon size={28} className="text-[#94a3b8]" />
      </div>
      <h3 className="text-base font-semibold text-[#0f172a] mb-1">{title}</h3>
      <p className="text-sm text-[#94a3b8] max-w-xs mb-5">{description}</p>
      {action && actionLabel && (
        <Button onClick={action} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
