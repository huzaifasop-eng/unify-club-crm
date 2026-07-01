import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/shared/PageHero'
import Link from 'next/link'
import { ArrowRight, Clock, Users, Star } from 'lucide-react'

const sportsPrograms = [
  {
    id: 'football',
    emoji: '⚽',
    title: 'Football',
    ages: '5–21 years',
    groupSize: 'Max 12 per group',
    sessions: '3x per week',
    desc: 'Our flagship sport. Children develop teamwork, coordination, gross motor skills, and social bonds through structured football training. Adapted for all ability levels with certified inclusive coaches.',
    outcomes: ['Motor coordination', 'Teamwork & communication', 'Cardiovascular fitness', 'Social confidence'],
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: 'basketball',
    emoji: '🏀',
    title: 'Basketball',
    ages: '6–21 years',
    groupSize: 'Max 10 per group',
    sessions: '2x per week',
    desc: 'Basketball builds spatial awareness, hand-eye coordination, and the ability to follow complex instructions in a fast-paced, exciting environment.',
    outcomes: ['Hand-eye coordination', 'Following instructions', 'Gross motor skills', 'Team spirit'],
    color: 'from-orange-500 to-amber-600',
  },
  {
    id: 'swimming',
    emoji: '🏊',
    title: 'Swimming',
    ages: '4–21 years',
    groupSize: 'Max 6 per group',
    sessions: '2x per week',
    desc: 'Swimming is profoundly therapeutic. The sensory input of water, combined with structured skill-building, makes swimming one of our most powerful programmes for children with sensory processing differences.',
    outcomes: ['Water safety', 'Sensory regulation', 'Full-body strength', 'Confidence building'],
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'athletics',
    emoji: '🏃',
    title: 'Athletics',
    ages: '6–21 years',
    groupSize: 'Max 15 per group',
    sessions: '2x per week',
    desc: 'Track and field events — running, jumping, and throwing — adapted to celebrate every child\'s personal best rather than measure against others.',
    outcomes: ['Personal goal-setting', 'Explosive power', 'Endurance', 'Self-belief'],
    color: 'from-purple-500 to-violet-600',
  },
  {
    id: 'tennis',
    emoji: '🎾',
    title: 'Tennis',
    ages: '7–21 years',
    groupSize: 'Max 8 per group',
    sessions: '2x per week',
    desc: 'Tennis develops focus, reaction time, and fine motor control. Our adaptive programme uses modified equipment and simplified rules to ensure every child can participate and succeed.',
    outcomes: ['Focus & attention', 'Fine motor control', 'Reaction speed', 'Problem-solving'],
    color: 'from-yellow-500 to-lime-600',
  },
  {
    id: 'badminton',
    emoji: '🏸',
    title: 'Badminton',
    ages: '7–21 years',
    groupSize: 'Max 8 per group',
    sessions: '2x per week',
    desc: 'A precision sport that develops eye-tracking, bilateral coordination, and strategic thinking in a friendly, low-pressure environment.',
    outcomes: ['Eye tracking', 'Bilateral coordination', 'Agility', 'Strategic thinking'],
    color: 'from-teal-500 to-emerald-500',
  },
  {
    id: 'fitness',
    emoji: '💪',
    title: 'Inclusive Fitness',
    ages: '12–35 years',
    groupSize: 'Max 10 per group',
    sessions: '3x per week',
    desc: 'A structured gym-based fitness programme designed specifically for teens and young adults. Circuit training, resistance work, and cardiovascular conditioning adapted for every ability.',
    outcomes: ['Strength & endurance', 'Body awareness', 'Healthy habits', 'Independence'],
    color: 'from-rose-500 to-pink-600',
  },
  {
    id: 'unified',
    emoji: '🤝',
    title: 'Unified Sports',
    ages: '8–21 years',
    groupSize: 'Mixed groups',
    sessions: 'Weekly',
    desc: 'Our most powerful inclusion programme. Athletes with and without intellectual disabilities train and compete together as genuine teammates — developing mutual respect, empathy, and friendship.',
    outcomes: ['Inclusion experience', 'Social skills', 'Community building', 'Leadership'],
    color: 'from-unify-blue to-indigo-700',
    featured: true,
  },
]

