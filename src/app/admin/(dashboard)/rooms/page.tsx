"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Upload, Check } from "lucide-react";
import * as LucideIcons from 'lucide-react';
import Image from "next/image";
import IconPicker from "@/components/IconPicker";

export default function RoomManagementPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roomToDelete, setRoomToDelete] = useState<number | null>(null);
  const [roomsSubtitle, setRoomsSubtitle] = useState("");
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/rooms");
      const data = await res.json();
      setRooms(data);
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
      if (data.rooms_subtitle) setRoomsSubtitle(data.rooms_subtitle);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const res = await fetch("http://localhost:5000/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rooms_subtitle: roomsSubtitle })
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

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    price: string;
    description: string;
    facilities: { name: string, icon: string }[];
  }>({
    name: "",
    price: "",
    description: "",
    facilities: [],
  });
  const [newFacilityName, setNewFacilityName] = useState("");
  const [newFacilityIcon, setNewFacilityIcon] = useState("Check");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const openModal = (room: any = null) => {
    setEditingRoom(room);
    if (room) {
      setFormData({
        name: room.name || "",
        price: room.price || "",
        description: room.description || "",
        facilities: (room.facilities || []).map((f: any) => typeof f === 'string' ? { name: f, icon: 'Check' } : f),
      });
    } else {
      setFormData({ name: "", price: "", description: "", facilities: [] });
    }
    setNewFacilityName("");
    setNewFacilityIcon("Check");
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingRoom(null);
    setIsModalOpen(false);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("description", formData.description);
      data.append("facilities", JSON.stringify(formData.facilities));
      
      if (selectedFile) {
        data.append("image", selectedFile);
      }

      // If adding new room, set default isFeatured to false
      if (!editingRoom) {
        data.append("isFeatured", "false");
      }

      const url = editingRoom 
        ? `http://localhost:5000/api/rooms/${editingRoom.id}`
        : "http://localhost:5000/api/rooms";
        
      const method = editingRoom ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: data, // fetch automatically sets multipart/form-data header
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menyimpan data");
      }

      closeModal();
      fetchRooms();
    } catch (err: any) {
      setAlertMessage(err.message || "Gagal menyimpan data kamar");
      setTimeout(() => setAlertMessage(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (roomId: number) => {
    setRoomToDelete(roomId);
  };

  const confirmDelete = async () => {
    if (!roomToDelete) return;
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/rooms/${roomToDelete}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Gagal menghapus kamar");
      fetchRooms();
    } catch (err: any) {
      console.error(err);
      setAlertMessage("Gagal menghapus kamar");
      setTimeout(() => setAlertMessage(null), 3000);
    } finally {
      setIsLoading(false);
      setRoomToDelete(null);
    }
  };

  const toggleFeatured = async (roomId: number) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    const currentFeaturedCount = rooms.filter(r => r.isFeatured).length;
    
    // Check limit
    if (!room.isFeatured && currentFeaturedCount >= 2) {
      setAlertMessage("Maksimal hanya 2 kamar yang dapat ditampilkan di halaman publik.");
      setTimeout(() => setAlertMessage(null), 3000);
      return;
    }

    try {
      // Optimistic UI update
      setRooms(rooms.map(r => r.id === roomId ? { ...r, isFeatured: !r.isFeatured } : r));

      const res = await fetch(`http://localhost:5000/api/rooms/${roomId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: room.name,
          price: room.price,
          description: room.description,
          isFeatured: !room.isFeatured
        })
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      // Revert if failed
      fetchRooms();
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    if (!rawValue) {
      setFormData({ ...formData, price: "" });
      return;
    }
    // Format to Indonesian Rupiah (dots for thousands)
    const formatted = parseInt(rawValue, 10).toLocaleString('id-ID');
    setFormData({ ...formData, price: `Rp${formatted}` });
  };

  const handleFacilityNameChange = (val: string) => {
    setNewFacilityName(val);
    const lowerVal = val.toLowerCase();
    if (lowerVal.includes('wifi') || lowerVal.includes('internet')) setNewFacilityIcon('Wifi');
    else if (lowerVal.includes('tv') || lowerVal.includes('televisi')) setNewFacilityIcon('Tv');
    else if (lowerVal.includes('ac') || lowerVal.includes('pendingin')) setNewFacilityIcon('Wind');
    else if (lowerVal.includes('kopi') || lowerVal.includes('teh')) setNewFacilityIcon('Coffee');
    else if (lowerVal.includes('mandi') || lowerVal.includes('air') || lowerVal.includes('shower')) setNewFacilityIcon('Droplets');
    else if (lowerVal.includes('kasur') || lowerVal.includes('tidur') || lowerVal.includes('bed')) setNewFacilityIcon('Bed');
    else if (lowerVal.includes('suhu') || lowerVal.includes('panas')) setNewFacilityIcon('Thermometer');
    else if (lowerVal.includes('parkir') || lowerVal.includes('mobil')) setNewFacilityIcon('Car');
    else if (lowerVal.includes('makan') || lowerVal.includes('sarapan')) setNewFacilityIcon('Utensils');
    else if (lowerVal.includes('rokok') || lowerVal.includes('smoking')) setNewFacilityIcon('CigaretteOff');
  };

  const handleAddFacility = () => {
    if (newFacilityName.trim() && !formData.facilities.find(f => f.name === newFacilityName.trim())) {
      setFormData({
        ...formData,
        facilities: [...formData.facilities, { name: newFacilityName.trim(), icon: newFacilityIcon }]
      });
      setNewFacilityName("");
    }
  };

  const handleRemoveFacility = (index: number) => {
    const newFacilities = [...formData.facilities];
    newFacilities.splice(index, 1);
    setFormData({ ...formData, facilities: newFacilities });
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
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Kamar</h2>
          <p className="text-sm text-gray-500">Kelola daftar kamar yang ditampilkan di halaman publik.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          Tambah Kamar
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Pengaturan Halaman</h3>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Penjelasan Singkat (Subtitle)</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <textarea 
              rows={2}
              value={roomsSubtitle}
              onChange={(e) => setRoomsSubtitle(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Berbagai pilihan kamar yang dirancang khusus..."
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kamar</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tampil di Beranda</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="relative h-16 w-24 overflow-hidden rounded-md border border-gray-200 bg-gray-100 flex items-center justify-center">
                      {room.imageUrl ? (
                        <Image 
                          src={room.imageUrl.startsWith('http') || room.imageUrl.startsWith('/') ? (room.imageUrl.startsWith('/assets') ? room.imageUrl : `http://localhost:5000${room.imageUrl}`) : room.imageUrl} 
                          alt={room.name} 
                          fill 
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-[10px]">No Image</div>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{room.name}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500">{room.price}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <button 
                      onClick={() => toggleFeatured(room.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${room.isFeatured ? 'bg-primary' : 'bg-gray-200'}`}
                      role="switch"
                      aria-checked={room.isFeatured}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${room.isFeatured ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => openModal(room)}
                        className="text-orange hover:text-orange-ink transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(room.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
                {editingRoom ? 'Edit Kamar' : 'Tambah Kamar Baru'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form className="p-6 space-y-5 overflow-y-auto flex-1" onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Nama Kamar</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-mint focus:outline-none focus:ring-1 focus:ring-mint"
                    placeholder="Contoh: Superior Room"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Harga</label>
                  <input 
                    type="text" 
                    value={formData.price}
                    onChange={handlePriceChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-mint focus:outline-none focus:ring-1 focus:ring-mint"
                    placeholder="Contoh: Rp350.000"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-mint focus:outline-none focus:ring-1 focus:ring-mint"
                  placeholder="Penjelasan singkat mengenai kamar..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Fasilitas Kamar</label>
                <div className="flex gap-2 relative">
                  <div className="relative w-1/3 min-w-[160px]">
                    <IconPicker 
                      value={newFacilityIcon}
                      onChange={setNewFacilityIcon}
                    />
                  </div>
                  <input 
                    type="text" 
                    value={newFacilityName}
                    onChange={(e) => handleFacilityNameChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFacility();
                      }
                    }}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-mint focus:outline-none focus:ring-1 focus:ring-mint"
                    placeholder="Contoh: AC, TV, dll"
                  />
                  <button
                    type="button"
                    onClick={handleAddFacility}
                    className="rounded-md border border-primary bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    Tambah
                  </button>
                </div>
                {formData.facilities.length > 0 && (
                  <div className="mt-3 overflow-hidden rounded-md border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 font-medium text-gray-700">Ikon</th>
                          <th className="px-4 py-2 font-medium text-gray-700">Nama Fasilitas</th>
                          <th className="px-4 py-2 font-medium text-gray-700 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {formData.facilities.map((fac, idx) => {
                          const IconComp = (LucideIcons as any)[fac.icon] || Check;
                          return (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-4 py-2"><IconComp size={20} className="text-orange drop-shadow-sm" /></td>
                              <td className="px-4 py-2 text-gray-900 font-medium">{fac.name}</td>
                              <td className="px-4 py-2 text-right">
                                <button type="button" onClick={() => handleRemoveFacility(idx)} className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-md hover:bg-red-50">
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Foto Kamar</label>
                <label 
                  htmlFor="file-upload"
                  className="mt-1 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 px-6 py-8 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Upload className="h-10 w-10 text-gray-400 mb-4" aria-hidden="true" />
                  <div className="text-sm leading-6 text-gray-600 text-center">
                    <span className="font-semibold text-primary hover:text-orange">Klik untuk unggah file</span>
                    <p>atau drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-500 mt-1">PNG, JPG, WEBP maks 5MB</p>
                  
                  {previewUrl ? (
                    <div className="mt-4 relative h-32 w-48 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <Image src={previewUrl} alt="Preview Foto Baru" fill className="object-cover" />
                      <div className="absolute top-2 left-2 bg-primary/90 px-2 py-1 rounded text-xs font-medium text-white backdrop-blur-sm">Foto Baru</div>
                    </div>
                  ) : editingRoom && editingRoom.imageUrl ? (
                    <div className="mt-4 relative h-32 w-48 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <Image 
                        src={editingRoom.imageUrl.startsWith('http') || editingRoom.imageUrl.startsWith('/') ? (editingRoom.imageUrl.startsWith('/assets') ? editingRoom.imageUrl : `http://localhost:5000${editingRoom.imageUrl}`) : editingRoom.imageUrl} 
                        alt="Preview Foto Lama" 
                        fill 
                        className="object-cover" 
                      />
                      <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-xs font-medium text-white backdrop-blur-sm">Foto Lama</div>
                    </div>
                  ) : null}
                  
                  <input 
                    id="file-upload" 
                    name="file-upload" 
                    type="file" 
                    className="sr-only" 
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setSelectedFile(file);
                      if (file) {
                        if (previewUrl) URL.revokeObjectURL(previewUrl);
                        setPreviewUrl(URL.createObjectURL(file));
                      } else {
                        setPreviewUrl(null);
                      }
                    }}
                  />
                </label>
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
      {roomToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl overflow-hidden p-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-5">
              <Trash2 className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Kamar</h3>
            <p className="text-sm text-gray-500 mb-6">
              Apakah Anda yakin ingin menghapus kamar ini? Tindakan ini tidak dapat dibatalkan dan semua data terkait akan terhapus.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setRoomToDelete(null)}
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
