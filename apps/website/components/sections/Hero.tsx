'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Play, ChevronDown } from 'lucide-react'

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden" aria-label="Hero">
      {/* Background */}
      <div className="absolute inset-0 bg-unify-navy">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-unify-navy via-unify-blue/90 to-blue-900/80 z-10" />
        {/* Animated orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-unify-orange/20 blur-3xl z-0 animate-float" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full bg-blue-400/15 blur-3xl z-0 animate-float" style={{ animationDelay: '2s' }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid z-0 opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-20 flex-1 flex flex-col justify-center section-container pt-32 pb-20">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-unify-orange/20 border border-unify-orange/30 text-unify-gold text-sm font-semibold mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-unify-orange animate-pulse" />
            Pakistan&apos;s #1 Inclusive Sports &amp; Therapy Organization
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-display text-white leading-none tracking-tight mb-6 animate-fade-up delay-100">
            Where Every
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-unify-orange via-unify-gold to-yellow-300">
              Child Shines
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/75 leading-relaxed max-w-2xl mb-10 animate-fade-up delay-200">
            Empowering children with intellectual disabilities through world-class inclusive sports,
            professional therapies, and a community built on love, acceptance, and limitless possibility.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 animate-fade-up delay-300">
            <Link href="/parents#admissions" className="btn-orange">
              Apply for Admission
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/programs" className="btn-white">
              Explore Programs
            </Link>
            <button
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
              aria-label="Watch our story"
            >
              <span className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <Play className="w-5 h-5 fill-white ml-0.5" />
              </span>
              <span className="text-sm font-medium">Watch Our Story</span>
            </button>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center gap-8 mt-14 pt-10 border-t border-white/15 animate-fade-up delay-400">
            {[
              { num: '2,500+', label: 'Children Served' },
              { num: '3', label: 'Karachi Branches' },
              { num: '50+', label: 'Expert Coaches' },
              { num: '8', label: 'Sports Disciplines' },
            ].map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <div className="text-3xl sm:text-4xl font-bold font-display text-white">{stat.num}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-20 flex justify-center pb-10 animate-bounce">
        <button
          onClick={() => document.getElementById('mission')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Scroll down"
          className="flex flex-col items-center gap-1 text-white/50 hover:text-white/80 transition-colors"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg viewBox="0 0 1440 80" className="w-full h-auto fill-white dark:fill-gray-950" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  )
}