const specialPrograms = [
  {
    id: 'early',
    title: 'Early Intervention',
    ages: '18 months – 5 years',
    desc: 'For the very youngest children, early intervention is the single most impactful investment a family can make. Our specialised early intervention programme combines sensory play, movement, and pre-academic skills.',
    icon: '🌱',
  },
  {
    id: 'camps',
    title: 'Summer & Holiday Camps',
    ages: 'All ages',
    desc: 'Immersive multi-week holiday programmes packed with sports, swimming, art, therapy activities, and friendships. The highlight of every child\'s year.',
    icon: '🏕️',
  },
  {
    id: 'weekend',
    title: 'Weekend Programs',
    ages: 'All ages',
    desc: 'Saturday and Sunday sessions for families who cannot commit to weekday attendance. All of the UNIFY experience in a convenient weekend format.',
    icon: '📅',
  },
  {
    id: 'school',
    title: 'School Programs',
    ages: 'School-age children',
    desc: 'We bring UNIFY directly to schools — training their PE teachers, running in-school sports sessions, and helping campuses become truly inclusive.',
    icon: '🏫',
  },
  {
    id: 'family',
    title: 'Family Programs',
    ages: 'Families',
    desc: 'Parents, siblings, and caregivers participate together. Family programmes build understanding, reduce caregiver stress, and celebrate each child\'s progress as a shared victory.',
    icon: '👨‍👩‍👦',
  },
  {
    id: 'adult',
    title: 'Adult Programs',
    ages: '18–40 years',
    desc: 'Inclusion doesn\'t end at 18. Our adult programme provides sports, social activities, and fitness for young adults with intellectual disabilities who want to stay active, connected, and valued.',
    icon: '🌟',
  },
]

export default function ProgramsPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          label="Our Programs"
          title="A Program for"
          titleAccent="Every Ability"
          subtitle="Eight sports disciplines and six specialised programmes — all designed, adapted, and delivered by certified inclusive coaches and therapists."
        />

        {/* Sports Programs */}
        <section className="section-padding bg-white dark:bg-gray-950">
          <div className="section-container">
            <div className="max-w-2xl mx-auto text-center mb-14">
              <span className="section-label mb-5">Sports Programmes</span>
              <h2 className="section-title text-gray-900 dark:text-white mt-4">
                Move. Compete. <span className="gradient-text">Shine.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sportsPrograms.map((prog) => (
                <div
                  key={prog.id}
                  id={prog.id}
                  className={`card-premium overflow-hidden ${prog.featured ? 'md:col-span-2 lg:col-span-1' : ''}`}
                >
                  {prog.featured && (
                    <div className="bg-unify-orange text-white text-xs font-bold uppercase tracking-widest py-2 text-center">
                      ★ Flagship Programme
                    </div>
                  )}
                  <div className={`h-28 bg-gradient-to-br ${prog.color} flex items-center justify-center`}>
                    <span className="text-6xl">{prog.emoji}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-2">{prog.title}</h3>
                    <div className="flex flex-wrap gap-3 mb-4">
                      <span className="flex items-center gap-1 text-xs text-gray-500"><Users className="w-3 h-3" />{prog.ages}</span>
                      <span className="flex items-center gap-1 text-xs text-gray-500"><Users className="w-3 h-3" />{prog.groupSize}</span>
                      <span className="flex items-center gap-1 text-xs text-gray-500"><Clock className="w-3 h-3" />{prog.sessions}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{prog.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {prog.outcomes.map((o) => (
                        <span key={o} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-unify-light text-unify-blue">
                          <Star className="w-2.5 h-2.5" />{o}
                        </span>
                      ))}
                    </div>
                    <Link href="/parents#admissions" className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-unify-blue hover:gap-3 transition-all">
                      Enrol Now <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Special Programs */}
        <section className="section-padding bg-gray-50 dark:bg-gray-900">
          <div className="section-container">
            <div className="max-w-2xl mx-auto text-center mb-14">
              <span className="section-label mb-5">Specialised Programmes</span>
              <h2 className="section-title text-gray-900 dark:text-white mt-4">
                Beyond <span className="gradient-text-orange">Sport</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {specialPrograms.map((prog) => (
                <div key={prog.id} id={prog.id} className="card-premium p-7">
                  <span className="text-5xl block mb-4">{prog.icon}</span>
                  <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white mb-1">{prog.title}</h3>
                  <p className="text-xs text-unify-blue font-semibold mb-3">{prog.ages}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{prog.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-unify-blue text-white text-center">
          <div className="section-container max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Ready to Find the Right Programme?</h2>
            <p className="text-white/70 mb-8">Our team will guide you to the perfect combination of sports and therapy for your child&apos;s unique needs.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/parents#admissions" className="btn-orange">Book an Assessment <ArrowRight className="w-5 h-5" /></Link>
              <Link href="/contact" className="btn-white">Speak to a Coach</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
