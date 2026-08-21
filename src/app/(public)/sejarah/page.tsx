import PageIntro from '@/components/PageIntro'

export const metadata = {
  title: 'Sejarah | Hannah Hotel',
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

export default async function SejarahPage() {
  const settings = await getSettings();
  
  const historySubtitle = settings.history_subtitle || 'Mengenal lebih dekat perjalanan Hannah Hotel sejak awal berdiri hingga menjadi pilihan utama untuk pengalaman menginap terbaik Anda.';
  const historyQuote = settings.history_quote || '"Berawal dari mimpi kecil untuk menciptakan persinggahan yang hangat layaknya rumah, Hannah Hotel kini telah tumbuh melayani ribuan tamu dengan dedikasi dan cinta."';
  const historyContent = settings.history_content || 'Perjalanan kami dimulai pada sebuah bangunan klasik yang sederhana...';
  
  // Pisahkan konten berdasarkan baris baru
  const paragraphs = historyContent.split('\n').filter((p: string) => p.trim() !== '');
  return (
    <main className="bg-[#FCF9F8]">
      <PageIntro 
        title="Sejarah Kami" 
        description={historySubtitle}
        patterned={true}
      />
      <section className="mx-auto max-w-4xl px-5 py-24 sm:px-8">
        <div className="prose prose-lg prose-p:text-secondary prose-h2:text-primary max-w-none text-justify">
          <p className="text-xl font-medium leading-9 text-primary text-center mb-12">
            {historyQuote}
          </p>
          <div className="space-y-8 text-lg leading-8 text-secondary">
            {paragraphs.map((paragraph: string, index: number) => {
              // Jika ini adalah paragraf ke-3 (index 2), tambahkan quote interstitial sebelumnya jika mau,
              // atau kita tampilkan saja secara linier
              return (
                <p key={index}>
                  {paragraph}
                </p>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}