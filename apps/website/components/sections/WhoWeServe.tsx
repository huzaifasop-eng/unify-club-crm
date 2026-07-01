import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const conditions = [
  { emoji: '🧩', label: 'Autism Spectrum', color: 'from-blue-400 to-blue-600' },
  { emoji: '💛', label: 'Down Syndrome', color: 'from-yellow-400 to-orange-500' },
  { emoji: '🧠', label: 'ADHD', color: 'from-purple-400 to-purple-600' },
  { emoji: '🌱', label: 'Developmental Delay', color: 'from-green-400 to-emerald-600' },
  { emoji: '♿', label: 'Cerebral Palsy', color: 'from-teal-400 to-cyan-600' },
  { emoji: '📖', label: 'Learning Disabilities', color: 'from-pink-400 to-rose-600' },
  { emoji: '🌟', label: 'Intellectual Disabilities', color: 'from-unify-blue to-indigo-600' },
  { emoji: '✨', label: 'Neurodiverse Children', color: 'from-unify-orange to-amber-500' },
]

export default function WhoWeServe() {
  return (
    <section className="section-padding bg-unify-navy text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-dots opacity-10" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-unify-orange/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl" />

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-semibold uppercase tracking-widest mb-6">
              Who We Serve
            </span>
            <h2 className="text-4xl md:text-5xl font-bold font-display leading-tight mb-6">
              Every Child
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-unify-orange to-unify-gold">
                Is Welcome Here
              </span>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              UNIFY CLUB serves children and young adults across the full spectrum of intellectual
              disabilities, developmental differences, and neurodiverse profiles. There is no
              minimum ability required — only the desire to grow, play, and belong.
            </p>
            <div className="space-y-4 mb-10">
              {[
                'Children aged 3–21 years',
                'Adults with intellectual disabilities',
                'Families seeking support and guidance',
                'Schools seeking inclusion partnerships',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-white/80">
                  <span className="w-5 h-5 rounded-full bg-unify-orange flex items-center justify-center text-white text-xs font-bold">✓</span>
                  {item}
                </div>
              ))}
            </div>
            <Link href="/who-we-serve" className="btn-orange">
              Learn Who We Serve <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Right: condition chips */}
          <div className="grid grid-cols-2 gap-4">
            {conditions.map((c) => (
              <div
                key={c.label}
                className="glass rounded-2xl p-5 flex items-center gap-4 hover:bg-white/20 transition-colors cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform`}>
                  {c.emoji}
                </div>
                <span className="text-sm font-semibold text-white/90">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
