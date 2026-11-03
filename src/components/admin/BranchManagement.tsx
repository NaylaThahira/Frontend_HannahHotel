'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { adminApi, adminFetch, adminLocation } from '@/lib/admin-api';
import { branchImageUrl, type HotelBranch } from '@/lib/branches';

export default function BranchManagement() {
  const location = adminLocation(usePathname());
  const [branch, setBranch] = useState<HotelBranch | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const previewRef = useRef('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    adminFetch(`${adminApi(location)}/api/branches`).then(async response => {
      if (!response.ok) throw new Error('Gagal memuat informasi cabang');
      const branches: HotelBranch[] = await response.json();
      const own = branches.find(item => item.id === location);
      if (!own) throw new Error('Informasi cabang tidak ditemukan');
      if (active) { setBranch(own); setFailed(false); setMessage(''); }
    }).catch(error => { if (active) { setFailed(true); setMessage(error.message); } });
    return () => { active = false; };
  }, [location, version]);

  useEffect(() => () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
  }, []);

  function selectFile(selected: File | null) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = selected ? URL.createObjectURL(selected) : '';
    setPreview(previewRef.current);
    setFile(selected);
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    if (!branch) return;
    setSaving(true); setMessage('');
    try {
      const form = new FormData();
      form.set('title', branch.title); form.set('description', branch.description); form.set('location', branch.location);
      if (file) form.set('image', file);
      const response = await adminFetch(`${adminApi(location)}/api/branches/${location}`, { method: 'PUT', body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Gagal menyimpan informasi cabang');
      setBranch(result); selectFile(null); formElement.reset();
      setFailed(false); setMessage('Informasi cabang berhasil disimpan. Kartu di beranda sudah diperbarui.');
    } catch (error) { setFailed(true); setMessage(error instanceof Error ? error.message : 'Gagal menyimpan informasi cabang'); }
    finally { setSaving(false); }
  }

  const image = preview || (branch?.imageUrl ? branchImageUrl(branch.imageUrl) : '');
  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none';
  return (
    <section id="branch-info" className="scroll-mt-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-bold text-gray-900">Informasi Cabang Hotel</h2>
      <p className="mt-1 text-sm text-gray-500">Kelola kartu Hannah Hotel {location === 'padang' ? 'Padang' : 'Painan'} yang tampil di beranda.</p>
      {message && <p role="status" className={`mt-4 rounded-lg p-3 text-sm ${failed ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-800'}`}>{message}</p>}
      {!branch ? (failed ? <button onClick={() => setVersion(version + 1)} className="mt-4 text-primary underline">Coba lagi</button> : <p className="mt-6">Memuat informasi cabang...</p>) : (
        <form onSubmit={save} className="mt-6 grid gap-8 lg:grid-cols-2">
          <fieldset disabled={saving} className="space-y-4">
            <div><label htmlFor="branch-title" className="mb-2 block text-sm font-semibold">Judul</label><input id="branch-title" className={inputClass} required maxLength={150} value={branch.title} onChange={event => setBranch({ ...branch, title: event.target.value })} /></div>
            <div><label htmlFor="branch-description" className="mb-2 block text-sm font-semibold">Deskripsi</label><textarea id="branch-description" className={inputClass} required rows={4} maxLength={3000} value={branch.description} onChange={event => setBranch({ ...branch, description: event.target.value })} /></div>
            <div><label htmlFor="branch-location" className="mb-2 block text-sm font-semibold">Lokasi / Alamat</label><textarea id="branch-location" className={inputClass} required rows={2} maxLength={500} value={branch.location} onChange={event => setBranch({ ...branch, location: event.target.value })} /></div>
            <div><label htmlFor="branch-image" className="mb-2 block text-sm font-semibold">Gambar Cabang</label><input id="branch-image" type="file" accept="image/jpeg,image/png,image/webp" className={inputClass} onChange={event => {
              const selected = event.target.files?.[0] || null;
              if (selected && (selected.size > 5 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(selected.type))) {
                setFailed(true); setMessage('Pilih gambar JPG, PNG, atau WEBP maksimal 5 MB.'); event.target.value = ''; selectFile(null); return;
              }
              selectFile(selected);
            }} /><p className="mt-2 text-xs text-gray-500">JPG, PNG, WEBP maksimal 5 MB. Kosongkan untuk mempertahankan gambar.</p></div>
            <button type="submit" className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Menyimpan...' : 'Simpan Informasi Cabang'}</button>
          </fieldset>
          <div><p className="mb-3 text-sm font-semibold text-gray-600">Pratinjau Kartu</p><article className="overflow-hidden rounded-lg border border-gray-200 bg-cream">
            <div className="relative h-60 bg-mint/20">{image ? <Image src={image} alt={branch.title} fill className="object-cover" /> : <div className="flex h-full items-center justify-center text-secondary">Belum ada gambar cabang</div>}</div>
            <div className="p-6"><h3 className="font-display text-2xl font-semibold text-primary">{branch.title}</h3><p className="mt-3 whitespace-pre-line text-secondary">{branch.description}</p><p className="mt-4 whitespace-pre-line text-sm font-semibold text-primary">{branch.location}</p><Link href={`/rooms/${branch.id}`} className="mt-6 block rounded border border-primary p-3 text-center text-sm font-bold text-primary">Lihat Detail</Link></div>
          </article></div>
        </form>
      )}
    </section>
  );
}
