import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'

const steps = [
  { step: '01', title: 'Enquire', desc: 'Call, WhatsApp, or fill in our online enquiry form.' },
  { step: '02', title: 'Assessment', desc: 'Book a comprehensive assessment with our clinical team.' },
  { step: '03', title: 'Personalised Plan', desc: 'Receive a tailored program and therapy recommendation.' },
  { step: '04', title: 'Enrol', desc: 'Complete admission paperwork and begin your child\'s journey.' },
]

export default function AdmissionsCTA() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-unify-blue via-blue-700 to-unify-teal" />
      <div className="absolute inset-0 bg-dots opacity-10" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-unify-orange/20 blur-3xl" />

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="text-white">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-semibold uppercase tracking-widest mb-6">
              Admissions Open
            </span>
            <h2 className="text-4xl md:text-5xl font-bold font-display leading-tight mb-5">
              Start Your Child&apos;s
              <br />
              <span className="text-unify-gold">Journey Today</span>
            </h2>
            <p className="text-white/75 text-lg leading-relaxed mb-8">
              Admissions are open across all three UNIFY CLUB branches. Our team will guide you through
              every step — from your first call to your child&apos;s first day on the field.
            </p>
            <div className="space-y-3 mb-10">
              {[
                'Assessments available within 5 working days',
                'Flexible session times — mornings, evenings, weekends',
                'Scholarships available for eligible families',
                'Free first assessment for new enquiries',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-white/85">
                  <CheckCircle className="w-5 h-5 text-unify-gold shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/parents#admissions" className="btn-orange">
                Apply Now <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-white"
              >
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* Right: how it works */}
          <div className="space-y-5">
            {steps.map((s, i) => (
              <div key={s.step} className="glass rounded-2xl p-5 flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-unify-orange flex items-center justify-center text-white font-bold font-display text-lg shrink-0">
                  {s.step}
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">{s.title}</h4>
                  <p className="text-white/65 text-sm">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="absolute left-16 mt-14 w-0.5 h-4 bg-white/20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
