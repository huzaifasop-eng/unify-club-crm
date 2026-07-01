import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/shared/PageHero'
import Link from 'next/link'
import { ArrowRight, Award, Target, Eye, Heart } from 'lucide-react'

const timeline = [
  { year: '2013', title: 'Foundation', desc: 'UNIFY CLUB was founded in Karachi with a single branch and a handful of dedicated coaches and parents united by a shared dream.' },
  { year: '2015', title: 'First Championships', desc: 'We hosted our first internal sports day — 40 children competed, dozens of families wept with joy, and a tradition was born.' },
  { year: '2017', title: 'Therapy Services Launch', desc: 'Recognising the deep need for professional therapy, we launched speech, occupational, and physical therapy under one roof.' },
  { year: '2019', title: 'Second Branch', desc: 'Growing demand led us to open our Clifton branch, doubling capacity and bringing UNIFY closer to more families.' },
  { year: '2021', title: 'ABA & Psychology', desc: 'We added Board-Certified Behaviour Analyst (BCBA) supervised ABA therapy and clinical psychology services.' },
  { year: '2023', title: 'Third Branch & 2,000 Children', desc: 'Our North Nazimabad branch opened its doors, and we celebrated serving 2,000 children — a milestone that moved the entire team to tears.' },
  { year: '2025', title: 'Pakistan\'s Leading Organisation', desc: 'Today, UNIFY CLUB is recognised as Pakistan\'s premier inclusive sports and therapy organisation, with more children and families joining every week.' },
]

const leadership = [
  { name: 'Muhammad Usman', role: 'Founder & CEO', emoji: '👨‍💼', bio: 'A passionate advocate for inclusion, Usman founded UNIFY CLUB after witnessing first-hand the lack of professional services for children with intellectual disabilities in Pakistan.' },
  { name: 'Dr. Ayesha Khan', role: 'Clinical Director', emoji: '👩‍⚕️', bio: 'Board-certified developmental paediatrician with 15 years of experience. Dr. Ayesha leads all clinical and therapy programmes.' },
  { name: 'Imran Hussain', role: 'Head of Sports', emoji: '👨‍🏫', bio: 'Former national-level athlete and certified inclusive sports coach. Imran designs and oversees all sports programming.' },
  { name: 'Sana Mirza', role: 'Director of Operations', emoji: '👩‍💼', bio: 'MBA holder and social entrepreneur. Sana ensures that UNIFY runs with the discipline of a corporation and the warmth of a family.' },
]

