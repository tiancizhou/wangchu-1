import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHomeData, type Banner, type ContentSection, type HomeData, type ProductCategory } from '../api/publicApi';
import { normalizeHomeCertificateImages, type HomeCertificateImage } from '../utils/homeCertificateImages';

const fallbackCategories = ['汽油机油', '柴油机油', '工业油品', '导热油', '润滑油', '特种油品研发'];

type FeatureCard = { title?: string; description?: string; icon?: string; linkUrl?: string };
type SupportTab = { title?: string; imageUrl?: string; heading?: string; description?: string; thumbnails?: string[] };
type ProcessItem = { title?: string; description?: string; imageUrl?: string };
type ImagePreview = { url: string; title: string };

const videoPattern = /\.(mp4|webm|mov)$/i;

function isVideoMedia(url?: string) {
  return Boolean(url && videoPattern.test(url));
}

function FactoryMenuIcon({ index }: { index: number }) {
  const icons = [
    <path d="M4 18V8l5 3V6l5 3V4h4v14H4Zm4-2h2v-4H8v4Zm4 0h2v-4h-2v4Z" />,
    <path d="M6 4h12M6 20h12M8 4v16h8V4M10 14c0-2 2-4 2-4s2 2 2 4a2 2 0 1 1-4 0Z" />,
    <path d="M8 17a6 6 0 0 1 0-10M16 7a6 6 0 0 1 0 10M5 20a10 10 0 0 1 0-16M19 4a10 10 0 0 1 0 16M12 9a3 3 0 1 0 0 6a3 3 0 0 0 0-6Z" />,
    <path d="M3 11l9-7l9 7M5 10v10h14V10M9 20v-6h6v6M16 16h1M16 18h1M7 16h1M7 18h1" />
  ];

  return <svg className="factory-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[index] || icons[0]}</svg>;
}

export function HomePage() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [activeSupportIndex, setActiveSupportIndex] = useState(1);
  const [previewImage, setPreviewImage] = useState<ImagePreview | null>(null);

  useEffect(() => {
    getHomeData().then(setHomeData).catch(() => {});
  }, []);

  const banners = homeData?.banners || [];
  const bannerImages = banners.filter((banner) => banner.imageUrl);
  const banner = bannerImages[activeBannerIndex % Math.max(bannerImages.length, 1)];

  useEffect(() => {
    setActiveBannerIndex(0);
  }, [bannerImages.length]);

  useEffect(() => {
    if (bannerImages.length <= 1) return;
    const timer = window.setInterval(() => setActiveBannerIndex((index) => (index + 1) % bannerImages.length), 5000);
    return () => window.clearInterval(timer);
  }, [bannerImages.length]);

  return (
    <main>
      <HeroCarousel banners={bannerImages} banner={banner} activeBannerIndex={activeBannerIndex} onSelect={setActiveBannerIndex} />
      <FeatureCards section={homeData?.sections.featureCards} />
      <SupportModule section={homeData?.sections.supportModule} activeIndex={activeSupportIndex} onSelect={setActiveSupportIndex} onPreview={setPreviewImage} />
      <ProductCategoryGrid categories={homeData?.categories || []} />
      <ProcessModule section={homeData?.sections.processModule} onPreview={setPreviewImage} />
      <AboutPreview section={homeData?.sections.aboutPreview} companyName={homeData?.siteProfile?.companyName} />
      <CertificatePreview images={normalizeHomeCertificateImages(homeData?.sections.certificatePreview?.data?.images)} />
      {previewImage && <ImagePreviewOverlay image={previewImage} onClose={() => setPreviewImage(null)} />}
    </main>
  );
}

