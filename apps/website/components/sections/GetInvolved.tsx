import Link from 'next/link'
import { Heart, Users, Briefcase, ArrowRight } from 'lucide-react'

const cards = [
  {
    icon: Heart,
    color: 'bg-rose-500',
    title: 'Donate',
    subtitle: 'Change a life today',
    desc: 'Your donation directly funds sports equipment, therapy sessions, and scholarships for children who cannot afford them. Every rupee creates impact.',
    cta: 'Donate Now',
    href: '/donate',
    bg: 'from-rose-500 to-pink-600',
  },
  {
    icon: Users,
    color: 'bg-unify-blue',
    title: 'Volunteer',
    subtitle: 'Give your time',
    desc: 'Coaches, therapists, drivers, photographers, administrators — we need passionate people. Join our volunteer family and discover the joy of giving.',
    cta: 'Become a Volunteer',
    href: '/volunteer',
    bg: 'from-unify-blue to-indigo-700',
  },
  {
    icon: Briefcase,
    color: 'bg-unify-teal',
    title: 'Corporate CSR',
    subtitle: 'Partner with purpose',
    desc: 'Transform your CSR budget into real, measurable social impact. Sponsor a child, equip a branch, or co-brand our annual championships.',
    cta: 'Partner With Us',
    href: '/donate#csr',
    bg: 'from-teal-500 to-cyan-600',
  },
]

export default function GetInvolved() {
  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-900">
      <div className="section-container">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="section-label mb-5">Get Involved</span>
          <h2 className="section-title text-gray-900 dark:text-white mt-4">
            Be Part of
            <br />
            <span className="gradient-text-orange">Something Greater</span>
          </h2>
          <p className="section-subtitle mt-4 mx-auto">
            Whether you give time, talent, or treasure — every act of support directly transforms the life of a child.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.title} className="group relative overflow-hidden rounded-3xl">
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10 bg-white dark:bg-gray-800 group-hover:bg-transparent border border-gray-100 dark:border-gray-700 rounded-3xl p-8 transition-all duration-500 h-full">
                  <div className={`w-14 h-14 rounded-2xl ${card.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-white/60 transition-colors mb-1">
                    {card.subtitle}
                  </div>
                  <h3 className="text-2xl font-bold font-display text-gray-900 dark:text-white group-hover:text-white transition-colors mb-3">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 group-hover:text-white/80 transition-colors leading-relaxed mb-8">
                    {card.desc}
                  </p>
                  <Link
                    href={card.href}
                    className="inline-flex items-center gap-2 font-semibold text-unify-blue group-hover:text-white transition-colors"
                  >
                    {card.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Donate impact calculator teaser */}
        <div className="mt-12 p-8 md:p-10 rounded-3xl bg-unify-blue text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold font-display mb-2">See Your Impact</h3>
            <p className="text-white/70">
              PKR 5,000 funds one month of sports for a child.
              PKR 15,000 covers a full therapy session package.
              PKR 50,000 sponsors a child for an entire term.
            </p>
          </div>
          <Link href="/donate#impact" className="btn-orange whitespace-nowrap shrink-0">
            Calculate My Impact
          </Link>
        </div>
      </div>
    </section>
  )
}
