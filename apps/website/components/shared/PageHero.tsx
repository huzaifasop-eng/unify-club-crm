interface PageHeroProps {
  label: string
  title: string
  titleAccent?: string
  subtitle?: string
  breadcrumb?: { label: string; href: string }[]
}

export default function PageHero({ label, title, titleAccent, subtitle }: PageHeroProps) {
  return (
    <section className="relative pt-40 pb-24 overflow-hidden bg-unify-navy text-white">
      <div className="absolute inset-0 bg-dots opacity-10" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-unify-orange/15 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="section-container relative z-10 text-center max-w-4xl mx-auto">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-semibold uppercase tracking-widest mb-6">
          {label}
        </span>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-tight mb-5">
          {title}
          {titleAccent && (
            <>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-unify-orange to-unify-gold">
                {titleAccent}
              </span>
            </>
          )}
        </h1>
        {subtitle && (
          <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">{subtitle}</p>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" className="w-full fill-white dark:fill-gray-950" preserveAspectRatio="none">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  )
}
