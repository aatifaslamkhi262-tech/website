import { MetadataRoute } from 'next';
import { fetchProducts, getProductSlug } from '@/lib/api';

export const revalidate = 3600;

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
      url: `${baseUrl}/category/playstation-5`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/category/consoles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/category/games`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/category/controllers`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/category/accessories`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/category/gift-cards`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
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
    const productsRes = await fetchProducts({ limit: 1000 });
    const productRoutes: MetadataRoute.Sitemap = (productsRes.data || []).map((product) => {
      const updatedDate = (product as any).updatedAt || (product as any).createdAt;
      return {
        url: `${baseUrl}/products/${getProductSlug(product)}`,
        lastModified: updatedDate ? new Date(updatedDate) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      };
    });

    return [...staticPages, ...productRoutes];
  } catch (err) {
    console.error('Error generating dynamic sitemap:', err);
    return staticPages;
  }
}
