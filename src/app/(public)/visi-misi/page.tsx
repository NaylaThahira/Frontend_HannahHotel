import PageIntro from '@/components/PageIntro'
import { Target, Heart, ShieldCheck, Smile, Star } from 'lucide-react'

export const metadata = {
  title: 'Visi Misi | Hannah Hotel',
}

import * as LucideIcons from 'lucide-react'

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

export default async function VisiMisiPage() {
  const settings = await getSettings();
  const visionSubtitle = settings.vision_subtitle || 'Mendedikasikan diri untuk selalu memberikan layanan perhotelan terbaik dan pengalaman tak terlupakan bagi setiap tamu kami.';
  const visionText = settings.vision_text || 'Menjadi pionir dalam industri perhotelan...';
  let missions: any[] = [];
  try {
    if (settings.missions_json) missions = JSON.parse(settings.missions_json);
  } catch(e) {}
  return (
    <main className="bg-[#FCF9F8]">
      <PageIntro 
        title="Visi & Misi" 
        description={visionSubtitle}
        patterned={true}
      />
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Visi */}
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100 h-fit">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-sm mb-6">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="font-display text-3xl font-bold text-primary mb-4">Visi Kami</h2>
            <p className="text-lg leading-8 text-secondary">
              {visionText}
            </p>
          </div>

          {/* Misi */}
          <div>
            <h2 className="font-display text-3xl font-bold text-primary mb-8">Misi Kami</h2>
            <ul className="space-y-6">
              {missions.map((item, idx) => {
                const IconComp = (LucideIcons as any)[item.icon] || LucideIcons.Check;
                return (
                <li key={idx} className="flex gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange text-orange-ink shadow-sm">
                      <IconComp className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary">{item.title}</h3>
                    <p className="mt-1 text-secondary leading-7">{item.desc}</p>
                  </div>
                </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
