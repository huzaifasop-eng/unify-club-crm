'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Quote, ChevronLeft, ChevronRight, Star, ArrowRight } from 'lucide-react'

const stories = [
  {
    id: 1,
    name: 'Ahmed, 9',
    condition: 'Autism Spectrum',
    program: 'Football + Speech Therapy',
    quote:
      '"When Ahmed joined UNIFY CLUB two years ago, he wouldn\'t make eye contact or engage with other children. Today he is captain of his team, calling out plays and celebrating with his teammates. The transformation has been nothing short of miraculous."',
    parent: 'Fatima, Ahmed\'s Mother',
    avatar: '👦',
    rating: 5,
    duration: '2 years',
  },
  {
    id: 2,
    name: 'Zara, 12',
    condition: 'Down Syndrome',
    program: 'Swimming + Occupational Therapy',
    quote:
      '"Zara competed in her first swimming gala this year and finished third in her category. I cried the entire race. UNIFY CLUB didn\'t just teach her to swim — they taught her to believe in herself."',
    parent: 'Dr. Sana, Zara\'s Mother',
    avatar: '👧',
    rating: 5,
    duration: '3 years',
  },
  {
    id: 3,
    name: 'Omar, 7',
    condition: 'ADHD & Developmental Delay',
    program: 'Athletics + ABA Therapy',
    quote:
      '"The structured environment at UNIFY CLUB gave Omar the consistency he needed. Within six months his focus had improved dramatically and his teacher told us he was a different child in school. We are forever grateful."',
    parent: 'Bilal, Omar\'s Father',
    avatar: '👦',
    rating: 5,
    duration: '18 months',
  },
  {
    id: 4,
    name: 'Sara, 14',
    condition: 'Intellectual Disability',
    program: 'Basketball + Physical Therapy',
    quote:
      '"Sara has found her people at UNIFY CLUB. She goes to sleep excited for her next session. Her physical strength, social confidence, and self-esteem have grown beyond anything I imagined possible."',
    parent: 'Nadia, Sara\'s Mother',
    avatar: '👧',
    rating: 5,
    duration: '4 years',
  },
]

const testimonials = [
  {
    text: 'The coaches at UNIFY CLUB genuinely love these children. You can feel it in everything they do.',
    author: 'Hina K.',
    role: 'Parent',
  },
  {
    text: 'I have referred many of my patients to UNIFY CLUB. The clinical quality is exceptional.',
    author: 'Dr. Asif Raza',
    role: 'Developmental Paediatrician',
  },
  {
    text: 'As a school principal, partnering with UNIFY CLUB has transformed how we approach inclusion.',
    author: 'Mrs. Kamran',
    role: 'School Principal',
  },
]

export default function Stories() {
  const [active, setActive] = useState(0)

  const prev = () => setActive((a) => (a === 0 ? stories.length - 1 : a - 1))
  const next = () => setActive((a) => (a === stories.length - 1 ? 0 : a + 1))
  const story = stories[active]

  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-900">
      <div className="section-container">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="section-label mb-5">Success Stories</span>
          <h2 className="section-title text-gray-900 dark:text-white mt-4">
            Real Children.
            <br />
            <span className="gradient-text-orange">Real Change.</span>
          </h2>
        </div>

        {/* Featured story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <div className="relative bg-gradient-to-br from-unify-blue to-unify-navy rounded-3xl p-10 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-unify-orange/20 blur-2xl" />
            <Quote className="w-10 h-10 text-unify-orange mb-6" />
            <p className="text-lg leading-relaxed italic mb-8">{story.quote}</p>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{story.avatar}</span>
              <div>
                <div className="font-bold">{story.parent}</div>
                <div className="text-white/60 text-sm">Parent of {story.name} · {story.duration}</div>
              </div>
            </div>
            <div className="flex mt-4">
              {[...Array(story.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-unify-gold text-unify-gold" />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3 mt-8">
              <button onClick={prev} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Previous">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {stories.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`h-1.5 rounded-full transition-all ${i === active ? 'w-8 bg-unify-orange' : 'w-2 bg-white/30'}`}
                    aria-label={`Story ${i + 1}`}
                  />
                ))}
              </div>
              <button onClick={next} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Next">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Story details */}
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-5">
              <span className="text-6xl">{story.avatar}</span>
              <div>
                <h3 className="text-2xl font-bold font-display text-gray-900 dark:text-white">{story.name}</h3>
                <div className="flex flex-col gap-1 mt-1">
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-unify-teal" />
                    {story.condition}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-unify-orange" />
                    {story.program}
                  </span>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-200 dark:bg-gray-700" />

            <div className="space-y-4">
              {stories.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActive(i)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left ${
                    i === active
                      ? 'bg-unify-blue/10 border-2 border-unify-blue/30'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-transparent'
                  }`}
                >
                  <span className="text-3xl">{s.avatar}</span>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{s.name}</div>
                    <div className="text-xs text-gray-500">{s.condition} · {s.program}</div>
                  </div>
                  {i === active && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-unify-orange" />
                  )}
                </button>
              ))}
            </div>

            <Link href="/athletes" className="btn-secondary mt-auto">
              More Stories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Testimonials strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.author} className="card-premium p-6">
              <Quote className="w-8 h-8 text-unify-orange/30 mb-4" />
              <p className="text-gray-700 dark:text-gray-300 italic text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm">{t.author}</div>
                <div className="text-xs text-gray-400">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
