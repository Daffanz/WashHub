import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Pencil, Trash2, FlaskConical } from 'lucide-react'
import komposisiBahanService from '../../services/komposisiBahanService'
import jenisLayananService from '../../services/jenisLayananService'
import bahanBakuService from '../../services/bahanBakuService'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/common/Toast'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import DataTable from '../../components/tables/DataTable'
import Pagination from '../../components/tables/Pagination'

const KomposisiForm = ({ item, layananList, bahanList, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState({ jenis_layanan_id: '', bahan_baku_id: '', jumlah: '', satuan: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (item) {
      setForm({
        jenis_layanan_id: item.jenis_layanan_id || '',
        bahan_baku_id: item.bahan_baku_id || '',
        jumlah: item.jumlah || '',
        satuan: item.satuan || '',
      })
    }
  }, [item])

  const validate = () => {
    const errs = {}
    if (!form.jenis_layanan_id) errs.jenis_layanan_id = 'Jenis layanan is required'
    if (!form.bahan_baku_id) errs.bahan_baku_id = 'Bahan baku is required'
    if (!form.jumlah && form.jumlah !== 0) errs.jumlah = 'Jumlah is required'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
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
        <label className="text-sm font-medium text-[#0f172a]">Jenis Layanan <span className="text-[#ef4444]">*</span></label>
        <select name="jenis_layanan_id" value={form.jenis_layanan_id} onChange={handleChange}
          className={`w-full px-3 py-2.5 text-sm rounded-lg border bg-white text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#2f74de]/30 focus:border-[#2f74de] transition-all ${errors.jenis_layanan_id ? 'border-[#ef4444]' : 'border-[#e2e8f0]'}`}>
          <option value="">Select jenis layanan...</option>
          {layananList.map((l) => (
            <option key={l.id} value={l.id}>{l.nama}</option>
          ))}
        </select>
        {errors.jenis_layanan_id && <p className="text-xs text-[#ef4444]">{errors.jenis_layanan_id}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#0f172a]">Bahan Baku <span className="text-[#ef4444]">*</span></label>
        <select name="bahan_baku_id" value={form.bahan_baku_id} onChange={handleChange}
          className={`w-full px-3 py-2.5 text-sm rounded-lg border bg-white text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#2f74de]/30 focus:border-[#2f74de] transition-all ${errors.bahan_baku_id ? 'border-[#ef4444]' : 'border-[#e2e8f0]'}`}>
          <option value="">Select bahan baku...</option>
          {bahanList.map((b) => (
            <option key={b.id} value={b.id}>{b.nama}</option>
          ))}
        </select>
        {errors.bahan_baku_id && <p className="text-xs text-[#ef4444]">{errors.bahan_baku_id}</p>}
      </div>
      <Input label="Jumlah" name="jumlah" type="number" placeholder="0" value={form.jumlah} onChange={handleChange} error={errors.jumlah} required />
      <Input label="Satuan" name="satuan" placeholder="e.g. ml, gram" value={form.satuan} onChange={handleChange} />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>{item ? 'Save Changes' : 'Create Komposisi'}</Button>
      </div>
    </form>
  )
}

const KomposisiBahanPage = () => {
  const { hasPermission } = useAuth()
  const toast = useToast()

  const [items, setItems] = useState([])
  const [layananList, setLayananList] = useState([])
  const [bahanList, setBahanList] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 10, total: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  const canView = hasPermission('view-komposisi-bahan')
  const canCreate = hasPermission('create-komposisi-bahan')
  const canEdit = hasPermission('edit-komposisi-bahan')
  const canDelete = hasPermission('delete-komposisi-bahan')

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await komposisiBahanService.getAll({ search, page, per_page: 10 })
      setItems(res.data?.items || [])
      setPagination(res.data?.pagination || {})
    } catch {
      toast.error('Failed to load komposisi bahan')
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    jenisLayananService.getAll().then((res) => setLayananList(res.data?.items || res.data || [])).catch(() => {})
    bahanBakuService.getAll().then((res) => setBahanList(res.data?.items || res.data || [])).catch(() => {})
  }, [])

  const handleAdd = async (data) => {
    setFormLoading(true)
    try {
      await komposisiBahanService.create(data)
      toast.success('Komposisi bahan created successfully')
      setAddModal(false)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create komposisi bahan')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = async (data) => {
    setFormLoading(true)
    try {
      await komposisiBahanService.update(selected.id, data)
      toast.success('Komposisi bahan updated successfully')
      setEditModal(false)
      setSelected(null)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update komposisi bahan')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    setFormLoading(true)
    try {
      await komposisiBahanService.delete(selected.id)
      toast.success('Komposisi bahan deleted successfully')
      setDeleteModal(false)
      setSelected(null)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete komposisi bahan')
    } finally {
      setFormLoading(false)
    }
  }

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#94a3b8]">You don't have permission to view komposisi bahan.</p>
      </div>
    )
  }

  const columns = [
    {
      key: 'jenis_layanan',
      label: 'Jenis Layanan',
      render: (val) => (
        <Badge variant="primary">{val?.nama || '—'}</Badge>
      ),
    },
    {
      key: 'bahan_baku',
      label: 'Bahan Baku',
      render: (val) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#d1fae5] flex items-center justify-center text-[#065f46] shrink-0">
            <FlaskConical size={14} />
          </div>
          <span className="text-[#0f172a] font-medium">{val?.nama || '—'}</span>
        </div>
      ),
    },
    {
      key: 'jumlah',
      label: 'Jumlah',
      render: (val, row) => (
        <span className="text-[#475569]">{val ?? '—'} {row.satuan || ''}</span>
      ),
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
          <h1 className="text-2xl font-bold text-[#0f172a]">Komposisi Bahan</h1>
          <p className="text-sm text-[#64748b] mt-1">Kelola komposisi bahan per layanan.</p>
        </div>
        {canCreate && (
          <Button icon={Plus} onClick={() => setAddModal(true)}>Add Komposisi</Button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_1px_8px_rgba(0,0,0,0.05)] mb-5 p-4">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input type="text" placeholder="Search komposisi..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#f8fafc] border border-[#e2e8f0] rounded-lg placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2f74de]/30 focus:border-[#2f74de] transition-all" />
        </div>
      </div>

      <div>
        <DataTable columns={columns} data={items} loading={loading} emptyTitle="No komposisi found" emptyDescription="Add your first komposisi to get started." emptyAction={canCreate ? () => setAddModal(true) : undefined} emptyActionLabel="Add Komposisi" />
        <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={pagination.per_page} onPageChange={setPage} />
      </div>

      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add New Komposisi Bahan" size="md">
        <KomposisiForm layananList={layananList} bahanList={bahanList} onSubmit={handleAdd} onCancel={() => setAddModal(false)} loading={formLoading} />
      </Modal>

      <Modal isOpen={editModal} onClose={() => { setEditModal(false); setSelected(null) }} title="Edit Komposisi Bahan" size="md">
        <KomposisiForm item={selected} layananList={layananList} bahanList={bahanList} onSubmit={handleEdit} onCancel={() => { setEditModal(false); setSelected(null) }} loading={formLoading} />
      </Modal>

      <Modal isOpen={deleteModal} onClose={() => { setDeleteModal(false); setSelected(null) }} title="Delete Komposisi Bahan" size="sm"
        footer={<><Button variant="ghost" onClick={() => { setDeleteModal(false); setSelected(null) }}>Cancel</Button><Button variant="danger" loading={formLoading} onClick={handleDelete}>Delete</Button></>}>
        <p className="text-sm text-[#475569]">Are you sure you want to delete this komposisi? This action cannot be undone.</p>
      </Modal>
    </div>
  )
}

export default KomposisiBahanPage
