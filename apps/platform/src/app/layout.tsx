import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { APP_NAME, APP_TAGLINE } from '@/config/app';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s · ${APP_NAME}` },
  description: `${APP_NAME} ${APP_TAGLINE} — CRM, HR, operations and finance in one place.`,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f9fb' },
    { media: '(prefers-color-scheme: dark)', color: '#0d1017' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
