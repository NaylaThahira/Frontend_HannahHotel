import PageIntro from '../components/PageIntro'

const facilities = [
  { name: 'Air Conditioning', description: 'Suhu kamar yang sejuk dan nyaman sepanjang waktu.', icon: 'M6 19V5m12 14V5M6 8h12M6 16h12' },
  { name: 'Restaurant', description: 'Hidangan halal pilihan dengan cita rasa khas Nusantara.', icon: 'M7 3v8m-3-8v5a3 3 0 0 0 6 0V3m7 0v18m0-18c-3 3-3 8 0 10' },
  { name: 'Swimming Pool', description: 'Area kolam renang yang bersih untuk bersantai bersama keluarga.', icon: 'M2 17c2-2 4 2 6 0s4 2 6 0 4 2 6 0M8 14V5a3 3 0 0 1 6 0' },
  { name: 'Fitness Center', description: 'Peralatan kebugaran untuk menjaga rutinitas sehat Anda.', icon: 'M6 7v10m12-10v10M3 10v4m18-4v4M6 12h12' },
  { name: 'Free WiFi', description: 'Internet cepat gratis tersedia di seluruh area hotel.', icon: 'M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 20h.01' },
  { name: 'Free Parking', description: 'Area parkir luas dan aman khusus untuk tamu hotel.', icon: 'M6 21V3h7a5 5 0 0 1 0 10H6m0-7h7a2 2 0 0 1 0 4H6' },
  { name: '24-Hour Reception', description: 'Tim resepsionis siap membantu kebutuhan Anda selama 24 jam.', icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3 2' },
  { name: 'Laundry Service', description: 'Layanan laundry profesional untuk masa inap yang lebih praktis.', icon: 'M5 7h14l-1 14H6L5 7Zm3-4h8l2 4H6l2-4Zm1 9a3 3 0 1 0 6 0' },
]

export default function FacilitiesPage() {
  return (
    <>
      <PageIntro title="Fasilitas Hotel" description="Nikmati rangkaian fasilitas lengkap yang kami siapkan untuk mendukung kenyamanan, ketenangan, dan kebutuhan Anda selama menginap." />
      <section className="bg-cream px-5 pb-24 pt-12 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {facilities.map((facility) => (
            <article key={facility.name} className="group rounded-lg border border-primary/10 bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
              <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#e8f5ee] text-[#1e6b3e] transition group-hover:bg-primary group-hover:text-white">
                <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={facility.icon} /></svg>
              </span>
              <h2 className="mt-5 font-display text-xl font-semibold text-primary">{facility.name}</h2>
              <p className="mt-3 text-sm leading-6 text-secondary">{facility.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
