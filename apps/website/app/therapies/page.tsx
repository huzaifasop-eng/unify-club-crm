import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/shared/PageHero'
import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'

const therapies = [
  {
    id: 'speech',
    emoji: '🗣️',
    title: 'Speech & Language Therapy',
    therapist: 'Speech-Language Pathologists (SLPs)',
    desc: 'Communication is at the heart of every human connection. Our certified SLPs work with children to develop expressive and receptive language, articulation, social pragmatics, and — where needed — Augmentative and Alternative Communication (AAC) systems.',
    who: 'Children with autism, Down syndrome, developmental delay, stuttering, language disorders, or any communication difficulty.',
    outcomes: [
      'Expressive language development',
      'Receptive language comprehension',
      'Articulation & phonology',
      'Social communication skills',
      'AAC (communication devices, PECS)',
      'Feeding & swallowing',
    ],
  },
  {
    id: 'ot',
    emoji: '✋',
    title: 'Occupational Therapy',
    therapist: 'Occupational Therapists (OTs)',
    desc: 'Occupational therapy enables children to participate fully in the activities that matter most — school, play, self-care, and family life. Our OTs assess sensory processing, fine motor skills, visual-motor integration, and daily living activities, then create bespoke intervention plans.',
    who: 'Children with autism, sensory processing disorder, developmental coordination disorder, ADHD, Down syndrome, or cerebral palsy.',
    outcomes: [
      'Fine motor skills & handwriting',
      'Sensory integration & regulation',
      'Self-care independence (dressing, eating)',
      'Visual-motor integration',
      'School readiness',
      'Play skills',
    ],
  },
  {
    id: 'aba',
    emoji: '🧠',
    title: 'ABA Therapy',
    therapist: 'BCBA-Supervised Behaviour Technicians',
    desc: 'Applied Behaviour Analysis (ABA) is the most evidence-based intervention for autism spectrum disorder. Our ABA programme is supervised by Board Certified Behaviour Analysts (BCBAs) and delivered through positive, naturalistic, child-led sessions — not the rigid, repetitive drills of the past.',
    who: 'Primarily for children with autism spectrum disorder (ASD), but also effective for intellectual disabilities and behaviour challenges.',
    outcomes: [
      'Communication & language',
      'Social skills',
      'Adaptive daily living skills',
      'Reduction of challenging behaviours',
      'Academic & pre-academic skills',
      'Generalisation across environments',
    ],
  },
  {
    id: 'pt',
    emoji: '🏃',
    title: 'Physical Therapy',
    therapist: 'Physiotherapists (PT)',
    desc: 'Physical therapy maximises a child\'s movement potential. Our physiotherapists assess gross motor development, muscle tone, balance, coordination, and gait — then design targeted exercise programmes that improve physical function and independence.',
    who: 'Children with cerebral palsy, Down syndrome, muscular dystrophy, gross motor delay, or any condition affecting movement and physical function.',
    outcomes: [
      'Gross motor skill development',
      'Balance & coordination',
      'Muscle strength & tone',
      'Gait & mobility',
      'Pain management',
      'Posture & alignment',
    ],
  },
  {
    id: 'psych',
    emoji: '💙',
    title: 'Clinical Psychology',
    therapist: 'Clinical Psychologists',
    desc: 'Mental health support for children, young people, and their families. Our clinical psychologists provide comprehensive psychological assessments, individual therapy, and family counselling — all grounded in evidence-based approaches.',
    who: 'Children experiencing anxiety, depression, trauma, emotional dysregulation, or behaviour difficulties. Also for families seeking support and guidance.',
    outcomes: [
      'Psychological & cognitive assessment',
      'Anxiety & behaviour management',
      'Emotional regulation skills',
      'Individual therapy (CBT, play therapy)',
      'Family therapy & coaching',
      'School & diagnostic reports',
    ],
  },
  {
    id: 'remedial',
    emoji: '📚',
    title: 'Remedial Therapy',
    therapist: 'Specialist Educators',
    desc: 'Targeted academic intervention for children experiencing learning difficulties. Our remedial specialists identify the root causes of a child\'s academic challenges and deliver structured, evidence-based programmes to build literacy, numeracy, and cognitive skills.',
    who: 'Children with dyslexia, dyscalculia, learning disabilities, intellectual disabilities, or any child struggling academically despite adequate schooling.',
    outcomes: [
      'Literacy & reading intervention',
      'Numeracy & maths skills',
      'Writing & spelling',
      'Memory & attention strategies',
      'Study skills',
      'Academic confidence',
    ],
  },
]

export default function TherapiesPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          label="Therapy Services"
          title="Professional Therapy."
          titleAccent="Transformational Outcomes."
          subtitle="Six evidence-based therapy disciplines delivered by fully qualified specialists. Every child receives an individualised plan designed around their unique needs and goals."
        />

        {/* Intro */}
        <section className="section-padding bg-white dark:bg-gray-950">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {[
                { title: 'Fully Qualified', desc: 'All therapists are degree-qualified, registered with professional bodies, and committed to ongoing professional development.' },
                { title: 'Individualised Plans', desc: 'No two children receive the same programme. Every plan is built from a comprehensive assessment of your child\'s unique profile.' },
                { title: 'Family-Centred', desc: 'We view parents as partners. You will receive regular updates, home programmes, and training to maximise your child\'s progress.' },
              ].map((item) => (
                <div key={item.title} className="card-premium p-6">
                  <h3 className="font-bold font-display text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Therapy details */}
            <div className="space-y-12">
              {therapies.map((t) => (
                <div key={t.id} id={t.id} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start pb-12 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div>
                    <div className="flex items-start gap-4 mb-5">
                      <span className="text-5xl">{t.emoji}</span>
                      <div>
                        <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white">{t.title}</h2>
                        <p className="text-sm text-unify-blue font-semibold mt-1">{t.therapist}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{t.desc}</p>
                    <div className="p-4 rounded-xl bg-unify-light dark:bg-blue-900/20 text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-semibold text-unify-blue">Suitable for: </span>{t.who}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4">Key Outcomes</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {t.outcomes.map((o) => (
                        <div key={o} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <CheckCircle className="w-4 h-4 text-unify-teal shrink-0" />
                          {o}
                        </div>
                      ))}
                    </div>
                    <Link href="/parents#admissions" className="btn-primary mt-6 inline-flex">
                      Book an Assessment <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-unify-blue text-white text-center">
          <div className="section-container max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Not Sure Which Therapy Your Child Needs?</h2>
            <p className="text-white/70 mb-8">Book a comprehensive assessment with our multidisciplinary team. We will guide you to the right combination of therapies for your child&apos;s specific needs.</p>
            <Link href="/parents#admissions" className="btn-orange">Book a Comprehensive Assessment <ArrowRight className="w-5 h-5" /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
