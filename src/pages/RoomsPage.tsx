import { Link } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import deluxeRoom from '../assets/deluxe-room.jpg'
import familyRoom from '../assets/family-room.jpg'
import suiteRoom from '../assets/suite-room.jpg'
import superiorRoom from '../assets/superior-room.jpg'

const rooms = [
  { name: 'Kamar Superior', price: 'Rp350.000', description: 'Kamar praktis dan nyaman untuk istirahat setelah aktivitas Anda.', note: 'Tanpa jendela luar', amenities: ['2 Tamu', '1 Queen Bed', 'WiFi', 'AC'], image: superiorRoom },
  { name: 'Kamar Deluxe', price: 'Rp450.000', description: 'Ruangan lebih luas dengan pemandangan kota.', note: 'Pilihan favorit tamu', amenities: ['2 Tamu', '1 King Bed', 'Smart TV', 'Sarapan'], image: deluxeRoom },
  { name: 'Kamar Family', price: 'Rp650.000', description: 'Kenyamanan ekstra untuk keluarga tercinta.', note: 'Cocok untuk keluarga', amenities: ['4 Tamu', '2 Queen Bed', 'WiFi', 'Sarapan'], image: familyRoom },
  { name: 'Kamar Suite', price: 'Rp850.000', description: 'Pengalaman mewah dengan ruang tamu terpisah.', note: 'Ruang tamu pribadi', amenities: ['2 Tamu', '1 King Bed', 'Bathtub', 'Mini Bar'], image: suiteRoom },
]

export default function RoomsPage() {
  return (
    <>
      <PageIntro patterned title="Rooms & Suites" description="Temukan ruang istirahat yang dirancang untuk ketenangan Anda. Setiap kamar menghadirkan kenyamanan modern dalam suasana yang hangat dan sesuai prinsip Syari'ah." />
      <section className="bg-cream px-5 py-20 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          {rooms.map((room) => (
            <article key={room.name} className="overflow-hidden rounded-lg border border-[#e5e2e1] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="h-72 overflow-hidden bg-[#e5e2e1]">
                <img src={room.image} alt={room.name} className="size-full object-cover transition duration-500 hover:scale-105" />
              </div>
              <div className="p-6 sm:p-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-display text-3xl font-semibold text-primary">{room.name}</h2>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-secondary/65">{room.note}</p>
                  </div>
                  <p className="w-fit rounded-full bg-peach px-3 py-1.5 text-sm font-bold text-orange-ink">{room.price}<span className="font-normal"> / malam</span></p>
                </div>
                <p className="mt-5 leading-7 text-secondary">{room.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Fasilitas ${room.name}`}>
                  {room.amenities.map((amenity) => <li key={amenity} className="rounded-full bg-[#eae7e7] px-3 py-1.5 text-xs font-medium text-secondary">{amenity}</li>)}
                </ul>
                <Link to="/contact" className="mt-6 flex items-center justify-center rounded-sm bg-primary px-5 py-3.5 text-sm font-bold tracking-wide text-white transition hover:bg-[#1e6b3e]">Pesan Kamar</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
