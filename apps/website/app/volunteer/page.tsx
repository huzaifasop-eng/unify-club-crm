import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/shared/PageHero'
import { ArrowRight, CheckCircle } from 'lucide-react'

const roles = [
  { icon: '⚽', title: 'Sports Coach Assistant', commitment: '4–6 hrs/week', skills: 'Basic fitness, teamwork, patience', desc: 'Support our certified coaches during training sessions. No formal sports coaching experience required — just a love of sport and a passion for inclusion.' },
  { icon: '💙', title: 'Therapy Support', commitment: '3–5 hrs/week', skills: 'Caring nature, reliability', desc: 'Assist our therapy team with administrative tasks, room setup, parent communication, and supporting group therapy activities.' },
  { icon: '📸', title: 'Photographer / Videographer', commitment: 'Event-based', skills: 'Photography skills, equipment preferred', desc: 'Document the incredible moments at UNIFY CLUB — competitions, therapy milestones, and everyday magic. Your images inspire donors, parents, and the world.' },
  { icon: '📚', title: 'Tutor / Remedial Support', commitment: '3–4 hrs/week', skills: 'Teaching, patience, academic background', desc: 'Provide one-on-one academic support to children enrolled in our remedial programme. Guidance provided by our specialist educators.' },
  { icon: '🚗', title: 'Transport Volunteer', commitment: 'Flexible', skills: 'Valid driving licence, own vehicle', desc: 'Help families who have difficulty transporting their children to and from sessions. A small act with enormous impact.' },
  { icon: '💻', title: 'Digital & Marketing', commitment: 'Flexible / Remote', skills: 'Social media, design, content creation', desc: 'Help UNIFY CLUB tell its story to the world. Social media, graphic design, fundraising campaigns, and copywriting.' },
]

export default function VolunteerPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          label="Volunteer"
          title="Give Your Time."
          titleAccent="Change a Life."
          subtitle="Volunteering at UNIFY CLUB is one of the most rewarding things you will ever do. Join our family and discover the joy of true inclusion."
        />

        <section className="section-padding bg-white dark:bg-gray-950">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Roles */}
              <div>
                <span className="section-label mb-5">Volunteer Roles</span>
                <h2 className="text-3xl font-bold font-display text-gray-900 dark:text-white mt-4 mb-8">
                  Find Your <span className="gradient-text">Perfect Role</span>
                </h2>
                <div className="space-y-5">
                  {roles.map((role) => (
                    <div key={role.title} className="card-premium p-5 flex gap-4">
                      <span className="text-3xl shrink-0">{role.icon}</span>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">{role.title}</h3>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
                          <span>⏱ {role.commitment}</span>
                          <span>✓ {role.skills}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{role.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application form */}
              <div className="lg:sticky lg:top-32">
                <div className="card-premium p-8">
                  <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-6">Apply to Volunteer</h3>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name *</label>
                        <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-unify-blue/30" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name *</label>
                        <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-unify-blue/30" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                      <input type="tel" required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-unify-blue/30" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address *</label>
                      <input type="email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-unify-blue/30" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Area of Interest *</label>
                      <select required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-unify-blue/30">
                        <option value="">Select a role</option>
                        {roles.map((r) => <option key={r.title}>{r.title}</option>)}
                        <option>Multiple / Open</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Availability *</label>
                      <select required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-unify-blue/30">
                        <option value="">Select availability</option>
                        <option>Weekday mornings</option>
                        <option>Weekday afternoons</option>
                        <option>Weekday evenings</option>
                        <option>Weekends only</option>
                        <option>Flexible</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tell us about yourself</label>
                      <textarea rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-unify-blue/30 resize-none" placeholder="Background, skills, motivation..." />
                    </div>
                    <button type="submit" className="btn-primary w-full justify-center">
                      Submit Application <ArrowRight className="w-5 h-5" />
                    </button>
                  </form>
                </div>

                <div className="mt-6 space-y-3">
                  {['All volunteers receive full orientation and training', 'Police clearance required for child-facing roles', 'Volunteer hours can count towards university community service'].map((item) => (
                    <div key={item} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-unify-teal shrink-0 mt-0.5" />
                      {item}
                    </div>
                  ))}
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
