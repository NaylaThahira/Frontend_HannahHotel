# Design System — Hannah Hotel Syari'ah

**Versi:** 2.0 (General Style Guide)
**Tujuan:** Acuan desain umum agar halaman-halaman baru yang akan dibuat tetap konsisten dengan gaya visual brand, tanpa terikat pada konten/struktur mockup spesifik.

---

## 1. Brand Personality

| Aspek | Deskripsi |
|---|---|
| **Mood** | Elegan, tenang, religius-modern, hangat, terpercaya |
| **Kesan yang ingin dibangun** | Hotel syariah premium namun tetap homey — bersih, islami, ramah keluarga |
| **Tone tulisan** | Bahasa Indonesia formal-ramah (public-facing), sedikit lebih teknis/netral untuk konten admin |
| **Elemen dekoratif khas** | Garis horizontal tipis dengan ikon bintang ★ kecil di tengah, dipakai sebagai divider antara heading dan body text |

---

## 2. Warna

### 2.1 Palet Utama

| Token | Hex | Penggunaan |
|---|---|---|
| `color-primary-green` | `#00522A` | Warna brand utama — navbar, footer, sidebar admin, heading, tombol outline, teks brand |
| `color-primary-green-dark` | `#003F1C` | Hover/active state dari elemen hijau |
| `color-accent-orange` | `#FE9340` | Warna aksen/CTA — semua tombol aksi utama, indikator aktif |
| `color-accent-orange-dark` | `#E5762A` | Hover state tombol orange |

### 2.2 Warna Background

| Token | Hex | Penggunaan |
|---|---|---|
| `color-bg-cream` | `#F6F3F2` | Background utama halaman (off-white hangat) |
| `color-bg-card` | `#FCF9F8` | Background card/container di atas cream |
| `color-bg-mint` | `#E8F5EE` | Background ikon/highlight card (mis. ikon fasilitas, ikon login) |
| `color-bg-white` | `#FFFFFF` | Background card form, tabel, modal |

### 2.3 Warna Teks

| Token | Hex | Penggunaan |
|---|---|---|
| `color-text-dark` | `#1A1A1A` | Body text utama |
| `color-text-muted` | `#6B6B6B` | Sub-teks, placeholder, caption |
| `color-text-on-green` | `#FFFFFF` | Teks di atas background hijau (navbar/footer/sidebar) |
| `color-text-on-green-muted` | `#D9E8DD` | Sub-teks di atas background hijau |

### 2.4 Warna Status (Badge)

| Token | Background | Teks | Penggunaan |
|---|---|---|---|
| `color-status-success` | `#A7F4BA` | `#0F6B2C` | Status aktif/tersedia/sukses |
| `color-status-danger` | `#FFDAD6` | `#B3261E` | Status terisi/nonaktif/error |
| `color-status-neutral` | `#EFECEC` | `#6B6B6B` | Status netral/pending |

### 2.5 Border

| Token | Hex |
|---|---|
| `color-border` | `#E2DEDC` |

---

## 3. Tipografi

| Token | Font Family | Ukuran | Berat | Penggunaan |
|---|---|---|---|---|
| `font-display` | Serif (Playfair Display / Lora) | 36–48px | Bold | Hero title, judul utama halaman |
| `font-heading` | Serif | 24–32px | Bold / SemiBold | Judul section, judul card |
| `font-heading-sm` | Serif | 18–20px | SemiBold | Sub-judul, judul card kecil |
| `font-body` | Sans-serif (Inter / Public Sans) | 14–16px | Regular | Paragraf, deskripsi |
| `font-label` | Sans-serif | 12–13px | Medium / SemiBold | Label form, menu navigasi, badge |
| `font-button` | Sans-serif | 14–15px | SemiBold / Bold | Teks tombol |
| `font-caption` | Sans-serif | 12px | Regular | Caption, footer kecil, timestamp |

**Aturan umum:**
- Serif **hanya** untuk heading/judul & brand name — tidak untuk body text atau UI label.
- Sans-serif untuk semua elemen fungsional (navigasi, form, tombol, tabel, badge).

---

## 4. Spacing & Layout

| Token | Nilai |
|---|---|
| `container-max-width` | 1140–1200px |
| `container-padding-x` | 24–32px |
| `radius-card` | 8–12px |
| `radius-button` | 6–8px |
| `radius-badge` | full (pill) |
| `radius-input` | 6px |
| `section-spacing-y` | 64–96px (antar section halaman publik) |
| `shadow-card` | shadow tipis, soft (mis. `0 2px 8px rgba(0,0,0,0.06)`) |
| `shadow-modal` | shadow lebih tegas (mis. `0 8px 24px rgba(0,0,0,0.12)`) |

---

## 5. Komponen Dasar (Reusable)

### 5.1 Button

