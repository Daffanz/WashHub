import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Eye, PackageCheck, AlertTriangle } from 'lucide-react'
import receivingService from '../../services/receivingService'
import purchaseOrderService from '../../services/purchaseOrderService'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/common/Toast'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import DataTable from '../../components/tables/DataTable'
import Pagination from '../../components/tables/Pagination'

const ReceivingsPage = () => {
  const { hasPermission } = useAuth()
  const toast = useToast()

  const [receivings, setReceivings] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 10, total: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [approvedPOs, setApprovedPOs] = useState([])
  const [selectedPO, setSelectedPO] = useState(null)
  const [poItems, setPoItems] = useState([])
  const [receivedQtys, setReceivedQtys] = useState({})
  const [poLoading, setPoLoading] = useState(false)

  const [addModal, setAddModal] = useState(false)
  const [detailModal, setDetailModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  const canView = hasPermission('view-receivings')
  const canCreate = hasPermission('create-receivings')

  const fetchReceivings = useCallback(async () => {
    try {
      setLoading(true)
      const res = await receivingService.getAll({ search, page, per_page: 10 })
      setReceivings(res.data?.items || [])
      setPagination(res.data?.pagination || {})
    } catch {
      toast.error('Failed to load receivings')
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => { fetchReceivings() }, [fetchReceivings])

  const fetchApprovedPOs = async () => {
    try {
      const res = await purchaseOrderService.getAll({ status: 'po.diterima', per_page: 100 })
      setApprovedPOs(res.data?.items || [])
    } catch {
      toast.error('Failed to load approved purchase orders')
    }
  }

  const handlePOSelect = async (poId) => {
    if (!poId) {
      setSelectedPO(null)
      setPoItems([])
      setReceivedQtys({})
      return
    }
    setPoLoading(true)
    try {
      const res = await purchaseOrderService.getById(poId)
      const po = res.data || res
      setSelectedPO(po)
      const items = po.items || []
      setPoItems(items)
      const qtys = {}
      items.forEach((item) => { qtys[item.id] = '' })
      setReceivedQtys(qtys)
    } catch {
      toast.error('Failed to load purchase order details')
    } finally {
      setPoLoading(false)
    }
  }

  const handleQtyChange = (itemId, value) => {
    setReceivedQtys((prev) => ({ ...prev, [itemId]: value }))
  }

  const validateReceiving = () => {
    if (!selectedPO) {
      toast.error('Please select a purchase order')
      return false
    }
    for (const item of poItems) {
      const qty = Number(receivedQtys[item.id])
      if (!qty || qty <= 0) {
        toast.error(`Received quantity for "${item.bahan_baku?.nama}" must be greater than 0`)
        return false
      }
      if (qty > Number(item.kuantitas)) {
        toast.error(`Received quantity for "${item.bahan_baku?.nama}" exceeds ordered quantity (${item.kuantitas})`)
        return false
      }
    }
    return true
  }

  const handleCreate = async () => {
    if (!validateReceiving()) return
    setFormLoading(true)
    try {
      await receivingService.create({
        purchase_order_id: selectedPO.id,
        items: poItems.map((item) => ({
          purchase_order_item_id: item.id,
          bahan_baku_id: item.bahan_baku_id,
          kuantitas_dipesan: Number(item.kuantitas),
          kuantitas_diterima: Number(receivedQtys[item.id]),
        })),
      })
      toast.success('Receiving created successfully')
      setAddModal(false)
      resetForm()
      fetchReceivings()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create receiving')
    } finally {
      setFormLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedPO(null)
    setPoItems([])
    setReceivedQtys({})
  }

  const handleViewDetail = async (receiving) => {
    setDetailLoading(true)
    setDetailModal(true)
    try {
      const res = await receivingService.getById(receiving.id)
      setSelected(res.data || res)
    } catch {
      toast.error('Failed to load receiving details')
      setDetailModal(false)
    } finally {
      setDetailLoading(false)
    }
  }

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#94a3b8]">You don't have permission to view receivings.</p>
      </div>
    )
  }

  const columns = [
    {
      key: 'nomor_penerimaan',
      label: 'Receiving #',
      render: (val, row) => (
        <button onClick={() => handleViewDetail(row)} className="flex items-center gap-2 font-medium text-[#2f74de] hover:underline">
          <PackageCheck size={14} />
          {val || `RCV-${row.id}`}
        </button>
      ),
    },
    {
      key: 'purchase_order',
      label: 'PO Number',
      render: (val, row) => <span className="text-[#475569]">{val?.nomor_po || row.purchase_order?.nomor_po || '—'}</span>,
    },
    {
      key: 'tanggal_penerimaan',
      label: 'Date',
      render: (val) => <span className="text-[#475569]">{val ? new Date(val).toLocaleDateString('id-ID') : '—'}</span>,
    },
    {
      key: 'items',
      label: 'Items',
      render: (val) => <span className="text-[#475569]">{val?.length || 0} items</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val, row) => {
        const status = val?.nama || 'Received'
        return <Badge variant="success">{status}</Badge>
      },
    },
    {
      key: 'id',
      label: 'Actions',
      render: (_, row) => (
        <button onClick={() => handleViewDetail(row)} className="p-1.5 rounded-lg text-[#6377a2] hover:bg-[#eef0f7] transition-colors" title="View Details">
          <Eye size={15} />
        </button>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Receivings</h1>
          <p className="text-sm text-[#64748b] mt-1">Kelola penerimaan barang dari supplier.</p>
        </div>
        {canCreate && (
          <Button icon={Plus} onClick={() => { setAddModal(true); fetchApprovedPOs() }}>
            Create Receiving
          </Button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_1px_8px_rgba(0,0,0,0.05)] mb-5 p-4">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input type="text" placeholder="Search receivings..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#f8fafc] border border-[#e2e8f0] rounded-lg placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2f74de]/30 focus:border-[#2f74de] transition-all" />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={receivings}
        loading={loading}
        emptyTitle="No receivings found"
        emptyDescription="Create your first receiving to get started."
        emptyAction={canCreate ? () => { setAddModal(true); fetchApprovedPOs() } : undefined}
        emptyActionLabel="Create Receiving"
      />
      <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={pagination.per_page} onPageChange={setPage} />

      {/* Create Modal */}
      <Modal isOpen={addModal} onClose={() => { setAddModal(false); resetForm() }} title="Create Receiving" size="xl">
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#0f172a]">Select Approved Purchase Order <span className="text-[#ef4444]">*</span></label>
            <select
              value={selectedPO?.id || ''}
              onChange={(e) => handlePOSelect(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-[#e2e8f0] bg-white text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#2f74de]/30 focus:border-[#2f74de] transition-all"
            >
              <option value="">Select purchase order...</option>
              {approvedPOs.map((po) => (
                <option key={po.id} value={po.id}>{po.nomor_po || `PO-${po.id}`} — {po.supplier?.nama || 'Unknown Supplier'}</option>
              ))}
            </select>
          </div>

          {poLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-[#2f74de] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {selectedPO && !poLoading && poItems.length > 0 && (
            <div className="border border-[#e2e8f0] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-[#64748b] uppercase">Bahan Baku</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-[#64748b] uppercase">Ordered Qty</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-[#64748b] uppercase">Received Qty</th>
                    <th className="px-4 py-2.5 text-center text-xs font-semibold text-[#64748b] uppercase w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {poItems.map((item) => {
                    const maxQty = Number(item.kuantitas)
                    const currentQty = Number(receivedQtys[item.id] || 0)
                    const exceeds = currentQty > maxQty
                    return (
                      <tr key={item.id} className="border-b border-[#f1f5f9] last:border-0">
                        <td className="px-4 py-3 text-sm text-[#0f172a]">
                          {item.bahan_baku?.nama || `Item ${item.id}`}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#475569] text-right">{item.kuantitas}</td>
                        <td className="px-4 py-3 text-right">
                          <input
                            type="number"
                            min="0"
                            max={maxQty}
                            value={receivedQtys[item.id] || ''}
                            onChange={(e) => handleQtyChange(item.id, e.target.value)}
                            className={`w-24 px-2 py-1.5 text-sm text-right rounded-lg border bg-white text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#2f74de]/30 focus:border-[#2f74de] transition-all
                              ${exceeds ? 'border-[#ef4444]' : 'border-[#e2e8f0]'}`}
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          {exceeds && (
                            <span title="Exceeds ordered quantity" className="text-[#ef4444]">
                              <AlertTriangle size={16} />
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {selectedPO && !poLoading && poItems.length === 0 && (
            <p className="text-sm text-[#94a3b8] text-center py-4">This purchase order has no items.</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => { setAddModal(false); resetForm() }}>Cancel</Button>
            <Button loading={formLoading} onClick={handleCreate} disabled={!selectedPO || poItems.length === 0}>
              Create Receiving
            </Button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={detailModal} onClose={() => { setDetailModal(false); setSelected(null) }} title="Receiving Details" size="lg">
        {detailLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#2f74de] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : selected ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#94a3b8]">Receiving #</p>
                <p className="text-sm font-medium text-[#0f172a]">{selected.nomor_penerimaan || `RCV-${selected.id}`}</p>
              </div>
              <div>
                <p className="text-xs text-[#94a3b8]">PO Number</p>
                <p className="text-sm text-[#0f172a]">{selected.purchase_order?.nomor_po || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-[#94a3b8]">Date</p>
                <p className="text-sm text-[#0f172a]">{selected.tanggal_penerimaan ? new Date(selected.tanggal_penerimaan).toLocaleDateString('id-ID') : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-[#94a3b8]">Status</p>
                <Badge variant="success">{selected.status?.nama || 'Received'}</Badge>
              </div>
            </div>

            {selected.items?.length > 0 && (
              <div className="border border-[#e2e8f0] rounded-lg overflow-hidden mt-2">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-[#64748b] uppercase">Bahan Baku</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-[#64748b] uppercase">Ordered</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-[#64748b] uppercase">Received</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.items.map((item, i) => (
                      <tr key={i} className="border-b border-[#f1f5f9] last:border-0">
                        <td className="px-4 py-2.5 text-sm text-[#0f172a]">{item.bahan_baku?.nama || `Item ${i + 1}`}</td>
                        <td className="px-4 py-2.5 text-sm text-[#475569] text-right">{item.kuantitas_dipesan || item.kuantitas}</td>
                        <td className="px-4 py-2.5 text-sm font-medium text-[#0f172a] text-right">{item.kuantitas_diterima}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : null}
      </Modal>
    </div>
  )
}

export default ReceivingsPage
