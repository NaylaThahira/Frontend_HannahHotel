type PageIntroProps = {
  title: string
  description: string
  patterned?: boolean
}

export default function PageIntro({ title, description, patterned = false }: PageIntroProps) {
  return (
    <section className={`relative isolate overflow-hidden border-b border-[#bfc9be] px-5 py-20 text-center sm:px-8 ${patterned ? 'bg-[#f6f3f2]' : 'bg-cream'}`}>
      {patterned && (
        <div className="absolute inset-0 -z-10 opacity-[0.05] [background-image:radial-gradient(circle_at_center,#1e6b3e_2px,transparent_2.5px)] [background-size:28px_28px]" />
      )}
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-bold tracking-tight text-primary sm:text-6xl">{title}</h1>
        <div className="mx-auto mt-6 flex max-w-xs items-center gap-4" aria-hidden="true">
          <span className="h-px flex-1 bg-primary/20" />
          <span className="size-2 rotate-45 bg-orange" />
          <span className="h-px flex-1 bg-primary/20" />
        </div>
        <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-secondary sm:text-lg">{description}</p>
      </div>
    </section>
  )
}