export function HeroCarousel({ banners, banner, activeBannerIndex, onSelect }: { banners: Banner[]; banner?: Banner; activeBannerIndex: number; onSelect: (index: number) => void }) {
  const heroStyle = {
    aspectRatio: '1920 / 750',
    ...(banner?.imageUrl && !isVideoMedia(banner.imageUrl) ? { backgroundImage: `url(${banner.imageUrl})` } : {})
  };

  return (
    <section className={isVideoMedia(banner?.imageUrl) ? 'hero hero-video' : 'hero'} style={heroStyle}>
      {banner?.imageUrl && isVideoMedia(banner.imageUrl) && <video className="hero-video-media" src={banner.imageUrl} autoPlay muted loop playsInline />}
      {!banner?.imageUrl && (
        <div className="hero-copy">
          <p>Shell HELIX · Kronprins</p>
          <h1>极摩动力 超凡表现</h1>
          <span>专注润滑油产品研发与技术支持</span>
        </div>
      )}
      {banners.length > 1 && <div className="hero-dots">{banners.map((item, index) => <button className={index === activeBannerIndex ? 'hero-dot active' : 'hero-dot'} key={item.id} aria-label={`切换到第 ${index + 1} 张轮播图`} onClick={() => onSelect(index)} />)}</div>}
    </section>
  );
}

export function FeatureCards({ section }: { section?: ContentSection }) {
  const items = (section?.data.items as FeatureCard[] | undefined) || [
    { title: '品牌定制', description: '提供成熟的品牌定制与产品包装方案。', icon: '✥', linkUrl: '/consult' },
    { title: '附加服务', description: '从设计、打样到生产交付，提供一站式服务支持。', icon: '✥', linkUrl: '/consult' },
    { title: '天然保障', description: '严格检测流程和生产管理体系。', icon: '✥', linkUrl: '/certificates' },
    { title: '工厂直供', description: '依托成熟供应链与生产体系。', icon: '✥', linkUrl: '/products' }
  ];

  return (
    <section className="feature-row container">
      {items.map((item) => (
        <article className="feature-card" key={item.title}>
          <div className="red-icon">{item.icon || '✥'}</div>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <Link to={item.linkUrl || '/consult'}>了解更多</Link>
        </article>
      ))}
    </section>
  );
}

export function SupportModule({ section, activeIndex, onSelect, onPreview }: { section?: ContentSection; activeIndex: number; onSelect: (index: number) => void; onPreview: (image: ImagePreview) => void }) {
  const tabs = (section?.data.tabs as SupportTab[] | undefined) || [
    { title: '调和', heading: '生产调和', description: '标准化调和流程，为客户提供稳定可靠的产品生产支持。', thumbnails: [] },
    { title: '检测', heading: '锅炉百科', description: '围绕润滑油研发、生产检测与品质管理，建立标准化实验流程和技术服务体系。', thumbnails: [] },
    { title: '检验', heading: '品质检验', description: '通过规范化检测标准，对产品性能、稳定性和适用性进行持续检验。', thumbnails: [] }
  ];
  const active = tabs[activeIndex] || tabs[0];
  const [galleryPage, setGalleryPage] = useState(0);
  const thumbnails = active?.thumbnails?.length ? active.thumbnails : [];
  const fallbackThumbClasses = ['thumb-one', 'thumb-two', 'thumb-three', 'thumb-four', 'thumb-five'];
  const visibleThumbs = thumbnails.length > 0 ? thumbnails.slice(galleryPage, galleryPage + 5) : fallbackThumbClasses;

  useEffect(() => {
    setGalleryPage(0);
  }, [activeIndex]);

  function previousGallery() {
    if (thumbnails.length === 0) return;
    setGalleryPage((page) => Math.max(0, page - 1));
  }

  function nextGallery() {
    if (thumbnails.length === 0) return;
    setGalleryPage((page) => Math.min(Math.max(thumbnails.length - 5, 0), page + 1));
  }

  return (
    <section className="section support-section" id="support">
      <div className="container">
        <SectionTitle title={section?.title || '生产设计与制作'} subtitle={section?.subtitle} />
        <div className="support-showcase">
          <aside className="support-menu">
            <div className="support-menu-title"><span>contents</span><strong>{section?.title || '生产设计与制作'}</strong></div>
            {tabs.map((tab, index) => <button className={index === activeIndex ? 'active' : ''} onClick={() => onSelect(index)} key={tab.title}>{index === 0 ? '⚙' : index === 1 ? '🧪' : '▲'} {tab.title}</button>)}
          </aside>
          <div className="support-main-photo">
            {active?.imageUrl && <button className="home-preview-image-button square" type="button" onClick={() => onPreview({ url: active.imageUrl!, title: active.heading || active.title || '生产设计与制作' })}><img src={active.imageUrl} alt={active.heading || active.title || '生产设计与制作'} /></button>}
          </div>
          <article className="support-copy"><h3>{active?.heading}</h3><p>{active?.description}</p><Link to="/consult">立即查看</Link></article>
        </div>
        <div className="support-gallery"><button className="support-gallery-arrow" aria-label="上一组" onClick={previousGallery}>‹</button>{visibleThumbs.map((image, index) => thumbnails.length > 0 ? <button className="support-thumb home-preview-image-button square" type="button" onClick={() => onPreview({ url: image, title: active?.heading || active?.title || '生产设计与制作' })} key={`${image}-${galleryPage}-${index}`}><img src={image} alt={active?.heading || active?.title || '生产设计与制作'} /></button> : <div className={`support-thumb ${image}`} key={`${image}-${galleryPage}-${index}`} />)}<button className="support-gallery-arrow" aria-label="下一组" onClick={nextGallery}>›</button></div>
      </div>
    </section>
  );
}

