import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/shared/PageHero'
import Link from 'next/link'
import { Heart, ArrowRight, CheckCircle } from 'lucide-react'

const donationTiers = [
  { amount: 'PKR 5,000', title: 'Sports Sponsor', desc: 'Funds one month of sports sessions for one child. Your gift keeps them active, connected, and growing.', icon: '⚽', popular: false },
  { amount: 'PKR 15,000', title: 'Therapy Sponsor', desc: 'Covers a full month of professional therapy sessions. A direct investment in a child\'s clinical progress.', icon: '💙', popular: true },
  { amount: 'PKR 30,000', title: 'Term Sponsor', desc: 'Sponsors one full school term of combined sports and therapy for a child who could not otherwise afford it.', icon: '🌟', popular: false },
  { amount: 'PKR 100,000', title: 'Scholarship Donor', desc: 'Provides a full year of comprehensive UNIFY CLUB support for one child — sports, therapy, and assessments.', icon: '🏆', popular: false },
]

const csrPackages = [
  { title: 'Bronze', amount: 'PKR 250,000', benefits: ['Branch naming rights (one session)', 'Social media recognition', 'Certificate of appreciation', 'Impact report'] },
  { title: 'Silver', amount: 'PKR 500,000', benefits: ['Equipment sponsorship with branding', 'Monthly social media features', 'Press release', 'Annual impact report', 'VIP event invitation'] },
  { title: 'Gold', amount: 'PKR 1,000,000+', benefits: ['Annual event title sponsorship', 'Full branch co-branding', 'Quarterly CSR reports', 'Media coverage', 'Board-level recognition', 'Custom impact video'] },
]

export default function DonatePage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          label="Donate"
          title="Change a Life"
          titleAccent="Today"
          subtitle="Every donation directly funds a child's sports session, therapy appointment, or scholarship. The impact is real, measurable, and permanent."
        />

        {/* Donation tiers */}
        <section className="section-padding bg-white dark:bg-gray-950">
          <div className="section-container">
            <div className="max-w-2xl mx-auto text-center mb-14">
              <span className="section-label mb-5">Sponsor a Child</span>
              <h2 className="section-title text-gray-900 dark:text-white mt-4">
                Every Rupee <span className="gradient-text">Creates Impact</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {donationTiers.map((tier) => (
                <div key={tier.title} className={`card-premium p-6 relative ${tier.popular ? 'ring-2 ring-unify-orange ring-offset-4' : ''}`}>
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-unify-orange text-white text-xs font-bold whitespace-nowrap">
                      Most Popular
                    </div>
                  )}
                  <span className="text-5xl block mb-4">{tier.icon}</span>
                  <div className="text-2xl font-bold font-display text-unify-blue mb-1">{tier.amount}</div>
                  <div className="font-bold text-gray-900 dark:text-white mb-3">{tier.title}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5">{tier.desc}</p>
                  <button className="btn-primary w-full justify-center text-sm py-3">
                    <Heart className="w-4 h-4" /> Donate {tier.amount}
                  </button>
                </div>
              ))}
            </div>

            {/* Custom amount */}
            <div className="max-w-xl mx-auto text-center p-8 rounded-3xl bg-unify-light dark:bg-gray-800 border-2 border-dashed border-unify-blue/30">
              <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-2">Choose Your Own Amount</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-5">Every amount matters. Enter whatever you can give and we will tell you exactly what it funds.</p>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Enter amount (PKR)"
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-unify-blue/30"
                />
                <button className="btn-primary px-6 py-3">Donate</button>
              </div>
            </div>
          </div>
        </section>

        {/* CSR */}
        <section id="csr" className="section-padding bg-gray-50 dark:bg-gray-900">
          <div className="section-container">
            <div className="max-w-2xl mx-auto text-center mb-14">
              <span className="section-label mb-5">Corporate CSR</span>
              <h2 className="section-title text-gray-900 dark:text-white mt-4">
                Partner With <span className="gradient-text-orange">Purpose</span>
              </h2>
              <p className="section-subtitle mt-4 mx-auto">
                Transform your CSR investment into measurable social impact. Our corporate packages deliver quantified outcomes, media coverage, and the kind of positive association that money cannot buy.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {csrPackages.map((pkg) => (
                <div key={pkg.title} className="card-premium p-7">
                  <div className="text-xs font-bold uppercase tracking-widest text-unify-blue mb-2">{pkg.title} Partner</div>
                  <div className="text-2xl font-bold font-display text-gray-900 dark:text-white mb-5">{pkg.amount}</div>
                  <div className="space-y-2 mb-6">
                    {pkg.benefits.map((b) => (
                      <div key={b} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-unify-teal shrink-0" />
                        {b}
                      </div>
                    ))}
                  </div>
                  <Link href="/contact" className="btn-secondary w-full justify-center text-sm">
                    Get in Touch <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact */}
        <section id="impact" className="section-padding bg-unify-blue text-white text-center">
          <div className="section-container max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">100% of Donations Go to Programmes</h2>
            <p className="text-white/70 mb-8">
              UNIFY CLUB is committed to full financial transparency. Every donation is reported in our annual impact report.
              Administrative costs are covered separately, so your gift goes entirely to children.
            </p>
            <Link href="/about#reports" className="btn-white">
              View Our Impact Reports
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
