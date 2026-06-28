import { useState, useEffect, useCallback } from 'react'
import { Search, Package, AlertTriangle } from 'lucide-react'
import stockService from '../../services/stockService'
import outletService from '../../services/outletService'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/common/Toast'
import Badge from '../../components/common/Badge'
import DataTable from '../../components/tables/DataTable'
import Pagination from '../../components/tables/Pagination'

const StockPage = () => {
  const { hasPermission } = useAuth()
  const toast = useToast()

  const [outlets, setOutlets] = useState([])
  const [selectedOutlet, setSelectedOutlet] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const [stocks, setStocks] = useState([])
  const [lowStocks, setLowStocks] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 10, total: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const canView = hasPermission('view-stock')

  useEffect(() => {
    outletService.getAll({ per_page: 100 }).then((res) => {
      setOutlets(res.data?.items || [])
    }).catch(() => {})
  }, [])

  const fetchStocks = useCallback(async () => {
    if (!selectedOutlet) { setStocks([]); setLoading(false); return }
    try {
      setLoading(true)
      const res = await stockService.getAll({ outlet_id: selectedOutlet, search, page, per_page: 10 })
      setStocks(res.data?.items || [])
      setPagination(res.data?.pagination || {})
    } catch {
      toast.error('Failed to load stock data')
    } finally {
      setLoading(false)
    }
  }, [selectedOutlet, search, page])

  const fetchLowStocks = useCallback(async () => {
    if (!selectedOutlet) { setLowStocks([]); return }
    try {
      setLoading(true)
      const res = await stockService.getLowStock(selectedOutlet)
      setLowStocks(res.data?.items || [])
    } catch {
      toast.error('Failed to load low stock data')
    } finally {
      setLoading(false)
    }
  }, [selectedOutlet])

  useEffect(() => {
    if (activeTab === 'all') {
      fetchStocks()
    } else {
      fetchLowStocks()
    }
  }, [activeTab, fetchStocks, fetchLowStocks])

  useEffect(() => {
    setPage(1)
    setSearch('')
  }, [selectedOutlet, activeTab])

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#94a3b8]">You don't have permission to view stock.</p>
      </div>
    )
  }

  const stockColumns = [
    {
      key: 'bahan_baku',
      label: 'Bahan Baku',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#e8f0fd] flex items-center justify-center text-[#2f74de] text-xs font-semibold shrink-0">
            <Package size={16} />
          </div>
          <div>
            <p className="font-medium text-[#0f172a]">{val?.nama || '—'}</p>
            <p className="text-xs text-[#94a3b8]">{val?.kode || ''}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'kuantitas',
      label: 'Quantity',
      render: (val, row) => {
        const qty = val ?? row.quantity ?? 0
        return <span className="text-sm font-medium text-[#0f172a]">{qty}</span>
      },
    },
    {
      key: 'satuan',
      label: 'Unit',
      render: (val, row) => <span className="text-[#475569]">{val || row.bahan_baku?.satuan || '—'}</span>,
    },
    {
      key: 'is_low',
      label: 'Status',
      render: (val, row) => {
        const minStock = row.minimum_stock?.jumlah_minimum || row.minimum_stock || 0
        const qty = row.kuantitas ?? row.quantity ?? 0
        const isLow = val || (minStock > 0 && qty <= minStock)
        return isLow
          ? <Badge variant="danger">Low Stock</Badge>
          : <Badge variant="success">Normal</Badge>
      },
    },
  ]

  const lowStockColumns = [
    {
      key: 'bahan_baku',
      label: 'Bahan Baku',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#fee2e2] flex items-center justify-center text-[#ef4444] text-xs font-semibold shrink-0">
            <AlertTriangle size={16} />
          </div>
          <div>
            <p className="font-medium text-[#0f172a]">{val?.nama || '—'}</p>
            <p className="text-xs text-[#94a3b8]">{val?.kode || ''}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'kuantitas',
      label: 'Current Stock',
      render: (val, row) => <span className="text-sm font-medium text-[#ef4444]">{val ?? row.quantity ?? 0}</span>,
    },
    {
      key: 'minimum_stock',
      label: 'Minimum Stock',
      render: (val, row) => <span className="text-sm text-[#475569]">{val?.jumlah_minimum || val || row.minimum_quantity || '—'}</span>,
    },
    {
      key: 'satuan',
      label: 'Unit',
      render: (val, row) => <span className="text-[#475569]">{val || row.bahan_baku?.satuan || '—'}</span>,
    },
  ]

  const currentData = activeTab === 'all' ? stocks : lowStocks
  const currentColumns = activeTab === 'all' ? stockColumns : lowStockColumns

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Stock</h1>
          <p className="text-sm text-[#64748b] mt-1">Monitor stok bahan baku di setiap outlet.</p>
        </div>
      </div>

      {/* Outlet Filter */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_1px_8px_rgba(0,0,0,0.05)] mb-5 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#64748b]">Outlet</label>
            <select
              value={selectedOutlet}
              onChange={(e) => setSelectedOutlet(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#2f74de]/30 focus:border-[#2f74de] transition-all min-w-[200px]"
            >
              <option value="">Select outlet...</option>
              {outlets.filter((o) => o.is_active).map((o) => (
                <option key={o.id} value={o.id}>{o.nama}</option>
              ))}
            </select>
          </div>
          {activeTab === 'all' && selectedOutlet && (
            <div className="relative flex-1 min-w-[200px] self-end">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
              <input type="text" placeholder="Search stock..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="w-full pl-9 pr-4 py-2 text-sm bg-[#f8fafc] border border-[#e2e8f0] rounded-lg placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2f74de]/30 focus:border-[#2f74de] transition-all" />
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      {selectedOutlet && (
        <div className="flex gap-1 mb-5">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'all'
                ? 'bg-[#2f74de] text-white'
                : 'text-[#475569] hover:bg-[#f1f5f9] bg-white border border-[#e2e8f0]'
            }`}
          >
            All Stock
          </button>
          <button
            onClick={() => setActiveTab('low')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'low'
                ? 'bg-[#ef4444] text-white'
                : 'text-[#475569] hover:bg-[#f1f5f9] bg-white border border-[#e2e8f0]'
            }`}
          >
            <AlertTriangle size={14} />
            Low Stock
          </button>
        </div>
      )}

      {!selectedOutlet ? (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_1px_8px_rgba(0,0,0,0.05)] flex items-center justify-center py-16">
          <div className="text-center">
            <Package size={40} className="mx-auto text-[#cbd5e1] mb-3" />
            <p className="text-sm text-[#94a3b8]">Select an outlet to view stock data.</p>
          </div>
        </div>
      ) : (
        <div>
          <DataTable
            columns={currentColumns}
            data={currentData}
            loading={loading}
            emptyTitle={activeTab === 'all' ? 'No stock data found' : 'No low stock items'}
            emptyDescription={activeTab === 'all' ? 'Stock data will appear here once available.' : 'All items are above minimum stock levels.'}
          />
          {activeTab === 'all' && (
            <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={pagination.per_page} onPageChange={setPage} />
          )}
        </div>
      )}
    </div>
  )
}

export default StockPage
