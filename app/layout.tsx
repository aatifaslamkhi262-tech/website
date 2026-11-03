import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { FlyingCartAnimationContainer } from '@/components/FlyingCartAnimation';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.pgsgameshop.online'),
  title: {
    default: 'PGS Game Shop | PS5 Price in Pakistan & Gaming Consoles Store',
    template: '%s | PGS Game Shop Pakistan',
  },
  description: 'Best PS5 Price in Pakistan. Buy original Sony PlayStation 5 Slim, PS5 Pro, PS4, Xbox Series X, game CDs, DualSense controllers, and gaming gear. 100% authentic with warranty and express nationwide delivery.',
  keywords: [
    'PS5 price in Pakistan',
    'PlayStation 5 Pakistan',
    'Buy PS5 Karachi',
    'PS5 Slim price in Pakistan',
    'PS5 Pro Pakistan',
    'Gaming Store Pakistan',
    'Used PS5 Games Karachi',
    'PGS Game Shop',
  ],
  alternates: {
    canonical: 'https://www.pgsgameshop.online',
  },
  openGraph: {
    title: 'PGS Game Shop | PS5 Price in Pakistan & Official Gaming Store',
    description: 'Buy PlayStation 5, Xbox Series X, original game discs, controllers, and gaming accessories with official warranty and nationwide delivery.',
    url: 'https://www.pgsgameshop.online',
    siteName: 'PGS Game Shop Karachi',
    locale: 'en_PK',
    type: 'website',
    images: [
      {
        url: 'https://www.pgsgameshop.online/logo2.png',
        width: 1200,
        height: 630,
        alt: 'PGS Game Shop Pakistan - PS5 & Gaming Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PGS Game Shop | PS5 Price in Pakistan & Gaming Store',
    description: 'Buy PlayStation 5, Xbox Series X, original games & gear with warranty across Pakistan.',
    images: ['https://www.pgsgameshop.online/logo2.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const storeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoGameStore',
  name: 'PGS Game Shop',
  image: 'https://www.pgsgameshop.online/logo2.png',
  url: 'https://www.pgsgameshop.online',
  telephone: '+92-312-2319157',
  priceRange: 'PKR',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Shop No. G19, Grace Shopping Mall, Opp Bhayani Heights, Near Maskan Chowrangi, Gulshan-e-Iqbal',
    addressLocality: 'Karachi',
    addressRegion: 'Sindh',
    postalCode: '75300',
    addressCountry: 'PK',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 24.9318,
    longitude: 67.1082,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '12:00',
      closes: '23:00',
    },
  ],
  sameAs: [
    'https://www.facebook.com',
    'https://www.instagram.com',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
        />
      </head>
      <body className="h-full flex flex-col antialiased text-slate-900 selection:bg-[#0070D1] selection:text-white">
        <CartProvider>
          {children}
          <FloatingWhatsApp />
          <FlyingCartAnimationContainer />
        </CartProvider>
      </body>
    </html>
  );
}

