import { ChevronLeft, ChevronRight } from 'lucide-react'

const Pagination = ({ currentPage, lastPage, onPageChange, total, perPage }) => {
  if (lastPage <= 1) return null

  const from = (currentPage - 1) * perPage + 1
  const to = Math.min(currentPage * perPage, total)

  const pages = []
  const delta = 2
  for (let i = Math.max(1, currentPage - delta); i <= Math.min(lastPage, currentPage + delta); i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#e2e8f0]">
      <p className="text-xs text-[#94a3b8]">
        Showing <span className="font-medium text-[#475569]">{from}–{to}</span> of{' '}
        <span className="font-medium text-[#475569]">{total}</span> results
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg text-[#475569] hover:bg-[#f1f5f9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        {pages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="w-8 h-8 rounded-lg text-xs font-medium text-[#475569] hover:bg-[#f1f5f9] transition-colors"
            >
              1
            </button>
            {pages[0] > 2 && <span className="text-[#94a3b8] text-xs px-1">…</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors
              ${page === currentPage
                ? 'bg-[#2f74de] text-white'
                : 'text-[#475569] hover:bg-[#f1f5f9]'
              }`}
          >
            {page}
          </button>
        ))}

        {pages[pages.length - 1] < lastPage && (
          <>
            {pages[pages.length - 1] < lastPage - 1 && (
              <span className="text-[#94a3b8] text-xs px-1">…</span>
            )}
            <button
              onClick={() => onPageChange(lastPage)}
              className="w-8 h-8 rounded-lg text-xs font-medium text-[#475569] hover:bg-[#f1f5f9] transition-colors"
            >
              {lastPage}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          className="p-1.5 rounded-lg text-[#475569] hover:bg-[#f1f5f9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

export default Pagination
