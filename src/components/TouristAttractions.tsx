interface TouristAttractionsProps {
  painan: string[]
  padang: string[]
  activeBranch?: 'padang' | 'painan'
}

export default function TouristAttractions({ painan, padang, activeBranch }: TouristAttractionsProps) {
  if (activeBranch) {
    const label = activeBranch === 'padang' ? 'Padang' : 'Painan'
    const items = activeBranch === 'padang' ? padang : painan

    return (
      <section className="border-t border-cream bg-white px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange">Lokasi Strategis</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-primary sm:text-4xl">
              Area Akomodasi &amp; Destinasi Sekitar {label}
            </h2>
          </div>

          <div className="rounded-xl border border-primary/10 p-6 sm:p-8">
            {items.length === 0 ? (
              <p className="rounded-lg border border-primary/10 bg-cream p-5 text-center text-sm text-secondary">
                Informasi area akomodasi {label} akan segera tersedia.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {items.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-lg border border-primary/10 bg-cream p-4 transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <svg
                      className="h-5 w-5 shrink-0 text-peach"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium text-secondary sm:text-base">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="border-t border-cream bg-white px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center font-display text-3xl font-semibold text-primary">Area Akomodasi</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {(
            [
              { id: 'padang', label: 'Padang', items: padang },
              { id: 'painan', label: 'Painan', items: painan },
            ] as const
          ).map((branch) => (
            <div key={branch.id} className="min-w-0 rounded-xl border border-primary/10 p-5 sm:p-6">
              <h3 className="mb-5 border-b border-primary/10 pb-4 text-center font-display text-2xl font-semibold text-primary">
                Hannah Hotel {branch.label}
              </h3>
              {branch.items.length === 0 ? (
                <p className="rounded-lg border border-primary/10 bg-cream p-5 text-sm text-secondary">
                  Informasi area akomodasi {branch.label} akan segera tersedia.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {branch.items.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-lg border border-primary/10 bg-cream p-4 transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <svg
                        className="h-5 w-5 shrink-0 text-peach"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium text-secondary sm:text-base">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
