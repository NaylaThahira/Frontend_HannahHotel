"use client";

import BranchLocationField from '@/components/BranchLocationField';
import { usePathname } from 'next/navigation';
import { adminApi, adminLocation, adminFetch } from '@/lib/admin-api';
import { resolveImageUrl } from '@/lib/api';
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Check, Upload } from "lucide-react";
import { getHotelIcon } from '@/lib/hotel-icons';
import Image from "next/image";
import IconPicker from "@/components/IconPicker";

export default function FacilityManagementPage() {
  const location = adminLocation(usePathname());
  const api = adminApi(location);
  const subtitleKey = location === 'padang' ? 'facilities_subtitle_padang' : 'facilities_subtitle';
  const [facilities, setFacilities] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<any>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [facilityToDelete, setFacilityToDelete] = useState<number | null>(null);
  const [facilitiesSubtitle, setFacilitiesSubtitle] = useState("");
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const [formData, setFormData] = useState({
    location,
    name: "",
    description: "",
    icon: "Check",
    price: "",
    facilities: [] as { name: string; icon: string }[],
  });
  const [newItemName, setNewItemName] = useState("");
  const [newItemIcon, setNewItemIcon] = useState("Check");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchFacilities = async () => {
    setIsLoading(true);
    try {
      const res = await adminFetch(`${api}/api/facilities/manage`);
      const data = await res.json();
      setFacilities(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await adminFetch(`${api}/api/settings?keys=${subtitleKey}`);
      const data = await res.json();
      if (data[subtitleKey]) setFacilitiesSubtitle(data[subtitleKey]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    Promise.all([
      adminFetch(`${api}/api/facilities/manage`).then((r) => r.json()).catch(() => []),
      adminFetch(`${api}/api/settings?keys=${subtitleKey}`).then((r) => r.json()).catch(() => ({})),
    ]).then(([facData, settingsData]) => {
      if (!active) return;
      setFacilities(Array.isArray(facData) ? facData : []);
      if (settingsData?.[subtitleKey]) setFacilitiesSubtitle(settingsData[subtitleKey]);
      setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, [api, subtitleKey]);

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const res = await adminFetch(`${api}/api/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [subtitleKey]: facilitiesSubtitle })
      });
      if (!res.ok) throw new Error();
      setAlertMessage("Subtitle halaman berhasil disimpan!");
      setTimeout(() => setAlertMessage(null), 3000);
    } catch (err) {
      setAlertMessage("Gagal menyimpan subtitle");
      setTimeout(() => setAlertMessage(null), 3000);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const openModal = (facility: any = null) => {
    setEditingFacility(facility);
    if (facility) {
      setFormData({
        location: facility.location || location,
        name: facility.name || "",
        description: facility.description || "",
        icon: facility.icon || "Check",
        price: facility.price || "",
        facilities: (facility.facilities || []).map((item: any) => typeof item === 'string' ? { name: item, icon: 'Check' } : item),
      });
    } else {
      setFormData({ location, name: "", description: "", icon: "Check", price: "", facilities: [] });
    }
    setNewItemName(""); setNewItemIcon("Check"); setSelectedFile(null); setPreviewUrl(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingFacility(null);
    setIsModalOpen(false);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const url = editingFacility 
        ? `${api}/api/facilities/${editingFacility.id}`
        : `${api}/api/facilities`;
        
      const method = editingFacility ? "PUT" : "POST";

      const data = new FormData();
      data.append("location", location); data.append("name", formData.name); data.append("description", formData.description); data.append("icon", formData.icon); data.append("price", formData.price); data.append("facilities", JSON.stringify(formData.facilities));
      if (selectedFile) data.append("image", selectedFile);
      const res = await adminFetch(url, { method, body: data });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menyimpan data");
      }

      closeModal();
      fetchFacilities();
    } catch (err: any) {
      setAlertMessage(err.message || "Gagal menyimpan data fasilitas");
      setTimeout(() => setAlertMessage(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setFacilityToDelete(id);
  };

  const addDetail = () => {
    const name = newItemName.trim();
    if (!name || formData.facilities.some((item) => item.name === name)) return;
    setFormData({ ...formData, facilities: [...formData.facilities, { name, icon: newItemIcon }] });
    setNewItemName("");
  };

  const confirmDelete = async () => {
    if (!facilityToDelete) return;
    setIsLoading(true);
    try {
      const res = await adminFetch(`${api}/api/facilities/${facilityToDelete}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Gagal menghapus fasilitas");
      fetchFacilities();
    } catch (err: any) {
      console.error(err);
      setAlertMessage("Gagal menghapus fasilitas");
      setTimeout(() => setAlertMessage(null), 3000);
    } finally {
      setIsLoading(false);
      setFacilityToDelete(null);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Custom Toast Alert */}
      {alertMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`flex items-center gap-3 rounded-xl px-5 py-3.5 text-white shadow-lg ${alertMessage.toLowerCase().includes('gagal') || alertMessage.toLowerCase().includes('maksimal') ? 'bg-red-600' : 'bg-mint-ink'}`}>
            {alertMessage.toLowerCase().includes('gagal') || alertMessage.toLowerCase().includes('maksimal') ? <X size={20} /> : <Check size={20} />}
            <p className="text-sm font-medium">{alertMessage}</p>
            <button onClick={() => setAlertMessage(null)} className="ml-2 text-white/70 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Fasilitas {location === 'padang' ? 'Padang' : 'Painan'}</h2>
          <p className="text-sm text-gray-500">Kelola daftar fasilitas hotel yang ditampilkan di halaman publik.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          Tambah Fasilitas
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Pengaturan Halaman</h3>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Penjelasan Singkat (Subtitle)</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <textarea 
              rows={2}
              value={facilitiesSubtitle}
              onChange={(e) => setFacilitiesSubtitle(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Berbagai fasilitas kelas satu yang kami siapkan..."
            />
            <button 
              onClick={handleSaveSettings}
              disabled={isSavingSettings}
              className="shrink-0 h-fit rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSavingSettings ? 'Menyimpan...' : 'Simpan Subtitle'}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gambar</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Fasilitas</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {facilities.map((fac) => {
                const IconComp = getHotelIcon(fac.icon);
                return (
                <tr key={fac.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="relative flex h-14 w-20 items-center justify-center overflow-hidden rounded-md bg-[#e8f5ee] text-[#1e6b3e]">{fac.imageUrl ? <Image src={resolveImageUrl(fac.imageUrl)} alt={fac.name} fill sizes="80px" className="object-cover" /> : <IconComp size={24} />}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{fac.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate" title={fac.description}>{fac.description}</div>
                    <div className="mt-1 text-xs text-gray-400">{(fac.facilities || []).length} detail fasilitas</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{fac.price || '-'}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => openModal(fac)}
                        className="text-orange hover:text-orange-ink transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(fac.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 shrink-0">
              <h3 className="text-lg font-bold text-gray-900">
                {editingFacility ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form className="p-6 space-y-5 overflow-y-auto flex-1" onSubmit={handleFormSubmit}>
              <BranchLocationField value={formData.location} ownLocation={location} onChange={value => setFormData({ ...formData, location: value })} />
              <div className="space-y-2"><label className="block text-sm font-medium text-gray-700">Ikon Fasilitas</label><IconPicker value={formData.icon} onChange={(icon) => setFormData({...formData, icon})} /></div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2"><label className="block text-sm font-medium text-gray-700">Harga</label><input type="text" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="Contoh: Rp50.000 / jam" /></div>
                <div className="space-y-2"><label className="block text-sm font-medium text-gray-700">Foto Fasilitas</label><label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"><Upload size={18} /> Unggah gambar<input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => { const file = e.target.files?.[0] || null; setSelectedFile(file); if (file) { if (previewUrl) URL.revokeObjectURL(previewUrl); setPreviewUrl(URL.createObjectURL(file)); } }} /></label></div>
              </div>
              {(previewUrl || editingFacility?.imageUrl) && <div className="relative h-36 w-56 overflow-hidden rounded-md border"><Image src={previewUrl || resolveImageUrl(editingFacility.imageUrl)} alt="Pratinjau fasilitas" fill sizes="224px" className="object-cover" /></div>}

              <div className="space-y-2"><label className="block text-sm font-medium text-gray-700">Detail Fasilitas</label><div className="flex gap-2"><div className="w-40"><IconPicker value={newItemIcon} onChange={setNewItemIcon} /></div><input type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addDetail(); } }} className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="Contoh: WiFi gratis" /><button type="button" onClick={addDetail} className="rounded-md border border-primary px-3 text-sm font-medium text-primary hover:bg-primary hover:text-white">Tambah</button></div>{formData.facilities.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{formData.facilities.map((item, index) => { const ItemIcon = getHotelIcon(item.icon); return <span key={`${item.name}-${index}`} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-xs"><ItemIcon size={14} />{item.name}<button type="button" onClick={() => setFormData({...formData, facilities: formData.facilities.filter((_, i) => i !== index)})} className="ml-1 text-red-500"><X size={14} /></button></span> })}</div>}</div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nama Fasilitas</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-mint focus:outline-none focus:ring-1 focus:ring-mint"
                  placeholder="Contoh: Swimming Pool"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-mint focus:outline-none focus:ring-1 focus:ring-mint"
                  placeholder="Penjelasan singkat mengenai fasilitas..."
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
                <button 
                  type="button" 
                  onClick={closeModal}
                  disabled={isLoading}
                  className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {facilityToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl overflow-hidden p-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-5">
              <Trash2 className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Fasilitas</h3>
            <p className="text-sm text-gray-500 mb-6">
              Apakah Anda yakin ingin menghapus fasilitas ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setFacilityToDelete(null)}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={confirmDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {isLoading ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
