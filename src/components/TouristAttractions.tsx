interface TouristAttractionsProps {
  painan: string[];
  padang: string[];
}

export default function TouristAttractions({ painan, padang }: TouristAttractionsProps) {

  return (
    <section className="bg-white py-16 px-5 sm:px-8 border-t border-cream">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-display text-3xl font-semibold text-primary mb-10">Area Akomodasi</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {([{ id: 'padang', label: 'Padang', items: padang }, { id: 'painan', label: 'Painan', items: painan }]).map(branch => (
            <div key={branch.id} className="min-w-0 rounded-xl border border-primary/10 p-5 sm:p-6">
              <h3 className="mb-5 border-b border-primary/10 pb-4 text-center font-display text-2xl font-semibold text-primary">Hannah Hotel {branch.label}</h3>
              {branch.items.length === 0 ? <p className="rounded-lg border border-primary/10 bg-cream p-5 text-sm text-secondary">Informasi area akomodasi {branch.label} akan segera tersedia.</p> : (
                <div className="grid grid-cols-1 gap-3">
                  {branch.items.map(item => (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-primary/10 bg-cream p-4 transition hover:-translate-y-1 hover:shadow-md">
                      <svg className="h-5 w-5 shrink-0 text-peach" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
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
