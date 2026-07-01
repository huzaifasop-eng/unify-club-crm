import Link from 'next/link'
import { MapPin, Phone, Mail, Heart, Share2, Video, MessageSquare, Globe } from 'lucide-react'

const footerLinks = {
  Organization: [
    { label: 'About UNIFY CLUB', href: '/about' },
    { label: 'Our Story', href: '/about#story' },
    { label: 'Leadership', href: '/about#leadership' },
    { label: 'Annual Reports', href: '/about#reports' },
    { label: 'Careers', href: '/careers' },
    { label: 'Media', href: '/media' },
  ],
  Programs: [
    { label: 'Sports Programs', href: '/programs' },
    { label: 'Unified Sports', href: '/programs#unified' },
    { label: 'Summer Camps', href: '/programs#camps' },
    { label: 'Early Intervention', href: '/programs#early' },
    { label: 'School Programs', href: '/programs#school' },
    { label: 'Adult Programs', href: '/programs#adult' },
  ],
  Therapies: [
    { label: 'Speech Therapy', href: '/therapies#speech' },
    { label: 'Occupational Therapy', href: '/therapies#ot' },
    { label: 'ABA Therapy', href: '/therapies#aba' },
    { label: 'Physical Therapy', href: '/therapies#pt' },
    { label: 'Psychology', href: '/therapies#psych' },
    { label: 'Assessments', href: '/therapies#assessments' },
  ],
  'Get Involved': [
    { label: 'Volunteer', href: '/volunteer' },
    { label: 'Donate', href: '/donate' },
    { label: 'Corporate CSR', href: '/donate#csr' },
    { label: 'Admissions', href: '/parents#admissions' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Events', href: '/events' },
  ],
}

const branches = [
  { name: 'Karachi — Defence', address: 'DHA Phase 6, Karachi' },
  { name: 'Karachi — Clifton', address: 'Block 5, Clifton, Karachi' },
  { name: 'Karachi — North Nazimabad', address: 'Block H, North Nazimabad' },
]

const socials = [
  { icon: Share2, label: 'Facebook', href: 'https://facebook.com/unifysports' },
  { icon: Globe, label: 'Instagram', href: 'https://instagram.com/unifysports' },
  { icon: Video, label: 'YouTube', href: 'https://youtube.com/@unifysports' },
  { icon: MessageSquare, label: 'Twitter', href: 'https://twitter.com/unifysports' },
]

export default function Footer() {
  return (
    <footer className="bg-unify-navy text-white">
      {/* Newsletter strip */}
      <div className="bg-unify-blue">
        <div className="section-container py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold font-display">Stay Informed. Stay Inspired.</h3>
              <p className="text-white/70 text-sm mt-1">Join our newsletter for stories, events, and updates.</p>
            </div>
            <form className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 min-w-72"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-unify-orange text-white font-semibold text-sm hover:bg-orange-600 transition-colors whitespace-nowrap"
              >
                Subscribe Free
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-unify-blue flex items-center justify-center">
                <span className="text-white font-bold text-xl font-display">U</span>
              </div>
              <div>
                <div className="font-bold font-display text-xl tracking-tight">UNIFY CLUB</div>
                <div className="text-white/60 text-xs">Where Every Child Shines</div>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              Pakistan&apos;s leading organization for inclusive sports, therapy, and holistic child development.
              Empowering children with intellectual disabilities to discover their potential through movement,
              play, and professional care.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-unify-orange transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            {/* Branches */}
            <div className="space-y-3 pt-2">
              {branches.map((b) => (
                <div key={b.name} className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-unify-orange mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium">{b.name}</div>
                    <div className="text-xs text-white/50">{b.address}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact bar */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a href="tel:+923001234567" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-unify-orange transition-colors">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-white/50">Call Us</div>
              <div className="text-sm font-medium">+92 300 123 4567</div>
            </div>
          </a>
          <a href="mailto:info@unifysports.pk" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-unify-orange transition-colors">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-white/50">Email Us</div>
              <div className="text-sm font-medium">info@unifysports.pk</div>
            </div>
          </a>
          <a
            href="https://wa.me/923001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-green-500 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div>
              <div className="text-xs text-white/50">WhatsApp</div>
              <div className="text-sm font-medium">Chat With Us</div>
            </div>
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="section-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} UNIFY CLUB. All rights reserved. Registered NGO, Pakistan.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/70 transition-colors">Terms</Link>
            <Link href="/accessibility" className="hover:text-white/70 transition-colors">Accessibility</Link>
          </div>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-unify-orange fill-unify-orange" /> in Karachi
          </p>
        </div>
      </div>
    </footer>
  )
}
