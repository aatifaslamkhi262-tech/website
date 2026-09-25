import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';

export const metadata: Metadata = {
  title: 'PGS Game Shop | Official Retail Store',
  description: 'Buy new, used, and refurbished gaming consoles, PS5 CDs, Xbox Series X, controllers, and accessories with official warranty and fast nationwide delivery.',
  keywords: ['PGS Game Shop', 'PS5 Pakistan', 'Gaming Consoles', 'PlayStation 5', 'Xbox Series X', 'Pre-owned PS5 games', 'Refurbished Nintendo Switch'],
  openGraph: {
    title: 'PGS Game Shop | Official Retail Store',
    description: 'Pakistan premier gaming ecommerce store for original consoles, games, and accessories.',
    siteName: 'PGS Game Shop',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className="h-full flex flex-col antialiased text-slate-900 selection:bg-emerald-500 selection:text-white">
        <CartProvider>
          {children}
          <FloatingWhatsApp />
        </CartProvider>
      </body>
    </html>
  );
}
