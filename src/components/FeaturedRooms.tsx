import deluxeRoom from '../assets/deluxe-room.jpg'
import superiorRoom from '../assets/superior-room.jpg'
import { Link } from 'react-router-dom'

const rooms = [
  {
    name: 'Superior Room',
    price: 'Mulai Rp350.000',
    description: 'Kamar nyaman dengan fasilitas lengkap untuk perjalanan bisnis maupun liburan Anda.',
    image: superiorRoom,
  },
  {
    name: 'Deluxe Room',
    price: 'Mulai Rp450.000',
    description: 'Ruang lebih luas dengan interior elegan untuk pengalaman menginap yang istimewa.',
    image: deluxeRoom,
  },
]

export default function FeaturedRooms() {
  return (
    <section id="rooms" className="scroll-mt-20 bg-cream px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange">Pilihan Terbaik Untuk Anda</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-primary sm:text-5xl">Kamar Pilihan Kami</h2>
          <span className="mx-auto mt-5 block h-1 w-24 bg-orange" />
        </div>

        <div className="mt-12 grid gap-7 md:grid-cols-2">
          {rooms.map((room) => (
            <article key={room.name} className="group overflow-hidden rounded-lg border border-[#e5e2e1] bg-cream shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="h-64 overflow-hidden">
                <img src={room.image} alt={room.name} className="size-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <h3 className="font-display text-2xl font-semibold text-ink">{room.name}</h3>
                  <p className="shrink-0 text-sm font-bold tracking-wide text-orange">{room.price}</p>
                </div>
                <p className="mt-4 leading-7 text-secondary">{room.description}</p>
                <Link to="/contact" className="mt-6 flex w-full items-center justify-center rounded-sm border border-primary px-5 py-3 text-sm font-bold tracking-wide text-primary transition hover:bg-primary hover:text-white">
                  Lihat Detail
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/rooms" className="inline-flex items-center gap-2 text-sm font-bold tracking-wide text-primary hover:text-orange">
            Lihat Semua Tipe Kamar <span aria-hidden="true">-&gt;</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
