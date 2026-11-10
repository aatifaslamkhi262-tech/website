import React from 'react';
import type { Metadata } from 'next';
import { fetchCategories, fetchProducts, getProductSlug } from '@/lib/api';
import ProductsClientPage from './ProductsClientPage';

export const revalidate = 120;

export const metadata: Metadata = {
  title: 'All Gaming Consoles, PS5 Games & Accessories Catalog',
  description: 'Browse our complete catalog of Sony PlayStation 5 (PS5 Slim & Pro), PS4, Xbox Series X consoles, original game CDs, DualSense controllers, and gaming gear in Pakistan.',
  alternates: {
    canonical: 'https://www.pgsgameshop.online/products',
  },
  openGraph: {
    title: 'All Gaming Consoles, PS5 Games & Accessories Catalog | PGS Game Shop',
    description: 'Browse our complete catalog of Sony PlayStation 5, PS4, Xbox consoles, original game CDs, DualSense controllers, and gaming gear in Pakistan.',
    url: 'https://www.pgsgameshop.online/products',
    siteName: 'PGS Game Shop Karachi',
    type: 'website',
  },
};

export default async function CatalogPage() {
  const [categories, fullCatalogRes] = await Promise.all([
    fetchCategories(),
    fetchProducts({ page: 1, limit: 1000, sortBy: 'latest' }),
  ]);

  const allProducts = fullCatalogRes.success && fullCatalogRes.data ? fullCatalogRes.data : [];
  const initialPageProducts = allProducts.slice(0, 24);
  const total = allProducts.length;
  const initialPagination = {
    total,
    page: 1,
    limit: 24,
    totalPages: Math.ceil(total / 24) || 1,
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'PGS Game Shop Complete Gaming Catalog',
    numberOfItems: total,
    itemListElement: allProducts.slice(0, 50).map((product, index) => ({
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
      <ProductsClientPage
        initialCategories={categories}
        initialProducts={initialPageProducts}
        initialPagination={initialPagination}
        allCatalogProducts={allProducts}
      />
    </>
  );
}
