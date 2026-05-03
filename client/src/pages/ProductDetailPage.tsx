import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct, type Product } from '../api/publicApi';
import { CategorySide } from './ProductsPage';

export function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (slug) getProduct(slug).then(setProduct);
  }, [slug]);

  if (!product) return <main className="page-loading">正在加载商品详情...</main>;

  const images = product.galleryImageUrls.length ? product.galleryImageUrls : [product.coverImageUrl, product.coverImageUrl, product.coverImageUrl].filter(Boolean);

  return (
    <main className="gray-page detail-page">
      <div className="breadcrumb container">当前位置：首页 › 产品分类</div>
      <div className="content-card container two-column">
        <CategorySide title="产品分类" active={product.category} />
        <section className="detail-section">
          <h1>产品详情</h1>
          <div className="detail-top">
            <div className="detail-image">{product.coverImageUrl ? <img src={product.coverImageUrl} alt={product.name} /> : <div className="product-fallback">K</div>}</div>
            <div className="detail-summary"><h2>{product.name}</h2><div className="consult-box">资讯热线 <b>0519-68288220</b><button>立即咨询</button></div></div>
          </div>
          <h2 className="tab-title">产品详情</h2>
          <article className="rich-detail"><h3>{product.name}</h3><p>{product.description || product.summary || '请在后台维护商品详细介绍。'}</p>{product.coverImageUrl && <img src={product.coverImageUrl} alt={product.name} />}</article>
          <div className="params-row"><div>产品参数<br />product parameters</div><div>基本属性<br />Material&Crafts INDEX</div></div>
          <h2 className="center-title">产品细节</h2>
          <div className="detail-gallery">{images.map((image, index) => <figure key={`${image}-${index}`}><img src={image} alt={`${product.name}-${index}`} /><figcaption>细节</figcaption></figure>)}</div>
          <h2 className="center-title">稳定的生产表现</h2>
          <p className="center-copy">公司围绕润滑产品建立研发、生产和服务体系，为客户提供可靠产品和持续支持。</p>
          <div className="icon-row">{['特点文案', '特点文案', '特点文案', '特点文案'].map((item) => <span key={item}>●<small>{item}</small></span>)}</div>
        </section>
      </div>
    </main>
  );
}
