import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCategories, getProduct, getSiteProfile, type Product, type ProductCategory, type ProductPerformanceItem, type SiteProfile } from '../api/publicApi';
import { CategorySide } from './ProductsPage';

const defaultPerformanceTitle = '稳定的生产表现';
const defaultPerformanceText = '公司围绕润滑产品建立研发、生产和服务体系，为客户提供可靠产品和持续支持。';
const defaultPerformanceItems: ProductPerformanceItem[] = [
  { icon: '●', title: '稳定润滑', description: '' },
  { icon: '◆', title: '品质检测', description: '' },
  { icon: '✓', title: '应用支持', description: '' },
  { icon: '■', title: '快速交付', description: '' }
];

export function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [profile, setProfile] = useState<SiteProfile | null>(null);

  useEffect(() => {
    if (slug) getProduct(slug).then(setProduct);
    getCategories().then(setCategories).catch(() => {});
    getSiteProfile().then(setProfile).catch(() => {});
  }, [slug]);

  if (!product) return <main className="page-loading">正在加载商品详情...</main>;

  const gallery = (product.detailGallery || []).slice(0, 6);
  const performanceItems = (product.performanceItems?.length ? product.performanceItems : defaultPerformanceItems).slice(0, 4);
  const activeCategory = product.categoryRef?.slug || categories.find((category) => category.name === product.categoryName)?.slug || product.categoryName;
  const hotline = profile?.hotline || profile?.phone || '0519-68288220';
  const detailImage = product.detailImageUrl || product.coverImageUrl;

  function selectCategory(category: string) {
    navigate(category ? `/products?category=${encodeURIComponent(category)}&page=1` : '/products?page=1');
  }

  return (
    <main className="gray-page product-center-page product-detail-public-page detail-page">
      <div className="breadcrumb container">当前位置：<Link to="/">首页</Link> › <Link to="/products">产品分类</Link> › {product.name}</div>
      <div className="product-center-shell container">
        <CategorySide title="产品分类" categories={categories} active={activeCategory} hotline={hotline} onSelect={selectCategory} />
        <section className="detail-section product-panel">
          <div className="product-panel-title"><h1>产品详情</h1></div>
          <div className="detail-top">
            <div className="detail-image">{product.coverImageUrl ? <img src={product.coverImageUrl} alt={product.name} /> : <div className="product-fallback">K</div>}</div>
            <div className="detail-summary">
              <h2>{product.name}</h2>
              {product.topSubtitle && <p>{product.topSubtitle}</p>}
              <div className="consult-box"><span>资讯热线</span><b>{hotline}</b><Link to={`/consult?product=${product.slug}`}>立即咨询</Link></div>
            </div>
          </div>

          <h2 className="tab-title">产品详情</h2>
          <article className="rich-detail">
            <h3>{product.detailTitle || product.name}</h3>
            <p>{product.detailDescription || '请在后台维护商品详细介绍。'}</p>
            {detailImage && <img src={detailImage} alt={product.detailTitle || product.name} />}
          </article>

          {product.productSpecsImageUrl && (
            <div className="product-spec-image-layout single">
              <img src={product.productSpecsImageUrl} alt="产品参数与基本属性" />
            </div>
          )}

          {gallery.length > 0 && <><h2 className="center-title">产品细节</h2><div className="detail-gallery">{gallery.map((item, index) => <figure key={`${item.imageUrl}-${index}`}>{item.imageUrl ? <img src={item.imageUrl} alt={item.caption || `${product.name}-${index}`} /> : <div className="product-fallback">K</div>}<figcaption>{item.caption || '细节'}</figcaption></figure>)}</div></>}

          <h2 className="center-title">{product.performanceTitle || defaultPerformanceTitle}</h2>
          <p className="center-copy">{product.performanceText || defaultPerformanceText}</p>
          <div className="icon-row">{performanceItems.map((item) => <span key={item.title}>{item.icon || '●'}<small>{item.title}</small>{item.description && <em>{item.description}</em>}</span>)}</div>
        </section>
      </div>
    </main>
  );
}
