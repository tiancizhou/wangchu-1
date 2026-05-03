import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBanners, getProducts, type Banner, type Product } from '../api/publicApi';

const categories = ['汽油机油', '柴油机油', '工业油品', '导热油', '润滑油', '特种油品研发'];

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    getProducts('?pageSize=6').then((data) => setProducts(data.items));
    getBanners().then(setBanners);
  }, []);

  const banner = banners[0];

  return (
    <main>
      <section className="hero" style={banner?.imageUrl ? { backgroundImage: `url(${banner.imageUrl})` } : undefined}>
        <div className="hero-copy">
          <p>Shell HELIX · Kronprins</p>
          <h1>{banner?.title || '极摩动力 超凡表现'}</h1>
          <span>{banner?.subtitle || '专注润滑油产品研发与技术支持'}</span>
        </div>
      </section>

      <section className="feature-row container">
        {['品牌定制', '附加服务', '天然保障', '工厂直供'].map((item) => (
          <article className="feature-card" key={item}>
            <div className="red-icon">✦</div>
            <h3>{item}</h3>
            <p>提供成熟的产品服务体系，满足不同渠道客户的展示、销售与售后需求。</p>
            <button>了解更多</button>
          </article>
        ))}
      </section>

      <section className="section container" id="support">
        <SectionTitle title="生产设计与制作" />
        <div className="support-panel">
          <aside>{categories.slice(0, 4).map((item, index) => <div className={index === 1 ? 'active' : ''} key={item}>{item}</div>)}</aside>
          <div className="support-image" />
          <article><h3>研发团队</h3><p>依托成熟生产线和技术团队，为客户提供产品设计、生产、包装与渠道支持。</p><button>查看更多</button></article>
        </div>
      </section>

      <section className="section container">
        <SectionTitle title="产品细项分类" />
        <div className="product-grid">
          {products.map((product) => <ProductCard product={product} key={product.id} />)}
          {products.length === 0 && categories.map((item) => <PlaceholderProduct name={item} key={item} />)}
        </div>
      </section>

      <section className="factory-section">
        <SectionTitle title="先进的制作工艺" light />
        <div className="factory-card">
          <aside>{['巡检工艺', '资料', '设备', '仓储'].map((item, index) => <span className={index === 0 ? 'active' : ''} key={item}>{item}</span>)}</aside>
          <div className="factory-photo" />
          <p>标准化生产流程与检测体系保障稳定品质，满足客户对产品性能与供应周期的要求。</p>
        </div>
      </section>

      <section className="section container" id="about">
        <SectionTitle title="关于我们" />
        <div className="about-block">
          <div className="about-photo">Kronprins<br />王储</div>
          <p>稼尔润（北京）润滑油有限公司专注润滑油产品研发、生产与渠道服务。公司围绕汽车润滑、工业润滑和特种油品场景，为客户提供稳定可靠的产品和合作支持。</p>
        </div>
      </section>

      <section className="section container">
        <SectionTitle title="荣誉资质" />
        <div className="cert-row"><Link to="/certificates">查看荣誉资质</Link><span>营业执照</span><span>信用证书</span><span>认证证书</span></div>
      </section>
    </main>
  );
}

function SectionTitle({ title, light }: { title: string; light?: boolean }) {
  return <div className={light ? 'section-title light' : 'section-title'}><h2>{title}</h2><p>稼尔润（北京）润滑油有限公司</p></div>;
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/products/${product.slug}`} className="product-card">
      {product.coverImageUrl ? <img src={product.coverImageUrl} alt={product.name} /> : <div className="product-fallback">K</div>}
      <h3>{product.name}</h3>
      <p>{product.summary || product.category}</p>
    </Link>
  );
}

function PlaceholderProduct({ name }: { name: string }) {
  return <div className="product-card"><div className="product-fallback">K</div><h3>{name}</h3><p>点击后台上传真实商品图片与详情</p></div>;
}
