import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCategories, getContentSections, getProducts, getSiteProfile, type ContentSection, type Product, type ProductCategory, type SiteProfile } from '../api/publicApi';

export function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const active = params.get('category') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [profile, setProfile] = useState<SiteProfile | null>(null);
  const [sections, setSections] = useState<Record<string, ContentSection>>({});
  const [total, setTotal] = useState(0);
  const page = Math.max(Number(params.get('page') || 1), 1);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
    getSiteProfile().then(setProfile).catch(() => {});
    getContentSections('products').then(setSections).catch(() => {});
  }, []);

  useEffect(() => {
    const query = new URLSearchParams({ page: String(page), pageSize: '12' });
    if (active) query.set('category', active);
    getProducts(`?${query.toString()}`).then((data) => { setProducts(data.items); setTotal(data.total); });
  }, [active, page]);

  function selectCategory(category: string) {
    setParams(category ? { category, page: '1' } : { page: '1' });
  }

  return (
    <main className="gray-page">
      <div className="breadcrumb container">当前位置：首页 › 产品分类</div>
      <div className="content-card container two-column">
        <CategorySide title="产品分类" categories={categories} active={active} hotline={profile?.hotline || profile?.phone} onSelect={selectCategory} />
        <section className="list-section">
          <h1>产品列表</h1>
          <div className="list-grid">
            {products.map((product) => <Link className="list-product" to={`/products/${product.slug}`} key={product.id}>{product.coverImageUrl ? <img src={product.coverImageUrl} alt={product.name} /> : <div className="product-fallback">K</div>}<span>{product.name}</span></Link>)}
            {products.length === 0 && <div className="empty-state">暂无产品，请在后台添加。</div>}
          </div>
          <Pager total={total} page={page} pageSize={12} active={active} />
        </section>
      </div>
      <AdvantageSections advantages={sections.advantages} benefits={sections.benefits} />
    </main>
  );
}

export function CategorySide({ title, categories, active, hotline, onSelect }: { title: string; categories: ProductCategory[]; active: string; hotline?: string; onSelect?: (category: string) => void }) {
  return (
    <aside className="category-side">
      <h2>{title}</h2>
      <button className={!active ? 'active' : ''} onClick={() => onSelect?.('')}>全部产品<span>›</span></button>
      {categories.map((category) => <button className={category.slug === active || category.name === active ? 'active' : ''} onClick={() => onSelect?.(category.slug)} key={category.id}>{category.name}<span>›</span></button>)}
      <div className="hotline">资讯热线<b>{hotline || '0519-68288220'}</b></div>
    </aside>
  );
}

function Pager({ total, page, pageSize, active }: { total: number; page: number; pageSize: number; active: string }) {
  const pages = Math.max(Math.ceil(total / pageSize), 1);
  if (pages <= 1) return null;

  const start = Math.max(1, Math.min(page - 2, pages - 4));
  const pageNumbers = Array.from({ length: Math.min(5, pages) }, (_, index) => start + index);
  const href = (pageNumber: number) => `/products?${new URLSearchParams({ ...(active ? { category: active } : {}), page: String(pageNumber) }).toString()}`;

  return (
    <nav className="pager product-pager" aria-label="产品列表分页">
      <Link className={page === 1 ? 'disabled' : ''} to={href(Math.max(page - 1, 1))}>上一页</Link>
      {pageNumbers.map((pageNumber) => <Link className={page === pageNumber ? 'active' : ''} to={href(pageNumber)} key={pageNumber}>{pageNumber}</Link>)}
      <Link className={page === pages ? 'disabled' : ''} to={href(Math.min(page + 1, pages))}>下一页</Link>
    </nav>
  );
}

type ProductPageItem = { title?: string; description?: string; icon?: string };

function AdvantageSections({ advantages, benefits }: { advantages?: ContentSection; benefits?: ContentSection }) {
  const advantageItems = (advantages?.data.items as ProductPageItem[] | undefined) || ['产品优势', '价格优势', '品质保障', '技术优势'].map((title) => ({ title, description: '成熟的产品体系和服务流程，为渠道伙伴提供长期稳定的合作支持。', icon: '♢' }));
  const benefitItems = (benefits?.data.items as ProductPageItem[] | undefined) || ['专属经理对接', '按需邮寄样品', '免费设计培训', '共建实施方案', '建立长效机制', '售后支持'].map((title) => ({ title, description: '根据客户需求配置产品、资料和渠道支持。', icon: '▧' }));

  return (
    <section className="section container">
      <div className="section-title"><h2>{advantages?.title || '加盟优势'}</h2><p>{advantages?.subtitle || '稼尔润（北京）润滑油有限公司'}</p></div>
      <div className="advantage-row">{advantageItems.map((item, index) => <article key={`${item.title}-${index}`}><div className={index === 1 ? 'circle red' : 'circle'}>{item.icon || '♢'}</div><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
      <div className="section-title"><h2>{benefits?.title || '加盟福利'}</h2><p>{benefits?.subtitle || '稼尔润（北京）润滑油有限公司'}</p></div>
      <div className="benefit-grid">{benefitItems.map((item, index) => <article className={index === 1 ? 'active' : ''} key={`${item.title}-${index}`}><b>{item.icon || '▧'}</b><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
    </section>
  );
}
