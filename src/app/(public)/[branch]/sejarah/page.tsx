import { notFound } from 'next/navigation'
import PageIntro from '@/components/PageIntro'
import { SERVER_API_URL } from '@/lib/api'
import { isValidBranch } from '@/lib/branches'

export const metadata = {
  title: 'Sejarah | Hannah Hotel',
}

async function getSettings() {
  try {
    const res = await fetch(
      `${SERVER_API_URL}/api/settings?keys=history_subtitle,history_quote,history_content,history_subtitle_padang,history_quote_padang,history_content_padang`,
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

export default async function SejarahPage({
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

  const historySubtitle =
    (isPadang ? settings.history_subtitle_padang || settings.history_subtitle : settings.history_subtitle) ||
    'Mengenal lebih dekat perjalanan Hannah Hotel sejak awal berdiri hingga menjadi pilihan utama untuk pengalaman menginap terbaik Anda.'
  const historyQuote =
    (isPadang ? settings.history_quote_padang || settings.history_quote : settings.history_quote) ||
    '"Berawal dari mimpi kecil untuk menciptakan persinggahan yang hangat layaknya rumah, Hannah Hotel kini telah tumbuh melayani ribuan tamu dengan dedikasi dan cinta."'
  const historyContent =
    (isPadang ? settings.history_content_padang || settings.history_content : settings.history_content) ||
    'Perjalanan kami dimulai pada sebuah bangunan klasik yang sederhana...'

  const paragraphs = historyContent.split('\n').filter((p: string) => p.trim() !== '')
  return (
    <main className="bg-[#FCF9F8]">
      <PageIntro title="Sejarah Kami" description={historySubtitle} patterned={true} />
      <section className="mx-auto max-w-4xl px-5 py-24 sm:px-8">
        <div className="prose prose-lg max-w-none text-justify prose-h2:text-primary prose-p:text-secondary">
          <p className="mb-12 text-center text-xl font-medium leading-9 text-primary">{historyQuote}</p>
          <div className="space-y-8 text-lg leading-8 text-secondary">
            {paragraphs.map((paragraph: string, index: number) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
