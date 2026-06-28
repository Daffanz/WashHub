import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Eye, CheckCircle, Truck } from 'lucide-react'
import distributionService from '../../services/distributionService'
import outletService from '../../services/outletService'
import bahanBakuService from '../../services/bahanBakuService'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/common/Toast'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import DataTable from '../../components/tables/DataTable'
import Pagination from '../../components/tables/Pagination'
import DistributionForm from './components/DistributionForm'

const distStatusConfig = {
  'dist.draft': { label: 'Draft', variant: 'neutral' },
  'dist.dikirim': { label: 'Sent', variant: 'info' },
  'dist.diterima': { label: 'Received', variant: 'success' },
  'dist.ditolak': { label: 'Rejected', variant: 'danger' },
  'dist.selesai': { label: 'Completed', variant: 'success', className: '!bg-[#ccfbf1] !text-[#0f766e]' },
}

const DistributionsPage = () => {
  const { hasPermission } = useAuth()
  const toast = useToast()

  const [distributions, setDistributions] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 10, total: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [outlets, setOutlets] = useState([])
  const [bahanBakus, setBahanBakus] = useState([])

  const [addModal, setAddModal] = useState(false)
  const [detailModal, setDetailModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  const canView = hasPermission('view-distributions')
  const canCreate = hasPermission('create-distributions')
  const canConfirm = hasPermission('confirm-distributions')

  const fetchDistributions = useCallback(async () => {
    try {
      setLoading(true)
      const res = await distributionService.getAll({ search, page, per_page: 10 })
      setDistributions(res.data?.items || [])
      setPagination(res.data?.pagination || {})
    } catch {
      toast.error('Failed to load distributions')
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => { fetchDistributions() }, [fetchDistributions])

  useEffect(() => {
    Promise.all([
      outletService.getAll({ per_page: 100 }).catch(() => ({ data: {} })),
      bahanBakuService.getAll({ per_page: 100, is_active: 1 }).catch(() => ({ data: {} })),
    ]).then(([o, b]) => {
      setOutlets(o.data?.items || [])
      setBahanBakus(b.data?.items || [])
    })
  }, [])

  const handleCreate = async (data) => {
    setFormLoading(true)
    try {
      await distributionService.create(data)
      toast.success('Distribution created successfully')
      setAddModal(false)
      fetchDistributions()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create distribution')
    } finally {
      setFormLoading(false)
    }
  }

  const handleViewDetail = async (dist) => {
    setDetailLoading(true)
    setDetailModal(true)
    try {
      const res = await distributionService.getById(dist.id)
      setSelected(res.data || res)
    } catch {
      toast.error('Failed to load distribution details')
      setDetailModal(false)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleConfirm = async (dist) => {
    try {
      await distributionService.confirm(dist.id)
      toast.success('Distribution confirmed successfully')
      if (detailModal) {
        setDetailModal(false)
        setSelected(null)
      }
      fetchDistributions()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to confirm distribution')
    }
  }

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#94a3b8]">You don't have permission to view distributions.</p>
      </div>
    )
  }

  const renderStatus = (row) => {
    const slug = row.status?.slug || row.status_slug
    const config = distStatusConfig[slug] || { label: row.status?.nama || 'Unknown', variant: 'neutral' }
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>
  }

  const columns = [
    {
      key: 'nomor_distribusi',
      label: 'Distribution #',
      render: (val, row) => (
        <button onClick={() => handleViewDetail(row)} className="flex items-center gap-2 font-medium text-[#2f74de] hover:underline">
          <Truck size={14} />
          {val || `DIST-${row.id}`}
        </button>
      ),
    },
    {
      key: 'asal_outlet',
      label: 'Source',
      render: (val) => <span className="text-[#475569]">{val?.nama || '—'}</span>,
    },
    {
      key: 'outlet',
      label: 'Target',
      render: (val) => <span className="text-[#475569]">{val?.nama || '—'}</span>,
    },
    {
      key: 'tanggal_distribusi',
      label: 'Date',
      render: (val) => <span className="text-[#475569]">{val ? new Date(val).toLocaleDateString('id-ID') : '—'}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, row) => renderStatus(row),
    },
    {
      key: 'id',
      label: 'Actions',
      render: (_, row) => {
        const slug = row.status?.slug || row.status_slug
        return (
          <div className="flex items-center gap-2">
            <button onClick={() => handleViewDetail(row)} className="p-1.5 rounded-lg text-[#6377a2] hover:bg-[#eef0f7] transition-colors" title="View Details">
              <Eye size={15} />
            </button>
            {canConfirm && slug === 'dist.dikirim' && (
              <button onClick={() => handleConfirm(row)} className="p-1.5 rounded-lg text-[#10b981] hover:bg-[#d1fae5] transition-colors" title="Confirm Receipt">
                <CheckCircle size={15} />
              </button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Distributions</h1>
          <p className="text-sm text-[#64748b] mt-1">Kelola distribusi bahan baku antar outlet.</p>
        </div>
        {canCreate && <Button icon={Plus} onClick={() => setAddModal(true)}>Create Distribution</Button>}
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_1px_8px_rgba(0,0,0,0.05)] mb-5 p-4">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input type="text" placeholder="Search distributions..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#f8fafc] border border-[#e2e8f0] rounded-lg placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2f74de]/30 focus:border-[#2f74de] transition-all" />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={distributions}
        loading={loading}
        emptyTitle="No distributions found"
        emptyDescription="Create your first distribution to get started."
        emptyAction={canCreate ? () => setAddModal(true) : undefined}
        emptyActionLabel="Create Distribution"
      />
      <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={pagination.per_page} onPageChange={setPage} />

      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Create Distribution" size="xl">
        <DistributionForm
          outlets={outlets}
          bahanBakus={bahanBakus}
          onSubmit={handleCreate}
          onCancel={() => setAddModal(false)}
          loading={formLoading}
        />
      </Modal>

      <Modal isOpen={detailModal} onClose={() => { setDetailModal(false); setSelected(null) }} title="Distribution Details" size="lg">
        {detailLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#2f74de] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : selected ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#94a3b8]">Distribution #</p>
                <p className="text-sm font-medium text-[#0f172a]">{selected.nomor_distribusi || `DIST-${selected.id}`}</p>
              </div>
              <div>
                <p className="text-xs text-[#94a3b8]">Status</p>
                {renderStatus(selected)}
              </div>
              <div>
                <p className="text-xs text-[#94a3b8]">Source Outlet</p>
                <p className="text-sm text-[#0f172a]">{selected.asal_outlet?.nama || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-[#94a3b8]">Target Outlet</p>
                <p className="text-sm text-[#0f172a]">{selected.outlet?.nama || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-[#94a3b8]">Date</p>
                <p className="text-sm text-[#0f172a]">{selected.tanggal_distribusi ? new Date(selected.tanggal_distribusi).toLocaleDateString('id-ID') : '—'}</p>
              </div>
            </div>
            {selected.catatan && (
              <div>
                <p className="text-xs text-[#94a3b8]">Notes</p>
                <p className="text-sm text-[#475569]">{selected.catatan}</p>
              </div>
            )}

            {selected.items?.length > 0 && (
              <div className="border border-[#e2e8f0] rounded-lg overflow-hidden mt-2">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-[#64748b] uppercase">Bahan Baku</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-[#64748b] uppercase">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.items.map((item, i) => (
                      <tr key={i} className="border-b border-[#f1f5f9] last:border-0">
                        <td className="px-4 py-2.5 text-sm text-[#0f172a]">{item.bahan_baku?.nama || `Item ${i + 1}`}</td>
                        <td className="px-4 py-2.5 text-sm font-medium text-[#0f172a] text-right">{item.kuantitas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {canConfirm && (selected.status?.slug || selected.status_slug) === 'dist.dikirim' && (
              <div className="flex justify-end pt-2 border-t border-[#e2e8f0]">
                <Button icon={CheckCircle} onClick={() => handleConfirm(selected)}>
                  Confirm Receipt
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </Modal>
    </div>
  )
}

export default DistributionsPage
