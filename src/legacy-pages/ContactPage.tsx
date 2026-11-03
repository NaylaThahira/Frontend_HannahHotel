import PageIntro from '../components/PageIntro'

const fieldClass = 'mt-2 w-full rounded-sm border border-primary/15 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-secondary/45 focus:border-primary focus:ring-2 focus:ring-primary/10'

export default function ContactPage() {
  return (
    <>
      <PageIntro title="Hubungi Kami" description="Kami siap membantu merencanakan masa inap Anda. Kirimkan pertanyaan, kebutuhan khusus, atau permintaan reservasi melalui formulir berikut." />
      <section className="bg-cream px-5 pb-24 pt-12 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_.95fr]">
          <div className="relative overflow-hidden rounded-lg border border-primary/10 bg-white p-6 shadow-sm sm:p-9">
            <div className="absolute right-0 top-0 size-40 translate-x-1/2 -translate-y-1/2 rounded-full bg-mint/30" />
            <h2 className="relative font-display text-3xl font-semibold text-primary">Kirim Pesan</h2>
            <form className="relative mt-7 space-y-5" onSubmit={(event) => event.preventDefault()}>
              <div>
                <label htmlFor="full-name" className="text-sm font-semibold text-secondary">Nama Lengkap</label>
                <input id="full-name" name="fullName" type="text" required placeholder="Masukkan nama Anda" className={fieldClass} />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-semibold text-secondary">Email</label>
                <input id="email" name="email" type="email" required placeholder="contoh@email.com" className={fieldClass} />
              </div>
              <div>
                <label htmlFor="phone" className="text-sm font-semibold text-secondary">Nomor HP / WhatsApp</label>
                <input id="phone" name="phone" type="tel" required placeholder="0812 3456 7890" className={fieldClass} />
              </div>
              <div>
                <label htmlFor="message" className="text-sm font-semibold text-secondary">Pesan Anda</label>
                <textarea id="message" name="message" required rows={5} placeholder="Tuliskan pertanyaan atau kebutuhan Anda di sini..." className={`${fieldClass} resize-none`} />
              </div>
              <button type="submit" className="w-full rounded-sm bg-primary px-6 py-4 text-sm font-bold tracking-wide text-white transition hover:bg-[#1e6b3e]">Kirim Pesan</button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <article className="relative overflow-hidden rounded-lg bg-primary p-6 text-white shadow-sm">
                <span className="text-xs font-bold uppercase tracking-widest text-mint">Alamat</span>
                <h2 className="mt-4 font-display text-2xl font-semibold">Hannah Hotel Syari'ah</h2>
                <p className="mt-3 text-sm leading-6 text-white/75">Jl. Ilyas Yakub, Painan<br />Pesisir Selatan, Sumatera Barat</p>
              </article>
              <article className="relative overflow-hidden rounded-lg bg-[#e8f5ee] p-6 text-primary shadow-sm">
                <span className="text-xs font-bold uppercase tracking-widest text-[#1e6b3e]">Kontak</span>
                <h2 className="mt-4 font-display text-2xl font-semibold">Hubungi Langsung</h2>
                <p className="mt-3 text-sm leading-7"><a href="tel:+628116617717">0811 6617 717</a><br /><a href="mailto:info@hannahhotel.id">info@hannahhotel.id</a></p>
              </article>
            </div>

            <div className="relative flex min-h-80 items-center justify-center overflow-hidden rounded-lg border border-primary/15 bg-[#eae7e7] p-6 text-center shadow-sm [background-image:linear-gradient(30deg,rgba(0,82,42,.08)_12%,transparent_12.5%,transparent_87%,rgba(0,82,42,.08)_87.5%,rgba(0,82,42,.08)),linear-gradient(150deg,rgba(0,82,42,.08)_12%,transparent_12.5%,transparent_87%,rgba(0,82,42,.08)_87.5%,rgba(0,82,42,.08))] [background-size:80px_140px]">
              <div className="rounded-lg border border-white/70 bg-white/80 px-8 py-6 shadow-lg backdrop-blur-sm">
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary text-white">
                  <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
                </span>
                <h2 className="mt-3 font-display text-xl font-semibold text-primary">Lokasi Hotel</h2>
                <p className="mt-1 text-sm text-secondary">Pusat Kota Painan</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
