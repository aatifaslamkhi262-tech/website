import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us & Karachi Store Location',
  description: 'Visit PGS Game Shop at Grace Shopping Mall, Maskan Chowrangi, Gulshan-e-Iqbal, Karachi. Pakistan’s premier retailer for authentic PS5 consoles, games, and accessories.',
  alternates: {
    canonical: 'https://www.pgsgameshop.online/about',
  },
  openGraph: {
    title: 'About PGS Game Shop Karachi | Official Gaming Store',
    description: 'Visit PGS Game Shop at Grace Shopping Mall, Gulshan-e-Iqbal, Karachi or order online with nationwide insured delivery across Pakistan.',
    url: 'https://www.pgsgameshop.online/about',
    siteName: 'PGS Game Shop Karachi',
    type: 'website',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