export function ProductCategoryGrid({ categories }: { categories: ProductCategory[] }) {
  const items = categories.length > 0 ? categories : fallbackCategories.map((name, index) => ({ id: name, name, slug: encodeURIComponent(name), description: '菜单文案菜单文案', coverImageUrl: '', iconImageUrl: '', sortOrder: index, isPublished: true, seoTitle: '', seoDescription: '' } as ProductCategory));
  return (
    <section className="section container product-category-section">
      <SectionTitle title="产品细项目分类" />
      <div className="product-category-grid">
        {items.map((category) => <ProductCategoryCard category={category} key={category.id} />)}
      </div>
    </section>
  );
}

export function ProcessModule({ section, onPreview }: { section?: ContentSection; onPreview: (image: ImagePreview) => void }) {
  const data = section?.data as { items?: ProcessItem[]; backgroundImageUrl?: string } | undefined;
  const items = data?.items || [
    { title: '菜单文案', description: '稼尔润（北京）润滑油有限公司专注润滑油研发、生产与技术服务，围绕调和、灌装、检测和仓储建立标准化流程，为客户提供稳定可靠的产品交付能力。' },
    { title: '灌装', description: '自动化灌装流程提升生产效率，保障产品包装规格统一、出厂品质稳定。' },
    { title: '设备', description: '成熟设备体系满足多类润滑油产品生产、调和与检测需求。' },
    { title: '仓储', description: '规范仓储管理保障产品存放安全和订单交付效率。' }
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex] || items[0];

  useEffect(() => {
    setActiveIndex(0);
  }, [items.length]);

  return (
    <section className="factory-section" style={data?.backgroundImageUrl ? { backgroundImage: `linear-gradient(rgba(15,43,78,.78),rgba(15,43,78,.84)),url(${data.backgroundImageUrl})` } : undefined}>
      <SectionTitle title={section?.title || '先进的制作工艺'} subtitle={section?.subtitle} light />
      <div className="factory-card">
        <div className="factory-showcase">
          <aside>{items.map((item, index) => <button className={index === activeIndex ? 'active' : ''} type="button" onClick={() => setActiveIndex(index)} key={item.title}><FactoryMenuIcon index={index} /><span>{item.title}</span></button>)}</aside>
          <div className="factory-photo">
            {active?.imageUrl && <button className="home-preview-image-button ratio-3-2" type="button" onClick={() => onPreview({ url: active.imageUrl!, title: active.title || '先进的制作工艺' })}><img src={active.imageUrl} alt={active.title || '先进的制作工艺'} /></button>}
          </div>
        </div>
        <article className="factory-copy"><h3>{active?.title}</h3><p>{active?.description}</p><span>”</span></article>
        <div className="factory-gallery-title"><span>{active?.title}</span></div>
        <div className="factory-thumb-grid">
          {items.slice(0, 4).map((item, index) => <button className={index === activeIndex ? 'active' : ''} type="button" onClick={() => item.imageUrl ? onPreview({ url: item.imageUrl, title: item.title || '先进的制作工艺' }) : setActiveIndex(index)} key={`${item.title}-thumb`}>{item.imageUrl ? <img src={item.imageUrl} alt={item.title} /> : <div className={`factory-thumb-fallback factory-thumb-${index + 1}`} />}<span>{item.title}</span></button>)}
        </div>
      </div>
    </section>
  );
}

