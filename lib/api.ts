import { ProductsApiResponse, CategoriesApiResponse, CheckoutPayload, CheckoutApiResponse, ProductQueryParams, Category, Product } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_IMS_API_URL || 'https://pgs-ims.vercel.app';
const API_KEY = process.env.NEXT_PUBLIC_IMS_API_KEY || 'pgs_ecommerce_secret_key_2026';

// Memory Cache for instant sub-50ms responses
let globalCatalogCache: {
  timestamp: number;
  products: Product[];
  categories: Category[];
} | null = null;

let isWarmingCache = false;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 Minutes TTL

export function getProductEffectivePrice(product: Product): number {
  if (!product) return 0;
  const minP = product.minSellingPrice || 0;
  const sellP = product.sellingPrice || 0;
  const origP = product.originalPrice || 0;

  if (minP > 0 && (minP < sellP || sellP <= 0)) {
    return minP;
  }
  if (sellP > 0) {
    return sellP;
  }
  if (origP > 0) {
    return origP;
  }
  return 0;
}

export function isPriceOnCall(product: Product): boolean {
  const price = getProductEffectivePrice(product);
  return price <= 0;
}

export async function fetchCategories(): Promise<Category[]> {
  if (globalCatalogCache && globalCatalogCache.categories.length > 0) {
    return globalCatalogCache.categories;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/public/categories`, {
      headers: {
        'x-api-key': API_KEY,
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json',
      },
      next: { revalidate: 300 }
    });

    if (!res.ok) {
      console.error(`IMS Categories API returned status ${res.status}`);
      return [];
    }

    const json: CategoriesApiResponse = await res.json();
    if (json.success && Array.isArray(json.data)) {
      const cleanCategories = json.data.filter(c => {
        const name = (c.name || '').toUpperCase();
        return !name.includes('REPAIR') && c._id !== '6ab53bed11becccecde93543';
      });

      if (globalCatalogCache) {
        globalCatalogCache.categories = cleanCategories;
      }
      return cleanCategories;
    }
    return [];
  } catch (err) {
    console.error('Error fetching live categories from IMS:', err);
    return [];
  }
}

let warmingPromise: Promise<Product[]> | null = null;

async function ensureCatalogCache(): Promise<Product[]> {
  const now = Date.now();
  if (globalCatalogCache && globalCatalogCache.products.length > 0 && (now - globalCatalogCache.timestamp < CACHE_TTL_MS)) {
    return globalCatalogCache.products;
  }

  if (warmingPromise) {
    return warmingPromise;
  }

  warmingPromise = (async () => {
    try {
      // Check browser localStorage cache if available for instant warm startup
      if (typeof window !== 'undefined') {
        try {
          const cached = localStorage.getItem('pgs_catalog_cache_v3');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0 && (now - parsed.timestamp < CACHE_TTL_MS)) {
              globalCatalogCache = parsed;
              return parsed.products;
            }
          }
        } catch (e) {
          // ignore
        }
      }

      const pages = [1, 2, 3, 4, 5, 6, 7];
      const promises = pages.map(p =>
        fetch(`${API_BASE_URL}/api/public/products?page=${p}&limit=100`, {
          headers: {
            'x-api-key': API_KEY,
            'Authorization': `Bearer ${API_KEY}`,
            'Accept': 'application/json',
          },
          cache: 'no-store'
        }).then(res => res.json()).catch(() => null)
      );

      const results = await Promise.all(promises);
      const allProducts: Product[] = [];

      results.forEach(r => {
        if (r && r.success && Array.isArray(r.data)) {
          allProducts.push(...r.data);
        }
      });

      if (allProducts.length > 0) {
        const uniqueMap = new Map<string, Product>();
        allProducts.forEach(p => uniqueMap.set(p._id, p));
        const unique = Array.from(uniqueMap.values());

        // Exclude all products belonging to "REPAIRING PARTS" category
        const filteredProducts = unique.filter(p => {
          if (typeof p.category === 'object' && p.category !== null) {
            const catName = (p.category.name || '').toUpperCase();
            if (catName.includes('REPAIR') || p.category._id === '6ab53bed11becccecde93543') return false;
          } else if (typeof p.category === 'string') {
            if (p.category === '6ab53bed11becccecde93543' || p.category.toUpperCase().includes('REPAIR')) return false;
          }
          return true;
        });

        // Global Sort: In-Stock items FIRST (highest stock first), Out-of-Stock items AT THE VERY END
        filteredProducts.sort((a, b) => {
          if (a.inStock !== b.inStock) {
            return a.inStock ? -1 : 1;
          }
          return (b.warehouseStock || 0) - (a.warehouseStock || 0);
        });

        globalCatalogCache = {
          timestamp: Date.now(),
          products: filteredProducts,
          categories: globalCatalogCache?.categories || []
        };

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('pgs_catalog_cache_v3', JSON.stringify(globalCatalogCache));
          } catch (e) {}
        }

        return filteredProducts;
      }

      return globalCatalogCache?.products || [];
    } catch (e) {
      console.error('Error warming catalog cache:', e);
      return globalCatalogCache?.products || [];
    } finally {
      warmingPromise = null;
    }
  })();

  return warmingPromise;
}

export async function fetchProducts(params: ProductQueryParams = {}): Promise<ProductsApiResponse> {
  const {
    page = 1,
    limit = 24,
    search = '',
    category = '',
    condition = 'All',
    minPrice,
    maxPrice,
    inStockOnly,
    sortBy = 'latest'
  } = params;

  // Await shared catalog warming promise so concurrent page-load calls share the complete sorted catalog
  const catalog = await ensureCatalogCache();

  if (catalog && catalog.length > 0) {
    let filtered = [...catalog];

    // Filter by search query
    if (search.trim()) {
      const s = search.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(s) ||
        p.sku.toLowerCase().includes(s) ||
        (p.brand && p.brand.toLowerCase().includes(s)) ||
        (p.barcode && p.barcode.toLowerCase().includes(s))
      );
    }

    // Filter by category
    if (category && category !== 'All') {
      filtered = filtered.filter(p => {
        if (typeof p.category === 'object' && p.category !== null) {
          return p.category._id === category || p.category.slug === category;
        }
        return p.category === category;
      });
    }

    // Filter by condition
    if (condition && condition !== 'All') {
      filtered = filtered.filter(p => p.condition === condition);
    }

    // Filter by minPrice / maxPrice
    if (minPrice !== undefined && !isNaN(minPrice)) {
      filtered = filtered.filter(p => getProductEffectivePrice(p) >= minPrice);
    }
    if (maxPrice !== undefined && !isNaN(maxPrice) && maxPrice > 0) {
      filtered = filtered.filter(p => getProductEffectivePrice(p) <= maxPrice);
    }

    // Filter inStockOnly
    if (inStockOnly) {
      filtered = filtered.filter(p => p.inStock);
    }

    // Apply sorting (keeping In-Stock items at top)
    filtered.sort((a, b) => {
      if (a.inStock !== b.inStock) {
        return a.inStock ? -1 : 1;
      }

      const priceA = getProductEffectivePrice(a);
      const priceB = getProductEffectivePrice(b);

      if (sortBy === 'price_asc') {
        return priceA - priceB;
      } else if (sortBy === 'price_desc') {
        return priceB - priceA;
      } else if (sortBy === 'name_asc') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const validPage = Math.min(Math.max(1, page), totalPages);
    const startIndex = (validPage - 1) * limit;
    const paginatedItems = filtered.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: paginatedItems,
      pagination: {
        total,
        page: validPage,
        limit,
        totalPages
      }
    };
  }

  // Fast direct single-page query for instant initial render (< 150ms!)
  try {
    const query = new URLSearchParams();
    query.set('page', page.toString());
    query.set('limit', limit.toString());
    if (search.trim()) query.set('search', search.trim());
    if (category && category !== 'All') query.set('category', category);
    if (condition && condition !== 'All') query.set('condition', condition);

    const res = await fetch(`${API_BASE_URL}/api/public/products?${query.toString()}`, {
      headers: {
        'x-api-key': API_KEY,
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      return {
        success: false,
        data: [],
        pagination: { total: 0, page: 1, limit: 24, totalPages: 1 }
      };
    }

    const json: ProductsApiResponse = await res.json();
    if (json.success && Array.isArray(json.data)) {
      // Sort single-page in-stock items first
      const items = [...json.data].sort((a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0));
      return {
        ...json,
        data: items
      };
    }

    return {
      success: false,
      data: [],
      pagination: { total: 0, page: 1, limit: 24, totalPages: 1 }
    };

  } catch (err) {
    console.error('Error fetching live products from IMS:', err);
    return {
      success: false,
      data: [],
      pagination: { total: 0, page: 1, limit: 24, totalPages: 1 }
    };
  }
}

export async function submitCheckout(payload: CheckoutPayload): Promise<CheckoutApiResponse> {
  const res = await fetch(`${API_BASE_URL}/api/public/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  const json: CheckoutApiResponse = await res.json().catch(() => ({
    success: false,
    error: `Server error HTTP ${res.status}`
  } as any));

  if (!res.ok || !json.success) {
    throw new Error((json as any).error || json.message || `Checkout failed with status ${res.status}`);
  }

  // Clear catalog cache upon order submission
  globalCatalogCache = null;

  return json;
}
