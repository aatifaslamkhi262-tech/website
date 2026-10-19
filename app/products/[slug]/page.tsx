import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchProductBySlug, fetchProducts, getProductSlug, getProductEffectivePrice, isPriceOnCall } from '@/lib/api';
import ProductDetailClientPage from './ProductDetailClientPage';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await fetchProductBySlug(resolvedParams.slug);

  if (!product) {
    return {
      title: 'Product Not Found | PGS Game Shop Karachi',
      description: 'The requested gaming product could not be found.',
    };
  }

  const rawImage = product.images && product.images.length > 0
    ? (product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || '')
    : '/logo.png';

  const primaryImage = rawImage.startsWith('http')
    ? rawImage
    : `https://pgsgameshop.online${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;

  const priceStr = isPriceOnCall(product)
    ? 'Call for Price'
    : `Rs. ${getProductEffectivePrice(product).toLocaleString()}`;

  const metaTitle = `${product.name} - ${priceStr} | PGS Game Shop Karachi`;
  const metaDesc = `Buy ${product.name} (${product.condition} condition) online in Pakistan for ${priceStr}. 100% Authentic, Warranty Verified, Express Nationwide Dispatch.`;
  const canonicalUrl = `https://pgsgameshop.online/products/${getProductSlug(product)}`;

  return {
    title: metaTitle,
    description: metaDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: canonicalUrl,
      siteName: 'PGS Game Shop Karachi',
      images: [
        {
          url: primaryImage,
          secureUrl: primaryImage,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDesc,
      images: [primaryImage],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const product = await fetchProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // Fetch related products from same category or general catalog
  const categoryId = typeof product.category === 'object' && product.category !== null ? product.category._id : (product.category || '');
  const relatedRes = await fetchProducts({ category: categoryId, limit: 12 });
  const categoryProducts = (relatedRes.success && relatedRes.data) ? relatedRes.data : [];
  const relatedProducts = categoryProducts.filter(p => p._id !== product._id).slice(0, 4);

  return (
    <ProductDetailClientPage
      product={product}
      relatedProducts={relatedProducts}
      allCategoryProducts={categoryProducts}
    />
  );
}
