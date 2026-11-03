"use client";

import { adminFetch } from '@/lib/admin-api';
import { useState, useEffect } from "react";
import { Plus, Trash2, X, Save, Edit3, GripVertical, Check } from "lucide-react";
import * as LucideIcons from 'lucide-react';
import IconPicker from "@/components/IconPicker";

export default function AboutUsManagementPage() {
  const [activeTab, setActiveTab] = useState<'sejarah' | 'visi-misi'>('sejarah');
  
  const [historySubtitle, setHistorySubtitle] = useState("");
  const [historyQuote, setHistoryQuote] = useState("");
  const [historyContent, setHistoryContent] = useState("");
  
  const [visionSubtitle, setVisionSubtitle] = useState("");
  const [visionText, setVisionText] = useState("");
  const [missions, setMissions] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await adminFetch("http://localhost:5000/api/settings");
      const data = await res.json();
      
      if (data.history_subtitle) setHistorySubtitle(data.history_subtitle);
      if (data.history_quote) setHistoryQuote(data.history_quote);
      if (data.history_content) setHistoryContent(data.history_content);
      if (data.vision_subtitle) setVisionSubtitle(data.vision_subtitle);
      if (data.vision_text) setVisionText(data.vision_text);
      if (data.missions_json) {
        try {
          setMissions(JSON.parse(data.missions_json));
        } catch(e) {}
      }
    } catch (err) {
      console.error(err);
      showAlert('error', 'Gagal memuat pengaturan awal');
    } finally {
      setIsLoading(false);
    }
  };

  const showAlert = (type: 'success' | 'error', text: string) => {
    setAlertMessage({ type, text });
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const handleSaveSejarah = async () => {
    setIsSaving(true);
    try {
      const payload = {
        history_subtitle: historySubtitle,
        history_quote: historyQuote,
        history_content: historyContent
      };
      
      const res = await adminFetch("http://localhost:5000/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error();
      showAlert('success', 'Sejarah berhasil disimpan!');
    } catch (err) {
      showAlert('error', 'Gagal menyimpan sejarah.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveVisiMisi = async () => {
    setIsSaving(true);
    try {
      const payload = {
        vision_subtitle: visionSubtitle,
        vision_text: visionText,
        missions_json: JSON.stringify(missions)
      };
      
      const res = await adminFetch("http://localhost:5000/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error();
      showAlert('success', 'Visi & Misi berhasil disimpan!');
    } catch (err) {
      showAlert('error', 'Gagal menyimpan Visi & Misi.');
    } finally {
      setIsSaving(false);
    }
  };

  const addMission = () => {
    setMissions([...missions, { title: '', desc: '', icon: 'Check' }]);
  };

  const updateMission = (index: number, field: string, value: string) => {
    const newMissions = [...missions];
    newMissions[index][field] = value;
    setMissions(newMissions);
  };

  const removeMission = (index: number) => {
    setMissions(missions.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8 relative w-full">
      {/* Toast Alert */}
      {alertMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`flex items-center gap-3 rounded-xl px-5 py-3.5 text-white shadow-lg ${alertMessage.type === 'success' ? 'bg-mint-ink' : 'bg-red-600'}`}>
            {alertMessage.type === 'success' ? <Check size={20} /> : <X size={20} />}
            <p className="text-base font-medium">{alertMessage.text}</p>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-3xl font-bold text-gray-900">Manajemen Tentang Kami</h2>
        <p className="text-base text-gray-500 mt-1">Kelola teks untuk halaman Sejarah dan Visi & Misi hotel.</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('sejarah')}
            className={`
              whitespace-nowrap border-b-2 py-4 px-2 text-base font-medium transition-colors
              ${activeTab === 'sejarah'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }
            `}
          >
            Halaman Sejarah
          </button>
          <button
            onClick={() => setActiveTab('visi-misi')}
            className={`
              whitespace-nowrap border-b-2 py-4 px-2 text-base font-medium transition-colors
              ${activeTab === 'visi-misi'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }
            `}
          >
            Halaman Visi & Misi
          </button>
        </nav>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-mint border-t-transparent"></div>
        </div>
      ) : (
        <div className="mt-6">
          
          {/* TAB: SEJARAH */}
          {activeTab === 'sejarah' && (
            <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
              <div className="space-y-2">
                <label className="block text-base font-semibold text-gray-700">Penjelasan Singkat (Subtitle)</label>
                <p className="text-sm text-gray-500">Tampil di bawah judul halaman utama.</p>
                <textarea 
                  rows={2}
                  value={historySubtitle}
                  onChange={(e) => setHistorySubtitle(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Mengenal lebih dekat perjalanan Hannah Hotel..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-base font-semibold text-gray-700">Teks Kutipan Utama (Quote)</label>
                <p className="text-sm text-gray-500">Tampil menonjol di bagian atas halaman.</p>
                <textarea 
                  rows={3}
                  value={historyQuote}
                  onChange={(e) => setHistoryQuote(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder='Contoh: "Berawal dari mimpi kecil..."'
                />
              </div>

              <div className="space-y-2">
                <label className="block text-base font-semibold text-gray-700">Konten Sejarah</label>
                <p className="text-sm text-gray-500">Gunakan tombol Enter untuk memisahkan antar paragraf.</p>
                <textarea 
                  rows={15}
                  value={historyContent}
                  onChange={(e) => setHistoryContent(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary whitespace-pre-wrap leading-relaxed"
                  placeholder="Ceritakan perjalanan panjang hotel Anda di sini..."
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button 
                  onClick={handleSaveSejarah}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Save size={20} />
                  {isSaving ? 'Menyimpan...' : 'Simpan Sejarah'}
                </button>
              </div>
            </div>
          )}

          {/* TAB: VISI MISI */}
          {activeTab === 'visi-misi' && (
            <div className="space-y-8">
              
              <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm space-y-4">
                <div className="space-y-2">
                  <label className="block text-base font-semibold text-gray-700">Penjelasan Singkat (Subtitle)</label>
                  <p className="text-sm text-gray-500">Tampil di bawah judul halaman utama Visi & Misi.</p>
                  <textarea 
                    rows={2}
                    value={visionSubtitle}
                    onChange={(e) => setVisionSubtitle(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Mendedikasikan diri untuk selalu memberikan layanan..."
                  />
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 bg-mint/10 text-mint rounded-lg"><LucideIcons.Target size={24} /></div>
                  <h3 className="text-xl font-bold text-gray-900">Visi Hotel</h3>
                </div>
                
                <textarea 
                  rows={4}
                  value={visionText}
                  onChange={(e) => setVisionText(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                  placeholder="Menjadi pionir dalam industri perhotelan..."
                />
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-orange/10 text-orange rounded-lg"><LucideIcons.CheckSquare size={24} /></div>
                    <h3 className="text-xl font-bold text-gray-900">Daftar Misi</h3>
                  </div>
                  <button 
                    onClick={addMission}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    <Plus size={18} />
                    Tambah Misi
                  </button>
                </div>

                <div className="space-y-5">
                  {missions.map((mission, idx) => (
                    <div key={idx} className="flex gap-4 p-5 rounded-xl border border-gray-100 bg-gray-50 relative group">
                      <div className="pt-2 text-gray-400 cursor-move hover:text-gray-600">
                        <GripVertical size={24} />
                      </div>
                      <div className="flex-1 grid gap-5 sm:grid-cols-[1fr_2fr]">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">Judul Misi</label>
                            <input 
                              type="text" 
                              value={mission.title}
                              onChange={(e) => updateMission(idx, 'title', e.target.value)}
                              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-base focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                              placeholder="Pelayanan Sepenuh Hati"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">Ikon Representasi</label>
                            <IconPicker 
                              value={mission.icon}
                              onChange={(val) => updateMission(idx, 'icon', val)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1.5">Deskripsi Misi</label>
                          <textarea 
                            rows={5}
                            value={mission.desc}
                            onChange={(e) => updateMission(idx, 'desc', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-base focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                            placeholder="Memberikan standar layanan tertinggi..."
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => removeMission(idx)}
                        className="absolute -right-2 -top-2 rounded-full bg-white p-2 text-gray-400 shadow-sm ring-1 ring-gray-200 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Hapus Misi"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  
                  {missions.length === 0 && (
                    <div className="text-center py-10 text-gray-500 text-base border-2 border-dashed border-gray-200 rounded-xl bg-white">
                      Belum ada misi yang ditambahkan.
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-8 mt-6 border-t border-gray-100">
                  <button 
                    onClick={handleSaveVisiMisi}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    <Save size={20} />
                    {isSaving ? 'Menyimpan...' : 'Simpan Visi & Misi'}
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
}
