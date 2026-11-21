"use client";

import { usePathname } from 'next/navigation';
import { adminApi, adminFetch, adminLocation } from '@/lib/admin-api';
import { resolveImageUrl } from '@/lib/api';
import { useState, useEffect } from "react";
import { Plus, Trash2, X, Upload, Check } from "lucide-react";
import Image from "next/image";

export default function GalleryManagementPage() {
  const location = adminLocation(usePathname());
  const api = adminApi(location);
  const label = location === 'padang' ? 'Padang' : 'Painan';
  const subtitleKey = location === 'padang' ? 'galleries_subtitle_padang' : 'galleries_subtitle';

  const [galleries, setGalleries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({ title: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [galleriesSubtitle, setGalleriesSubtitle] = useState("");
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const fetchGalleries = async () => {
    setIsLoading(true);
    try {
      const res = await adminFetch(`${api}/api/galleries/manage`);
      const data = await res.json();
      setGalleries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setGalleries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await adminFetch(`${api}/api/settings?keys=${subtitleKey}`);
      const data = await res.json();
      if (data[subtitleKey]) setGalleriesSubtitle(data[subtitleKey]);
      else setGalleriesSubtitle("");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    Promise.all([
      adminFetch(`${api}/api/galleries/manage`).then((r) => r.json()).catch(() => []),
      adminFetch(`${api}/api/settings?keys=${subtitleKey}`).then((r) => r.json()).catch(() => ({})),
    ]).then(([galData, settingsData]) => {
      if (!active) return;
      setGalleries(Array.isArray(galData) ? galData : []);
      setGalleriesSubtitle(settingsData?.[subtitleKey] || "");
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
        body: JSON.stringify({ [subtitleKey]: galleriesSubtitle })
      });
      if (!res.ok) throw new Error();
      setAlertMessage("Subtitle halaman berhasil disimpan!");
      setTimeout(() => setAlertMessage(null), 3000);
    } catch {
      setAlertMessage("Gagal menyimpan subtitle");
      setTimeout(() => setAlertMessage(null), 3000);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus foto ini dari galeri?")) return;
    
    try {
      const res = await adminFetch(`${api}/api/galleries/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Gagal menghapus foto");
      fetchGalleries();
    } catch (err: any) {
      console.error(err);
      setAlertMessage("Gagal menghapus foto");
      setTimeout(() => setAlertMessage(null), 3000);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Harap pilih file gambar terlebih dahulu");
      return;
    }
    
    setIsSaving(true);
    try {
      const data = new FormData();
      data.append("location", location);
      data.append("title", formData.title);
      data.append("image", selectedFile);

      const res = await adminFetch(`${api}/api/galleries`, {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        throw new Error("Gagal mengunggah foto");
      }

      setIsModalOpen(false);
      setFormData({ title: "" });
      setSelectedFile(null);
      fetchGalleries();
    } catch (err: any) {
      setAlertMessage(err.message || "Gagal mengunggah foto");
      setTimeout(() => setAlertMessage(null), 3000);
    } finally {
      setIsSaving(false);
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
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Galeri {label}</h2>
          <p className="text-sm text-gray-500">
            Kelola foto-foto galeri hotel cabang {label}. {galleries.length} foto tersedia. 
            (6 foto terbaru akan tampil di Beranda {label}).
          </p>
        </div>
        <button 
          onClick={() => {
            setFormData({ title: "" });
            setSelectedFile(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          Tambah Foto
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Pengaturan Halaman</h3>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Penjelasan Singkat (Subtitle)</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <textarea 
              rows={2}
              value={galleriesSubtitle}
              onChange={(e) => setGalleriesSubtitle(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder={`Jelajahi keindahan dan kenyamanan yang ditawarkan oleh Hannah Hotel ${label}...`}
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

      {isLoading ? (
        <div className="text-center py-10">Memuat data galeri...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {galleries.map((img, index) => (
            <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm border border-gray-200">
              {img.imageUrl ? (
                <Image 
                  src={resolveImageUrl(img.imageUrl)}
                  alt={img.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  loading={index < 5 ? "eager" : "lazy"}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No Image</div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <p className="text-white text-sm font-medium truncate mb-2">{img.title}</p>
                <button 
                  onClick={() => handleDelete(img.id)}
                  className="w-full py-1.5 flex justify-center items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-semibold transition-colors"
                >
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            </div>
          ))}
          {galleries.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              Belum ada foto di galeri {label}. Klik tombol &quot;Tambah Foto&quot; untuk mulai mengunggah.
            </div>
          )}
        </div>
      )}

      {/* Modal Tambah Foto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">Tambah Foto Galeri {label}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form className="p-6 space-y-5" onSubmit={handleFormSubmit}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Judul Foto (Opsional)</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-mint focus:outline-none focus:ring-1 focus:ring-mint"
                  placeholder="Contoh: Tampak depan hotel"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">File Gambar</label>
                <label 
                  htmlFor="gallery-upload"
                  className="mt-1 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 px-6 py-8 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Upload className="h-10 w-10 text-gray-400 mb-4" />
                  <div className="text-sm leading-6 text-gray-600 text-center">
                    <span className="font-semibold text-primary hover:text-orange">Klik untuk unggah</span>
                    <p>atau drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-500 mt-1">PNG, JPG, WEBP maks 5MB</p>
                  
                  {selectedFile && (
                    <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-mint/10 text-primary text-sm font-medium max-w-full truncate">
                      {selectedFile.name}
                    </div>
                  )}
                  
                  <input 
                    id="gallery-upload" 
                    type="file" 
                    className="sr-only" 
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    required
                  />
                </label>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isSaving || !selectedFile}
                  className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Mengunggah...' : 'Unggah Foto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
