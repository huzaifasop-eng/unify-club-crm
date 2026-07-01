'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, Search, Phone } from 'lucide-react'

const navLinks = [
  { label: 'About', href: '/about' },
  {
    label: 'Programs',
    href: '/programs',
    children: [
      { label: 'Sports Programs', href: '/programs#sports', desc: 'Football, basketball, swimming & more' },
      { label: 'Unified Sports', href: '/programs#unified', desc: 'Inclusive team sports for all abilities' },
      { label: 'Summer Camps', href: '/programs#camps', desc: 'Fun-filled seasonal programs' },
      { label: 'Early Intervention', href: '/programs#early', desc: 'Support from the very beginning' },
      { label: 'Weekend Programs', href: '/programs#weekend', desc: 'Saturday & Sunday sessions' },
      { label: 'School Programs', href: '/programs#school', desc: 'Bringing inclusion to campuses' },
    ],
  },
  {
    label: 'Therapies',
    href: '/therapies',
    children: [
      { label: 'Speech Therapy', href: '/therapies#speech', desc: 'Communication and language development' },
      { label: 'Occupational Therapy', href: '/therapies#ot', desc: 'Building daily-life independence' },
      { label: 'ABA Therapy', href: '/therapies#aba', desc: 'Applied Behaviour Analysis' },
      { label: 'Physical Therapy', href: '/therapies#pt', desc: 'Movement and motor skills' },
      { label: 'Psychology', href: '/therapies#psych', desc: 'Mental health and wellbeing' },
      { label: 'Assessments', href: '/therapies#assessments', desc: 'Comprehensive evaluations' },
    ],
  },
  { label: 'Who We Serve', href: '/who-we-serve' },
  { label: 'Impact', href: '/impact' },
  { label: 'Events', href: '/events' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-premium py-3'
          : 'bg-transparent py-5'
      }`}
    >
      {/* Top bar */}
      <div className={`border-b border-unify-blue/10 mb-0 hidden lg:block ${scrolled ? 'hidden' : ''}`}>
        <div className="section-container flex items-center justify-between py-1.5">
          <p className="text-xs text-white/80">
            Pakistan&apos;s Leading Inclusive Sports &amp; Therapy Organization
          </p>
          <div className="flex items-center gap-4 text-xs text-white/80">
            <a href="tel:+923001234567" className="flex items-center gap-1 hover:text-white transition-colors">
              <Phone className="w-3 h-3" />
              +92 300 123 4567
            </a>
            <a href="/parents#admissions" className="hover:text-white transition-colors">
              Admissions Open
            </a>
            <a href="/donate" className="px-3 py-0.5 rounded-full bg-unify-orange text-white text-xs font-semibold hover:bg-orange-600 transition-colors">
              Donate
            </a>
          </div>
        </div>
      </div>

      <div className="section-container" ref={dropdownRef}>
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-unify-blue flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-lg font-display">U</span>
            </div>
            <div className="leading-none">
              <span className={`block font-bold font-display text-lg tracking-tight transition-colors ${scrolled ? 'text-unify-blue' : 'text-white'}`}>
                UNIFY CLUB
              </span>
              <span className={`block text-xs transition-colors ${scrolled ? 'text-gray-500' : 'text-white/70'}`}>
                Where Every Child Shines
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.label} className="relative">
                {link.children ? (
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === link.label ? null : link.label)}
                    className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      scrolled
                        ? 'text-gray-700 hover:text-unify-blue hover:bg-unify-light'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === link.label ? 'rotate-180' : ''}`}
                    />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      scrolled
                        ? 'text-gray-700 hover:text-unify-blue hover:bg-unify-light'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </Link>
                )}

                {/* Mega Dropdown */}
                {link.children && activeDropdown === link.label && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[480px] bg-white rounded-2xl shadow-card-hover border border-gray-100 overflow-hidden z-50 animate-fade-up">
                    <div className="p-2 grid grid-cols-2 gap-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setActiveDropdown(null)}
                          className="flex flex-col gap-0.5 p-3 rounded-xl hover:bg-unify-light group/item transition-colors"
                        >
                          <span className="text-sm font-semibold text-gray-900 group-hover/item:text-unify-blue transition-colors">
                            {child.label}
                          </span>
                          <span className="text-xs text-gray-500">{child.desc}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="px-4 py-3 bg-unify-light border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-500">Explore all {link.label.toLowerCase()}</span>
                      <Link
                        href={link.href}
                        onClick={() => setActiveDropdown(null)}
                        className="text-xs font-semibold text-unify-blue hover:underline"
                      >
                        View All →
                      </Link>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              aria-label="Search"
              className={`p-2 rounded-full transition-colors ${
                scrolled ? 'text-gray-600 hover:bg-gray-100' : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/volunteer"
              className={`px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all ${
                scrolled
                  ? 'border-unify-blue text-unify-blue hover:bg-unify-blue hover:text-white'
                  : 'border-white text-white hover:bg-white hover:text-unify-blue'
              }`}
            >
              Volunteer
            </Link>
            <Link
              href="/parents#admissions"
              className="px-5 py-2.5 rounded-full text-sm font-semibold bg-unify-orange text-white hover:bg-orange-700 transition-colors shadow-md"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-2xl max-h-screen overflow-y-auto">
          <div className="section-container py-4 space-y-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-900 font-medium hover:bg-unify-light hover:text-unify-blue transition-colors"
                >
                  {link.label}
                  {link.children && <ChevronDown className="w-4 h-4 text-gray-400" />}
                </Link>
                {link.children && (
                  <div className="ml-4 mt-1 space-y-0.5">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-2 rounded-lg text-sm text-gray-600 hover:text-unify-blue hover:bg-unify-light transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <Link href="/parents#admissions" onClick={() => setMobileOpen(false)} className="btn-orange text-center">
                Apply Now
              </Link>
              <Link href="/volunteer" onClick={() => setMobileOpen(false)} className="btn-secondary text-center">
                Volunteer
              </Link>
              <Link href="/donate" onClick={() => setMobileOpen(false)} className="btn-primary text-center">
                Donate
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
