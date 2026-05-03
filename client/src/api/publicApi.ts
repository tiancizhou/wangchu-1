import { request } from './http';

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  coverImageUrl: string;
  galleryImageUrls: string[];
  sortOrder: number;
  isPublished: boolean;
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  sortOrder: number;
  isActive: boolean;
};

export function getProducts(params = '') {
  return request<{ items: Product[]; total: number; page: number; pageSize: number }>(`/api/products${params}`);
}

export function getProduct(slug: string) {
  return request<Product>(`/api/products/${slug}`);
}

export function getBanners() {
  return request<Banner[]>('/api/banners');
}
