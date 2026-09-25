export interface Category {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
}

export interface ProductImage {
  url: string;
  isPrimary?: boolean;
}

export type ProductCondition = 'New' | 'Used' | 'Refurbished' | 'Defective';

export interface Product {
  _id: string;
  name: string;
  sku: string;
  barcode?: string;
  category: Category | string | null;
  brand?: string;
  model?: string;
  color?: string;
  condition: ProductCondition;
  sellingPrice: number;
  minSellingPrice?: number;
  originalPrice?: number;
  images: ProductImage[];
  description?: string;
  serialTracking?: boolean;
  warehouseStock: number;
  inStock: boolean;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsApiResponse {
  success: boolean;
  data: Product[];
  pagination: PaginationMeta;
}

export interface CategoriesApiResponse {
  success: boolean;
  data: Category[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutItemPayload {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export type PaymentMethod = 'CASH' | 'BANK_TRANSFER';

export interface CheckoutPayload {
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  city?: string;
  paymentMethod: PaymentMethod;
  deliveryCharges: number;
  notes?: string;
  items: CheckoutItemPayload[];
}

export interface CheckoutResponseData {
  saleId: string;
  saleNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

export interface CheckoutApiResponse {
  success: boolean;
  data: CheckoutResponseData;
  message?: string;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  condition?: ProductCondition | 'All';
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sortBy?: 'latest' | 'price_asc' | 'price_desc' | 'name_asc';
}
