<<<<<<< HEAD
import Image from 'next/image'
import Link from 'next/link'

async function getFeaturedRooms() {
  try {
    // using no-store so it updates when we change things in admin
    const res = await fetch('http://localhost:5000/api/rooms', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    const rooms = await res.json();
    return rooms.filter((r: any) => r.isFeatured).slice(0, 2);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function FeaturedRooms() {
  const rooms = await getFeaturedRooms();

=======
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
>>>>>>> 38a8652e400b24c80a0845349201457aec57cdb2
  return (
    <section id="rooms" className="scroll-mt-20 bg-cream px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange">Pilihan Terbaik Untuk Anda</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-primary sm:text-5xl">Kamar Pilihan Kami</h2>
          <span className="mx-auto mt-5 block h-1 w-24 bg-orange" />
        </div>

        <div className="mt-12 grid gap-7 md:grid-cols-2">
<<<<<<< HEAD
          {rooms.map((room: any) => (
            <article key={room.name} className="group overflow-hidden rounded-lg border border-[#e5e2e1] bg-cream shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-64 overflow-hidden">
                {room.imageUrl ? (
                  <Image 
                    src={room.imageUrl.startsWith('http') || room.imageUrl.startsWith('/') ? (room.imageUrl.startsWith('/assets') ? room.imageUrl : `http://localhost:5000${room.imageUrl}`) : room.imageUrl} 
                    alt={room.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">No Image</div>
                )}
=======
          {rooms.map((room) => (
            <article key={room.name} className="group overflow-hidden rounded-lg border border-[#e5e2e1] bg-cream shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="h-64 overflow-hidden">
                <img src={room.image} alt={room.name} className="size-full object-cover transition duration-500 group-hover:scale-105" />
>>>>>>> 38a8652e400b24c80a0845349201457aec57cdb2
              </div>
              <div className="p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <h3 className="font-display text-2xl font-semibold text-ink">{room.name}</h3>
                  <p className="shrink-0 text-sm font-bold tracking-wide text-orange">{room.price}</p>
                </div>
                <p className="mt-4 leading-7 text-secondary">{room.description}</p>
<<<<<<< HEAD
                <Link href={`/rooms/${room.id}`} className="mt-6 flex w-full items-center justify-center rounded-sm border border-primary px-5 py-3 text-sm font-bold tracking-wide text-primary transition hover:bg-primary hover:text-white">
=======
                <Link to="/contact" className="mt-6 flex w-full items-center justify-center rounded-sm border border-primary px-5 py-3 text-sm font-bold tracking-wide text-primary transition hover:bg-primary hover:text-white">
>>>>>>> 38a8652e400b24c80a0845349201457aec57cdb2
                  Lihat Detail
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
<<<<<<< HEAD
          <Link href="/rooms" className="inline-flex items-center gap-2 text-sm font-bold tracking-wide text-primary hover:text-orange">
=======
          <Link to="/rooms" className="inline-flex items-center gap-2 text-sm font-bold tracking-wide text-primary hover:text-orange">
>>>>>>> 38a8652e400b24c80a0845349201457aec57cdb2
            Lihat Semua Tipe Kamar <span aria-hidden="true">-&gt;</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
