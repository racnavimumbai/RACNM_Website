import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import ParticleField from '@/components/ParticleField';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://rotaractclubofnavimumbai.org'),
  title: {
    default: 'Rotaract Club of Navi Mumbai | 45th Year MAGNUM OPUS',
    template: '%s | Rotaract Club of Navi Mumbai'
  },
  description: 'Rotaract Club of Navi Mumbai is a premier community-based youth organization in Navi Mumbai (Est. 1982, Zone 1, District 3142). Celebrating 45 years of leadership, service & youth impact under MAGNUM OPUS.',
  keywords: [
    'Rotaract Club of Navi Mumbai',
    'RACNM',
    'Rotaract District 3142',
    'Rotaract Navi Mumbai',
    'Youth NGO Navi Mumbai',
    'Community Service Navi Mumbai',
    'Magnum Opus Rotaract'
  ],
  authors: [{ name: 'Rotaract Club of Navi Mumbai' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://rotaractclubofnavimumbai.org',
    siteName: 'Rotaract Club of Navi Mumbai',
    title: 'Rotaract Club of Navi Mumbai | 45th Year MAGNUM OPUS',
    description: 'Premier community-based youth leadership & social impact organization in Navi Mumbai. Est. 1982 • District 3142.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Rotaract Club of Navi Mumbai 45th Year'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rotaract Club of Navi Mumbai | 45th Year MAGNUM OPUS',
    description: 'Premier youth leadership & community impact organization in Navi Mumbai. Est. 1982.'
  },
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/favicon.ico'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'Rotaract Club of Navi Mumbai',
    alternateName: 'RACNM',
    url: 'https://rotaractclubofnavimumbai.org',
    logo: 'https://rotaractclubofnavimumbai.org/icon.png',
    foundingDate: '1982',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Navi Mumbai',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN'
    },
    parentOrganization: {
      '@type': 'NGO',
      name: 'Rotary Club of Navi Mumbai',
      nonprofitStatus: 'Nonprofit501c3'
    },
    description: 'Rotaract Club of Navi Mumbai is the oldest community-based Rotaract club in Zone 1, District 3142.'
  };

  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable} dark h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#08080b] text-[#f8fafc] font-sans antialiased flex flex-col min-h-screen relative">
        {/* Global Subtle Golden Sparkles Background */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          <ParticleField count={75} />
        </div>

        {/* Noise Texture Overlay */}
        <div className="noise-overlay" aria-hidden="true" />
        
        {/* Scroll Progress Bar */}
        <ScrollProgress />
        
        <Header />
        <main className="flex-1 pt-[72px] page-enter relative z-10">{children}</main>
        <Footer />
        
        {/* Vercel Web Analytics & Real User Speed Insights */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
