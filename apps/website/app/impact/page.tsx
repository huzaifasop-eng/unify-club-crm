import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/shared/PageHero'
import Link from 'next/link'

const impactStats = [
  { num: '2,500+', label: 'Children Served', desc: 'Children who have participated in UNIFY CLUB programmes since 2013' },
  { num: '1,200+', label: 'Families Supported', desc: 'Families who have received guidance, training, and community support' },
  { num: '3', label: 'Branches', desc: 'Purpose-built centres across Karachi' },
  { num: '50+', label: 'Expert Staff', desc: 'Coaches, therapists, and support professionals' },
  { num: '8', label: 'Sports', desc: 'Disciplines offered in our adapted sports programme' },
  { num: '6', label: 'Therapies', desc: 'Professional therapy disciplines available' },
  { num: '20+', label: 'Annual Events', desc: 'Competitions, camps, workshops, and community events per year' },
  { num: '10+', label: 'Years of Impact', desc: 'Serving Karachi since 2013' },
]

const caseStudies = [
  {
    title: 'From Isolation to Championship',
    child: 'Ali, 11 — Autism Spectrum',
    desc: 'Ali joined UNIFY CLUB at age 7 with significant social withdrawal and no functional communication. Four years of intensive ABA, speech therapy, and football have produced a child who now leads team chants, has a best friend, and recently won the Most Improved Player award at our annual championship.',
    outcome: 'From non-verbal to team captain',
    emoji: '🏆',
  },
  {
    title: 'First Steps at Thirty',
    child: 'Samina, 28 — Intellectual Disability',
    desc: 'Samina joined our adult programme after years of being told she was too old to benefit from sport. Within 18 months she had run her first 5K, lost 12kg, and told our coaches it was the first time she had ever felt proud of her body.',
    outcome: 'Independent living skills + first 5K run',
    emoji: '🏃',
  },
  {
    title: 'A School That Chose Inclusion',
    child: 'Bright Futures Academy, Karachi',
    desc: 'We partnered with Bright Futures Academy to deliver a 6-month Unified Sports programme. The result: their mainstream students reported dramatically increased empathy, their students with disabilities reported feeling "like proper part of the school," and three parents wrote to say it was the best thing the school had ever done.',
    outcome: 'School-wide culture shift toward inclusion',
    emoji: '🏫',
  },
]

export default function ImpactPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          label="Our Impact"
          title="Numbers Tell"
          titleAccent="One Story"
          subtitle="The real story is in the faces of children who found their place in the world. But the numbers matter too."
        />

        {/* Stats grid */}
        <section className="section-padding bg-white dark:bg-gray-950">
          <div className="section-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {impactStats.map((s) => (
                <div key={s.label} className="card-premium p-6 text-center">
                  <div className="text-4xl md:text-5xl font-bold font-display text-unify-blue dark:text-blue-400 mb-1">{s.num}</div>
                  <div className="font-bold text-gray-900 dark:text-white text-sm mb-1">{s.label}</div>
                  <div className="text-xs text-gray-500">{s.desc}</div>
                </div>
              ))}
            </div>

            {/* Annual impact narrative */}
            <div className="max-w-3xl mx-auto bg-unify-light dark:bg-gray-800 rounded-3xl p-8 md:p-12 text-center mb-16">
              <h2 className="text-3xl font-bold font-display text-gray-900 dark:text-white mb-5">
                2024 in Numbers
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { num: '412', label: 'New children enrolled' },
                  { num: '3,840', label: 'Therapy sessions delivered' },
                  { num: '18', label: 'Competitions hosted' },
                  { num: '96%', label: 'Parent satisfaction rate' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-3xl font-bold font-display text-unify-blue">{s.num}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Case studies */}
            <div className="max-w-2xl mx-auto text-center mb-12">
              <span className="section-label mb-5">Case Studies</span>
              <h2 className="section-title text-gray-900 dark:text-white mt-4">
                Stories Behind <span className="gradient-text-orange">the Stats</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {caseStudies.map((c) => (
                <div key={c.title} className="card-premium p-7">
                  <span className="text-5xl block mb-4">{c.emoji}</span>
                  <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white mb-1">{c.title}</h3>
                  <p className="text-xs font-semibold text-unify-blue mb-3">{c.child}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{c.desc}</p>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-unify-light dark:bg-blue-900/30 text-sm font-semibold text-unify-blue">
                    ✓ {c.outcome}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-unify-blue text-white text-center">
          <div className="section-container max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Help Us Create More Impact</h2>
            <p className="text-white/70 mb-8">Every donation, every volunteer hour, every enrolment adds to this story of change. Be part of it.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/donate" className="btn-orange">Donate Now</Link>
              <Link href="/volunteer" className="btn-white">Volunteer</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
