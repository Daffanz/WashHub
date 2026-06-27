import LoadingSpinner from '../common/LoadingSpinner'
import EmptyState from '../common/EmptyState'

const DataTable = ({
  columns,
  data,
  loading,
  emptyTitle,
  emptyDescription,
  emptyAction,
  emptyActionLabel,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3.5 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider whitespace-nowrap ${col.className || ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length}>
                  <LoadingSpinner />
                </td>
              </tr>
            ) : data?.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    action={emptyAction}
                    actionLabel={emptyActionLabel}
                  />
                </td>
              </tr>
            ) : (
              data?.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className="border-b border-[#f1f5f9] last:border-0 hover:bg-[#f8fafc] transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-5 py-4 text-sm text-[#0f172a] ${col.cellClassName || ''}`}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
