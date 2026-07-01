import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'

const programs = [
  {
    id: 'football',
    emoji: '⚽',
    title: 'Football',
    category: 'Team Sport',
    desc: 'Inclusive football builds teamwork, coordination, and confidence in a fun, supportive environment.',
    color: 'from-green-500 to-emerald-600',
    tag: 'Most Popular',
  },
  {
    id: 'basketball',
    emoji: '🏀',
    title: 'Basketball',
    category: 'Team Sport',
    desc: 'Developing motor skills and social bonds through the universal language of basketball.',
    color: 'from-orange-500 to-amber-600',
    tag: null,
  },
  {
    id: 'swimming',
    emoji: '🏊',
    title: 'Swimming',
    category: 'Individual Sport',
    desc: 'Therapeutic and empowering — swimming builds strength, calm, and independence.',
    color: 'from-blue-500 to-cyan-600',
    tag: 'Therapeutic',
  },
  {
    id: 'athletics',
    emoji: '🏃',
    title: 'Athletics',
    category: 'Track & Field',
    desc: 'Running, jumping, and throwing — celebrating every personal best on the track.',
    color: 'from-purple-500 to-violet-600',
    tag: null,
  },
  {
    id: 'tennis',
    emoji: '🎾',
    title: 'Tennis',
    category: 'Racquet Sport',
    desc: 'Focus, precision, and fun — tennis is adapted for all ability levels.',
    color: 'from-yellow-500 to-lime-600',
    tag: null,
  },
  {
    id: 'fitness',
    emoji: '💪',
    title: 'Inclusive Fitness',
    category: 'Wellness',
    desc: 'Structured fitness programs designed specifically for diverse abilities and goals.',
    color: 'from-rose-500 to-pink-600',
    tag: 'New',
  },
  {
    id: 'unified',
    emoji: '🤝',
    title: 'Unified Sports',
    category: 'Inclusion Program',
    desc: 'Athletes with and without intellectual disabilities train and compete together.',
    color: 'from-unify-blue to-indigo-700',
    tag: 'Flagship',
  },
  {
    id: 'camps',
    emoji: '🏕️',
    title: 'Summer Camps',
    category: 'Seasonal',
    desc: 'Immersive multi-week programs packed with sports, art, therapy, and friendship.',
    color: 'from-teal-500 to-cyan-600',
    tag: 'Seasonal',
  },
]

export default function Programs() {
  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-900">
      <div className="section-container">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <span className="section-label mb-4">Our Programs</span>
            <h2 className="section-title text-gray-900 dark:text-white mt-3">
              A Program for
              <br />
              <span className="gradient-text">Every Ability</span>
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-sm">
            Eight professionally designed sports and fitness disciplines, each adapted to meet children where they are.
          </p>
        </div>

        {/* Programs grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {programs.map((prog) => (
            <Link
              key={prog.id}
              href={`/programs#${prog.id}`}
              className="group relative card-premium overflow-hidden"
            >
              {/* Tag */}
              {prog.tag && (
                <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-bold bg-unify-orange text-white">
                  {prog.tag}
                </div>
              )}

              {/* Gradient header */}
              <div className={`h-32 bg-gradient-to-br ${prog.color} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10" />
                <span className="text-6xl relative z-10 group-hover:scale-110 transition-transform duration-300">
                  {prog.emoji}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{prog.category}</div>
                <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white group-hover:text-unify-blue transition-colors">
                  {prog.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed line-clamp-2">{prog.desc}</p>
                <div className="flex items-center gap-1 mt-4 text-sm font-semibold text-unify-blue group-hover:gap-2 transition-all">
                  Learn More <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/programs" className="btn-primary">
            <Zap className="w-5 h-5" />
            Explore All Programs
          </Link>
        </div>
      </div>
    </section>
  )
}
