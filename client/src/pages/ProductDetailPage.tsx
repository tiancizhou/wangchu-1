import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCategories, getProduct, getSiteProfile, type Product, type ProductCategory, type SiteProfile } from '../api/publicApi';
import { CategorySide } from './ProductsPage';

type Spec = { name?: string; value?: string };
type Feature = { title?: string; description?: string; icon?: string };
type DetailBlock = { title?: string; body?: string; imageUrl?: string };

export function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [profile, setProfile] = useState<SiteProfile | null>(null);

  useEffect(() => {
    if (slug) getProduct(slug).then(setProduct);
    getCategories().then(setCategories).catch(() => {});
    getSiteProfile().then(setProfile).catch(() => {});
  }, [slug]);

  if (!product) return <main className="page-loading">正在加载商品详情...</main>;

  const images = product.galleryImageUrls.length ? product.galleryImageUrls : [product.coverImageUrl].filter(Boolean);
  const specs = (product.specifications || []) as Spec[];
  const detailBlocks = (product.detailSections || []) as DetailBlock[];
  const features = (product.featureCards || []) as Feature[];
  const activeCategory = product.categoryRef?.slug || product.category;

  return (
    <main className="gray-page detail-page">
      <div className="breadcrumb container">当前位置：首页 › 产品分类 › {product.name}</div>
      <div className="content-card container two-column">
        <CategorySide title="产品分类" categories={categories} active={activeCategory} hotline={profile?.hotline || profile?.phone} />
        <section className="detail-section">
          <h1>产品详情</h1>
          <div className="detail-top">
            <div className="detail-image">{product.coverImageUrl ? <img src={product.coverImageUrl} alt={product.name} /> : <div className="product-fallback">K</div>}</div>
            <div className="detail-summary"><h2>{product.name}</h2><p>{product.subtitle || product.summary}</p><div className="consult-box">资讯热线 <b>{profile?.hotline || profile?.phone || '0519-68288220'}</b><Link to={`/consult?product=${product.slug}`}>立即咨询</Link></div></div>
          </div>
          <h2 className="tab-title">产品详情</h2>
          <article className="rich-detail"><h3>{product.name}</h3><p>{product.description || product.summary || '请在后台维护商品详细介绍。'}</p>{product.coverImageUrl && <img src={product.coverImageUrl} alt={product.name} />}</article>
          {detailBlocks.length > 0 && <div className="product-detail-blocks">{detailBlocks.map((block, index) => <article key={`${block.title}-${index}`}><div><h3>{block.title}</h3><p>{block.body}</p></div>{block.imageUrl && <img src={block.imageUrl} alt={block.title || product.name} />}</article>)}</div>}
          {specs.length > 0 && <div className="params-row"><div><b>产品参数</b>{specs.map((spec) => <p key={spec.name}>{spec.name}：{spec.value}</p>)}</div><div><b>基本属性</b><p>Material&Crafts INDEX</p></div></div>}
          {images.length > 0 && <><h2 className="center-title">产品细节</h2><div className="detail-gallery">{images.map((image, index) => <figure key={`${image}-${index}`}><img src={image} alt={`${product.name}-${index}`} /><figcaption>细节</figcaption></figure>)}</div></>}
          <h2 className="center-title">稳定的生产表现</h2>
          <p className="center-copy">公司围绕润滑产品建立研发、生产和服务体系，为客户提供可靠产品和持续支持。</p>
          <div className="icon-row">{(features.length ? features : [{ title: '稳定润滑' }, { title: '品质检测' }, { title: '应用支持' }, { title: '快速交付' }]).map((item) => <span key={item.title}>{item.icon || '●'}<small>{item.title}</small></span>)}</div>
        </section>
      </div>
    </main>
  );
}
