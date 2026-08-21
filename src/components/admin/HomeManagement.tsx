"use client";

import { useState, useEffect, useRef } from "react";
import { Check, X, Upload, Plus, Trash2, GripVertical, Image as ImageIcon, AlignLeft, MapPin } from "lucide-react";
import Image from "next/image";

type Tab = 'hero' | 'order' | 'attractions';

const DEFAULT_SECTIONS = [
  { id: 'hero', label: 'Hero Section' },
  { id: 'trustbar', label: 'Trust Bar (Keunggulan)' },
  { id: 'rooms', label: 'Kamar Pilihan' },
  { id: 'attractions', label: 'Destinasi Wisata' },
  { id: 'gallery', label: 'Galeri Foto' }
];

export default function HomeManagementPage() {
  const [activeTab, setActiveTab] = useState<Tab>('hero');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Hero State
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [selectedHeroFile, setSelectedHeroFile] = useState<File | null>(null);

  // Order State
  const [sectionsOrder, setSectionsOrder] = useState<string[]>([]);

  // Attractions State
  const [attractions, setAttractions] = useState<string[]>([]);
  const [newAttraction, setNewAttraction] = useState("");

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/settings");
      const data = await res.json();
      
      setHeroTitle(data.home_hero_title || "");
      setHeroSubtitle(data.home_hero_subtitle || "");
      setHeroImage(data.home_hero_image || "");

      if (data.home_sections_order) {
        try {
          setSectionsOrder(JSON.parse(data.home_sections_order));
        } catch(e) {}
      } else {
        setSectionsOrder(DEFAULT_SECTIONS.map(s => s.id));
      }

      if (data.tourist_attractions_json) {
        try {
          setAttractions(JSON.parse(data.tourist_attractions_json));
        } catch(e) {}
      } else {
        setAttractions([
          'Pantai Carocok', 'Bukik Langkisau', 'Pulau Cingkuak', 
          'Kawasan Mandeh', 'Air terjun Bayang S', 'Jembatan Akar'
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const showAlert = (type: 'success'|'error', text: string) => {
    setAlertMessage({type, text});
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const handleSaveHeroText = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("http://localhost:5000/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          home_hero_title: heroTitle,
          home_hero_subtitle: heroSubtitle
        })
      });
      if (!res.ok) throw new Error();
      showAlert('success', 'Teks Hero berhasil disimpan!');
    } catch (err) {
      showAlert('error', 'Gagal menyimpan teks Hero');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveHeroImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHeroFile) return;

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedHeroFile);

      const res = await fetch("http://localhost:5000/api/settings/upload-hero", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      setHeroImage(data.imageUrl);
      setSelectedHeroFile(null);
      showAlert('success', 'Gambar Hero berhasil diperbarui!');
    } catch (err) {
      showAlert('error', 'Gagal mengunggah gambar Hero');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveOrder = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("http://localhost:5000/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          home_sections_order: JSON.stringify(sectionsOrder)
        })
      });
      if (!res.ok) throw new Error();
      showAlert('success', 'Urutan beranda berhasil disimpan!');
    } catch (err) {
      showAlert('error', 'Gagal menyimpan urutan');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...sectionsOrder];
    const temp = newOrder[index - 1];
    newOrder[index - 1] = newOrder[index];
    newOrder[index] = temp;
    setSectionsOrder(newOrder);
  };

  const handleMoveDown = (index: number) => {
    if (index === sectionsOrder.length - 1) return;
    const newOrder = [...sectionsOrder];
    const temp = newOrder[index + 1];
    newOrder[index + 1] = newOrder[index];
    newOrder[index] = temp;
    setSectionsOrder(newOrder);
  };

  const handleSaveAttractions = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("http://localhost:5000/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourist_attractions_json: JSON.stringify(attractions)
        })
      });
      if (!res.ok) throw new Error();
      showAlert('success', 'Daftar wisata berhasil disimpan!');
    } catch (err) {
      showAlert('error', 'Gagal menyimpan daftar wisata');
    } finally {
      setIsSaving(false);
    }
  };

  const addAttraction = () => {
    if (newAttraction.trim() && !attractions.includes(newAttraction.trim())) {
      setAttractions([...attractions, newAttraction.trim()]);
      setNewAttraction("");
    }
  };

  const removeAttraction = (index: number) => {
    const newAttrs = [...attractions];
    newAttrs.splice(index, 1);
    setAttractions(newAttrs);
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center">Memuat data...</div>;
  }

  return (
    <div className="space-y-6 relative w-full">
      {/* Custom Toast Alert */}
      {alertMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`flex items-center gap-3 rounded-xl px-5 py-3.5 text-white shadow-lg ${alertMessage.type === 'success' ? 'bg-mint-ink' : 'bg-red-600'}`}>
            {alertMessage.type === 'success' ? <Check size={20} /> : <X size={20} />}
            <p className="text-base font-medium">{alertMessage.text}</p>
            <button onClick={() => setAlertMessage(null)} className="ml-2 text-white/70 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-gray-900">Pengaturan Beranda</h2>
        <p className="text-sm text-gray-500 mt-1">Kelola konten, gambar, dan tata letak halaman utama (Home).</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'hero' ? 'text-primary' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ImageIcon size={18} />
          Hero Section
          {activeTab === 'hero' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab('order')}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'order' ? 'text-primary' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <AlignLeft size={18} />
          Urutan Konten
          {activeTab === 'order' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab('attractions')}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'attractions' ? 'text-primary' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <MapPin size={18} />
          Destinasi Wisata
          {activeTab === 'attractions' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
        </button>
      </div>

      <div className="pt-4">
        {/* TAB: HERO SECTION */}
        {activeTab === 'hero' && (
          <div className="space-y-8">
            <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Teks Utama Hero</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Judul Utama</label>
                  <input 
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Hannah Hotel Syari'ah"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Deskripsi / Subjudul</label>
                  <textarea 
                    rows={3}
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Find a hotel close to the tourist attraction..."
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={handleSaveHeroText}
                  disabled={isSaving}
                  className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Teks'}
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Gambar Latar Belakang (Hero Image)</h3>
              
              {heroImage && (
                <div className="relative w-full h-64 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                  <Image 
                    src={heroImage.startsWith('http') ? heroImage : `http://localhost:5000${heroImage}`} 
                    alt="Hero" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary">
                    Gambar Saat Ini
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSaveHeroImage} className="space-y-4">
                <label 
                  htmlFor="hero-upload"
                  className="mt-1 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-10 hover:bg-gray-50 hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <Upload className="h-10 w-10 text-gray-400 mb-4" />
                  <div className="text-sm leading-6 text-gray-600 text-center">
                    <span className="font-semibold text-primary hover:text-mint-ink transition-colors">Klik untuk memilih foto baru</span>
                  </div>
                  <p className="text-xs leading-5 text-gray-500 mt-1">Disarankan: 1920x1080 (Landscape). Format: JPG, PNG, WEBP maks 5MB.</p>
                  
                  {selectedHeroFile && (
                    <div className="mt-4 inline-flex items-center px-4 py-1.5 rounded-full bg-mint/10 text-primary text-sm font-medium border border-mint/20">
                      <Check size={16} className="mr-2" />
                      File terpilih: {selectedHeroFile.name}
                    </div>
                  )}
                  
                  <input 
                    id="hero-upload" 
                    type="file" 
                    className="sr-only" 
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) => setSelectedHeroFile(e.target.files?.[0] || null)}
                  />
                </label>

                <div className="flex justify-end pt-2">
                  <button 
                    type="submit"
                    disabled={isSaving || !selectedHeroFile}
                    className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isSaving ? 'Mengunggah...' : 'Unggah & Simpan Gambar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB: ORDER */}
        {activeTab === 'order' && (
          <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Urutan Konten Beranda</h3>
              <p className="text-sm text-gray-500">
                Atur urutan bagian yang tampil di halaman depan. Bagian paling atas (Hero) disarankan tidak dipindah, tetapi Anda bebas mengaturnya.
              </p>
            </div>

            <div className="space-y-2 mt-6">
              {sectionsOrder.map((sectionId, index) => {
                const sectionInfo = DEFAULT_SECTIONS.find(s => s.id === sectionId);
                if (!sectionInfo) return null;
                return (
                  <div key={sectionId} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-gray-400 bg-white p-1.5 border border-gray-200 rounded shadow-sm">
                        <GripVertical size={18} />
                      </div>
                      <span className="font-medium text-gray-700">
                        <span className="inline-block w-6 text-gray-400">{index + 1}.</span> 
                        {sectionInfo.label}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button 
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="text-gray-400 hover:text-primary hover:bg-primary/10 rounded p-1 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-colors"
                        title="Geser ke atas"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"/></svg>
                      </button>
                      <button 
                        onClick={() => handleMoveDown(index)}
                        disabled={index === sectionsOrder.length - 1}
                        className="text-gray-400 hover:text-primary hover:bg-primary/10 rounded p-1 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-colors"
                        title="Geser ke bawah"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100 mt-6">
              <button 
                onClick={handleSaveOrder}
                disabled={isSaving}
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
              >
                {isSaving ? 'Menyimpan...' : 'Simpan Urutan'}
              </button>
            </div>
          </div>
        )}

        {/* TAB: ATTRACTIONS */}
        {activeTab === 'attractions' && (
          <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Destinasi Wisata Terdekat</h3>
              <p className="text-sm text-gray-500">
                Kelola daftar tempat wisata yang ditampilkan di halaman beranda.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="text" 
                value={newAttraction}
                onChange={(e) => setNewAttraction(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAttraction();
                  }
                }}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary w-full"
                placeholder="Tambah destinasi wisata (contoh: Pantai Carocok)"
              />
              <button
                type="button"
                onClick={addAttraction}
                className="inline-flex justify-center items-center gap-2 rounded-lg border border-primary bg-white px-5 py-2.5 text-sm font-medium text-primary hover:bg-primary hover:text-white transition-colors w-full sm:w-auto shrink-0"
              >
                <Plus size={18} />
                Tambah
              </button>
            </div>

            <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
              {attractions.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">Belum ada daftar wisata.</div>
              ) : (
                <ul className="divide-y divide-gray-200 bg-white">
                  {attractions.map((attr, idx) => (
                    <li key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <MapPin size={18} className="text-orange" />
                        <span className="font-medium text-gray-800">{attr}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeAttraction(idx)} 
                        className="text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded-md hover:bg-red-50"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100 mt-6">
              <button 
                onClick={handleSaveAttractions}
                disabled={isSaving}
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
              >
                {isSaving ? 'Menyimpan...' : 'Simpan Daftar Wisata'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
