import { request } from './http';

export type FooterLink = {
  label: string;
  url: string;
};

export type SiteProfile = {
  id: string;
  companyName: string;
  logoUrl: string;
  footerLogoUrl: string;
  phone: string;
  hotline: string;
  address: string;
  email: string;
  footerText: string;
  footerLinksJson: string;
  footerLinks?: FooterLink[];
  footerLinkTitle: string;
  legalLabel: string;
  legalUrl: string;
  contactLabel: string;
  contactUrl: string;
  copyrightText: string;
  policeFilingText: string;
  policeFilingUrl: string;
  icpText: string;
  icpUrl: string;
  seoTitle: string;
  seoDescription: string;
};

export type NavigationItem = {
  id: string;
  label: string;
  url: string;
  sortOrder: number;
  isVisible: boolean;
  openInNewTab: boolean;
};

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImageUrl: string;
  iconImageUrl: string;
  sortOrder: number;
  isPublished: boolean;
  seoTitle: string;
  seoDescription: string;
};

export type ProductGalleryItem = {
  imageUrl: string;
  caption: string;
};

export type ProductPerformanceItem = {
  icon: string;
  title: string;
  description: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  categoryId?: string | null;
  categoryRef?: ProductCategory | null;
  coverImageUrl: string;
  listCoverImageUrl: string;
  topSubtitle: string;
  detailTitle: string;
  detailDescription: string;
  detailImageUrl: string;
  productSpecsImageUrl: string;
  detailGallery: ProductGalleryItem[];
  performanceTitle: string;
  performanceText: string;
  performanceItems: ProductPerformanceItem[];
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

export type Certificate = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  issuer: string;
  issueDate: string;
  sortOrder: number;
  isPublished: boolean;
};

export type ContentSection<T = Record<string, unknown>> = {
  id: string;
  pageKey: string;
  sectionKey: string;
  title: string;
  subtitle: string;
  data: T;
  sortOrder: number;
  isPublished: boolean;
};

export type HomeData = {
  siteProfile: SiteProfile | null;
  navigation: NavigationItem[];
  banners: Banner[];
  categories: ProductCategory[];
  products: Product[];
  sections: Record<string, ContentSection>;
};

export type ConsultationPayload = {
  name: string;
  phone: string;
  industry?: string;
  message?: string;
  sourcePage?: string;
};

export function getSiteProfile() {
  return request<SiteProfile | null>('/api/site-profile');
}

export function getNavigation() {
  return request<NavigationItem[]>('/api/navigation');
}

export function getHomeData() {
  return request<HomeData>('/api/home');
}

export function getContentSections(pageKey: string) {
  return request<Record<string, ContentSection>>(`/api/content-sections?pageKey=${pageKey}`);
}

export function getCategories() {
  return request<ProductCategory[]>('/api/categories');
}

export function getCertificates() {
  return request<Certificate[]>('/api/certificates');
}

export function submitConsultation(payload: ConsultationPayload) {
  return request<{ id: string; ok: boolean }>('/api/consultations', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function getProducts(params = '') {
  return request<{ items: Product[]; total: number; page: number; pageSize: number }>(`/api/products${params}`);
}

export function getProduct(slug: string) {
  return request<Product>(`/api/products/${slug}`);
}

export function getBanners() {
  return request<Banner[]>('/api/banners');
}
