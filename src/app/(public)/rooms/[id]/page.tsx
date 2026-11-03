import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, Wifi, Tv, Wind, Coffee, Droplets, Bed, Thermometer, Car, Utensils, CigaretteOff } from "lucide-react";

type RoomFacility = {
  name: string;
  icon: string;
};

const getIcon = (iconName: string) => {
  const icons: Record<string, typeof Check> = {
    Check, Wifi, Tv, Wind, Coffee, Droplets, Bed, Thermometer, Car, Utensils, CigaretteOff
  };
  return icons[iconName] || Check;
};

async function getRoom(id: string) {
  try {
    const res = await fetch(`http://localhost:5000/api/rooms/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const room = await getRoom(id);

  if (!room) {
    notFound();
  }

  const facilities = room.facilities && room.facilities.length > 0
    ? room.facilities.map((f: RoomFacility | string) => typeof f === 'string' ? { name: f, icon: 'Check' } : f)
    : [];

  const detailImages = Array.isArray(room.detailImageUrls)
    ? room.detailImageUrls.filter((image: string) => !!image)
    : [];

  return (
    <main className="bg-cream min-h-screen pb-20">
      {/* Hero Image Section */}
      <section className="relative h-[50vh] min-h-100 w-full bg-primary">
        {room.imageUrl ? (
          <Image
            src={room.imageUrl.startsWith('http') || room.imageUrl.startsWith('/') ? (room.imageUrl.startsWith('/assets') ? room.imageUrl : `http://localhost:5000${room.imageUrl}`) : room.imageUrl}
            alt={room.name}
            fill
            className="object-cover opacity-80"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-primary opacity-80 flex items-center justify-center">
            <span className="text-white/50 text-xl">No Image Available</span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-primary/90 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="mx-auto max-w-6xl">
            <Link href={`/rooms/${room.location}`} className="mb-4 inline-block text-sm font-semibold text-cream">Hannah Hotel {room.location === 'padang' ? 'Padang' : 'Painan'} / Kamar</Link>
            <h1 className="font-display text-4xl font-bold text-cream md:text-6xl">{room.name}</h1>
            <p className="mt-4 text-xl font-medium text-orange">{room.price} / Malam</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-3">

          {/* Main Description */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-display text-2xl font-semibold text-primary">Tentang Kamar Ini</h2>
              <span className="mt-3 block h-1 w-16 bg-orange" />
              <p className="mt-6 leading-8 text-secondary text-lg whitespace-pre-wrap">
                {room.description}
              </p>
            </div>

            {facilities.length > 0 && (
              <div>
                <h3 className="font-display text-xl font-semibold text-primary">Fasilitas Kamar</h3>
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {facilities.map((amenity: RoomFacility, index: number) => {
                    const IconComp = getIcon(amenity.icon);
                    return (
                      <li key={index} className="flex items-center text-secondary font-medium">
                        <IconComp className="mr-4 h-6 w-6 text-orange drop-shadow-sm" />
                        {amenity.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {detailImages.length > 0 && (
              <div className="pt-2">
                <h3 className="font-display text-xl font-semibold text-primary">Detail Kamar</h3>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {detailImages.map((image: string, index: number) => (
                    <div key={`${image}-${index}`} className="group relative h-52 overflow-hidden rounded-xl border border-[#e5e2e1] bg-white shadow-sm">
                      <Image
                        src={image.startsWith('http') || image.startsWith('/') ? (image.startsWith('/assets') ? image : `http://localhost:5000${image}`) : image}
                        alt={`${room.name} detail ${index + 1}`}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-[#e5e2e1] bg-white p-6 shadow-lg">
              <h3 className="font-display text-xl font-semibold text-primary">Reservasi</h3>
              <p className="mt-2 text-sm text-secondary">Tertarik untuk menginap di kamar ini? Hubungi kami sekarang untuk memastikan ketersediaan.</p>

              <div className="mt-6 rounded-lg bg-cream p-4 border border-[#e5e2e1]">
                <p className="text-sm font-medium text-secondary mb-1">Tarif Kamar</p>
                <p className="text-2xl font-bold text-orange">{room.price}</p>
              </div>

              <a
                href={`https://wa.me/628116617717?text=${encodeURIComponent(`Halo Hannah Hotel Syariah, saya ingin reservasi kamar ${room.name}. Apakah masih tersedia?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-primary px-5 py-3 text-sm font-bold tracking-wide text-primary transition hover:bg-primary hover:text-white"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0">
                  <path d="M20.52 3.48A11.91 11.91 0 0 0 12.05 0C5.46 0 .1 5.36.1 11.95c0 2.1.55 4.15 1.6 5.96L0 24l6.25-1.64a11.94 11.94 0 0 0 5.8 1.48h.01C18.65 23.84 24 18.48 24 11.9c0-3.19-1.24-6.18-3.48-8.42ZM12.06 21.82a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.71.97.99-3.62-.24-.37a9.9 9.9 0 0 1-1.52-5.26c0-5.48 4.46-9.94 9.94-9.94a9.87 9.87 0 0 1 7.03 2.91 9.87 9.87 0 0 1 2.91 7.03c0 5.48-4.47 9.87-10 9.87Zm5.45-7.44c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.18-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.58c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.3 1.27.49 1.7.62.72.23 1.37.2 1.88.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35Z" />
                </svg>
                Reservasi Sekarang
              </a>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
