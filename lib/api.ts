import { ProductsApiResponse, CategoriesApiResponse, CheckoutPayload, CheckoutApiResponse, ProductQueryParams, Category, Product } from './types';
import { redisGet, redisSet, redisDel } from './redis';
import { smartSearchProducts } from './smartSearch';

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
        const name = (c.name || '').toUpperCase().trim();
        return !name.includes('REPAIR') && name !== 'OTHER' && c._id !== '6ab53bed11becccecde93543' && c._id !== '6ac799f43d321e0959cefdce';
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
      // 1. Check browser localStorage cache first if available (0ms synchronous, zero network calls)
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

      // 2. Check Upstash Redis RAM Cache for Instant sub-10ms response
      const redisCatalog = await redisGet<Product[]>('pgs:catalog:v1');
      if (redisCatalog && Array.isArray(redisCatalog) && redisCatalog.length > 0) {
        globalCatalogCache = {
          timestamp: Date.now(),
          products: redisCatalog,
          categories: globalCatalogCache?.categories || [],
        };
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('pgs_catalog_cache_v3', JSON.stringify(globalCatalogCache));
          } catch (e) {}
        }
        return redisCatalog;
      }

      // 3. Single-Request Catalog Fetch (limit=1000 & inStockOnly=true, CDN-cacheable, no custom auth headers)
      const fetchPage = (pageNum: number) =>
        fetch(`${API_BASE_URL}/api/public/products?page=${pageNum}&limit=1000&inStockOnly=true`, {
          headers: {
            'Accept': 'application/json',
          },
          next: { revalidate: 120 }
        }).then(res => (res.ok ? res.json() : null)).catch(() => null);

      const firstPageRes = await fetchPage(1);
      const allProducts: Product[] = [];

      if (firstPageRes && firstPageRes.success && Array.isArray(firstPageRes.data)) {
        allProducts.push(...firstPageRes.data);

        // Safety fallback if in-stock catalog ever exceeds 1,000 items in the future
        const totalPages = Math.min(5, Math.max(1, firstPageRes.pagination?.totalPages || 1));
        if (totalPages > 1) {
          const remainingPages: number[] = [];
          for (let p = 2; p <= totalPages; p++) {
            remainingPages.push(p);
          }
          const results = await Promise.all(remainingPages.map(p => fetchPage(p)));
          results.forEach(r => {
            if (r && r.success && Array.isArray(r.data)) {
              allProducts.push(...r.data);
            }
          });
        }
      }

      if (allProducts.length > 0) {
        const uniqueMap = new Map<string, Product>();
        allProducts.forEach(p => uniqueMap.set(p._id, p));
        const unique = Array.from(uniqueMap.values());

        // Exclude REPAIRING PARTS, 'other' category, and Out-of-Stock products (inStock === false or warehouseStock <= 0)
        const filteredProducts = unique.filter(p => {
          if (!p.inStock || (p.warehouseStock !== undefined && p.warehouseStock <= 0)) return false;

          if (typeof p.category === 'object' && p.category !== null) {
            const catName = (p.category.name || '').toUpperCase().trim();
            if (catName.includes('REPAIR') || catName === 'OTHER' || p.category._id === '6ab53bed11becccecde93543' || p.category._id === '6ac799f43d321e0959cefdce') return false;
          } else if (typeof p.category === 'string') {
            const catStr = p.category.toUpperCase().trim();
            if (catStr === '6ab53bed11becccecde93543' || catStr === '6ac799f43d321e0959cefdce' || catStr.includes('REPAIR') || catStr === 'OTHER') return false;
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

        // Populate Upstash Redis RAM Cache (300s TTL for real-time freshness)
        redisSet('pgs:catalog:v1', filteredProducts, 300).catch(() => {});

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

  // 1. Ensure catalog cache is loaded (from RAM, Upstash Redis, or IMS API)
  let catalog = globalCatalogCache?.products;
  if (!catalog || catalog.length === 0) {
    catalog = await ensureCatalogCache();
  }

  if (catalog && catalog.length > 0) {
    let filtered = [...catalog];

    // Smart Multi-Word, Typo-Tolerant, Gaming-Synonym Search
    if (search.trim()) {
      filtered = smartSearchProducts(filtered, search.trim());
    }

    // Filter by category
    if (category && category !== 'All') {
      const catLower = category.toLowerCase();
      filtered = filtered.filter(p => {
        if (typeof p.category === 'object' && p.category !== null) {
          const catName = (p.category.name || '').toLowerCase();
          const catSlug = (p.category.slug || '').toLowerCase();
          return p.category._id === category || catSlug === catLower || catName.includes(catLower);
        }
        if (typeof p.category === 'string') {
          return p.category === category || p.category.toLowerCase().includes(catLower);
        }
        return false;
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

    // Always filter out of stock items
    filtered = filtered.filter(p => p.inStock && (p.warehouseStock === undefined || p.warehouseStock > 0));

    // Apply sorting: Only override order if explicit user sorting is chosen
    if (sortBy === 'price_asc') {
      filtered.sort((a, b) => getProductEffectivePrice(a) - getProductEffectivePrice(b));
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => getProductEffectivePrice(b) - getProductEffectivePrice(a));
    } else if (sortBy === 'name_asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    // Note: If sortBy is 'latest' and user searched, smartSearchProducts keeps the highest-relevance items on top!

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

  // 2. Trigger catalog background warming silently (non-blocking!)
  ensureCatalogCache().catch(() => {});

  // 3. Fast direct real-time single query to live CDN API (< 100ms!)
  try {
    const query = new URLSearchParams();
    query.set('page', page.toString());
    query.set('limit', limit.toString());
    query.set('inStockOnly', 'true');
    if (search.trim()) query.set('search', search.trim());
    if (category && category !== 'All') query.set('category', category);
    if (condition && condition !== 'All') query.set('condition', condition);

    const res = await fetch(`${API_BASE_URL}/api/public/products?${query.toString()}`, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 120 }
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
      // Filter out out-of-stock items
      const items = json.data.filter(p => p.inStock && (p.warehouseStock === undefined || p.warehouseStock > 0));
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

export async function submitCheckout(payload: CheckoutPayload, idempotencyKey?: string): Promise<CheckoutApiResponse> {
  const key = idempotencyKey || `chk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const res = await fetch(`${API_BASE_URL}/api/public/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'Authorization': `Bearer ${API_KEY}`,
      'x-idempotency-key': key,
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

  // Clear local & Upstash Redis catalog cache upon order submission (0ms real-time sync!)
  globalCatalogCache = null;
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('pgs_catalog_cache_v3');
    } catch (e) {}
  }
  redisDel('pgs:catalog:v1').catch(() => {});

  return json;
}

export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export function getProductSlug(product: Product): string {
  if (!product) return '';
  const cleanName = slugify(product.name);
  if (product._id) {
    return `${cleanName}-${product._id}`;
  }
  return cleanName;
}

export async function fetchProductBySlug(slugParam: string): Promise<Product | null> {
  if (!slugParam) return null;
  const decoded = decodeURIComponent(slugParam).trim();

  // 1. Check if slug contains 24-character Mongo ID at the end
  const matchId = decoded.match(/([a-f0-9]{24})$/i);
  const targetId = matchId ? matchId[1] : '';

  const res = await fetchProducts({ limit: 1000 });
  if (!res.success || !res.data) return null;

  const products = res.data;

  // Match by Mongo ID
  if (targetId) {
    const foundById = products.find(p => p._id === targetId);
    if (foundById) return foundById;
  }

  // Match by direct ID match
  const foundDirectId = products.find(p => p._id === decoded);
  if (foundDirectId) return foundDirectId;

  // Match by SKU
  const foundBySku = products.find(p => p.sku && (p.sku.toLowerCase() === decoded.toLowerCase() || slugify(p.sku) === decoded.toLowerCase()));
  if (foundBySku) return foundBySku;

  // Match by Name Slug
  const targetSlug = slugify(decoded);
  const foundByName = products.find(p => {
    const pSlug = slugify(p.name);
    return pSlug === targetSlug || getProductSlug(p) === decoded || targetSlug.includes(pSlug) || pSlug.includes(targetSlug);
  });

  if (foundByName) return foundByName;

  return null;
}
