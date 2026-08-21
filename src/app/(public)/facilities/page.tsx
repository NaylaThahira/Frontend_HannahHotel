import PageIntro from '@/components/PageIntro'

import * as LucideIcons from 'lucide-react';

async function getFacilities() {
  try {
    const res = await fetch('http://localhost:5000/api/facilities', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getSettings() {
  try {
    const res = await fetch('http://localhost:5000/api/settings', { cache: 'no-store' });
    if (!res.ok) return {};
    return res.json();
  } catch (error) {
    console.error(error);
    return {};
  }
}

export default async function FacilitiesPage() {
  const [facilities, settings] = await Promise.all([getFacilities(), getSettings()]);
  const facilitiesSubtitle = settings.facilities_subtitle || "Nikmati rangkaian fasilitas lengkap yang kami siapkan untuk mendukung kenyamanan, ketenangan, dan kebutuhan Anda selama menginap.";
  
  return (
    <>
      <PageIntro title="Fasilitas Hotel" description={facilitiesSubtitle} />
      <section className="bg-cream px-5 pb-24 pt-12 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {facilities.map((facility: any) => {
            const IconComp = (LucideIcons as any)[facility.icon] || LucideIcons.Check;
            return (
              <article key={facility.id} className="group rounded-lg border border-primary/10 bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
                <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#e8f5ee] text-[#1e6b3e] transition group-hover:bg-primary group-hover:text-white">
                  <IconComp size={32} strokeWidth={1.6} />
                </span>
                <h2 className="mt-5 font-display text-xl font-semibold text-primary">{facility.name}</h2>
                <p className="mt-3 text-sm leading-6 text-secondary">{facility.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </>
  )
}
