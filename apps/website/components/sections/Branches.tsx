import Link from 'next/link'
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react'

const branches = [
  {
    id: 'defence',
    name: 'UNIFY CLUB — Defence',
    area: 'DHA Phase 6, Karachi',
    address: 'Lane 12, Phase 6, Defence Housing Authority, Karachi',
    phone: '+92 300 123 4567',
    hours: 'Mon–Sat, 8:00 AM – 6:00 PM',
    programs: ['Football', 'Swimming', 'Speech Therapy', 'OT'],
    featured: true,
    mapEmbed: 'https://maps.google.com/?q=DHA+Phase+6+Karachi',
  },
  {
    id: 'clifton',
    name: 'UNIFY CLUB — Clifton',
    area: 'Block 5, Clifton, Karachi',
    address: 'Block 5, Clifton, Karachi, Sindh',
    phone: '+92 300 765 4321',
    hours: 'Mon–Sat, 8:00 AM – 6:00 PM',
    programs: ['Basketball', 'Athletics', 'ABA Therapy', 'Psychology'],
    featured: false,
    mapEmbed: 'https://maps.google.com/?q=Clifton+Block+5+Karachi',
  },
  {
    id: 'north-nazimabad',
    name: 'UNIFY CLUB — North Nazimabad',
    area: 'Block H, North Nazimabad, Karachi',
    address: 'Block H, North Nazimabad, Karachi',
    phone: '+92 300 987 6543',
    hours: 'Mon–Sat, 9:00 AM – 5:00 PM',
    programs: ['Tennis', 'Inclusive Fitness', 'Physical Therapy', 'Remedial'],
    featured: false,
    mapEmbed: 'https://maps.google.com/?q=North+Nazimabad+Block+H+Karachi',
  },
]

export default function Branches() {
  return (
    <section className="section-padding bg-white dark:bg-gray-950">
      <div className="section-container">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="section-label mb-5">Our Locations</span>
          <h2 className="section-title text-gray-900 dark:text-white mt-4">
            Find Your
            <br />
            <span className="gradient-text">Nearest Branch</span>
          </h2>
          <p className="section-subtitle mt-4 mx-auto">
            Three purpose-built centres across Karachi — each equipped with professional sports facilities,
            therapy rooms, and a team ready to welcome your child.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className={`card-premium overflow-hidden ${branch.featured ? 'ring-2 ring-unify-blue ring-offset-4' : ''}`}
            >
              {branch.featured && (
                <div className="bg-unify-blue text-white text-xs font-bold uppercase tracking-widest py-2 text-center">
                  Main Campus
                </div>
              )}

              {/* Map placeholder */}
              <div className="h-44 bg-gradient-to-br from-unify-light to-blue-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center relative overflow-hidden">
                <MapPin className="w-10 h-10 text-unify-blue/40" />
                <div className="absolute inset-0 bg-dots opacity-30" />
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-white shadow-sm text-xs font-semibold text-unify-blue">
                  View on Maps
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white">{branch.name}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                    <MapPin className="w-4 h-4 text-unify-orange shrink-0" />
                    {branch.area}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Phone className="w-4 h-4 text-unify-blue shrink-0" />
                    <a href={`tel:${branch.phone}`} className="hover:text-unify-blue transition-colors">{branch.phone}</a>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Clock className="w-4 h-4 text-unify-blue shrink-0 mt-0.5" />
                    {branch.hours}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {branch.programs.map((p) => (
                    <span key={p} className="px-3 py-1 rounded-full bg-unify-light dark:bg-blue-900/30 text-unify-blue dark:text-blue-400 text-xs font-medium">
                      {p}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/contact#${branch.id}`}
                  className="flex items-center gap-2 text-sm font-semibold text-unify-blue hover:gap-3 transition-all"
                >
                  Get Directions <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/contact" className="btn-secondary">
            View All Branches &amp; Contact Info
          </Link>
        </div>
      </div>
    </section>
  )
}
