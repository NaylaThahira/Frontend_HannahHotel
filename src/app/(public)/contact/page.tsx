'use client'

import PageIntro from '@/components/PageIntro'
import { Map, MapMarker, MapControls, MarkerPopup, MarkerContent } from '@/components/ui/map'

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

          <div className="flex flex-col gap-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <article className="relative overflow-hidden rounded-lg bg-primary p-6 text-white shadow-sm">
                <span className="text-xs font-bold uppercase tracking-widest text-mint">Alamat</span>
                <h2 className="mt-4 font-display text-2xl font-semibold">Hannah Hotel Syari'ah</h2>
                <p className="mt-3 text-sm leading-6 text-white/75">Jl. Sutan Syahrir No.25, Painan<br />Kec. IV Jurai, Kabupaten Pesisir Selatan<br />Sumatera Barat 25651</p>
              </article>
              <article className="relative overflow-hidden rounded-lg bg-[#e8f5ee] p-6 text-primary shadow-sm">
                <span className="text-xs font-bold uppercase tracking-widest text-[#1e6b3e]">Kontak</span>
                <h2 className="mt-4 font-display text-2xl font-semibold">Hubungi Langsung</h2>
                <p className="mt-3 text-sm leading-7"><a href="tel:+62756700000">(0756) 700 000</a><br /><a href="mailto:info@hannahhotel.id">info@hannahhotel.id</a></p>
              </article>
            </div>

            <div 
              className="relative flex-1 min-h-[300px] w-full overflow-hidden rounded-lg border border-primary/15 bg-white text-white shadow-sm"
              style={{
                "--background": "transparent",
                "--foreground": "#ffffff",
                "--border": "#ffffff",
                "--accent": "#ffffff",
                "--accent-foreground": "#ffffff",
                "--popover": "#ffffff",
                "--popover-foreground": "#1c1b1b",
                "--ring": "#ffffff",
                "--muted": "#f3f4f6",
                "--muted-foreground": "#1c1b1b"
              } as React.CSSProperties}
            >
              <Map center={[100.5782687, -1.3447921]} zoom={15.5} className="absolute inset-0 h-full w-full">
                <MapMarker longitude={100.5782687} latitude={-1.3447921}>
                  <MarkerContent>
                    <div className="flex flex-col items-center justify-center translate-y-[-50%] drop-shadow-md">
                      <svg viewBox="0 0 24 24" className="size-8 text-[#00522A]" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                    </div>
                  </MarkerContent>
                  <MarkerPopup closeButton>
                    <div className="p-3">
                      <h3 className="font-display font-semibold text-primary">Hannah Hotel Syari'ah</h3>
                      <p className="mt-1 text-sm text-secondary">Jl. Sutan Syahrir No.25, Painan</p>
                      <a href="https://maps.app.goo.gl/GvfpnC9SNYi6ZkiH9" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs font-bold text-mint-ink hover:underline">
                        Buka di Google Maps &rarr;
                      </a>
                    </div>
                  </MarkerPopup>
                </MapMarker>
                <MapControls position="bottom-right" />
              </Map>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
