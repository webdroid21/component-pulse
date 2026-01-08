import type { Timestamp } from 'firebase/firestore';

// ----------------------------------------------------------------------

export type ProductImage = {
  id: string;
  url: string;
  alt?: string;
  isPrimary?: boolean;
  isFeatured?: boolean;
};

export type ProductVariant = {
  id: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  attributes: Record<string, string>;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku: string;
  price: number;
  salePrice?: number;
  compareAtPrice?: number;
  costPrice?: number;
  stock: number;
  quantity: number;
  lowStockThreshold?: number;
  categoryId: string;
  categoryName?: string;
  subcategoryId?: string;
  images: ProductImage[];
  variants?: ProductVariant[];
  tags?: string[];
  brand?: string;
  weight?: number;
  weightUnit?: 'kg' | 'g' | 'lb' | 'oz';
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in' | 'm';
  };
  isActive: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  saleStartDate?: Timestamp;
  saleEndDate?: Timestamp;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: string;
};

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'slug'>;

export type ProductFilters = {
  search?: string;
  categoryId?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  limit?: number;
};
