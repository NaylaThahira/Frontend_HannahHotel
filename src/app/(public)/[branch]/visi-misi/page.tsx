import { notFound } from 'next/navigation'
import PageIntro from '@/components/PageIntro'
import { Target } from 'lucide-react'
import { getHotelIcon } from '@/lib/hotel-icons'
import { SERVER_API_URL } from '@/lib/api'
import { isValidBranch } from '@/lib/branches'

export const metadata = {
  title: 'Visi Misi | Hannah Hotel',
}

async function getSettings() {
  try {
    const res = await fetch(
      `${SERVER_API_URL}/api/settings?keys=vision_subtitle,vision_text,missions_json,vision_subtitle_padang,vision_text_padang,missions_padang_json`,
      {
        next: { revalidate: 300, tags: ['settings'] },
      }
    )
    if (!res.ok) return {}
    return res.json()
  } catch (error) {
    console.error(error)
    return {}
  }
}

export default async function VisiMisiPage({
  params,
}: {
  params: Promise<{ branch: string }>
}) {
  const { branch } = await params
  if (!isValidBranch(branch)) {
    notFound()
  }

  const settings = await getSettings()
  const isPadang = branch === 'padang'

  const visionSubtitle =
    (isPadang ? settings.vision_subtitle_padang || settings.vision_subtitle : settings.vision_subtitle) ||
    'Mendedikasikan diri untuk selalu memberikan layanan perhotelan terbaik dan pengalaman tak terlupakan bagi setiap tamu kami.'
  const visionText =
    (isPadang ? settings.vision_text_padang || settings.vision_text : settings.vision_text) ||
    'Menjadi pionir dalam industri perhotelan...'

  let missions: any[] = []
  const rawMissions = isPadang ? settings.missions_padang_json || settings.missions_json : settings.missions_json
  try {
    if (rawMissions) missions = JSON.parse(rawMissions)
  } catch {}

  return (
    <main className="bg-[#FCF9F8]">
      <PageIntro title="Visi & Misi" description={visionSubtitle} patterned={true} />
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Visi */}
          <div className="h-fit rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="mb-4 font-display text-3xl font-bold text-primary">Visi Kami</h2>
            <p className="text-lg leading-8 text-secondary">{visionText}</p>
          </div>

          {/* Misi */}
          <div>
            <h2 className="mb-8 font-display text-3xl font-bold text-primary">Misi Kami</h2>
            <ul className="space-y-6">
              {missions.map((item, idx) => {
                const IconComp = getHotelIcon(item.icon)
                return (
                  <li key={idx} className="flex gap-4">
                    <div className="mt-1 flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange text-orange-ink shadow-sm">
                        <IconComp className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary">{item.title}</h3>
                      <p className="mt-1 leading-7 text-secondary">{item.desc}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
