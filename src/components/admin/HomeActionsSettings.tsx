"use client"

import { adminFetch } from '@/lib/admin-api';
import { useEffect, useState } from 'react'
import { DEFAULT_WHATSAPP, DEFAULT_REVIEW_URL, normalizeWhatsApp, validReviewUrl } from '@/lib/home-actions'

export default function HomeActionsSettings() {
  const [phone, setPhone] = useState(DEFAULT_WHATSAPP)
  const [review, setReview] = useState(DEFAULT_REVIEW_URL)
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const response = await adminFetch('http://localhost:5000/api/settings')
        if (!response.ok) throw new Error()
        const data = await response.json()
        setPhone(data.home_whatsapp_number || DEFAULT_WHATSAPP)
        setReview(data.home_review_url || DEFAULT_REVIEW_URL)
      } catch {
        setLoadFailed(true)
        setMessage('Gagal memuat pengaturan. Muat ulang halaman untuk mencoba kembali.')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedPhone = normalizeWhatsApp(phone)
    if (!normalizedPhone) {
      setMessage('Masukkan nomor WhatsApp yang valid, misalnya 08116617717 atau +628116617717.')
      return
    }
    if (!validReviewUrl(review.trim())) {
      setMessage('Masukkan link formulir lengkap dengan https:// atau http://.')
      return
    }
    setSaving(true)
    setMessage('')
    try {
      const response = await adminFetch('http://localhost:5000/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ home_whatsapp_number: normalizedPhone, home_review_url: review.trim() }),
      })
      if (!response.ok) throw new Error()
      setPhone(normalizedPhone)
      setReview(review.trim())
      setMessage('Pengaturan tombol Home berhasil disimpan.')
    } catch {
      setMessage('Gagal menyimpan pengaturan. Silakan coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={save} className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
      <div>
        <h3 className="text-xl font-bold text-gray-900">Tombol WhatsApp & Review</h3>
        <p className="mt-1 text-sm text-gray-500">Atur tujuan dua tombol mengambang di halaman Home.</p>
      </div>
      <fieldset disabled={loading || loadFailed || saving} className="grid gap-5 disabled:opacity-60 sm:grid-cols-2">
        <div>
          <label htmlFor="home-whatsapp" className="text-sm font-semibold text-gray-700">Nomor WhatsApp hotel</label>
          <input id="home-whatsapp" type="tel" required value={phone} onChange={event => setPhone(event.target.value)} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" placeholder="08116617717" />
          <p className="mt-2 text-xs text-gray-500">Gunakan 08 atau kode negara, misalnya +62. Nomor 08 otomatis diubah menjadi 62.</p>
        </div>
        <div>
          <label htmlFor="home-review" className="text-sm font-semibold text-gray-700">Link form review</label>
          <input id="home-review" type="url" required value={review} onChange={event => setReview(event.target.value)} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" placeholder="https://forms.gle/..." />
          <p className="mt-2 text-xs text-gray-500">Formulir dibuka saat pengunjung menekan Write a Review.</p>
        </div>
        <button type="submit" className="justify-self-start rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary/90">{loading ? 'Memuat...' : saving ? 'Menyimpan...' : 'Simpan Pengaturan Tombol'}</button>
      </fieldset>
      <p role="status" aria-live="polite" className="text-sm text-gray-700">{message}</p>
    </form>
  )
}
