import Link from 'next/link'

const partners = [
  { name: 'HBL', type: 'Sponsor', initial: 'H' },
  { name: 'Aga Khan', type: 'Healthcare Partner', initial: 'A' },
  { name: 'The Citizens Foundation', type: 'Education Partner', initial: 'T' },
  { name: 'SKMT', type: 'Medical Partner', initial: 'S' },
  { name: 'Pakistan Olympic Association', type: 'Sports Partner', initial: 'P' },
  { name: 'NED University', type: 'Research Partner', initial: 'N' },
  { name: 'Indus Hospital', type: 'Healthcare Partner', initial: 'I' },
  { name: 'Engro Foundation', type: 'CSR Partner', initial: 'E' },
]

export default function Partners() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
      <div className="section-container">
        <div className="text-center mb-10">
          <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Trusted Partners &amp; Supporters</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Working together to create a more inclusive Pakistan</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {partners.map((p) => (
            <div
              key={p.name}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-gray-800 hover:shadow-premium transition-shadow group cursor-pointer"
              title={p.name}
            >
              <div className="w-12 h-12 rounded-xl bg-unify-light dark:bg-gray-700 flex items-center justify-center text-unify-blue font-bold text-lg group-hover:bg-unify-blue group-hover:text-white transition-colors">
                {p.initial}
              </div>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center leading-tight">{p.name}</span>
              <span className="text-[10px] text-gray-400">{p.type}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/donate#csr" className="text-sm font-semibold text-unify-blue hover:underline">
            Become a Partner →
          </Link>
        </div>
      </div>
    </section>
  )
}
