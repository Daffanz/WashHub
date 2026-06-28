import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Send, Check, X as XIcon, Trash2, Eye, FileText } from 'lucide-react'
import purchaseOrderService from '../../services/purchaseOrderService'
import supplierService from '../../services/supplierService'
import outletService from '../../services/outletService'
import bahanBakuService from '../../services/bahanBakuService'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/common/Toast'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import DataTable from '../../components/tables/DataTable'
import Pagination from '../../components/tables/Pagination'
import PurchaseOrderForm from './components/PurchaseOrderForm'

const statusConfig = {
  'po.draft': { label: 'Draft', variant: 'neutral' },
  'po.dikirim': { label: 'Sent', variant: 'info' },
  'po.diterima': { label: 'Approved', variant: 'success' },
  'po.ditolak': { label: 'Rejected', variant: 'danger' },
  'po.selesai': { label: 'Completed', variant: 'success', className: '!bg-[#ccfbf1] !text-[#0f766e]' },
}

const PurchaseOrdersPage = () => {
  const { hasPermission } = useAuth()
  const toast = useToast()

  const [orders, setOrders] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 10, total: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [suppliers, setSuppliers] = useState([])
  const [outlets, setOutlets] = useState([])
  const [bahanBakus, setBahanBakus] = useState([])

  const [addModal, setAddModal] = useState(false)
  const [detailModal, setDetailModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  const canView = hasPermission('view-purchase-orders')
  const canCreate = hasPermission('create-purchase-orders')
  const canSend = hasPermission('send-purchase-orders')
  const canApprove = hasPermission('approve-purchase-orders')
  const canReject = hasPermission('reject-purchase-orders')
  const canDelete = hasPermission('delete-purchase-orders')

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const res = await purchaseOrderService.getAll({ search, page, per_page: 10 })
      setOrders(res.data?.items || [])
      setPagination(res.data?.pagination || {})
    } catch {
      toast.error('Failed to load purchase orders')
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  useEffect(() => {
    Promise.all([
      supplierService.getAll({ per_page: 100 }).catch(() => ({ data: {} })),
      outletService.getAll({ per_page: 100 }).catch(() => ({ data: {} })),
      bahanBakuService.getAll({ per_page: 100, is_active: 1 }).catch(() => ({ data: {} })),
    ]).then(([s, o, b]) => {
      setSuppliers(s.data?.items || [])
      setOutlets(o.data?.items || [])
      setBahanBakus(b.data?.items || [])
    })
  }, [])

  const handleCreate = async (data) => {
    setFormLoading(true)
    try {
      await purchaseOrderService.create(data)
      toast.success('Purchase order created successfully')
      setAddModal(false)
      fetchOrders()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create purchase order')
    } finally {
      setFormLoading(false)
    }
  }

  const handleViewDetail = async (order) => {
    setDetailLoading(true)
    setDetailModal(true)
    try {
      const res = await purchaseOrderService.getById(order.id)
      setSelected(res.data || res)
    } catch {
      toast.error('Failed to load purchase order details')
      setDetailModal(false)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleSend = async (order) => {
    try {
      await purchaseOrderService.send(order.id)
      toast.success('Purchase order sent successfully')
      fetchOrders()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send purchase order')
    }
  }

  const handleApprove = async (order) => {
    try {
      await purchaseOrderService.approve(order.id)
      toast.success('Purchase order approved')
      fetchOrders()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve purchase order')
    }
  }

  const handleReject = async (order) => {
    try {
      await purchaseOrderService.reject(order.id)
      toast.success('Purchase order rejected')
      fetchOrders()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject purchase order')
    }
  }

  const handleDelete = async () => {
    setFormLoading(true)
    try {
      await purchaseOrderService.delete(selected.id)
      toast.success('Purchase order deleted')
      setDeleteModal(false)
      setSelected(null)
      fetchOrders()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete purchase order')
    } finally {
      setFormLoading(false)
    }
  }

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#94a3b8]">You don't have permission to view purchase orders.</p>
      </div>
    )
  }

  const renderStatus = (row) => {
    const slug = row.status?.slug || row.status_slug
    const config = statusConfig[slug] || { label: row.status?.nama || 'Unknown', variant: 'neutral' }
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>
  }

  const columns = [
    {
      key: 'nomor_po',
      label: 'PO Number',
      render: (val, row) => (
        <button onClick={() => handleViewDetail(row)} className="flex items-center gap-2 font-medium text-[#2f74de] hover:underline">
          <FileText size={14} />
          {val || `PO-${row.id}`}
        </button>
      ),
    },
    {
      key: 'supplier',
      label: 'Supplier',
      render: (val) => <span className="text-[#475569]">{val?.nama || '—'}</span>,
    },
    {
      key: 'outlet',
      label: 'Outlet',
      render: (val) => <span className="text-[#475569]">{val?.nama || '—'}</span>,
    },
    {
      key: 'tanggal_pesan',
      label: 'Order Date',
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
            {canSend && slug === 'po.draft' && (
              <button onClick={() => handleSend(row)} className="p-1.5 rounded-lg text-[#2f74de] hover:bg-[#e8f0fd] transition-colors" title="Send">
                <Send size={15} />
              </button>
            )}
            {canApprove && slug === 'po.dikirim' && (
              <button onClick={() => handleApprove(row)} className="p-1.5 rounded-lg text-[#10b981] hover:bg-[#d1fae5] transition-colors" title="Approve">
                <Check size={15} />
              </button>
            )}
            {canReject && slug === 'po.dikirim' && (
              <button onClick={() => handleReject(row)} className="p-1.5 rounded-lg text-[#f59e0b] hover:bg-[#fef3c7] transition-colors" title="Reject">
                <XIcon size={15} />
              </button>
            )}
            {canDelete && slug === 'po.draft' && (
              <button onClick={() => { setSelected(row); setDeleteModal(true) }} className="p-1.5 rounded-lg text-[#ef4444] hover:bg-[#fee2e2] transition-colors" title="Delete">
                <Trash2 size={15} />
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
          <h1 className="text-2xl font-bold text-[#0f172a]">Purchase Orders</h1>
          <p className="text-sm text-[#64748b] mt-1">Kelola pesanan pembelian bahan baku.</p>
        </div>
        {canCreate && <Button icon={Plus} onClick={() => setAddModal(true)}>Create PO</Button>}
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_1px_8px_rgba(0,0,0,0.05)] mb-5 p-4">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input type="text" placeholder="Search purchase orders..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#f8fafc] border border-[#e2e8f0] rounded-lg placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2f74de]/30 focus:border-[#2f74de] transition-all" />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        emptyTitle="No purchase orders found"
        emptyDescription="Create your first purchase order to get started."
        emptyAction={canCreate ? () => setAddModal(true) : undefined}
        emptyActionLabel="Create PO"
      />
      <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={pagination.per_page} onPageChange={setPage} />

      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Create Purchase Order" size="xl">
        <PurchaseOrderForm
          suppliers={suppliers}
          outlets={outlets}
          bahanBakus={bahanBakus}
          onSubmit={handleCreate}
          onCancel={() => setAddModal(false)}
          loading={formLoading}
        />
      </Modal>

      <Modal isOpen={detailModal} onClose={() => { setDetailModal(false); setSelected(null) }} title="Purchase Order Details" size="lg">
        {detailLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#2f74de] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : selected ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#94a3b8]">PO Number</p>
                <p className="text-sm font-medium text-[#0f172a]">{selected.nomor_po || `PO-${selected.id}`}</p>
              </div>
              <div>
                <p className="text-xs text-[#94a3b8]">Status</p>
                {renderStatus(selected)}
              </div>
              <div>
                <p className="text-xs text-[#94a3b8]">Supplier</p>
                <p className="text-sm text-[#0f172a]">{selected.supplier?.nama || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-[#94a3b8]">Outlet</p>
                <p className="text-sm text-[#0f172a]">{selected.outlet?.nama || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-[#94a3b8]">Order Date</p>
                <p className="text-sm text-[#0f172a]">{selected.tanggal_pesan ? new Date(selected.tanggal_pesan).toLocaleDateString('id-ID') : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-[#94a3b8]">Required Date</p>
                <p className="text-sm text-[#0f172a]">{selected.tanggal_diperlukan ? new Date(selected.tanggal_diperlukan).toLocaleDateString('id-ID') : '—'}</p>
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
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-[#64748b] uppercase">Qty</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-[#64748b] uppercase">Harga Satuan</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-[#64748b] uppercase">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.items.map((item, i) => (
                      <tr key={i} className="border-b border-[#f1f5f9] last:border-0">
                        <td className="px-4 py-2.5 text-sm text-[#0f172a]">{item.bahan_baku?.nama || `Item ${i + 1}`}</td>
                        <td className="px-4 py-2.5 text-sm text-[#475569] text-right">{item.kuantitas}</td>
                        <td className="px-4 py-2.5 text-sm text-[#475569] text-right">Rp {Number(item.harga_satuan).toLocaleString('id-ID')}</td>
                        <td className="px-4 py-2.5 text-sm font-medium text-[#0f172a] text-right">
                          Rp {(Number(item.kuantitas) * Number(item.harga_satuan)).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : null}
      </Modal>

      <Modal isOpen={deleteModal} onClose={() => { setDeleteModal(false); setSelected(null) }} title="Delete Purchase Order" size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setDeleteModal(false); setSelected(null) }}>Cancel</Button>
            <Button variant="danger" loading={formLoading} onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-[#475569]">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-[#0f172a]">"{selected?.nomor_po || `PO-${selected?.id}`}"</span>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}

export default PurchaseOrdersPage
