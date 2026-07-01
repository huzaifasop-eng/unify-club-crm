import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/shared/PageHero'
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'

const branches = [
  {
    id: 'defence',
    name: 'UNIFY CLUB — Defence',
    address: 'Lane 12, Phase 6, DHA, Karachi',
    phone: '+92 300 123 4567',
    email: 'defence@unifysports.pk',
    hours: 'Mon–Sat: 8:00 AM – 6:00 PM',
    mapUrl: 'https://maps.google.com/?q=DHA+Phase+6+Karachi',
  },
  {
    id: 'clifton',
    name: 'UNIFY CLUB — Clifton',
    address: 'Block 5, Clifton, Karachi',
    phone: '+92 300 765 4321',
    email: 'clifton@unifysports.pk',
    hours: 'Mon–Sat: 8:00 AM – 6:00 PM',
    mapUrl: 'https://maps.google.com/?q=Clifton+Block+5+Karachi',
  },
  {
    id: 'north-nazimabad',
    name: 'UNIFY CLUB — North Nazimabad',
    address: 'Block H, North Nazimabad, Karachi',
    phone: '+92 300 987 6543',
    email: 'nn@unifysports.pk',
    hours: 'Mon–Sat: 9:00 AM – 5:00 PM',
    mapUrl: 'https://maps.google.com/?q=North+Nazimabad+Block+H+Karachi',
  },
]

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          label="Contact Us"
          title="We're Here"
          titleAccent="For You"
          subtitle="Reach out any way that works for you. Our team typically responds within one business day."
        />

        <section className="section-padding bg-white dark:bg-gray-950">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Form */}
              <div>
                <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white mb-6">Send Us a Message</h2>
                <form className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Full name"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-unify-blue/30 focus:border-unify-blue transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+92 3XX XXX XXXX"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-unify-blue/30 focus:border-unify-blue transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-unify-blue/30 focus:border-unify-blue transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Enquiry Type *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-unify-blue/30 focus:border-unify-blue transition-colors"
                    >
                      <option value="">Select an option</option>
                      <option>Admission for my child</option>
                      <option>Sports programme enquiry</option>
                      <option>Therapy services enquiry</option>
                      <option>Volunteer / Career</option>
                      <option>Donation / CSR</option>
                      <option>Partnership</option>
                      <option>Media / Press</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us about your child, your questions, or how we can help..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-unify-blue/30 focus:border-unify-blue transition-colors resize-none"
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center">
                    Send Message
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    We respond within 1 business day. Your information is kept confidential.
                  </p>
                </form>
              </div>

              {/* Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white mb-6">Quick Contact</h2>
                  <div className="space-y-4">
                    <a href="tel:+923001234567" className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-unify-light dark:hover:bg-gray-700 transition-colors group">
                      <div className="w-12 h-12 rounded-xl bg-unify-blue flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-0.5">Call Us</div>
                        <div className="font-semibold text-gray-900 dark:text-white">+92 300 123 4567</div>
                      </div>
                    </a>
                    <a href="mailto:info@unifysports.pk" className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-unify-light dark:hover:bg-gray-700 transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-unify-teal flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-0.5">Email Us</div>
                        <div className="font-semibold text-gray-900 dark:text-white">info@unifysports.pk</div>
                      </div>
                    </a>
                    <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center shrink-0">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-0.5">WhatsApp</div>
                        <div className="font-semibold text-gray-900 dark:text-white">Chat With Us Now</div>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Branches */}
                <div>
                  <h3 className="font-bold font-display text-gray-900 dark:text-white mb-4">Our Branches</h3>
                  <div className="space-y-4">
                    {branches.map((b) => (
                      <div key={b.id} id={b.id} className="card-premium p-5">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-3">{b.name}</h4>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <MapPin className="w-4 h-4 text-unify-orange shrink-0 mt-0.5" />
                            {b.address}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Phone className="w-4 h-4 text-unify-blue shrink-0" />
                            <a href={`tel:${b.phone}`} className="hover:text-unify-blue transition-colors">{b.phone}</a>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Clock className="w-4 h-4 text-unify-blue shrink-0" />
                            {b.hours}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
