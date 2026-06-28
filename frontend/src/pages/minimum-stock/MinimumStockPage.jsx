import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Trash2, ShieldAlert } from 'lucide-react'
import minimumStockService from '../../services/minimumStockService'
import outletService from '../../services/outletService'
import bahanBakuService from '../../services/bahanBakuService'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/common/Toast'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import DataTable from '../../components/tables/DataTable'
import Pagination from '../../components/tables/Pagination'

const MinimumStockPage = () => {
  const { hasPermission } = useAuth()
  const toast = useToast()

  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 10, total: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [outlets, setOutlets] = useState([])
  const [bahanBakus, setBahanBakus] = useState([])

  const [addModal, setAddModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  const [form, setForm] = useState({ outlet_id: '', bahan_baku_id: '', jumlah_minimum: '' })
  const [errors, setErrors] = useState({})

  const canView = hasPermission('view-minimum-stock')
  const canCreate = hasPermission('create-minimum-stock')
  const canDelete = hasPermission('delete-minimum-stock')

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      const res = await minimumStockService.getAll({ search, page, per_page: 10 })
      setItems(res.data?.items || [])
      setPagination(res.data?.pagination || {})
    } catch {
      toast.error('Failed to load minimum stock configuration')
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => { fetchItems() }, [fetchItems])

  useEffect(() => {
    Promise.all([
      outletService.getAll({ per_page: 100 }).catch(() => ({ data: {} })),
      bahanBakuService.getAll({ per_page: 100, is_active: 1 }).catch(() => ({ data: {} })),
    ]).then(([o, b]) => {
      setOutlets(o.data?.items || [])
      setBahanBakus(b.data?.items || [])
    })
  }, [])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.outlet_id) errs.outlet_id = 'Outlet is required'
    if (!form.bahan_baku_id) errs.bahan_baku_id = 'Bahan baku is required'
    if (!form.jumlah_minimum || Number(form.jumlah_minimum) <= 0) errs.jumlah_minimum = 'Must be greater than 0'
    return errs
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setFormLoading(true)
    try {
      await minimumStockService.create({
        outlet_id: Number(form.outlet_id),
        bahan_baku_id: Number(form.bahan_baku_id),
        jumlah_minimum: Number(form.jumlah_minimum),
      })
      toast.success('Minimum stock configured successfully')
      setAddModal(false)
      setForm({ outlet_id: '', bahan_baku_id: '', jumlah_minimum: '' })
      setErrors({})
      fetchItems()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to configure minimum stock')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    setFormLoading(true)
    try {
      await minimumStockService.delete(selected.id)
      toast.success('Minimum stock configuration deleted')
      setDeleteModal(false)
      setSelected(null)
      fetchItems()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete minimum stock')
    } finally {
      setFormLoading(false)
    }
  }

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#94a3b8]">You don't have permission to view minimum stock configuration.</p>
      </div>
    )
  }

  const selectClass = 'w-full px-3 py-2.5 text-sm rounded-lg border border-[#e2e8f0] bg-white text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#2f74de]/30 focus:border-[#2f74de] transition-all'

  const columns = [
    {
      key: 'outlet',
      label: 'Outlet',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#e8f0fd] flex items-center justify-center text-[#2f74de] text-xs font-semibold shrink-0">
            <ShieldAlert size={16} />
          </div>
          <span className="font-medium text-[#0f172a]">{val?.nama || '—'}</span>
        </div>
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
      key: 'jumlah_minimum',
      label: 'Minimum Stock',
      render: (val) => <span className="text-sm font-medium text-[#0f172a]">{val}</span>,
    },
    {
      key: 'satuan',
      label: 'Unit',
      render: (val, row) => <span className="text-[#475569]">{val || row.bahan_baku?.satuan || '—'}</span>,
    },
    ...(canDelete ? [{
      key: 'id',
      label: 'Actions',
      render: (_, row) => (
        <button onClick={() => { setSelected(row); setDeleteModal(true) }} className="p-1.5 rounded-lg text-[#ef4444] hover:bg-[#fee2e2] transition-colors" title="Delete">
          <Trash2 size={15} />
        </button>
      ),
    }] : []),
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Minimum Stock</h1>
          <p className="text-sm text-[#64748b] mt-1">Konfigurasi batas minimum stok bahan baku per outlet.</p>
        </div>
        {canCreate && (
          <Button icon={Plus} onClick={() => { setAddModal(true); setForm({ outlet_id: '', bahan_baku_id: '', jumlah_minimum: '' }); setErrors({}) }}>
            Add Minimum Stock
          </Button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_1px_8px_rgba(0,0,0,0.05)] mb-5 p-4">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input type="text" placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#f8fafc] border border-[#e2e8f0] rounded-lg placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2f74de]/30 focus:border-[#2f74de] transition-all" />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        emptyTitle="No minimum stock configured"
        emptyDescription="Set minimum stock levels to receive low stock alerts."
        emptyAction={canCreate ? () => setAddModal(true) : undefined}
        emptyActionLabel="Add Minimum Stock"
      />
      <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={pagination.per_page} onPageChange={setPage} />

      {/* Add Modal */}
      <Modal isOpen={addModal} onClose={() => { setAddModal(false); setErrors({}) }} title="Add Minimum Stock" size="md">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#0f172a]">Outlet <span className="text-[#ef4444]">*</span></label>
            <select name="outlet_id" value={form.outlet_id} onChange={handleFormChange} className={selectClass}>
              <option value="">Select outlet...</option>
              {outlets.filter((o) => o.is_active).map((o) => <option key={o.id} value={o.id}>{o.nama}</option>)}
            </select>
            {errors.outlet_id && <p className="text-xs text-[#ef4444]">{errors.outlet_id}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#0f172a]">Bahan Baku <span className="text-[#ef4444]">*</span></label>
            <select name="bahan_baku_id" value={form.bahan_baku_id} onChange={handleFormChange} className={selectClass}>
              <option value="">Select bahan baku...</option>
              {bahanBakus.filter((b) => b.is_active).map((b) => <option key={b.id} value={b.id}>{b.nama}</option>)}
            </select>
            {errors.bahan_baku_id && <p className="text-xs text-[#ef4444]">{errors.bahan_baku_id}</p>}
          </div>
          <Input label="Jumlah Minimum" name="jumlah_minimum" type="number" min="1" placeholder="e.g. 10" value={form.jumlah_minimum} onChange={handleFormChange} error={errors.jumlah_minimum} required />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => { setAddModal(false); setErrors({}) }}>Cancel</Button>
            <Button type="submit" loading={formLoading}>Save</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteModal} onClose={() => { setDeleteModal(false); setSelected(null) }} title="Delete Minimum Stock" size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setDeleteModal(false); setSelected(null) }}>Cancel</Button>
            <Button variant="danger" loading={formLoading} onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-[#475569]">
          Are you sure you want to delete the minimum stock configuration for{' '}
          <span className="font-semibold text-[#0f172a]">
            "{selected?.bahan_baku?.nama || selected?.bahan_baku_name}"
          </span>{' '}
          at{' '}
          <span className="font-semibold text-[#0f172a]">
            "{selected?.outlet?.nama || selected?.outlet_name}"
          </span>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}

export default MinimumStockPage
