import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/shared/PageHero'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const conditions = [
  { id: 'autism', emoji: '🧩', title: 'Autism Spectrum Disorder (ASD)', desc: 'Autism spectrum disorder encompasses a wide range of profiles, from minimally verbal children to highly articulate young adults with social difficulties. UNIFY CLUB\'s structured, sensory-friendly environment and evidence-based ABA and OT programmes are specifically designed for children across the autism spectrum. We celebrate each child\'s unique way of experiencing the world.', programs: ['ABA Therapy', 'Occupational Therapy', 'Football', 'Swimming', 'Unified Sports'] },
  { id: 'down-syndrome', emoji: '💛', title: 'Down Syndrome', desc: 'Children with Down syndrome thrive in the movement-rich, socially warm environment of UNIFY CLUB. Our sports programmes build gross motor skills, strength, and cardiovascular health, while our speech, OT, and physiotherapy teams address the specific developmental needs associated with Down syndrome.', programs: ['Physical Therapy', 'Speech Therapy', 'Swimming', 'Athletics', 'Early Intervention'] },
  { id: 'adhd', emoji: '⚡', title: 'ADHD', desc: 'Physical activity is one of the most powerful tools for children with ADHD. UNIFY CLUB\'s structured, energetic sports programmes channel focus, build impulse control, and release the energy that can make traditional classrooms so difficult. Our psychologists also offer ADHD-specific behavioural coaching.', programs: ['Football', 'Athletics', 'Inclusive Fitness', 'Psychology', 'Weekend Programs'] },
  { id: 'developmental-delay', emoji: '🌱', title: 'Developmental Delay', desc: 'Children with developmental delay benefit enormously from UNIFY CLUB\'s early intervention and therapy programmes. Our multidisciplinary team identifies each child\'s specific delays and delivers targeted interventions to close the gap — in motor, language, cognitive, and social domains.', programs: ['Early Intervention', 'Speech Therapy', 'Occupational Therapy', 'Family Programs'] },
  { id: 'cerebral-palsy', emoji: '♿', title: 'Cerebral Palsy', desc: 'UNIFY CLUB\'s physiotherapy and adapted sports programmes are highly effective for children with cerebral palsy. We adapt every activity to accommodate different mobility levels — from children who are fully mobile to those who use wheelchairs. No child is excluded.', programs: ['Physical Therapy', 'Swimming', 'Inclusive Fitness', 'Athletics'] },
  { id: 'learning', emoji: '📖', title: 'Learning Disabilities', desc: 'Dyslexia, dyscalculia, and other learning disabilities can profoundly affect a child\'s confidence and wellbeing. UNIFY CLUB\'s remedial therapy programme and sports activities address both the academic and emotional dimensions of learning differences.', programs: ['Remedial Therapy', 'Psychology', 'Weekend Programs', 'Family Programs'] },
  { id: 'intellectual', emoji: '🌟', title: 'Intellectual Disabilities', desc: 'Children with intellectual disabilities are at the heart of UNIFY CLUB\'s mission. Every programme — sports, therapy, and social — is designed and adapted to maximise participation and progress regardless of cognitive level.', programs: ['All Sports Programs', 'All Therapy Services', 'Summer Camps', 'Adult Programs'] },
  { id: 'neurodiverse', emoji: '✨', title: 'Neurodiverse Children', desc: 'Many children who do not fit a specific diagnostic category still benefit enormously from UNIFY CLUB. Our inclusive, strengths-based approach welcomes all neurodiverse children — wherever they fall on any spectrum.', programs: ['Unified Sports', 'All Programs', 'Assessment'] },
]

export default function WhoWeServePage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          label="Who We Serve"
          title="Every Child."
          titleAccent="No Exceptions."
          subtitle="UNIFY CLUB was built to serve every child with an intellectual disability, developmental difference, or neurodiverse profile. There is no minimum ability required — only the desire to grow."
        />

        <section className="section-padding bg-white dark:bg-gray-950">
          <div className="section-container">
            <div className="space-y-12">
              {conditions.map((c, i) => (
                <div
                  key={c.id}
                  id={c.id}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-start pb-12 border-b border-gray-100 dark:border-gray-800 last:border-0 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                >
                  <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="flex items-start gap-4 mb-5">
                      <span className="text-5xl">{c.emoji}</span>
                      <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white pt-2">{c.title}</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-5">{c.desc}</p>
                    <Link href="/parents#admissions" className="inline-flex items-center gap-2 text-sm font-semibold text-unify-blue hover:gap-3 transition-all">
                      Enrol Your Child <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className={`card-premium p-6 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4">Recommended Programmes</h4>
                    <div className="flex flex-wrap gap-2">
                      {c.programs.map((p) => (
                        <span key={p} className="px-3 py-1.5 rounded-full bg-unify-light dark:bg-blue-900/30 text-unify-blue dark:text-blue-400 text-sm font-medium">
                          {p}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-sm text-gray-500">
                        Exact programme recommendations are made following a comprehensive assessment by our clinical team.
                        Every child&apos;s plan is unique.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-unify-blue text-white text-center">
          <div className="section-container max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Not Sure If We Can Help?</h2>
            <p className="text-white/70 mb-8">Call us. Our clinical team will discuss your child&apos;s profile and give you an honest assessment of how UNIFY CLUB can help — completely free of charge.</p>
            <Link href="/contact" className="btn-orange">Speak to Our Team <ArrowRight className="w-5 h-5" /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
