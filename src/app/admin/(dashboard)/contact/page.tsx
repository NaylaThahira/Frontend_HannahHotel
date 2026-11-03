'use client'

import { usePathname } from 'next/navigation'
import { adminApi, adminLocation, adminFetch } from '@/lib/admin-api';
import { useEffect, useState, type FormEvent } from 'react'
import { contactSettingKey, getBranchContactSettings, contactDefaults, type ContactSettings } from '@/lib/contact-settings'

type Field = [keyof ContactSettings, string, string?]
const groups: { title: string; fields: Field[] }[] = [
  { title: 'Judul Halaman', fields: [['contact_title', 'Judul'], ['contact_description', 'Deskripsi', 'textarea']] },
  { title: 'Informasi Kontak', fields: [
    ['contact_hotel_name', 'Nama hotel'],
    ['contact_address', 'Alamat lengkap', 'textarea'], ['contact_phone', 'Nomor telepon / WhatsApp', 'tel'], ['contact_email', 'Email hotel', 'email'],
  ] },
  { title: 'Lokasi Peta', fields: [
    ['contact_map_latitude', 'Latitude (lintang)', 'number'], ['contact_map_longitude', 'Longitude (bujur)', 'number'],
    ['contact_map_url', 'Link Google Maps', 'url'], ['contact_map_label', 'Teks tombol Google Maps'],
  ] },
]

export default function ContactManagementPage() {
  const location = adminLocation(usePathname())
  const api = adminApi(location)
  const visibleGroups = location === 'padang' ? groups.filter(group => group.title !== 'Judul Halaman') : groups
  const [settings, setSettings] = useState(contactDefaults)
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const response = await adminFetch(`${api}/api/settings`, { cache: 'no-store' })
        if (!response.ok) throw new Error()
        const loaded = getBranchContactSettings(await response.json(), location)
        setSettings(loaded)
      } catch {
        setLoadFailed(true)
        setStatus('Gagal memuat pengaturan. Silakan muat ulang halaman.')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [api, location])

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (visibleGroups.some(group => group.fields.some(([key]) => !settings[key].trim()))) {
      setStatus('Lengkapi semua isian sebelum menyimpan.')
      return
    }
    try {
      if (!['http:', 'https:'].includes(new URL(settings.contact_map_url).protocol)) throw new Error()
    } catch {
      setStatus('Link Google Maps harus diawali https:// atau http://.')
      return
    }
    setSaving(true)
    setStatus('')
    try {
      const response = await adminFetch(`${api}/api/settings`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(visibleGroups.flatMap(group => group.fields.map(([key]) => [contactSettingKey(key, location), settings[key].trim()])))),
      })
      if (!response.ok) throw new Error()
      setStatus('Pengaturan kontak berhasil disimpan.')
    } catch {
      setStatus('Gagal menyimpan pengaturan. Silakan coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Manajemen Kontak {location === 'padang' ? 'Padang' : 'Painan'}</h2>
        <p className="mt-1 text-sm text-gray-500">Kelola alamat, nomor HP, email, dan peta untuk cabang Anda.</p>
      </div>
      <p role="status" aria-live="polite" className="text-sm text-primary">{loading ? 'Memuat pengaturan...' : status}</p>
      <form onSubmit={save}>
        <fieldset disabled={loading || loadFailed || saving} className="space-y-6 disabled:opacity-60">
          {visibleGroups.map(group => (
            <section key={group.title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-lg font-semibold text-gray-900">{group.title}</h3>
              <div className="grid gap-5 md:grid-cols-2">
                {group.fields.map(([key, label, type = 'text']) => (
                  <div key={key} className={type === 'textarea' ? 'md:col-span-2' : ''}>
                    <label htmlFor={key} className="text-sm font-medium text-gray-700">{label}</label>
                    {type === 'textarea' ? (
                      <textarea id={key} required rows={3} value={settings[key]} onChange={event => setSettings(previous => ({ ...previous, [key]: event.target.value }))} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    ) : (
                      <input id={key} type={type} required step={type === 'number' ? 'any' : undefined} min={type === 'number' ? (key === 'contact_map_latitude' ? -90 : -180) : undefined} max={type === 'number' ? (key === 'contact_map_latitude' ? 90 : 180) : undefined} value={settings[key]} onChange={event => setSettings(previous => ({ ...previous, [key]: event.target.value }))} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
          <button type="submit" className="rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary/90">{saving ? 'Menyimpan...' : 'Simpan Pengaturan Kontak'}</button>
        </fieldset>
      </form>
    </div>
  )
}
