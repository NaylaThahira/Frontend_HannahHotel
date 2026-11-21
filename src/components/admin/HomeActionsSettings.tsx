"use client"

import { adminApi, adminFetch, adminLocation } from '@/lib/admin-api';
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  DEFAULT_REVIEW_URL_PADANG,
  DEFAULT_REVIEW_URL_PAINAN,
  DEFAULT_WHATSAPP_PADANG,
  DEFAULT_WHATSAPP_PAINAN,
  normalizeWhatsApp,
  validReviewUrl,
} from '@/lib/home-actions'

interface HomeActionsSettingsProps {
  initialWhatsapp?: string;
  initialReviewUrl?: string;
}

export default function HomeActionsSettings({ initialWhatsapp, initialReviewUrl }: HomeActionsSettingsProps = {}) {
  const pathname = usePathname();
  const location = adminLocation(pathname);
  const isPadang = location === 'padang';
  const whatsappKey = isPadang ? 'home_whatsapp_number_padang' : 'home_whatsapp_number';
  const reviewUrlKey = isPadang ? 'home_review_url_padang' : 'home_review_url';
  const defaultWhatsapp = isPadang ? DEFAULT_WHATSAPP_PADANG : DEFAULT_WHATSAPP_PAINAN;
  const defaultReviewUrl = isPadang ? DEFAULT_REVIEW_URL_PADANG : DEFAULT_REVIEW_URL_PAINAN;

  const hasInitialProps = initialWhatsapp !== undefined || initialReviewUrl !== undefined;
  const [phone, setPhone] = useState(initialWhatsapp || defaultWhatsapp)
  const [review, setReview] = useState(initialReviewUrl !== undefined ? initialReviewUrl : defaultReviewUrl)
  const [loading, setLoading] = useState(!hasInitialProps)
  const [loadFailed, setLoadFailed] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (hasInitialProps) {
      setPhone(initialWhatsapp || defaultWhatsapp)
      setReview(initialReviewUrl !== undefined ? initialReviewUrl : defaultReviewUrl)
      setLoading(false)
      return
    }
    async function load() {
      try {
        const response = await adminFetch(`${adminApi(location)}/api/settings?keys=${whatsappKey},${reviewUrlKey}`)
        if (!response.ok) throw new Error()
        const data = await response.json()
        setPhone(data[whatsappKey] || defaultWhatsapp)
        setReview(data[reviewUrlKey] !== undefined ? data[reviewUrlKey] : defaultReviewUrl)
      } catch {
        setLoadFailed(true)
        setMessage('Gagal memuat pengaturan. Muat ulang halaman untuk mencoba kembali.')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [hasInitialProps, initialWhatsapp, initialReviewUrl, location, whatsappKey, reviewUrlKey, defaultWhatsapp, defaultReviewUrl])

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedPhone = normalizeWhatsApp(phone)
    if (!normalizedPhone) {
      setMessage('Masukkan nomor WhatsApp yang valid, misalnya 08116670024 atau +628116670024.')
      return
    }
    const trimmedReview = review.trim()
    if (trimmedReview && !validReviewUrl(trimmedReview)) {
      setMessage('Masukkan link formulir lengkap dengan https:// atau http://, atau kosongkan jika belum tersedia.')
      return
    }
    setSaving(true)
    setMessage('')
    try {
      const response = await adminFetch(`${adminApi(location)}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [whatsappKey]: normalizedPhone, [reviewUrlKey]: trimmedReview }),
      })
      if (!response.ok) throw new Error()
      setPhone(normalizedPhone)
      setReview(trimmedReview)
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
        <h3 className="text-xl font-bold text-gray-900">Tombol WhatsApp & Review ({isPadang ? 'Padang' : 'Painan'})</h3>
        <p className="mt-1 text-sm text-gray-500">Atur tujuan tombol mengambang di halaman Home cabang {isPadang ? 'Padang' : 'Painan'}.</p>
      </div>
      <fieldset disabled={loading || loadFailed || saving} className="grid gap-5 disabled:opacity-60 sm:grid-cols-2">
        <div>
          <label htmlFor="home-whatsapp" className="text-sm font-semibold text-gray-700">Nomor WhatsApp hotel</label>
          <input id="home-whatsapp" type="tel" required value={phone} onChange={event => setPhone(event.target.value)} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" placeholder={isPadang ? '08116670024' : '08116617717'} />
          <p className="mt-2 text-xs text-gray-500">Gunakan 08 atau kode negara, misalnya +62. Nomor 08 otomatis diubah menjadi 62.</p>
        </div>
        <div>
          <label htmlFor="home-review" className="text-sm font-semibold text-gray-700">Link form review (opsional)</label>
          <input id="home-review" type="url" value={review} onChange={event => setReview(event.target.value)} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" placeholder="https://forms.gle/... (kosongkan jika belum ada)" />
          <p className="mt-2 text-xs text-gray-500">Jika dikosongkan, tombol Write a Review tidak ditampilkan di halaman cabang ini.</p>
        </div>
        <button type="submit" className="justify-self-start rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary/90">{loading ? 'Memuat...' : saving ? 'Menyimpan...' : 'Simpan Pengaturan Tombol'}</button>
      </fieldset>
      <p role="status" aria-live="polite" className="text-sm text-gray-700">{message}</p>
    </form>
  )
}
