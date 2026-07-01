import type { Metadata } from 'next'
import { Inter, Sora } from 'next/font/google'
import './globals.css'
import WhatsAppButton from '@/components/shared/WhatsAppButton'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'UNIFY CLUB — Where Every Child Shines | Inclusive Sports & Therapy Pakistan',
  description:
    "UNIFY CLUB is Pakistan's leading organization for inclusive sports, therapy, and child development. Empowering children with intellectual disabilities through sports, movement, and professional therapy in Karachi and beyond.",
  keywords: [
    'Inclusive Sports Pakistan',
    'Special Needs Sports Karachi',
    'Autism Sports Program',
    'Down Syndrome Sports',
    'Adaptive Sports Pakistan',
    'Inclusive Fitness',
    'Sports for Children with Intellectual Disabilities',
    'Therapy Karachi',
    'Special Needs Programs Pakistan',
    'UNIFY CLUB',
    'unifysports.pk',
  ],
  authors: [{ name: 'UNIFY CLUB', url: 'https://unifysports.pk' }],
  openGraph: {
    type: 'website',
    url: 'https://unifysports.pk',
    title: 'UNIFY CLUB — Where Every Child Shines',
    description:
      "Pakistan's premier organization for inclusive sports, therapy, and holistic child development.",
    siteName: 'UNIFY CLUB',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UNIFY CLUB — Where Every Child Shines',
    description:
      "Pakistan's premier organization for inclusive sports, therapy, and holistic child development.",
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://unifysports.pk'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#003087" />
      </head>
      <body className={`${inter.variable} ${sora.variable} antialiased`}>
          {children}
        <WhatsAppButton />
      </body>
    </html>
  )
}
