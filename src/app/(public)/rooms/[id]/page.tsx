import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, Wifi, Tv, Wind, Coffee, Droplets, Bed, Thermometer, Car, Utensils, CigaretteOff } from "lucide-react";

const getIcon = (iconName: string) => {
  const icons: Record<string, any> = {
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
    ? room.facilities.map((f: any) => typeof f === 'string' ? { name: f, icon: 'Check' } : f)
    : [];


  return (
    <main className="bg-cream min-h-screen pb-20">
      {/* Hero Image Section */}
      <section className="relative h-[50vh] min-h-[400px] w-full bg-primary">
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
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="mx-auto max-w-6xl">
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
                  {facilities.map((amenity: any, index: number) => {
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

              <Link 
                href="/rooms" 
                className="mt-6 flex w-full items-center justify-center rounded-md border border-primary px-5 py-3 text-sm font-bold tracking-wide text-primary transition hover:bg-primary hover:text-white"
              >
                Kembali ke Daftar Kamar
              </Link>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
