import type { Timestamp } from 'firebase/firestore';

// ----------------------------------------------------------------------

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  parentName?: string;
  order: number;
  isActive: boolean;
  productCount?: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type CategoryFormData = Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'slug' | 'productCount'>;

export type CategoryWithChildren = Category & {
  children?: Category[];
};
