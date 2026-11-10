import React from 'react';
import type { Metadata } from 'next';
import { fetchCategories, fetchProducts, getProductSlug } from '@/lib/api';
import { Product } from '@/lib/types';
import HomeClientPage from './HomeClientPage';

export const revalidate = 120;

export const metadata: Metadata = {
  title: 'PGS Game Shop | PS5 Price in Pakistan & Gaming Consoles Store',
  description: 'Best PS5 Price in Pakistan. Buy original Sony PlayStation 5 Slim, PS5 Pro, PS4, Xbox Series X, game CDs, DualSense controllers, and gaming gear. 100% authentic with warranty and express nationwide delivery.',
  alternates: {
    canonical: 'https://www.pgsgameshop.online',
  },
};

export default async function StorefrontHomePage() {
  const [categories, featuredRes] = await Promise.all([
    fetchCategories(),
    fetchProducts({ page: 1, limit: 120, sortBy: 'latest' }),
  ]);

  let allLoaded: Product[] = [];
  let initialFeatured: Product[] = [];
  let initialConsoles: Product[] = [];
  let initialGames: Product[] = [];
  let initialAccessories: Product[] = [];

  if (featuredRes.success && featuredRes.data) {
    allLoaded = [...featuredRes.data].sort((a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0));
    initialFeatured = allLoaded.slice(0, 8);

    const getCatId = (c: any) => (typeof c === 'object' && c !== null ? c._id : c);
    initialConsoles = allLoaded.filter(p => getCatId(p.category) === '6a8ad5a068ae35d1a79d1a83').slice(0, 4);
    initialGames = allLoaded.filter(p => getCatId(p.category) === '6a8aea066dd73e298cdb36da').slice(0, 4);
    initialAccessories = allLoaded
      .filter(p => getCatId(p.category) === '6a8ae13c5f408109bce576a6' || getCatId(p.category) === '6a8af3ad75f0085178374d75')
      .slice(0, 4);
  }

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Featured Gaming Consoles, PS5 Games & Accessories in Pakistan',
    itemListElement: allLoaded.slice(0, 24).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: product.name,
      url: `https://www.pgsgameshop.online/products/${getProductSlug(product)}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <HomeClientPage
        initialCategories={categories}
        initialFeatured={initialFeatured}
        initialConsoles={initialConsoles}
        initialGames={initialGames}
        initialAccessories={initialAccessories}
      />
    </>
  );
}
