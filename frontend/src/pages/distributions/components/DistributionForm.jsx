import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import Button from '../../../components/common/Button'
import Input from '../../../components/common/Input'

const emptyItem = { bahan_baku_id: '', kuantitas: '' }

const DistributionForm = ({ outlets = [], bahanBakus = [], onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState({
    outlet_id: '',
    asal_outlet_id: '',
    tanggal_distribusi: new Date().toISOString().split('T')[0],
    catatan: '',
  })
  const [items, setItems] = useState([{ ...emptyItem }])
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const addItem = () => setItems((prev) => [...prev, { ...emptyItem }])
  const removeItem = (index) => setItems((prev) => prev.filter((_, i) => i !== index))

  const validate = () => {
    const errs = {}
    if (!form.outlet_id) errs.outlet_id = 'Target outlet is required'
    if (!form.asal_outlet_id) errs.asal_outlet_id = 'Source outlet is required'
    if (form.outlet_id && form.asal_outlet_id && form.outlet_id === form.asal_outlet_id) {
      errs.outlet_id = 'Target and source outlet must be different'
    }
    if (!form.tanggal_distribusi) errs.tanggal_distribusi = 'Distribution date is required'

    const itemErrs = items.map((item) => {
      const e = {}
      if (!item.bahan_baku_id) e.bahan_baku_id = 'Required'
      if (!item.kuantitas || Number(item.kuantitas) <= 0) e.kuantitas = 'Must be > 0'
      return e
    })

    if (itemErrs.some((e) => Object.keys(e).length > 0)) errs.items = itemErrs
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onSubmit({
      ...form,
      items: items.map((item) => ({
        bahan_baku_id: Number(item.bahan_baku_id),
        kuantitas: Number(item.kuantitas),
      })),
    })
  }

  const selectClass = 'w-full px-3 py-2.5 text-sm rounded-lg border border-[#e2e8f0] bg-white text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#2f74de]/30 focus:border-[#2f74de] transition-all'
  const textareaClass = 'w-full px-3 py-2.5 text-sm rounded-lg border border-[#e2e8f0] bg-white text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2f74de]/30 focus:border-[#2f74de] transition-all resize-none'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#0f172a]">Source Outlet <span className="text-[#ef4444]">*</span></label>
          <select name="asal_outlet_id" value={form.asal_outlet_id} onChange={handleChange} className={selectClass}>
            <option value="">Select source outlet...</option>
            {outlets.filter((o) => o.is_active).map((o) => <option key={o.id} value={o.id}>{o.nama}</option>)}
          </select>
          {errors.asal_outlet_id && <p className="text-xs text-[#ef4444]">{errors.asal_outlet_id}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#0f172a]">Target Outlet <span className="text-[#ef4444]">*</span></label>
          <select name="outlet_id" value={form.outlet_id} onChange={handleChange} className={selectClass}>
            <option value="">Select target outlet...</option>
            {outlets.filter((o) => o.is_active).map((o) => <option key={o.id} value={o.id}>{o.nama}</option>)}
          </select>
          {errors.outlet_id && <p className="text-xs text-[#ef4444]">{errors.outlet_id}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Tanggal Distribusi" name="tanggal_distribusi" type="date" value={form.tanggal_distribusi} onChange={handleChange} error={errors.tanggal_distribusi} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#0f172a]">Catatan</label>
        <textarea name="catatan" rows={2} value={form.catatan} onChange={handleChange} placeholder="Distribution notes..." className={textareaClass} />
      </div>

      <div className="border-t border-[#e2e8f0] pt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-[#0f172a]">Items</h4>
          <Button type="button" size="sm" variant="outline" icon={Plus} onClick={addItem}>Add Item</Button>
        </div>

        <div className="flex flex-col gap-3">
          {items.map((item, idx) => (
            <div key={idx} className="bg-[#f8fafc] rounded-lg p-3 border border-[#e2e8f0]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-[#64748b]">Item #{idx + 1}</span>
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(idx)} className="p-1 rounded text-[#ef4444] hover:bg-[#fee2e2] transition-colors">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#475569]">Bahan Baku <span className="text-[#ef4444]">*</span></label>
                  <select value={item.bahan_baku_id} onChange={(e) => handleItemChange(idx, 'bahan_baku_id', e.target.value)} className={selectClass + ' text-xs'}>
                    <option value="">Select...</option>
                    {bahanBakus.filter((b) => b.is_active).map((b) => <option key={b.id} value={b.id}>{b.nama}</option>)}
                  </select>
                  {errors.items?.[idx]?.bahan_baku_id && <p className="text-xs text-[#ef4444]">{errors.items[idx].bahan_baku_id}</p>}
                </div>
                <Input label="Kuantitas" type="number" min="1" value={item.kuantitas} onChange={(e) => handleItemChange(idx, 'kuantitas', e.target.value)} error={errors.items?.[idx]?.kuantitas} required />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>Create Distribution</Button>
      </div>
    </form>
  )
}

export default DistributionForm
