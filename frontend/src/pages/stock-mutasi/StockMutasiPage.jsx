import { useState, useEffect, useCallback } from 'react'
import { Search, ArrowDownLeft, ArrowUpRight, Filter } from 'lucide-react'
import stockService from '../../services/stockService'
import outletService from '../../services/outletService'
import bahanBakuService from '../../services/bahanBakuService'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/common/Toast'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import DataTable from '../../components/tables/DataTable'
import Pagination from '../../components/tables/Pagination'

const StockMutasiPage = () => {
  const { hasPermission } = useAuth()
  const toast = useToast()

  const [mutations, setMutations] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 10, total: 0 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const [outlets, setOutlets] = useState([])
  const [bahanBakus, setBahanBakus] = useState([])

  const [filters, setFilters] = useState({
    outlet_id: '',
    bahan_baku_id: '',
    tipe: '',
    date_from: '',
    date_to: '',
  })

  const canView = hasPermission('view-stock')

  useEffect(() => {
    Promise.all([
      outletService.getAll({ per_page: 100 }).catch(() => ({ data: {} })),
      bahanBakuService.getAll({ per_page: 100 }).catch(() => ({ data: {} })),
    ]).then(([o, b]) => {
      setOutlets(o.data?.items || [])
      setBahanBakus(b.data?.items || [])
    })
  }, [])

  const fetchMutations = useCallback(async () => {
    try {
      setLoading(true)
      const params = { page, per_page: 10 }
      if (filters.outlet_id) params.outlet_id = filters.outlet_id
      if (filters.bahan_baku_id) params.bahan_baku_id = filters.bahan_baku_id
      if (filters.tipe) params.tipe = filters.tipe
      if (filters.date_from) params.date_from = filters.date_from
      if (filters.date_to) params.date_to = filters.date_to

      const res = await stockService.getMutasi(params)
      setMutations(res.data?.items || [])
      setPagination(res.data?.pagination || {})
    } catch {
      toast.error('Failed to load stock mutations')
    } finally {
      setLoading(false)
    }
  }, [page, filters])

  useEffect(() => { fetchMutations() }, [fetchMutations])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({ outlet_id: '', bahan_baku_id: '', tipe: '', date_from: '', date_to: '' })
    setPage(1)
  }

  const hasActiveFilters = Object.values(filters).some((v) => v)

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#94a3b8]">You don't have permission to view stock mutations.</p>
      </div>
    )
  }

  const selectClass = 'px-3 py-2 text-sm rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#2f74de]/30 focus:border-[#2f74de] transition-all'

  const columns = [
    {
      key: 'tanggal',
      label: 'Date',
      render: (val, row) => (
        <span className="text-[#475569]">
          {(val || row.created_at) ? new Date(val || row.created_at).toLocaleDateString('id-ID') : '—'}
        </span>
      ),
    },
    {
      key: 'bahan_baku',
      label: 'Bahan Baku',
      render: (val, row) => (
        <div>
          <p className="font-medium text-[#0f172a]">{val?.nama || '—'}</p>
          <p className="text-xs text-[#94a3b8]">{val?.kode || ''}</p>
        </div>
      ),
    },
    {
      key: 'outlet',
      label: 'Outlet',
      render: (val) => <span className="text-[#475569]">{val?.nama || '—'}</span>,
    },
    {
      key: 'tipe',
      label: 'Type',
      render: (val, row) => {
        const type = val || row.type || ''
        const isIn = type === 'in' || type === 'masuk'
        return (
          <div className="flex items-center gap-1.5">
            {isIn ? (
              <ArrowDownLeft size={14} className="text-[#10b981]" />
            ) : (
              <ArrowUpRight size={14} className="text-[#ef4444]" />
            )}
            <Badge variant={isIn ? 'success' : 'danger'}>
              {isIn ? 'In' : 'Out'}
            </Badge>
          </div>
        )
      },
    },
    {
      key: 'kuantitas',
      label: 'Quantity',
      render: (val, row) => {
        const qty = val ?? row.quantity ?? 0
        const type = row.tipe || row.type || ''
        const isIn = type === 'in' || type === 'masuk'
        return (
          <span className={`text-sm font-medium ${isIn ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
            {isIn ? '+' : '-'}{Math.abs(qty)}
          </span>
        )
      },
    },
    {
      key: 'keterangan',
      label: 'Description',
      render: (val) => <span className="text-[#475569]">{val || '—'}</span>,
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Stock Mutasi</h1>
          <p className="text-sm text-[#64748b] mt-1">Riwayat pergerakan stok bahan baku.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_1px_8px_rgba(0,0,0,0.05)] mb-5 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-[#64748b]" />
          <span className="text-sm font-medium text-[#0f172a]">Filters</span>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="ml-auto text-xs text-[#2f74de] hover:underline">
              Clear all
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <select name="outlet_id" value={filters.outlet_id} onChange={handleFilterChange} className={selectClass + ' min-w-[160px]'}>
            <option value="">All Outlets</option>
            {outlets.map((o) => <option key={o.id} value={o.id}>{o.nama}</option>)}
          </select>
          <select name="bahan_baku_id" value={filters.bahan_baku_id} onChange={handleFilterChange} className={selectClass + ' min-w-[160px]'}>
            <option value="">All Bahan Baku</option>
            {bahanBakus.map((b) => <option key={b.id} value={b.id}>{b.nama}</option>)}
          </select>
          <select name="tipe" value={filters.tipe} onChange={handleFilterChange} className={selectClass + ' min-w-[120px]'}>
            <option value="">All Types</option>
            <option value="in">In (Masuk)</option>
            <option value="out">Out (Keluar)</option>
          </select>
          <input type="date" name="date_from" value={filters.date_from} onChange={handleFilterChange} className={selectClass} placeholder="From" />
          <input type="date" name="date_to" value={filters.date_to} onChange={handleFilterChange} className={selectClass} placeholder="To" />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={mutations}
        loading={loading}
        emptyTitle="No mutations found"
        emptyDescription="Stock mutation history will appear here."
      />
      <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={pagination.per_page} onPageChange={setPage} />
    </div>
  )
}

export default StockMutasiPage
