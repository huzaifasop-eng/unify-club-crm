import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const therapies = [
  {
    id: 'speech',
    icon: '🗣️',
    title: 'Speech Therapy',
    desc: 'Communication is power. Our certified speech-language pathologists help children find their voice — developing language, articulation, and social communication skills.',
    highlights: ['Language development', 'Articulation', 'Social communication', 'AAC support'],
  },
  {
    id: 'ot',
    icon: '✋',
    title: 'Occupational Therapy',
    desc: 'Building independence through purposeful activity. OT supports fine motor skills, sensory processing, self-care, and daily living activities.',
    highlights: ['Fine motor skills', 'Sensory integration', 'Self-care skills', 'School readiness'],
  },
  {
    id: 'aba',
    icon: '🧠',
    title: 'ABA Therapy',
    desc: 'Evidence-based Applied Behaviour Analysis delivered by Board Certified Behaviour Analysts (BCBAs). Positive, structured, and individualised.',
    highlights: ['Behaviour support', 'Skill acquisition', 'BCBA supervised', 'Data-driven'],
  },
  {
    id: 'pt',
    icon: '🏃',
    title: 'Physical Therapy',
    desc: 'Movement is medicine. Our physiotherapists address mobility, strength, balance, and coordination to maximise physical function and independence.',
    highlights: ['Gross motor skills', 'Balance & coordination', 'Strength training', 'Pain management'],
  },
  {
    id: 'psych',
    icon: '💙',
    title: 'Psychology',
    desc: 'Mental health matters. Our clinical psychologists provide assessment, counselling, and behavioural support for children and families.',
    highlights: ['Psychological assessments', 'Individual therapy', 'Family counselling', 'Anxiety & behaviour'],
  },
  {
    id: 'remedial',
    icon: '📚',
    title: 'Remedial Therapy',
    desc: 'Targeted academic intervention to bridge learning gaps. Our specialists address reading, writing, maths, and cognitive skills.',
    highlights: ['Reading support', 'Writing skills', 'Maths intervention', 'Cognitive skills'],
  },
]

export default function Therapies() {
  return (
    <section className="section-padding bg-white dark:bg-gray-950">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          {/* Left sticky header */}
          <div className="lg:col-span-2 lg:sticky lg:top-32">
            <span className="section-label mb-5">Therapy Services</span>
            <h2 className="section-title text-gray-900 dark:text-white mt-4 mb-6">
              Professional Therapy
              <br />
              <span className="gradient-text">Under One Roof</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              Our multidisciplinary therapy team brings together the best clinical minds in Pakistan.
              Every therapy plan is bespoke — crafted around your child&apos;s unique profile, goals,
              and potential. We don&apos;t treat conditions; we develop children.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 rounded-full bg-unify-orange" />
                Fully qualified, registered therapists
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 rounded-full bg-unify-orange" />
                Individualised therapy plans
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 rounded-full bg-unify-orange" />
                Family-centred approach
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 rounded-full bg-unify-orange" />
                Progress tracked and shared regularly
              </div>
            </div>
            <Link href="/therapies" className="btn-primary mt-10 inline-flex">
              Book an Assessment
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Right: therapy cards */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {therapies.map((t) => (
              <Link
                key={t.id}
                href={`/therapies#${t.id}`}
                className="group card-premium p-6"
              >
                <div className="text-4xl mb-4">{t.icon}</div>
                <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white group-hover:text-unify-blue transition-colors mb-2">
                  {t.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{t.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {t.highlights.map((h) => (
                    <span key={h} className="px-2.5 py-1 rounded-full text-xs font-medium bg-unify-light text-unify-blue dark:bg-blue-900/30 dark:text-blue-400">
                      {h}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
