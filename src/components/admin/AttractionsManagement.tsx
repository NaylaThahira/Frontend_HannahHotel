'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MapPin, Trash2 } from 'lucide-react';
import { adminApi, adminFetch, adminLocation } from '@/lib/admin-api';
import { attractionsKey, defaultPainanAttractions, parseAttractions } from '@/lib/attractions';

export default function AttractionsManagement({ initialItems = null }: { initialItems?: string[] | null }) {
  const location = adminLocation(usePathname());
  const label = location === 'padang' ? 'Padang' : 'Painan';
  const [items, setItems] = useState<string[] | null>(initialItems);
  const [newItem, setNewItem] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (initialItems !== null && version === 0) {
      setItems(initialItems);
      return;
    }
    let active = true;
    const key = attractionsKey(location);
    adminFetch(`${adminApi(location)}/api/settings?keys=${key}`).then(async response => {
      if (!response.ok) throw new Error('Gagal memuat area akomodasi');
      const settings = await response.json();
      if (active) {
        setItems(parseAttractions(settings[key], location === 'painan' ? defaultPainanAttractions : []));
        setMessage('');
      }
    }).catch(error => { if (active) setMessage(error.message); });
    return () => { active = false; };
  }, [location, version, initialItems]);

  function add() {
    const value = newItem.trim();
    if (!value || !items) return;
    if (items.includes(value)) { setMessage('Area ini sudah ada dalam daftar.'); return; }
    if (items.length >= 50) { setMessage('Maksimal 50 area akomodasi per cabang.'); return; }
    setItems([...items, value]); setNewItem(''); setMessage('');
  }

  async function save() {
    setSaving(true); setMessage('');
    try {
      const response = await adminFetch(`${adminApi(location)}/api/settings`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [attractionsKey(location)]: JSON.stringify(items) })
      });
      if (!response.ok) { const result = await response.json(); throw new Error(result.error || 'Gagal menyimpan area akomodasi'); }
      setMessage(`Area akomodasi ${label} berhasil disimpan.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Gagal menyimpan area akomodasi'); }
    finally { setSaving(false); }
  }

  return (
    <section id="attractions-management" className="scroll-mt-24 space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div><h2 className="text-xl font-bold text-gray-900">Area Akomodasi Hannah Hotel {label}</h2><p className="mt-2 text-sm text-gray-500">Kelola area akomodasi cabang {label} yang ditampilkan di beranda.</p></div>
      {message && <p role="status" className="rounded-lg bg-cream p-3 text-sm text-primary">{message}</p>}
      {items === null ? (message ? <button onClick={() => setVersion(version + 1)} className="text-primary underline">Coba lagi</button> : <p>Memuat area akomodasi...</p>) : <>
        <fieldset disabled={saving} className="space-y-5">
          <div className="flex flex-col gap-2 sm:flex-row"><input aria-label="Nama area akomodasi" value={newItem} maxLength={200} onChange={event => setNewItem(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); add(); } }} placeholder="Tambah area akomodasi" className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm" /><button onClick={add} type="button" className="rounded-lg border border-primary px-5 py-3 text-sm font-semibold text-primary">Tambah</button></div>
          {items.length === 0 ? <p className="rounded-lg bg-cream p-6 text-sm text-secondary">Belum ada area akomodasi untuk cabang {label}.</p> : <ul className="divide-y rounded-lg border border-gray-200">{items.map((item, index) => <li key={`${index}-${item}`} className="flex items-center gap-3 p-4"><MapPin size={18} className="shrink-0 text-orange" /><span className="flex-1 break-words text-sm text-gray-800">{item}</span><button type="button" aria-label={`Hapus ${item}`} onClick={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))} className="p-2 text-red-600"><Trash2 size={18} /></button></li>)}</ul>}
          <button type="button" onClick={save} className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white">{saving ? 'Menyimpan...' : 'Simpan Area Akomodasi'}</button>
        </fieldset>
      </>}
    </section>
  );
}
