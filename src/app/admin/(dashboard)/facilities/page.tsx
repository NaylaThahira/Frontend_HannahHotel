"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Check } from "lucide-react";
import * as LucideIcons from 'lucide-react';
import IconPicker from "@/components/IconPicker";

export default function FacilityManagementPage() {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<any>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [facilityToDelete, setFacilityToDelete] = useState<number | null>(null);
  const [facilitiesSubtitle, setFacilitiesSubtitle] = useState("");
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "Check",
  });

  const fetchFacilities = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/facilities");
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
      const res = await fetch("http://localhost:5000/api/settings");
      const data = await res.json();
      if (data.facilities_subtitle) setFacilitiesSubtitle(data.facilities_subtitle);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFacilities();
    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const res = await fetch("http://localhost:5000/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facilities_subtitle: facilitiesSubtitle })
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
        name: facility.name || "",
        description: facility.description || "",
        icon: facility.icon || "Check",
      });
    } else {
      setFormData({ name: "", description: "", icon: "Check" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingFacility(null);
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const url = editingFacility 
        ? `http://localhost:5000/api/facilities/${editingFacility.id}`
        : "http://localhost:5000/api/facilities";
        
      const method = editingFacility ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

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

  const confirmDelete = async () => {
    if (!facilityToDelete) return;
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/facilities/${facilityToDelete}`, {
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
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Fasilitas</h2>
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ikon</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Fasilitas</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {facilities.map((fac) => {
                const IconComp = (LucideIcons as any)[fac.icon] || Check;
                return (
                <tr key={fac.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#e8f5ee] text-[#1e6b3e]">
                      <IconComp size={24} />
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{fac.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate" title={fac.description}>{fac.description}</div>
                  </td>
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
          <div className="w-full max-w-lg flex flex-col rounded-xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 shrink-0">
              <h3 className="text-lg font-bold text-gray-900">
                {editingFacility ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form className="p-6 space-y-5 flex-1" onSubmit={handleFormSubmit}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Ikon Fasilitas</label>
                <div className="w-full">
                  <IconPicker 
                    value={formData.icon}
                    onChange={(val) => setFormData({...formData, icon: val})}
                  />
                </div>
              </div>

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
