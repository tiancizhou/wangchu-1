export type CropSize = {
  width: number;
  height: number;
  label: string;
};

export const IMAGE_CROP_PRESETS = {
  homepageHero: { width: 1920, height: 936, label: '首页轮播图' },
  supportMiddle: { width: 437, height: 400, label: '生产设计中间图' },
  supportThumbnail: { width: 200, height: 200, label: '生产设计底部轮播图' },
  productCategoryCover: { width: 386, height: 386, label: '产品细项分类图' },
  processBackground: { width: 1920, height: 1174, label: '先进制作工艺背景图' },
  processMain: { width: 980, height: 520, label: '先进制作工艺主图' },
  processGallery: { width: 275, height: 160, label: '先进制作工艺底部轮播图' },
  aboutPreview: { width: 506, height: 406, label: '首页关于我们图片' },
  productListCover: { width: 266, height: 182, label: '产品列表封面图' },
  productDetailTop: { width: 372, height: 372, label: '产品详情页顶图' },
  productDetailMiddle: { width: 824, height: 412, label: '产品详情中间图' },
  productSpecs: { width: 824, height: 412, label: '产品参数和属性图' },
  productDetailGallery: { width: 387, height: 245, label: '产品细节图' },
  contactAvatar: { width: 110, height: 110, label: '联系顾问头像' },
  headerLogo: { width: 142, height: 62, label: '顶部 Logo' },
  footerLogo: { width: 160, height: 72, label: '页脚 Logo' }
} as const satisfies Record<string, CropSize>;

export type CropPresetKey = keyof typeof IMAGE_CROP_PRESETS;

export function resolveCropSize(cropPreset?: CropPresetKey, cropSize?: CropSize) {
  return cropSize || (cropPreset ? IMAGE_CROP_PRESETS[cropPreset] : undefined);
}

export function formatCropSize(size: CropSize) {
  return `${size.width} × ${size.height}`;
}
