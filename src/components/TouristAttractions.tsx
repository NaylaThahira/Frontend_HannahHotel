interface TouristAttractionsProps {
  attractions?: string[];
}

export default function TouristAttractions({ attractions: initialAttractions }: TouristAttractionsProps) {
  const attractions = initialAttractions && initialAttractions.length > 0 ? initialAttractions : [
    'Pantai Carocok',
    'Bukik Langkisau',
    'Pulau Cingkuak',
    'Kawasan Mandeh',
    'Air terjun Bayang S',
    'Jembatan Akar'
  ];

  return (
    <section className="bg-white py-16 px-5 sm:px-8 border-t border-cream">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-display text-3xl font-semibold text-primary mb-10">Tourist Attraction</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {attractions.map((item) => (
            <div key={item} className="flex items-center gap-3 p-4 rounded-lg bg-cream border border-primary/10 transition hover:-translate-y-1 hover:shadow-md">
              <svg className="w-5 h-5 text-peach shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium text-secondary text-sm sm:text-base">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
