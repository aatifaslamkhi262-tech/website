import { MetadataRoute } from 'next';
import { fetchProducts, getProductSlug } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.pgsgameshop.online';

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  try {
    const productsRes = await fetchProducts({ limit: 100 });
    const productRoutes: MetadataRoute.Sitemap = (productsRes.data || []).map((product) => ({
      url: `${baseUrl}/products/${getProductSlug(product)}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    return [...staticPages, ...productRoutes];
  } catch (err) {
    console.error('Error generating dynamic sitemap:', err);
    return staticPages;
  }
}

