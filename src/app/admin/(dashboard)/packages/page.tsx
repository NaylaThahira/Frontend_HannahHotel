"use client";

import BranchLocationField from '@/components/BranchLocationField';
import { usePathname } from 'next/navigation';
import { adminApi, adminLocation, adminFetch } from '@/lib/admin-api';
import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, Edit2, Plus, Trash2, Upload, X } from "lucide-react";

type HotelPackage = { id: number; name: string; description: string; included: string[]; imageUrl: string; location: string };
type FormData = { location: string; name: string; description: string; included: string[] };
const emptyForm: FormData = { location: "painan", name: "", description: "", included: [] };

const imageSrc = (value: string) => value?.startsWith("http") ? value : `http://localhost:5000${value}`;

export default function PackageManagementPage() {
    const location = adminLocation(usePathname());
    const api = adminApi(location);
    const [items, setItems] = useState<HotelPackage[]>([]);
    const [editing, setEditing] = useState<HotelPackage | null>(null);
    const [form, setForm] = useState<FormData>(emptyForm);
    const [newIncluded, setNewIncluded] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const load = async () => {
        const res = await adminFetch(`${api}/api/packages/manage`);
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
    };
    useEffect(() => {
        let active = true;
        adminFetch(`${api}/api/packages/manage`)
            .then((res) => res.json())
            .then((data) => { if (active) setItems(Array.isArray(data) ? data : []); })
            .catch(() => { if (active) setNotice("Gagal memuat data paket"); });
        return () => { active = false; };
    }, [api]);

    const open = (item: HotelPackage | null = null) => {
        setIsModalOpen(true);
        setEditing(item);
        setForm(item ? { name: item.name || "", description: item.description || "", included: Array.isArray(item.included) ? item.included : [], location: item.location || location } : { ...emptyForm, location });
        setNewIncluded(""); setFile(null); setPreview(null);
    };

    const close = () => { setIsModalOpen(false); openStateReset(); };
    const openStateReset = () => { setEditing(null); setForm(emptyForm); setNewIncluded(""); setFile(null); setPreview(null); };

    const addIncluded = () => {
        const value = newIncluded.trim();
        if (value) { setForm({ ...form, included: [...form.included, value] }); setNewIncluded(""); }
    };

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        const data = new FormData();
        data.append("location", form.location); data.append("name", form.name); data.append("description", form.description); data.append("included", JSON.stringify(form.included));
        if (file) data.append("image", file);
        const res = await adminFetch(editing ? `${api}/api/packages/${editing.id}` : `${api}/api/packages`, { method: editing ? "PUT" : "POST", body: data });
        if (!res.ok) { const body = await res.json(); setNotice(body.error || "Gagal menyimpan paket"); return; }
        close(); await load(); setNotice("Paket berhasil disimpan");
    };

    const remove = async () => {
        if (!deleting) return;
        const res = await adminFetch(`${api}/api/packages/${deleting}`, { method: "DELETE" });
        if (res.ok) { await load(); setNotice("Paket berhasil dihapus"); }
        else setNotice("Gagal menghapus paket");
        setDeleting(null);
    };

    return <div className="relative space-y-6">
        {notice && <div className="fixed right-6 top-6 z-[60] rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white shadow-lg">{notice}<button className="ml-4" onClick={() => setNotice(null)}><X size={16} /></button></div>}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-2xl font-bold text-gray-900">Manajemen Paket {location === 'padang' ? 'Padang' : 'Painan'}</h2><p className="text-sm text-gray-500">Kelola paket hotel yang ditampilkan di halaman publik.</p></div><button onClick={() => open()} className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"><Plus size={18} />Tambah Paket</button></div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Foto</th><th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Nama Paket</th><th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Deskripsi</th><th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Aksi</th></tr></thead><tbody className="divide-y divide-gray-200">{items.map(item => <tr key={item.id}><td className="px-6 py-4"><div className="relative h-14 w-20 overflow-hidden rounded-md bg-[#e8f5ee]">{item.imageUrl ? <Image src={imageSrc(item.imageUrl)} alt={item.name} fill className="object-cover" /> : <Check className="m-auto text-primary" />}</div></td><td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td><td className="max-w-md truncate px-6 py-4 text-sm text-gray-500">{item.description}</td><td className="px-6 py-4 text-right"><button title="Edit" onClick={() => open(item)} className="mr-3 text-orange"><Edit2 size={18} /></button><button title="Hapus" onClick={() => setDeleting(item.id)} className="text-red-500"><Trash2 size={18} /></button></td></tr>)}</tbody></table></div></div>
        <PackageModal ownLocation={location} isOpen={isModalOpen} editing={editing} form={form} setForm={setForm} newIncluded={newIncluded} setNewIncluded={setNewIncluded} addIncluded={addIncluded} file={file} setFile={setFile} preview={preview} setPreview={setPreview} onClose={close} onSubmit={submit} />
        {deleting && <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"><div className="w-full max-w-md rounded-xl bg-white p-6 text-center"><Trash2 className="mx-auto mb-4 text-red-600" size={40} /><h3 className="text-xl font-bold">Hapus Paket?</h3><p className="my-5 text-sm text-gray-500">Data paket dan fotonya akan dihapus.</p><button onClick={() => setDeleting(null)} className="mr-3 rounded-md px-4 py-2 text-sm">Batal</button><button onClick={remove} className="rounded-md bg-red-600 px-4 py-2 text-sm text-white">Ya, Hapus</button></div></div>}
    </div>;
}

