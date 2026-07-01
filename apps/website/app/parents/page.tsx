import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/shared/PageHero'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Download } from 'lucide-react'

const faqs = [
  { q: 'What age does UNIFY CLUB accept?', a: 'We accept children from 18 months through to 21 years for most programmes. Our adult programme serves young adults up to 35 years. Early intervention is available from 18 months.' },
  { q: 'Do we need a formal diagnosis to enrol?', a: 'A formal diagnosis is not required to begin the admissions process. Our clinical team will conduct a comprehensive assessment and guide you on the most appropriate programmes for your child.' },
  { q: 'What is the assessment process?', a: 'Our assessment is a 1–2 hour session with our multidisciplinary team. We observe your child in structured and unstructured activities, interview parents, and review any existing reports. You receive a written recommendations report within 5 working days.' },
  { q: 'How many children are in each group?', a: 'Our groups are deliberately small — typically 6–12 children per sports group and 1:1 to small groups for therapy. This ensures each child receives genuine individual attention.' },
  { q: 'Are scholarships available?', a: 'Yes. UNIFY CLUB operates a scholarship programme for families who cannot afford full fees. Please speak confidentially with our admissions team.' },
  { q: 'Can parents observe sessions?', a: 'Parents are welcome to observe from designated viewing areas. We also conduct regular parent meetings and send home weekly progress updates.' },
  { q: 'What qualifications do your coaches and therapists hold?', a: 'All coaches are certified in inclusive sports coaching. All therapists are degree-qualified, professionally registered, and supervised by senior clinicians. Details are available on request.' },
  { q: 'Do you offer online or home-based sessions?', a: 'Certain therapy services (speech, psychology, remedial) are available online. Some therapy programmes offer home visits for children who cannot attend a branch. Please enquire at the time of assessment.' },
]

const downloads = [
  { title: 'Admissions Brochure', desc: 'Complete overview of programmes, fees, and the enrolment process', icon: '📋', file: '#' },
  { title: 'Assessment Form', desc: 'Pre-assessment questionnaire to complete before your appointment', icon: '📝', file: '#' },
  { title: 'Therapy Information Pack', desc: 'Detailed guide to all therapy services, therapist bios, and what to expect', icon: '💙', file: '#' },
  { title: 'Sports Programme Guide', desc: 'Full guide to sports disciplines, schedules, and enrolment', icon: '⚽', file: '#' },
  { title: 'Parent Handbook', desc: 'Everything you need to know as a UNIFY CLUB family', icon: '📖', file: '#' },
  { title: 'Scholarship Application', desc: 'Confidential application for families seeking financial assistance', icon: '🌟', file: '#' },
]

export default function ParentsPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          label="For Parents"
          title="We're With You"
          titleAccent="Every Step"
          subtitle="From your first enquiry to your child's greatest achievement — UNIFY CLUB supports the whole family, not just the child."
        />

        {/* Admissions */}
        <section id="admissions" className="section-padding bg-white dark:bg-gray-950">
          <div className="section-container">
            <div className="max-w-2xl mx-auto text-center mb-14">
              <span className="section-label mb-5">Admissions</span>
              <h2 className="section-title text-gray-900 dark:text-white mt-4">
                How to <span className="gradient-text">Enrol Your Child</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { step: '01', title: 'Initial Enquiry', desc: 'Contact us by phone, WhatsApp, or the form below. Our admissions coordinator will respond within one business day.' },
                { step: '02', title: 'Assessment Booking', desc: 'Schedule a comprehensive assessment with our multidisciplinary team at your nearest branch.' },
                { step: '03', title: 'Personalised Plan', desc: 'Within 5 working days, receive a written recommendations report with the optimal programme combination for your child.' },
                { step: '04', title: 'Enrolment & Start', desc: 'Complete simple paperwork, settle the first term, and your child begins their UNIFY journey.' },
              ].map((s) => (
                <div key={s.step} className="card-premium p-6">
                  <div className="text-3xl font-bold font-display text-unify-orange mb-3">{s.step}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Enquiry form */}
            <div className="max-w-2xl mx-auto card-premium p-8">
              <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-6">Start Your Enquiry</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Parent / Guardian Name *</label>
                    <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-unify-blue/30" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Child&apos;s Name *</label>
                    <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-unify-blue/30" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Child&apos;s Age *</label>
                    <input type="number" min="1" max="40" required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-unify-blue/30" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                    <input type="tel" required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-unify-blue/30" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Diagnosis / Condition (if known)</label>
                  <input type="text" placeholder="e.g. Autism, Down syndrome, ADHD — or 'Not yet diagnosed'" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-unify-blue/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred Branch</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-unify-blue/30">
                    <option value="">Any branch</option>
                    <option>Defence (DHA Phase 6)</option>
                    <option>Clifton (Block 5)</option>
                    <option>North Nazimabad (Block H)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Interests / Goals</label>
                  <textarea rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-unify-blue/30 resize-none" placeholder="Tell us about your child and what you hope to achieve..." />
                </div>
                <button type="submit" className="btn-primary w-full justify-center">
                  Submit Enquiry <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Downloads */}
        <section className="section-padding bg-gray-50 dark:bg-gray-900">
          <div className="section-container">
            <div className="max-w-2xl mx-auto text-center mb-10">
              <span className="section-label mb-5">Resources</span>
              <h2 className="section-title text-gray-900 dark:text-white mt-4">
                Parent <span className="gradient-text">Downloads</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {downloads.map((d) => (
                <a key={d.title} href={d.file} className="card-premium p-5 flex items-start gap-4 hover:shadow-card-hover transition-shadow">
                  <span className="text-3xl">{d.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 dark:text-white mb-1">{d.title}</div>
                    <div className="text-xs text-gray-500">{d.desc}</div>
                  </div>
                  <Download className="w-5 h-5 text-unify-blue shrink-0 mt-1" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="section-padding bg-white dark:bg-gray-950">
          <div className="section-container max-w-3xl">
            <div className="text-center mb-12">
              <span className="section-label mb-5">FAQs</span>
              <h2 className="section-title text-gray-900 dark:text-white mt-4">
                Your Questions <span className="gradient-text">Answered</span>
              </h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.q} className="card-premium p-6">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-unify-teal shrink-0 mt-0.5" />
                    {faq.q}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed ml-7">{faq.a}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-4">Still have questions?</p>
              <Link href="/contact" className="btn-primary">Contact Our Team</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
