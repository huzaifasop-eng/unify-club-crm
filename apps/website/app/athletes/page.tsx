import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/shared/PageHero'
import Link from 'next/link'
import { Star, Trophy, ArrowRight } from 'lucide-react'

const athletes = [
  { name: 'Ahmed K.', age: 11, sport: 'Football', condition: 'Autism Spectrum', achievement: 'Most Improved Player, UNIFY Championship 2024', years: '4 years', emoji: '⚽', story: 'Ahmed started with us at 7, unable to join team activities. Today he is a team leader who mentors newer athletes.' },
  { name: 'Zara H.', age: 14, sport: 'Swimming', condition: 'Down Syndrome', achievement: 'Gold Medal, 50m Freestyle, 2024 Karachi Inclusive Games', years: '3 years', emoji: '🏊', story: 'Zara discovered a love of water that has translated into extraordinary strength, calm, and self-confidence.' },
  { name: 'Omar B.', age: 9, sport: 'Athletics', condition: 'ADHD', achievement: '100m Sprint Champion, UNIFY Autumn Games 2024', years: '2 years', emoji: '🏃', story: 'Athletics gave Omar an outlet for his boundless energy — and a sense of pride that has transformed his behaviour at school.' },
  { name: 'Sara N.', age: 16, sport: 'Basketball', condition: 'Intellectual Disability', achievement: 'Best Team Player Award 2024', years: '5 years', emoji: '🏀', story: 'Sara\'s journey from shy observer to the loudest voice on the basketball court is one of our favourite UNIFY stories.' },
  { name: 'Hamza R.', age: 12, sport: 'Tennis', condition: 'Cerebral Palsy', achievement: 'Participated in National Wheelchair Tennis Selection 2024', years: '3 years', emoji: '🎾', story: 'Hamza adapted our tennis programme for wheelchair users and has gone on to compete at the national level.' },
  { name: 'Aisha M.', age: 20, sport: 'Inclusive Fitness', condition: 'Down Syndrome', achievement: 'Completed first 5K Run for Inclusion 2024', years: '6 years', emoji: '💪', story: 'Aisha now volunteers as a peer mentor in our adult programme, helping newer athletes find their footing.' },
]

export default function AthletesPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          label="Our Athletes"
          title="Champions in"
          titleAccent="Every Sense"
          subtitle="Meet the extraordinary young people at the heart of UNIFY CLUB — athletes who overcome daily challenges and shine on the field, on the track, and in the pool."
        />

        <section className="section-padding bg-white dark:bg-gray-950">
          <div className="section-container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {athletes.map((athlete) => (
                <div key={athlete.name} className="card-premium overflow-hidden group">
                  <div className="h-36 bg-gradient-to-br from-unify-blue to-unify-navy flex items-center justify-center">
                    <span className="text-7xl group-hover:scale-110 transition-transform duration-300">{athlete.emoji}</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white">{athlete.name}</h3>
                        <p className="text-sm text-unify-blue">{athlete.sport} · Age {athlete.age}</p>
                      </div>
                      <span className="px-2 py-1 rounded-full bg-unify-light text-unify-blue text-xs font-semibold">{athlete.years}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-unify-orange" />
                      {athlete.condition}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{athlete.story}</p>
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-unify-light dark:bg-blue-900/20">
                      <Trophy className="w-4 h-4 text-unify-orange shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{athlete.achievement}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Athlete quote */}
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="bg-unify-navy rounded-3xl p-10 text-white">
                <Star className="w-10 h-10 text-unify-gold mx-auto mb-5" />
                <blockquote className="text-2xl md:text-3xl font-display italic leading-relaxed mb-5">
                  &ldquo;At UNIFY, I am not the child with a disability. I am an athlete.&rdquo;
                </blockquote>
                <cite className="not-italic text-white/60">— Sara N., Age 16, Basketball</cite>
              </div>
            </div>

            {/* Competition records */}
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold font-display text-gray-900 dark:text-white mb-8">
                Competition <span className="gradient-text">Achievements</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { num: '150+', label: 'Medals won' },
                  { num: '20+', label: 'Annual competitions' },
                  { num: '3', label: 'National selections' },
                  { num: '500+', label: 'Personal bests set' },
                ].map((s) => (
                  <div key={s.label} className="card-premium p-4 text-center">
                    <div className="text-3xl font-bold font-display text-unify-blue">{s.num}</div>
                    <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <Link href="/parents#admissions" className="btn-primary mt-8 inline-flex">
                Become an Athlete <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