function PackageModal({ ownLocation, isOpen, editing, form, setForm, newIncluded, setNewIncluded, addIncluded, file, setFile, preview, setPreview, onClose, onSubmit }: { ownLocation: string; isOpen: boolean; editing: HotelPackage | null; form: FormData; setForm: (value: FormData) => void; newIncluded: string; setNewIncluded: (value: string) => void; addIncluded: () => void; file: File | null; setFile: (value: File | null) => void; preview: string | null; setPreview: (value: string | null) => void; onClose: () => void; onSubmit: (event: React.FormEvent) => void }) {
    if (!isOpen) return null;
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white"><div className="flex items-center justify-between border-b px-6 py-4"><h3 className="font-bold">{editing ? "Edit Paket" : "Tambah Paket Baru"}</h3><button onClick={onClose}><X size={20} /></button></div><form onSubmit={onSubmit} className="space-y-5 overflow-y-auto p-6"><BranchLocationField value={form.location} ownLocation={ownLocation} onChange={value => setForm({ ...form, location: value })} /><div><label className="mb-2 block text-sm font-medium">Nama Paket</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-md border px-3 py-2 text-sm" /></div><div><label className="mb-2 block text-sm font-medium">Deskripsi Paket</label><textarea required rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full rounded-md border px-3 py-2 text-sm" /></div><div><label className="mb-2 block text-sm font-medium">Paket Included</label><div className="flex gap-2"><input value={newIncluded} onChange={e => setNewIncluded(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addIncluded(); } }} className="min-w-0 flex-1 rounded-md border px-3 py-2 text-sm" placeholder="Contoh: Buffet Lunch or Dinner 200 persons" /><button type="button" onClick={addIncluded} className="rounded-md border border-primary px-3 text-sm text-primary">Tambah</button></div><ul className="mt-3 space-y-2">{form.included.map((entry, index) => <li key={`${entry}-${index}`} className="flex items-center justify-between rounded bg-gray-50 px-3 py-2 text-sm"><span>{entry}</span><button type="button" onClick={() => setForm({ ...form, included: form.included.filter((_, i) => i !== index) })} className="text-red-500"><X size={15} /></button></li>)}</ul></div><div><label className="mb-2 block text-sm font-medium">Foto Paket</label><label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-3 py-3 text-sm"><Upload size={18} />{file ? file.name : "Unggah gambar"}<input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={e => { const selected = e.target.files?.[0] || null; setFile(selected); setPreview(selected ? URL.createObjectURL(selected) : null); }} /></label>{(preview || editing?.imageUrl) && <div className="relative mt-3 h-40 w-64 overflow-hidden rounded-md border"><Image src={preview || imageSrc(editing?.imageUrl || "")} alt="Preview paket" fill className="object-cover" /></div>}</div><div className="flex justify-end gap-3 border-t pt-5"><button type="button" onClick={onClose} className="rounded-md px-4 py-2 text-sm">Batal</button><button type="submit" className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-white">Simpan Data</button></div></form></div></div>;
}
