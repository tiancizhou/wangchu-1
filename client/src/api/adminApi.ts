import { request } from './http';
import type { Banner, Product } from './publicApi';

export type AdminUser = { id: string; username: string; role: string };

export function login(username: string, password: string) {
  return request<AdminUser>('/api/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
}

export function logout() {
  return request<{ ok: boolean }>('/api/admin/auth/logout', { method: 'POST' });
}

export function me() {
  return request<AdminUser>('/api/admin/auth/me');
}

export function adminProducts() {
  return request<Product[]>('/api/admin/products');
}

export function adminProduct(id: string) {
  return request<Product>(`/api/admin/products/${id}`);
}

export function saveProduct(product: Partial<Product>) {
  return request<Product>(product.id ? `/api/admin/products/${product.id}` : '/api/admin/products', {
    method: product.id ? 'PUT' : 'POST',
    body: JSON.stringify(product)
  });
}

export function deleteProduct(id: string) {
  return request<{ ok: boolean }>(`/api/admin/products/${id}`, { method: 'DELETE' });
}

export function adminBanners() {
  return request<Banner[]>('/api/admin/banners');
}

export function saveBanner(banner: Partial<Banner>) {
  return request<Banner>(banner.id ? `/api/admin/banners/${banner.id}` : '/api/admin/banners', {
    method: banner.id ? 'PUT' : 'POST',
    body: JSON.stringify(banner)
  });
}

export function deleteBanner(id: string) {
  return request<{ ok: boolean }>(`/api/admin/banners/${id}`, { method: 'DELETE' });
}

export function uploadImage(file: File) {
  const form = new FormData();
  form.append('file', file);
  return request<{ url: string }>('/api/admin/uploads/images', {
    method: 'POST',
    body: form
  });
}
