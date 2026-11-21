"use client";

import { usePathname } from 'next/navigation';
import { adminApi, adminFetch, adminLocation } from '@/lib/admin-api';
import { useState, useEffect } from "react";
import { Check, FileText, MapPin, Phone, Mail, Link as LinkIcon, Plus, Trash2, ChevronDown, Home, Bed, Image as ImageIcon, Coffee, Info } from "lucide-react";

const URL_OPTIONS = [
  { value: "/", label: "Beranda", icon: Home, desc: "Halaman utama website" },
  { value: "/rooms", label: "Katalog Kamar", icon: Bed, desc: "Daftar seluruh tipe kamar" },
  { value: "/gallery", label: "Galeri Lengkap", icon: ImageIcon, desc: "Koleksi foto fasilitas hotel" },
  { value: "/facilities", label: "Fasilitas Hotel", icon: Coffee, desc: "Halaman khusus daftar fasilitas" },
  { value: "/contact", label: "Hubungi Kami", icon: Phone, desc: "Halaman kontak & lokasi" },
  { value: "/#about", label: "Tentang Kami (Beranda)", icon: Info, desc: "Profil singkat Hannah Hotel" }
];

export default function FooterSettingsPage() {
  const location = adminLocation(usePathname());
  const api = adminApi(location);
  const label = location === 'padang' ? 'Padang' : 'Painan';
  const suffix = location === 'padang' ? '_padang' : '';

  const aboutKey = `footer_about${suffix}`;
  const addressKey = `footer_address${suffix}`;
  const phoneKey = `footer_phone${suffix}`;
  const emailKey = `footer_email${suffix}`;
  const linksKey = `footer_links${suffix}`;
  const newsletterKey = `footer_show_newsletter${suffix}`;

  const [formData, setFormData] = useState({
    footer_about: "",
    footer_address: "",
    footer_phone: "",
    footer_email: "",
    footer_links: [
      { label: "Beranda", url: "/" },
      { label: "Katalog Kamar", url: "/rooms" },
      { label: "Fasilitas", url: "/facilities" },
      { label: "Tentang Kami", url: "/#about" }
    ],
    footer_show_newsletter: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const keys = [
          aboutKey, addressKey, phoneKey, emailKey, linksKey, newsletterKey,
          'footer_about', 'footer_address', 'footer_phone', 'footer_email', 'footer_links', 'footer_show_newsletter'
        ].join(',');
        const res = await adminFetch(`${api}/api/settings?keys=${keys}`);
        const data = await res.json();

        let parsedLinks = formData.footer_links;
        const rawLinks = data[linksKey] ?? data.footer_links;
        if (rawLinks) {
          try {
            parsedLinks = JSON.parse(rawLinks);
          } catch (e) {
            console.error("Failed to parse footer links");
          }
        }

        const rawNewsletter = data[newsletterKey] ?? data.footer_show_newsletter;
        setFormData({
          footer_about: data[aboutKey] ?? data.footer_about ?? "",
          footer_address: data[addressKey] ?? (location === 'padang' ? "" : data.footer_address ?? ""),
          footer_phone: data[phoneKey] ?? (location === 'padang' ? "" : data.footer_phone ?? ""),
          footer_email: data[emailKey] ?? data.footer_email ?? "",
          footer_links: parsedLinks,
          footer_show_newsletter: rawNewsletter === "false" ? false : true
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [api, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const dataToSend = {
        [aboutKey]: formData.footer_about,
        [addressKey]: formData.footer_address,
        [phoneKey]: formData.footer_phone,
        [emailKey]: formData.footer_email,
        [linksKey]: JSON.stringify(formData.footer_links),
        [newsletterKey]: formData.footer_show_newsletter.toString()
      };

      const res = await adminFetch(`${api}/api/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend)
      });

      if (!res.ok) throw new Error("Failed to save settings");

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan pengaturan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddLink = () => {
    setFormData({
      ...formData,
      footer_links: [...formData.footer_links, { label: "", url: "" }]
    });
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = [...formData.footer_links];
    newLinks.splice(index, 1);
    setFormData({ ...formData, footer_links: newLinks });
  };

  const handleLinkChange = (index: number, field: 'label' | 'url', value: string) => {
    const newLinks = [...formData.footer_links];
    newLinks[index][field] = value;
    setFormData({ ...formData, footer_links: newLinks });
  };

  if (isLoading) return <div className="p-8 text-center">Memuat pengaturan...</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2 border-b border-gray-100 pb-6">
        <h2 className="text-3xl font-display font-bold text-primary">Pengaturan Footer {label}</h2>
        <p className="text-gray-500">
          Kelola informasi kontak dan teks yang akan ditampilkan pada bagian bawah (footer) website cabang {label}.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Form */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* About Section */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center gap-3">
                <FileText className="h-5 w-5 text-orange" />
                <h3 className="font-semibold text-gray-900">Deskripsi Singkat</h3>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-3">Teks ini akan tampil tepat di bawah logo Hannah Hotel pada sudut kiri footer.</p>
                <textarea
                  rows={4}
                  value={formData.footer_about}
                  onChange={(e) => setFormData({ ...formData, footer_about: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-mint focus:outline-none focus:ring-2 focus:ring-mint/20 transition-all"
                  placeholder={`Kenyamanan Islami di jantung Kota ${label}...`}
                />
              </div>
            </div>

            {/* Newsletter Toggle Section */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-orange" />
                  <h3 className="font-semibold text-gray-900">Formulir Newsletter</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, footer_show_newsletter: !formData.footer_show_newsletter })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-mint focus:ring-offset-2 ${formData.footer_show_newsletter ? 'bg-mint' : 'bg-gray-200'
                    }`}
                  role="switch"
                  aria-checked={formData.footer_show_newsletter}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.footer_show_newsletter ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-500">
                  Aktifkan ini jika Anda ingin pengunjung dapat berlangganan newsletter (buletin). Jika dinonaktifkan, kolom isian email pada footer akan disembunyikan.
                </p>
              </div>
            </div>

            {/* Quick Links Section */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md relative">
              <div className="rounded-t-xl border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LinkIcon className="h-5 w-5 text-orange" />
                  <h3 className="font-semibold text-gray-900">Tautan Cepat</h3>
                </div>
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:text-orange transition-colors"
                >
                  <Plus size={16} /> Tambah Tautan
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-500 mb-2">Tautan navigasi cepat yang membantu pengunjung menelusuri halaman.</p>

                {formData.footer_links.map((link, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => handleLinkChange(idx, 'label', e.target.value)}
                      placeholder="Nama Tautan (misal: Beranda)"
                      required
                      className="w-1/3 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-mint focus:outline-none focus:ring-2 focus:ring-mint/20 transition-all"
                    />
                    <div className="relative flex-1">
                      <div
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 bg-white cursor-pointer hover:border-gray-400 focus-within:border-mint focus-within:ring-2 focus-within:ring-mint/20 transition-all shadow-sm flex items-center justify-between"
                        onClick={() => setOpenDropdownIndex(openDropdownIndex === idx ? null : idx)}
                      >
                        <span className={link.url ? "text-gray-700" : "text-gray-400"}>
                          {URL_OPTIONS.find(opt => opt.value === link.url)?.label || "Pilih Halaman Tujuan"}
                        </span>
                        <ChevronDown size={18} className={`text-gray-400 transition-transform ${openDropdownIndex === idx ? "rotate-180" : ""}`} />
                      </div>

                      {openDropdownIndex === idx && (
                        <div className="absolute z-10 mt-1 w-full rounded-xl border border-gray-100 bg-white shadow-xl overflow-y-auto max-h-60 py-1 animate-in fade-in zoom-in-95 duration-100">
                          {URL_OPTIONS.map((opt) => {
                            const Icon = opt.icon;
                            return (
                              <div
                                key={opt.value}
                                className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-mint/5 transition-colors ${link.url === opt.value ? 'bg-mint/5' : ''}`}
                                onClick={() => {
                                  const newLinks = [...formData.footer_links];
                                  newLinks[idx].url = opt.value;

                                  setFormData({ ...formData, footer_links: newLinks });
                                  setOpenDropdownIndex(null);
                                }}
                              >
                                <div className={`p-2 rounded-lg ${link.url === opt.value ? 'bg-mint text-white shadow-sm' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}>
                                  <Icon size={16} />
                                </div>
                                <div>
                                  <div className={`text-sm font-semibold ${link.url === opt.value ? 'text-primary' : 'text-gray-700'}`}>{opt.label}</div>
                                  <div className="text-xs text-gray-400 mt-0.5">{opt.desc}</div>
                                </div>
                                {link.url === opt.value && <Check size={18} className="text-mint ml-auto" />}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(idx)}
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus tautan"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}

                {formData.footer_links.length === 0 && (
                  <div className="text-center py-6 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                    Belum ada tautan. Silakan tambah baru.
                  </div>
                )}
              </div>
            </div>

            {/* Contact Section */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center gap-3">
                <MapPin className="h-5 w-5 text-orange" />
                <h3 className="font-semibold text-gray-900">Informasi Kontak</h3>
              </div>
              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">Alamat Lengkap</label>
                  <input
                    type="text"
                    value={formData.footer_address}
                    onChange={(e) => setFormData({ ...formData, footer_address: e.target.value })}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-mint focus:outline-none focus:ring-2 focus:ring-mint/20 transition-all"
                    placeholder={location === 'padang' ? "Jl. ..., Padang" : "Jl. Ilyas Yakub, Painan"}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" /> Nomor Telepon
                    </label>
                    <input
                      type="text"
                      value={formData.footer_phone}
                      onChange={(e) => setFormData({ ...formData, footer_phone: e.target.value })}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-mint focus:outline-none focus:ring-2 focus:ring-mint/20 transition-all"
                      placeholder="0811 6617 717"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" /> Alamat Email
                    </label>
                    <input
                      type="email"
                      value={formData.footer_email}
                      onChange={(e) => setFormData({ ...formData, footer_email: e.target.value })}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-mint focus:outline-none focus:ring-2 focus:ring-mint/20 transition-all"
                      placeholder="info@hannahhotel.id"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-primary px-8 py-3 text-sm font-bold tracking-wide text-white shadow-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>

              {showSuccess && (
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg animate-in fade-in slide-in-from-left-2">
                  <Check size={18} />
                  Pengaturan berhasil disimpan!
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
