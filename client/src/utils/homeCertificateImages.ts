export type HomeCertificateImage = {
  id: string;
  imageUrl: string;
  title: string;
  sortOrder: number;
  isPublished: boolean;
};

export function normalizeHomeCertificateImages(value: unknown): HomeCertificateImage[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is Partial<HomeCertificateImage> & { imageUrl: string } => Boolean(item && typeof item === 'object' && 'imageUrl' in item && typeof item.imageUrl === 'string' && item.imageUrl))
    .map((item, index) => ({
      id: typeof item.id === 'string' && item.id ? item.id : `home-certificate-${index + 1}`,
      imageUrl: item.imageUrl,
      title: typeof item.title === 'string' && item.title ? item.title : '荣誉资质',
      sortOrder: typeof item.sortOrder === 'number' ? item.sortOrder : index + 1,
      isPublished: item.isPublished === undefined ? true : Boolean(item.isPublished)
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