| Variant | Style |
|---|---|
| **Primary** | Bg `color-accent-orange`, teks putih bold, radius 6–8px, padding ±12x24px. Hover → `color-accent-orange-dark`. Untuk semua CTA utama (submit, book, tambah data). |
| **Secondary (Outline)** | Border `color-primary-green` 1.5px, teks hijau, bg transparan/putih. Untuk aksi sekunder (lihat detail, batal). |
| **Dark / Tertiary** | Bg `color-primary-green`, teks putih. Untuk aksi di konteks admin (login, simpan data utama). |
| **Ghost / Icon Button** | Tanpa background, hanya ikon (edit = oranye, hapus = merah) — dipakai di tabel aksi. |

### 5.2 Card

- Background putih/cream, border halus `color-border`, radius 8–12px, shadow tipis.
- Variasi: **Card Foto** (gambar full-width di atas, konten di bawah), **Card Stat** (ikon + label kategori pill + angka besar serif), **Card Icon** (background mint, ikon besar tengah, label di bawah).

### 5.3 Badge / Pill

- Radius full, padding kecil (±4x10px), font kecil bold.
- Warna mengikuti token status (success/danger/neutral) atau warna brand (mint untuk info, orange muda untuk highlight).

### 5.4 Form Input

- Border tipis abu (`color-border`), radius 6px, background putih atau cream pucat.
- Placeholder warna `color-text-muted`.
- Label di atas input, bold kecil, sans-serif.
- Textarea mengikuti style input dengan tinggi minimum yang lebih besar.

### 5.5 Tabel (Admin)

- Header tabel: background abu muda, label sans-serif kecil.
- Baris: border-bottom tipis, padding vertikal cukup lega.
- Kolom aksi di kanan: toggle switch (on/off), ikon edit (oranye), ikon hapus (merah).
- Footer tabel: info "Menampilkan X-Y dari Z data" + pagination.

### 5.6 Toggle Switch

- Pill shape, hijau saat aktif, abu saat nonaktif, thumb putih bulat.

### 5.7 Navbar (Public)

- Background hijau tua penuh, logo kiri (ikon + teks brand serif + subteks lokasi kecil), menu tengah/kanan sans-serif, CTA tombol orange di ujung kanan.
- Menu aktif: underline orange tipis.

### 5.8 Sidebar (Admin)

- Background hijau tua, lebar fixed ±250px.
- Header: nama panel + subteks portal.
- Menu list dengan ikon + label; item aktif memiliki background orange solid dengan radius.
- Tombol CTA utama (mis. "+ New Reservation") konsisten di satu posisi (disarankan selalu di bagian bawah sidebar, sticky).

### 5.9 Footer (Public)

- Background hijau tua, multi-kolom (logo+deskripsi, links, kontak, opsional newsletter).
- Divider tipis sebelum copyright bar.
- Teks copyright kecil, warna `color-text-on-green-muted`.

### 5.10 Divider Dekoratif

- Garis horizontal tipis dengan ikon bintang ★ kecil di tengah — dipakai untuk memisahkan heading section dari deskripsi/body di bawahnya.

---

## 6. Ikonografi

- Style: **outline**, garis tipis konsisten, tanpa fill — mirip set ikon Lucide/Feather.
- Ukuran umum: 20–24px untuk ikon UI, 32–40px untuk ikon card/fasilitas.
- Warna ikon mengikuti konteks: hijau (`color-primary-green`) di area cream/mint, putih di area hijau gelap, oranye untuk aksi/highlight.

---

## 7. Prinsip Konsistensi (Checklist saat Membuat Halaman Baru)

1. **Heading section** selalu pakai `font-heading` serif + underline pendek orange (3–4px) di bawahnya, ATAU divider garis+bintang — pilih salah satu pola per section, jangan campur tanpa alasan.
2. **CTA utama** di halaman selalu warna orange; CTA sekunder selalu outline hijau. Jangan gunakan warna lain untuk tombol.
3. **Komponen Footer & Navbar** dibuat sebagai 1 komponen reusable (`<Navbar />`, `<Footer />`) dengan props opsional — hindari membuat varian footer berbeda-beda per halaman.
4. **Badge status** selalu pakai 3 token warna (success/danger/neutral) — jangan tambah warna status baru tanpa menambahkannya ke design token dulu.
5. **Card** apapun isinya (kamar, fasilitas, promo, stat) tetap pakai radius & shadow yang sama dari token `radius-card` / `shadow-card`.
6. **Spacing antar section** di halaman publik konsisten mengikuti `section-spacing-y` (jangan halaman satu rapat, halaman lain renggang).
7. **Sidebar admin**: posisi tombol CTA utama dan urutan menu harus sama di semua halaman admin — jangan berubah-ubah posisi antar halaman.

---

*Dokumen ini adalah ringkasan design system umum, hasil ekstraksi gaya visual dari mockup awal Hannah Hotel Syari'ah. Tujuannya sebagai acuan saat membuat halaman-halaman baru agar tetap satu gaya, tanpa membatasi struktur/konten halaman baru tersebut. Nilai warna bersifat estimasi dari sampling piksel mockup — validasi ulang bila source file desain (Figma dsb) tersedia.*
