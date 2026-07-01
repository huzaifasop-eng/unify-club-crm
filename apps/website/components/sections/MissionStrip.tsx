'use client'

import { useEffect, useRef, useState } from 'react'
import { Heart, Star, Users, Trophy } from 'lucide-react'

const values = [
  {
    icon: Heart,
    title: 'Inclusion First',
    desc: 'Every child, regardless of ability, belongs in sports, play, and community.',
    color: 'text-rose-500',
    bg: 'bg-rose-50',
  },
  {
    icon: Star,
    title: 'Professional Excellence',
    desc: 'Certified coaches, therapists, and educators dedicated to each child\'s growth.',
    color: 'text-unify-orange',
    bg: 'bg-orange-50',
  },
  {
    icon: Users,
    title: 'Family Partnership',
    desc: 'We walk alongside families — supporting, guiding, and celebrating every milestone.',
    color: 'text-unify-teal',
    bg: 'bg-teal-50',
  },
  {
    icon: Trophy,
    title: 'Limitless Potential',
    desc: 'We believe in every child\'s ability to achieve beyond expectation.',
    color: 'text-unify-blue',
    bg: 'bg-blue-50',
  },
]

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const observed = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !observed.current) {
          observed.current = true
          const duration = 2000
          const steps = 60
          const increment = target / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

const stats = [
  { num: 2500, suffix: '+', label: 'Children Served', sublabel: 'and counting' },
  { num: 3, suffix: '', label: 'Branches', sublabel: 'across Karachi' },
  { num: 50, suffix: '+', label: 'Expert Staff', sublabel: 'coaches & therapists' },
  { num: 8, suffix: '', label: 'Sports', sublabel: 'disciplines offered' },
  { num: 1200, suffix: '+', label: 'Families', sublabel: 'supported' },
  { num: 10, suffix: '+', label: 'Years', sublabel: 'of impact' },
]

export default function MissionStrip() {
  return (
    <section id="mission" className="section-padding bg-white dark:bg-gray-950">
      <div className="section-container">
        {/* Mission */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <span className="section-label mb-5">Our Mission</span>
          <h2 className="section-title text-gray-900 dark:text-white mt-4 mb-6">
            Championing Inclusion
            <br />
            <span className="gradient-text">Through Sports & Therapy</span>
          </h2>
          <p className="section-subtitle mx-auto text-gray-600 dark:text-gray-300">
            UNIFY CLUB was founded on a single, powerful belief: that every child — regardless of ability —
            deserves the joy of sports, the support of therapy, and the warmth of a community that truly sees them.
          </p>
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {values.map((v) => {
            const Icon = v.icon
            return (
              <div key={v.title} className="card-premium p-8 flex flex-col gap-4">
                <div className={`w-14 h-14 rounded-2xl ${v.bg} flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 ${v.color}`} />
                </div>
                <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white">{v.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{v.desc}</p>
              </div>
            )
          })}
        </div>

        {/* Stats */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-unify-blue to-blue-700 rounded-3xl" />
          <div className="absolute inset-0 bg-dots opacity-10 rounded-3xl" />
          <div className="relative z-10 py-12 px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold font-display text-white">
                  <CountUp target={s.num} suffix={s.suffix} />
                </div>
                <div className="text-base font-semibold text-white/90 mt-1">{s.label}</div>
                <div className="text-xs text-white/60">{s.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