export function AboutPreview({ section, companyName }: { section?: ContentSection; companyName?: string }) {
  const data = section?.data as { imageUrl?: string; body?: string } | undefined;
  const title = companyName || '稼尔润（北京）润滑油有限公司';
  return (
    <section className="section container" id="about">
      <SectionTitle title={section?.title || '关于我们'} subtitle={section?.subtitle} />
      <div className="about-block">
        {data?.imageUrl ? <img className="about-image" src={data.imageUrl} alt={section?.title || '关于我们'} /> : <div className="about-photo">Kronprins<br />王储</div>}
        <div className="about-copy">
          <h3>{title}</h3>
          <p>{data?.body || '稼尔润（北京）润滑油有限公司专注润滑油产品研发、生产与渠道服务。公司围绕汽车润滑、工业润滑和特种油品场景，为客户提供稳定可靠的产品和合作支持。'}</p>
        </div>
      </div>
    </section>
  );
}

export function CertificatePreview({ images }: { images: HomeCertificateImage[] }) {
  const allItems = images.filter((image) => image.isPublished);
  const [startIndex, setStartIndex] = useState(0);
  const visibleItems = Array.from({ length: Math.min(4, allItems.length) }, (_, index) => allItems[(startIndex + index) % allItems.length]);

  useEffect(() => {
    setStartIndex(0);
  }, [images.length]);

  function previousCertificates() {
    if (allItems.length === 0) return;
    setStartIndex((index) => (index - 1 + allItems.length) % allItems.length);
  }

  function nextCertificates() {
    if (allItems.length === 0) return;
    setStartIndex((index) => (index + 1) % allItems.length);
  }

  if (allItems.length === 0) return null;

  return (
    <section className="section certificate-showcase-section">
      <SectionTitle title="荣誉资质" />
      <div className="certificate-stage">
        <button className="certificate-arrow" type="button" aria-label="切换上一组荣誉资质" onClick={previousCertificates}>‹</button>
        <div className="certificate-display">
          {visibleItems.map((certificate, index) => (
            <Link to="/certificates" className={`certificate-display-card certificate-display-card-${index + 1}`} key={`${certificate.id}-${startIndex}-${index}`}>
              <img src={certificate.imageUrl} alt={certificate.title} />
            </Link>
          ))}
          <div className="certificate-shelf" />
        </div>
        <button className="certificate-arrow" type="button" aria-label="切换下一组荣誉资质" onClick={nextCertificates}>›</button>
      </div>
    </section>
  );
}

function SectionTitle({ title, subtitle, light }: { title: string; subtitle?: string; light?: boolean }) {
  return <div className={light ? 'section-title light' : 'section-title'}><h2>{title}</h2><p>{subtitle || '稼尔润（北京）润滑油有限公司'}</p></div>;
}

function ProductCategoryCard({ category }: { category: ProductCategory }) {
  const categoryLink = `/products?${new URLSearchParams({ category: category.slug }).toString()}`;
  return (
    <article className="product-category-card">
      <Link className="product-category-image square" to={categoryLink}>
        {category.coverImageUrl ? <img src={category.coverImageUrl} alt={category.name} /> : <div className="product-fallback">K</div>}
      </Link>
      <Link to={categoryLink}><h3>{category.name}</h3></Link>
      <p>{category.description || '菜单文案菜单文案'}</p>
    </article>
  );
}

function ImagePreviewOverlay({ image, onClose }: { image: ImagePreview; onClose: () => void }) {
  return (
    <button className="cert-preview-overlay" type="button" onClick={onClose} aria-label="关闭原图预览">
      <span className="cert-preview-dialog">
        <img src={image.url} alt={image.title} />
        <strong>{image.title}</strong>
        <em>点击任意位置关闭</em>
      </span>
    </button>
  );
}
