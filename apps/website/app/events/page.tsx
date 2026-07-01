import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/shared/PageHero'
import Link from 'next/link'
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react'

const events = [
  {
    id: 1,
    title: 'UNIFY Summer Championship 2025',
    date: 'July 15–20, 2025',
    time: '9:00 AM – 4:00 PM daily',
    location: 'DHA Sports Complex, Karachi',
    category: 'Competition',
    color: 'bg-unify-orange',
    desc: 'Our flagship annual multi-sport championship. 200+ athletes compete across 8 disciplines. Medals, trophies, and moments that will be treasured for life. Open to all enrolled UNIFY CLUB athletes.',
    registration: 'Open',
  },
  {
    id: 2,
    title: 'Parent Workshop: Understanding ABA',
    date: 'July 22, 2025',
    time: '10:00 AM – 1:00 PM',
    location: 'UNIFY CLUB Clifton Branch',
    category: 'Workshop',
    color: 'bg-unify-blue',
    desc: 'A practical, compassionate guide to Applied Behaviour Analysis for parents. Led by our BCBA team. Topics: what ABA is, how our programme works, how to support therapy at home, and how to celebrate progress.',
    registration: '18 seats remaining',
  },
  {
    id: 3,
    title: 'Back to School Sports Camp',
    date: 'August 1–14, 2025',
    time: '8:00 AM – 12:00 PM',
    location: 'All Three Branches',
    category: 'Camp',
    color: 'bg-unify-teal',
    desc: 'Two weeks of intensive fun — football, swimming, art, music, and friendship — to prepare children for the new school year with energy, confidence, and a smile. Ages 4–18.',
    registration: 'Limited seats',
  },
  {
    id: 4,
    title: 'Unified Sports Day — All Abilities Welcome',
    date: 'August 25, 2025',
    time: '9:00 AM – 2:00 PM',
    location: 'UNIFY CLUB Defence Branch',
    category: 'Community Event',
    color: 'bg-purple-600',
    desc: 'Our signature inclusion event. Mainstream students from partner schools train and compete alongside UNIFY athletes. Free entry. Open to public.',
    registration: 'Free — Open to all',
  },
  {
    id: 5,
    title: 'Therapist Training Intensive',
    date: 'September 5–6, 2025',
    time: '9:00 AM – 5:00 PM',
    location: 'UNIFY CLUB North Nazimabad',
    category: 'Professional Development',
    color: 'bg-rose-600',
    desc: 'Two-day CPD event for therapists and educators. Topics: neurodiversity-affirming practice, sensory integration, and inclusive sports facilitation. Certificates provided.',
    registration: 'Professional registration required',
  },
  {
    id: 6,
    title: 'Annual Gala & Awards Night',
    date: 'October 15, 2025',
    time: '7:00 PM – 10:00 PM',
    location: 'Pearl Continental Hotel, Karachi',
    category: 'Gala',
    color: 'bg-unify-gold',
    desc: 'Our annual celebration of children, families, volunteers, and donors. Awards for most improved athletes, outstanding volunteer, and corporate partner of the year. Black-tie optional.',
    registration: 'Tickets available soon',
  },
]

export default function EventsPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          label="Events"
          title="Join Us."
          titleAccent="Be There."
          subtitle="Competitions, camps, workshops, and celebrations — at UNIFY CLUB, every event is a chance to grow, connect, and be celebrated."
        />

        <section className="section-padding bg-white dark:bg-gray-950">
          <div className="section-container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} id={`event-${event.id}`} className="card-premium overflow-hidden">
                  <div className={`${event.color} p-5 text-white`}>
                    <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">{event.category}</div>
                    <h3 className="text-lg font-bold font-display leading-snug">{event.title}</h3>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Calendar className="w-4 h-4 text-unify-blue shrink-0" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Clock className="w-4 h-4 text-unify-blue shrink-0" />
                      {event.time}
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4 h-4 text-unify-orange shrink-0 mt-0.5" />
                      {event.location}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed pt-1">{event.desc}</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-semibold text-unify-orange">{event.registration}</span>
                      <Link href="/contact" className="inline-flex items-center gap-1 text-sm font-semibold text-unify-blue hover:gap-2 transition-all">
                        Register <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-500 mb-4">Want to stay updated on upcoming events?</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
                <input type="email" placeholder="Your email" className="flex-1 px-4 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-unify-blue/30" />
                <button className="btn-primary rounded-full px-6 py-3">Subscribe</button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
