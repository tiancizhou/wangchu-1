import { request } from './http';
import type { Banner, Certificate, ContentSection, NavigationItem, Product, ProductCategory, SiteProfile } from './publicApi';

export type AdminUser = { id: string; username: string; role: string };

export type ConsultationSubmission = {
  id: string;
  name: string;
  phone: string;
  industry: string;
  message: string;
  sourcePage: string;
  status: string;
  adminNote: string;
  createdAt: string;
  updatedAt: string;
};

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

export function adminSiteProfile() {
  return request<SiteProfile | null>('/api/admin/site-profile');
}

export function saveSiteProfile(profile: Partial<SiteProfile>) {
  return request<SiteProfile>('/api/admin/site-profile', {
    method: 'PUT',
    body: JSON.stringify(profile)
  });
}

export function adminNavigation() {
  return request<NavigationItem[]>('/api/admin/navigation');
}

export function saveNavigationItem(item: Partial<NavigationItem>) {
  return request<NavigationItem>(item.id ? `/api/admin/navigation/${item.id}` : '/api/admin/navigation', {
    method: item.id ? 'PUT' : 'POST',
    body: JSON.stringify(item)
  });
}

export function deleteNavigationItem(id: string) {
  return request<{ ok: boolean }>(`/api/admin/navigation/${id}`, { method: 'DELETE' });
}

export function adminCategories() {
  return request<ProductCategory[]>('/api/admin/categories');
}

export function saveCategory(category: Partial<ProductCategory>) {
  return request<ProductCategory>(category.id ? `/api/admin/categories/${category.id}` : '/api/admin/categories', {
    method: category.id ? 'PUT' : 'POST',
    body: JSON.stringify(category)
  });
}

export function deleteCategory(id: string) {
  return request<{ ok: boolean }>(`/api/admin/categories/${id}`, { method: 'DELETE' });
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

export function adminContentSections(pageKey = '') {
  return request<ContentSection[]>(`/api/admin/content-sections${pageKey ? `?pageKey=${pageKey}` : ''}`);
}

export function adminContentSection(pageKey: string, sectionKey: string) {
  return request<ContentSection>(`/api/admin/content-sections/${pageKey}/${sectionKey}`);
}

export function saveContentSection(section: Partial<ContentSection> & { pageKey: string; sectionKey: string }) {
  return request<ContentSection>(`/api/admin/content-sections/${section.pageKey}/${section.sectionKey}`, {
    method: 'PUT',
    body: JSON.stringify(section)
  });
}

export function adminCertificates() {
  return request<Certificate[]>('/api/admin/certificates');
}

export function saveCertificate(certificate: Partial<Certificate>) {
  return request<Certificate>(certificate.id ? `/api/admin/certificates/${certificate.id}` : '/api/admin/certificates', {
    method: certificate.id ? 'PUT' : 'POST',
    body: JSON.stringify(certificate)
  });
}

export function deleteCertificate(id: string) {
  return request<{ ok: boolean }>(`/api/admin/certificates/${id}`, { method: 'DELETE' });
}

export function adminConsultations(status = '') {
  return request<ConsultationSubmission[]>(`/api/admin/consultations${status ? `?status=${status}` : ''}`);
}

export function updateConsultation(id: string, payload: Pick<ConsultationSubmission, 'status' | 'adminNote'>) {
  return request<ConsultationSubmission>(`/api/admin/consultations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function uploadImage(file: File) {
  const form = new FormData();
  form.append('file', file);
  return request<{ url: string }>('/api/admin/uploads/images', {
    method: 'POST',
    body: form
  });
}

export function uploadMedia(file: File) {
  const form = new FormData();
  form.append('file', file);
  return request<{ url: string; mimeType: string }>('/api/admin/uploads/media', {
    method: 'POST',
    body: form
  });
}