const values = [
  { icon: Heart, title: 'Compassion', desc: 'We lead with love. Every decision, every programme, every interaction is rooted in deep care for the children and families we serve.' },
  { icon: Award, title: 'Excellence', desc: 'We hold ourselves to international standards in every aspect — clinical quality, programme design, facilities, and customer care.' },
  { icon: Target, title: 'Accountability', desc: 'We measure everything. Progress, outcomes, satisfaction — we are transparent with families, partners, and donors about our impact.' },
  { icon: Eye, title: 'Inclusion', desc: 'Inclusion is not a programme — it is our identity. We build spaces where every person feels seen, valued, and celebrated.' },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          label="About UNIFY CLUB"
          title="More Than an Organization."
          titleAccent="A Movement."
          subtitle="Born in Karachi. Driven by purpose. Built on the unshakeable belief that every child deserves to belong."
        />

        {/* Story */}
        <section className="section-padding bg-white dark:bg-gray-950">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="section-label mb-5">Our Story</span>
                <h2 className="section-title text-gray-900 dark:text-white mt-4 mb-6">
                  We Started With
                  <br />
                  <span className="gradient-text">One Child&apos;s Smile</span>
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                  <p>
                    UNIFY CLUB was born from frustration and love. Our founder, Muhammad Usman, watched his nephew —
                    a child with Down syndrome — sit on the sidelines while other children played. The message was
                    unspoken but deafening: you don&apos;t belong here.
                  </p>
                  <p>
                    That moment became the foundation of UNIFY CLUB. In 2013, with a borrowed gymnasium, three
                    volunteer coaches, and twelve children, we started something that would grow into Pakistan&apos;s
                    most respected inclusive sports organisation.
                  </p>
                  <p>
                    More than a decade later, we have served over 2,500 children, trained hundreds of coaches and
                    therapists, and built a community that proves inclusion is not an act of charity — it is a
                    human right.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-unify-blue to-unify-navy rounded-3xl p-10 text-white">
                  <blockquote className="text-2xl font-display italic leading-relaxed mb-6">
                    &ldquo;The day UNIFY CLUB opened, a mother told me it was the first time her child had ever been
                    cheered for. That is why we exist.&rdquo;
                  </blockquote>
                  <cite className="not-italic">
                    <div className="font-bold">Muhammad Usman</div>
                    <div className="text-white/60 text-sm">Founder, UNIFY CLUB</div>
                  </cite>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission / Vision / Values */}
        <section className="section-padding bg-gray-50 dark:bg-gray-900">
          <div className="section-container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="card-premium p-8 col-span-1">
                <div className="w-12 h-12 rounded-xl bg-unify-blue flex items-center justify-center mb-5">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-3">Our Mission</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  To empower children and young adults with intellectual disabilities through world-class inclusive
                  sports, professional therapy, and a community that champions their limitless potential.
                </p>
              </div>
              <div className="card-premium p-8 col-span-1">
                <div className="w-12 h-12 rounded-xl bg-unify-orange flex items-center justify-center mb-5">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-3">Our Vision</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  A Pakistan where every person with an intellectual disability has access to quality sports,
                  therapy, and community — and where inclusion is the expectation, not the exception.
                </p>
              </div>
              <div className="card-premium p-8 col-span-1">
                <div className="w-12 h-12 rounded-xl bg-unify-teal flex items-center justify-center mb-5">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-3">Our Promise</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Every family who walks through our doors will be treated with dignity, guided with expertise,
                  and supported with the consistency and care their child deserves. Always.
                </p>
              </div>
            </div>

            {/* Values */}
            <div className="max-w-2xl mx-auto text-center mb-10">
              <h2 className="section-title text-gray-900 dark:text-white">
                Our Core <span className="gradient-text">Values</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v) => {
                const Icon = v.icon
                return (
                  <div key={v.title} className="card-premium p-6">
                    <Icon className="w-8 h-8 text-unify-blue mb-4" />
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">{v.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{v.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="section-padding bg-white dark:bg-gray-950">
          <div className="section-container">
            <div className="max-w-2xl mx-auto text-center mb-14">
              <span className="section-label mb-5">Our Journey</span>
              <h2 className="section-title text-gray-900 dark:text-white mt-4">
                A Decade of <span className="gradient-text-orange">Impact</span>
              </h2>
            </div>
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-unify-blue to-unify-teal" />
              <div className="space-y-8">
                {timeline.map((item) => (
                  <div key={item.year} className="flex items-start gap-6 pl-16 relative">
                    <div className="absolute left-5 -translate-x-1/2 w-7 h-7 rounded-full bg-unify-blue border-4 border-white dark:border-gray-950 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <div className="card-premium p-6 flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold font-display text-unify-orange">{item.year}</span>
                        <span className="font-bold text-gray-900 dark:text-white">{item.title}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="section-padding bg-gray-50 dark:bg-gray-900">
          <div className="section-container">
            <div className="max-w-2xl mx-auto text-center mb-14">
              <span className="section-label mb-5">Leadership</span>
              <h2 className="section-title text-gray-900 dark:text-white mt-4">
                The People <span className="gradient-text">Behind UNIFY</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {leadership.map((person) => (
                <div key={person.name} className="card-premium p-6 text-center">
                  <span className="text-6xl block mb-4">{person.emoji}</span>
                  <h4 className="font-bold font-display text-gray-900 dark:text-white">{person.name}</h4>
                  <p className="text-sm text-unify-blue dark:text-blue-400 font-semibold mb-3">{person.role}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{person.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-unify-blue text-white text-center">
          <div className="section-container max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Join Our Story</h2>
            <p className="text-white/70 mb-8">Be part of a movement that is changing lives every single day across Pakistan.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/parents#admissions" className="btn-orange">Apply for Admission <ArrowRight className="w-5 h-5" /></Link>
              <Link href="/volunteer" className="btn-white">Become a Volunteer</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
