import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/shared/PageHero'
import Link from 'next/link'
import { Download, ExternalLink } from 'lucide-react'

const news = [
  { title: 'UNIFY CLUB Reaches 2,500 Children Served Milestone', date: 'March 2025', source: 'Dawn', emoji: '🎉' },
  { title: 'Karachi\'s Inclusive Sports Revolution: How UNIFY CLUB is Changing Lives', date: 'January 2025', source: 'The News International', emoji: '📰' },
  { title: 'Pakistan\'s Adaptive Sports Movement Gets Boost with UNIFY CLUB Expansion', date: 'November 2024', source: 'ARY News', emoji: '🏆' },
  { title: 'UNIFY CLUB Named Best NGO Initiative at Karachi Social Impact Awards', date: 'September 2024', source: 'Business Recorder', emoji: '🥇' },
]

const galleryItems = [
  { emoji: '⚽', caption: 'UNIFY Football Championship 2024', category: 'Sports' },
  { emoji: '🏊', caption: 'Swimming Gala — Clifton Branch', category: 'Sports' },
  { emoji: '🎉', caption: 'Annual Awards Night 2024', category: 'Events' },
  { emoji: '💙', caption: 'Therapy Sessions in Progress', category: 'Therapy' },
  { emoji: '🤝', caption: 'Unified Sports Day', category: 'Community' },
  { emoji: '🏕️', caption: 'Summer Camp Highlights', category: 'Camps' },
  { emoji: '🌟', caption: 'Parent-Child Sports Day', category: 'Family' },
  { emoji: '🏆', caption: 'Medal Ceremony — Athletics 2024', category: 'Sports' },
  { emoji: '📚', caption: 'Remedial Therapy Workshop', category: 'Therapy' },
]

export default function MediaPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          label="Media"
          title="Stories That"
          titleAccent="Inspire the World"
          subtitle="News, gallery, press releases, and resources for media partners. UNIFY CLUB's story is worth telling."
        />

        {/* Photo Gallery */}
        <section className="section-padding bg-white dark:bg-gray-950">
          <div className="section-container">
            <div className="text-center mb-12">
              <span className="section-label mb-5">Photo Gallery</span>
              <h2 className="section-title text-gray-900 dark:text-white mt-4">
                Life at <span className="gradient-text">UNIFY CLUB</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryItems.map((item, i) => (
                <div
                  key={i}
                  className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-unify-blue to-unify-navy flex items-center justify-center cursor-pointer group ${i === 0 ? 'col-span-2 row-span-2 h-80' : 'h-44'}`}
                >
                  <span className={`${i === 0 ? 'text-9xl' : 'text-6xl'} group-hover:scale-110 transition-transform duration-300`}>
                    {item.emoji}
                  </span>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div>
                      <p className="text-white font-semibold text-sm">{item.caption}</p>
                      <span className="text-white/60 text-xs">{item.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* News */}
        <section className="section-padding bg-gray-50 dark:bg-gray-900">
          <div className="section-container">
            <div className="text-center mb-12">
              <span className="section-label mb-5">In the News</span>
              <h2 className="section-title text-gray-900 dark:text-white mt-4">
                Press <span className="gradient-text-orange">Coverage</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {news.map((item) => (
                <div key={item.title} className="card-premium p-6 flex items-start gap-4">
                  <span className="text-4xl">{item.emoji}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 leading-snug">{item.title}</h3>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-unify-blue font-semibold">{item.source}</span>
                      <span className="text-gray-400">{item.date}</span>
                    </div>
                    <a href="#" className="inline-flex items-center gap-1 mt-2 text-xs text-gray-400 hover:text-unify-blue transition-colors">
                      <ExternalLink className="w-3 h-3" /> Read Article
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Press Kit */}
        <section className="section-padding bg-unify-blue text-white">
          <div className="section-container max-w-3xl text-center">
            <h2 className="text-3xl font-bold font-display mb-4">Media &amp; Press Kit</h2>
            <p className="text-white/70 mb-8">
              Download our press kit for logos, brand guidelines, approved photographs, and organisation fact sheets.
              For media enquiries, contact our communications team.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#" className="btn-white">
                <Download className="w-5 h-5" /> Download Press Kit
              </a>
              <Link href="/contact" className="btn-orange">
                Media Enquiries
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
