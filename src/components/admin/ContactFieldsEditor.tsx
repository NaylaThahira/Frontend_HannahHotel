import { Plus, Trash2 } from 'lucide-react'
import { MAX_CONTACT_FIELDS, contactFieldTypes, type ContactField } from '@/lib/contact-settings'

const typeLabels = { text: 'Teks singkat', email: 'Email', tel: 'Nomor telepon', textarea: 'Teks panjang', number: 'Angka', date: 'Tanggal' }
const inputClass = 'mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20'

export default function ContactFieldsEditor({ fields, onChange }: { fields: ContactField[]; onChange: (fields: ContactField[]) => void }) {
  function update(id: string, patch: Partial<ContactField>) {
    onChange(fields.map(field => field.id === id ? { ...field, ...patch } : field))
  }

  return (
    <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Field Formulir ({fields.length}/{MAX_CONTACT_FIELDS})</h3>
          <p className="mt-1 text-sm text-gray-500">Maksimal 5 field. Sertakan minimal satu field Email; email wajib diisi pengunjung agar hotel bisa membalas.</p>
        </div>
        <button type="button" disabled={fields.length >= MAX_CONTACT_FIELDS} onClick={() => {
          if (fields.length < MAX_CONTACT_FIELDS) onChange([...fields, { id: crypto.randomUUID(), label: '', type: 'text', placeholder: '', required: false }])
        }} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
          <Plus aria-hidden="true" size={18} /> Tambah Field
        </button>
      </div>
      {fields.length === 0 && <p className="text-sm text-gray-500">Belum ada field. Klik Tambah Field untuk membuat isian.</p>}
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold text-gray-800">{index + 1}. {field.label || 'Field baru'}</h4>
            <button type="button" onClick={() => onChange(fields.filter(item => item.id !== field.id))} aria-label={`Hapus field ${field.label || index + 1}`} className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"><Trash2 aria-hidden="true" size={16} /> Hapus</button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">Nama / label field
              <input required value={field.label} onChange={event => update(field.id, { label: event.target.value })} placeholder="Contoh: Tanggal check-in" className={inputClass} />
            </label>
            <label className="text-sm font-medium text-gray-700">Jenis field
              <select value={field.type} onChange={event => update(field.id, { type: event.target.value as ContactField['type'] })} className={inputClass}>
                {contactFieldTypes.map(type => <option key={type} value={type}>{typeLabels[type]}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700">Petunjuk isian (opsional)
              <input value={field.placeholder} onChange={event => update(field.id, { placeholder: event.target.value })} className={inputClass} />
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700"><input type="checkbox" checked={field.required} onChange={event => update(field.id, { required: event.target.checked })} /> Wajib diisi</label>
          </div>
        </div>
      ))}
      {fields.length >= MAX_CONTACT_FIELDS && <p className="text-sm text-gray-500">Batas 5 field tercapai. Hapus salah satu field untuk menambahkan field baru.</p>}
    </section>
  )
}
