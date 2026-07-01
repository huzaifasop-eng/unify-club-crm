import Link from 'next/link'
import { Calendar, MapPin, ArrowRight, Clock } from 'lucide-react'

const events = [
  {
    id: 1,
    title: 'UNIFY Summer Championship 2025',
    date: 'July 15–20, 2025',
    time: '9:00 AM – 4:00 PM',
    location: 'DHA Sports Complex, Karachi',
    category: 'Competition',
    color: 'bg-unify-orange',
    desc: 'Annual multi-sport championship for athletes across all UNIFY CLUB branches. 200+ athletes competing in 8 disciplines.',
    spots: 'Open Registration',
  },
  {
    id: 2,
    title: 'Parent Workshop: Understanding ABA',
    date: 'July 22, 2025',
    time: '10:00 AM – 1:00 PM',
    location: 'UNIFY CLUB Clifton Branch',
    category: 'Workshop',
    color: 'bg-unify-blue',
    desc: 'Practical guidance for parents on Applied Behaviour Analysis — what it is, what to expect, and how to reinforce therapy at home.',
    spots: '18 seats remaining',
  },
  {
    id: 3,
    title: 'Back to School Sports Camp',
    date: 'August 1–14, 2025',
    time: '8:00 AM – 12:00 PM',
    location: 'All Branches',
    category: 'Camp',
    color: 'bg-unify-teal',
    desc: 'Two weeks of intensive fun — sports, art, swimming, and friendship — to prepare children for the new school year with confidence.',
    spots: 'Limited seats',
  },
]

export default function Events() {
  return (
    <section className="section-padding bg-white dark:bg-gray-950">
      <div className="section-container">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <span className="section-label mb-5">Upcoming Events</span>
            <h2 className="section-title text-gray-900 dark:text-white mt-4">
              Join Us. <span className="gradient-text">Be There.</span>
            </h2>
          </div>
          <Link href="/events" className="btn-secondary shrink-0">
            Full Calendar <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="card-premium overflow-hidden">
              <div className={`${event.color} p-5 text-white`}>
                <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-3">{event.category}</div>
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
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4 text-unify-orange shrink-0" />
                  {event.location}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed pt-1">{event.desc}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-semibold text-unify-orange">{event.spots}</span>
                  <Link href={`/events#event-${event.id}`} className="text-sm font-semibold text-unify-blue hover:underline">
                    Register →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
