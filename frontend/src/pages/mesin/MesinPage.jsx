import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Pencil, Trash2, Cog } from 'lucide-react'
import mesinService from '../../services/mesinService'
import outletService from '../../services/outletService'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/common/Toast'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import DataTable from '../../components/tables/DataTable'
import Pagination from '../../components/tables/Pagination'

const MesinForm = ({ mesin, outletList, statusList, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState({ outlet_id: '', kode: '', nama: '', merek: '', tipe: '', kapasitas: '', satuan_kapasitas: '', status_id: '', deskripsi: '', is_active: true })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (mesin) {
      setForm({
        outlet_id: mesin.outlet_id || '',
        kode: mesin.kode || '',
        nama: mesin.nama || '',
        merek: mesin.merek || '',
        tipe: mesin.tipe || '',
        kapasitas: mesin.kapasitas || '',
        satuan_kapasitas: mesin.satuan_kapasitas || '',
        status_id: mesin.status_id || '',
        deskripsi: mesin.deskripsi || '',
        is_active: mesin.is_active ?? true,
      })
    }
  }, [mesin])

  const validate = () => {
    const errs = {}
    if (!form.nama.trim()) errs.nama = 'Name is required'
    if (!form.outlet_id) errs.outlet_id = 'Outlet is required'
    return errs
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#0f172a]">Outlet <span className="text-[#ef4444]">*</span></label>
        <select name="outlet_id" value={form.outlet_id} onChange={handleChange}
          className={`w-full px-3 py-2.5 text-sm rounded-lg border bg-white text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#2f74de]/30 focus:border-[#2f74de] transition-all ${errors.outlet_id ? 'border-[#ef4444]' : 'border-[#e2e8f0]'}`}>
          <option value="">Select outlet...</option>
          {outletList.map((o) => (
            <option key={o.id} value={o.id}>{o.nama}</option>
          ))}
        </select>
        {errors.outlet_id && <p className="text-xs text-[#ef4444]">{errors.outlet_id}</p>}
      </div>
      <Input label="Kode" name="kode" placeholder="Code (optional)" value={form.kode} onChange={handleChange} />
      <Input label="Nama Mesin" name="nama" placeholder="Machine Name" value={form.nama} onChange={handleChange} error={errors.nama} required />
      <Input label="Merek" name="merek" placeholder="Brand" value={form.merek} onChange={handleChange} />
      <Input label="Tipe" name="tipe" placeholder="Type" value={form.tipe} onChange={handleChange} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Kapasitas" name="kapasitas" type="number" min="0" placeholder="0" value={form.kapasitas} onChange={handleChange} />
        <Input label="Satuan Kapasitas" name="satuan_kapasitas" placeholder="e.g. kg, liter" value={form.satuan_kapasitas} onChange={handleChange} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#0f172a]">Status</label>
        <select name="status_id" value={form.status_id} onChange={handleChange}
          className="w-full px-3 py-2.5 text-sm rounded-lg border border-[#e2e8f0] bg-white text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#2f74de]/30 focus:border-[#2f74de] transition-all">
          <option value="">Select status...</option>
          {statusList.map((s) => (
            <option key={s.id} value={s.id}>{s.nama}</option>
          ))}
        </select>
      </div>
      <Input label="Deskripsi" name="deskripsi" placeholder="Description" value={form.deskripsi} onChange={handleChange} />
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="w-4 h-4 rounded accent-[#2f74de]" />
        <span className="text-sm text-[#475569]">Active</span>
      </label>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>{mesin ? 'Save Changes' : 'Create Mesin'}</Button>
      </div>
    </form>
  )
}

