import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchProducts, fetchCategories } from '@/lib/api';
import { CATEGORY_CONFIGS, CategorySeoConfig } from '@/lib/categoryData';
import CategoryClientPage from './CategoryClientPage';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.toLowerCase();

  const config = CATEGORY_CONFIGS[slug];

  if (!config) {
    return {
      title: 'Gaming Category | PGS Game Shop Pakistan',
      description: 'Explore authentic gaming consoles, games, and accessories at PGS Game Shop Karachi.',
    };
  }

  const canonicalUrl = `https://www.pgsgameshop.online/category/${slug}`;

  return {
    title: config.metaTitle,
    description: config.metaDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: config.metaTitle,
      description: config.metaDesc,
      url: canonicalUrl,
      siteName: 'PGS Game Shop Karachi',
      type: 'website',
      images: [
        {
          url: 'https://www.pgsgameshop.online/logo2.png',
          width: 1200,
          height: 630,
          alt: config.heading,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: config.metaTitle,
      description: config.metaDesc,
      images: ['https://www.pgsgameshop.online/logo2.png'],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.toLowerCase();

  let config: CategorySeoConfig | undefined = CATEGORY_CONFIGS[slug];

  // Dynamic fallback for any category in database if not explicitly pre-configured
  if (!config) {
    const allCategories = await fetchCategories();
    const matched = allCategories.find(
      c => c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug || c._id === slug
    );

    if (matched) {
      config = {
        id: matched._id,
        slug: slug,
        name: matched.name,
        metaTitle: `${matched.name} Price in Pakistan | PGS Game Shop`,
        metaDesc: `Buy original ${matched.name} in Pakistan with warranty and fast delivery from PGS Game Shop.`,
        heading: `${matched.name} in Pakistan`,
        subheading: `Authentic ${matched.name} available at competitive prices in Pakistan.`,
        seoText: `Explore our collection of genuine ${matched.name} with official warranty and nationwide shipping.`,
        faqs: [],
      };
    }
  }

  if (!config) {
    notFound();
  }

  // Fetch category products server-side
  const res = await fetchProducts({ category: config.id, limit: 48, sortBy: 'latest' });
  const products = (res.success && res.data) ? res.data : [];

  const canonicalUrl = `https://www.pgsgameshop.online/category/${slug}`;

  // Schema.org BreadcrumbList
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.pgsgameshop.online',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Categories',
        item: 'https://www.pgsgameshop.online/products',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: config.name,
        item: canonicalUrl,
      },
    ],
  };

  // Schema.org ItemList (CollectionPage)
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: config.heading,
    itemListElement: products.slice(0, 10).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: product.name,
      url: `https://www.pgsgameshop.online/products/${product._id}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <CategoryClientPage config={config} initialProducts={products} />
    </>
  );
}