const MesinPage = () => {
  const { hasPermission } = useAuth()
  const toast = useToast()

  const [items, setItems] = useState([])
  const [outletList, setOutletList] = useState([])
  const [statusList, setStatusList] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 10, total: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  const canView = hasPermission('view-mesin')
  const canCreate = hasPermission('create-mesin')
  const canEdit = hasPermission('edit-mesin')
  const canDelete = hasPermission('delete-mesin')

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await mesinService.getAll({ search, page, per_page: 10 })
      setItems(res.data?.items || [])
      setPagination(res.data?.pagination || {})
    } catch {
      toast.error('Failed to load mesin')
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    outletService.getAll().then((res) => setOutletList(res.data?.items || res.data || [])).catch(() => {})
    api.get('/statuses', { params: { grup: 'mesin' } }).then((res) => setStatusList(res.data?.items || res.data || [])).catch(() => {})
  }, [])

  const handleAdd = async (data) => {
    setFormLoading(true)
    try {
      await mesinService.create(data)
      toast.success('Mesin created successfully')
      setAddModal(false)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create mesin')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = async (data) => {
    setFormLoading(true)
    try {
      await mesinService.update(selected.id, data)
      toast.success('Mesin updated successfully')
      setEditModal(false)
      setSelected(null)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update mesin')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    setFormLoading(true)
    try {
      await mesinService.delete(selected.id)
      toast.success('Mesin deleted successfully')
      setDeleteModal(false)
      setSelected(null)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete mesin')
    } finally {
      setFormLoading(false)
    }
  }

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#94a3b8]">You don't have permission to view mesin.</p>
      </div>
    )
  }

  const columns = [
    {
      key: 'kode',
      label: 'Kode',
      render: (val) => <span className="text-[#475569] font-medium">{val || '—'}</span>,
    },
    {
      key: 'nama',
      label: 'Mesin',
      render: (val) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#dbeafe] flex items-center justify-center text-[#1e40af] text-xs font-semibold shrink-0">
            <Cog size={16} />
          </div>
          <p className="font-medium text-[#0f172a]">{val}</p>
        </div>
      ),
    },
    {
      key: 'merek',
      label: 'Merek',
      render: (val) => <span className="text-[#475569]">{val || '—'}</span>,
    },
    {
      key: 'tipe',
      label: 'Tipe',
      render: (val) => <span className="text-[#475569]">{val || '—'}</span>,
    },
    {
      key: 'kapasitas',
      label: 'Kapasitas',
      render: (val, row) => <span className="text-[#475569]">{val ?? '—'} {row.satuan_kapasitas || ''}</span>,
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (val) => <Badge variant={val ? 'success' : 'danger'}>{val ? 'Active' : 'Inactive'}</Badge>,
    },
    ...(canEdit || canDelete ? [{
      key: 'id',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          {canEdit && (
            <button onClick={() => { setSelected(row); setEditModal(true) }} className="p-1.5 rounded-lg text-[#6377a2] hover:bg-[#eef0f7] transition-colors">
              <Pencil size={15} />
            </button>
          )}
          {canDelete && (
            <button onClick={() => { setSelected(row); setDeleteModal(true) }} className="p-1.5 rounded-lg text-[#ef4444] hover:bg-[#fee2e2] transition-colors">
              <Trash2 size={15} />
            </button>
          )}
        </div>
      ),
    }] : []),
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Mesin</h1>
          <p className="text-sm text-[#64748b] mt-1">Kelola data mesin laundry.</p>
        </div>
        {canCreate && (
          <Button icon={Plus} onClick={() => setAddModal(true)}>Add Mesin</Button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_1px_8px_rgba(0,0,0,0.05)] mb-5 p-4">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input type="text" placeholder="Search mesin..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#f8fafc] border border-[#e2e8f0] rounded-lg placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2f74de]/30 focus:border-[#2f74de] transition-all" />
        </div>
      </div>

      <div>
        <DataTable columns={columns} data={items} loading={loading} emptyTitle="No mesin found" emptyDescription="Add your first mesin to get started." emptyAction={canCreate ? () => setAddModal(true) : undefined} emptyActionLabel="Add Mesin" />
        <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={pagination.per_page} onPageChange={setPage} />
      </div>

      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add New Mesin" size="md">
        <MesinForm outletList={outletList} statusList={statusList} onSubmit={handleAdd} onCancel={() => setAddModal(false)} loading={formLoading} />
      </Modal>

      <Modal isOpen={editModal} onClose={() => { setEditModal(false); setSelected(null) }} title="Edit Mesin" size="md">
        <MesinForm mesin={selected} outletList={outletList} statusList={statusList} onSubmit={handleEdit} onCancel={() => { setEditModal(false); setSelected(null) }} loading={formLoading} />
      </Modal>

      <Modal isOpen={deleteModal} onClose={() => { setDeleteModal(false); setSelected(null) }} title="Delete Mesin" size="sm"
        footer={<><Button variant="ghost" onClick={() => { setDeleteModal(false); setSelected(null) }}>Cancel</Button><Button variant="danger" loading={formLoading} onClick={handleDelete}>Delete</Button></>}>
        <p className="text-sm text-[#475569]">Are you sure you want to delete <span className="font-semibold text-[#0f172a]">"{selected?.nama}"</span>? This action cannot be undone.</p>
      </Modal>
    </div>
  )
}

export default MesinPage
