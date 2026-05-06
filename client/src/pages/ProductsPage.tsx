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
    const query = new URLSearchParams({ page: String(page), pageSize: '6' });
    if (active) query.set('category', active);
    getProducts(`?${query.toString()}`).then((data) => { setProducts(data.items); setTotal(data.total); });
  }, [active, page]);

  function selectCategory(category: string) {
    setParams(category ? { category, page: '1' } : { page: '1' });
  }

  return (
    <main className="gray-page product-center-page product-list-page">
      <div className="breadcrumb container">当前位置：<Link to="/">首页</Link> › 产品分类</div>
      <div className="product-center-shell container">
        <CategorySide title="产品分类" categories={categories} active={active} hotline={profile?.hotline || profile?.phone} onSelect={selectCategory} />
        <section className="list-section product-panel">
          <div className="product-panel-title"><h1>产品列表</h1></div>
          <div className="list-grid">
            {products.map((product) => (
              <Link className="list-product" to={`/products/${product.slug}`} key={product.id}>
                <figure>{(product.listCoverImageUrl || product.coverImageUrl) ? <img src={product.listCoverImageUrl || product.coverImageUrl} alt={product.name} /> : <div className="product-fallback">K</div>}</figure>
                <span>{product.name}</span>
              </Link>
            ))}
            {products.length === 0 && <div className="empty-state">暂无产品，请在后台添加。</div>}
          </div>
          <Pager total={total} page={page} pageSize={6} active={active} />
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
      <div className="category-list">
        <button type="button" className={!active ? 'active' : ''} onClick={() => onSelect?.('')}>全部产品<span>›</span></button>
        {categories.map((category) => <button type="button" className={category.slug === active || category.name === active ? 'active' : ''} onClick={() => onSelect?.(category.slug)} key={category.id}>{category.name}<span>›</span></button>)}
      </div>
      <div className="hotline"><small>资讯热线</small><b>{hotline || '0519-68288220'}</b></div>
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

type ProductPageItem = { title?: string; description?: string; icon?: string; iconKey?: SupportIconName; linkUrl?: string };

type SupportIconName = 'thumb' | 'tag' | 'shield' | 'diamond' | 'user' | 'truck' | 'tools' | 'document' | 'link';

const advantageDefaults: ProductPageItem[] = [
  { title: '产品优势', description: '烟台恒基金属制品有限公司成立于2004年，位于山东省烟台市福山区魏山路55号，公司现有员工50多名包括大专以上学历10名，', iconKey: 'thumb' },
  { title: '价格优势', description: '烟台恒基金属制品有限公司成立于2004年，位于山东省烟台市福山区魏山路55号，公司现有员工50多名包括大专以上学历10名，', iconKey: 'tag' },
  { title: '品质保障', description: '烟台恒基金属制品有限公司成立于2004年，位于山东省烟台市福山区魏山路55号，公司现有员工50多名包括大专以上学历10名，', iconKey: 'shield' },
  { title: '技术优势', description: '选用最适合生产润滑油的进口基础油，采用二次加氢技术、国际上先进的三段异构脱蜡工序，选用添加了USA最新研制的液相单分子高科技添加剂精制而成', iconKey: 'diamond' }
];

const benefitDefaults: ProductPageItem[] = [
  { title: '专属经理对接', description: '烟台恒基金属制品有限公司成立于2004年，', iconKey: 'user', linkUrl: '/benefits/dedicated-manager' },
  { title: '按需邮寄样品', description: '烟台恒基金属制品有限公司成立于2004年，', iconKey: 'truck', linkUrl: '/benefits/sample-delivery' },
  { title: '免费设计培训', description: '烟台恒基金属制品有限公司成立于2004年，', iconKey: 'tools', linkUrl: '/benefits/design-training' },
  { title: '免费设计培训', description: '烟台恒基金属制品有限公司成立于2004年，', iconKey: 'tools', linkUrl: '/benefits/display-support' },
  { title: '共建实施方案', description: '烟台恒基金属制品有限公司成立于2004年，', iconKey: 'document', linkUrl: '/benefits/implementation-plan' },
  { title: '建立长效机制', description: '烟台恒基金属制品有限公司成立于2004年，', iconKey: 'link', linkUrl: '/benefits/long-term-service' }
];

function normalizeSupportItems(items: ProductPageItem[] | undefined, defaults: ProductPageItem[]) {
  return defaults.map((fallback, index) => ({
    ...fallback,
    ...(items?.[index]?.title ? { title: items[index].title } : {}),
    ...(items?.[index]?.description ? { description: items[index].description } : {})
  }));
}

function AdvantageSections({ advantages, benefits }: { advantages?: ContentSection; benefits?: ContentSection }) {
  const advantageItems = normalizeSupportItems(advantages?.data.items as ProductPageItem[] | undefined, advantageDefaults);
  const benefitItems = normalizeSupportItems(benefits?.data.items as ProductPageItem[] | undefined, benefitDefaults);

  return (
    <section className="section container product-center-support">
      <div className="section-title"><h2>{advantages?.title || '加盟优势'}</h2><p>{advantages?.subtitle || '桔尔润（北京）润滑油有限公司'}</p></div>
      <div className="advantage-row">{advantageItems.map((item, index) => <article key={`${item.title}-${index}`}><div className={index === 1 ? 'circle red' : 'circle'}><SupportIcon name={item.iconKey || 'diamond'} /></div><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
      <div className="section-title"><h2>{benefits?.title || '加盟福利'}</h2><p>{benefits?.subtitle || '桔尔润（北京）润滑油有限公司'}</p></div>
      <div className="benefit-grid">{benefitItems.map((item, index) => <Link className={index === 1 ? 'active' : ''} to={item.linkUrl || `/benefits/${index + 1}`} key={`${item.title}-${index}`}><b><SupportIcon name={item.iconKey || 'document'} /></b><h3>{item.title}</h3><p>{item.description}</p></Link>)}</div>
    </section>
  );
}

function SupportIcon({ name }: { name: SupportIconName }) {
  if (name === 'thumb') return <svg viewBox="0 0 64 64"><path d="M24 28h-9v25h9zM24 51h23c3 0 5-2 6-5l4-14c1-4-1-7-5-7H39l2-10c1-4-2-7-5-7h-2L24 27z" /></svg>;
  if (name === 'tag') return <svg viewBox="0 0 64 64"><path d="M13 30 35 8h16v16L29 46z" /><circle cx="43" cy="16" r="3" /></svg>;
  if (name === 'shield') return <svg viewBox="0 0 64 64"><path d="M32 7 51 17v15c0 12-8 21-19 25-11-4-19-13-19-25V17z" /><path d="M32 23v18M23 32h18" /></svg>;
  if (name === 'diamond') return <svg viewBox="0 0 64 64"><path d="M16 18h32l8 13-24 25L8 31z" /><path d="M22 30h20" /></svg>;
  if (name === 'user') return <svg viewBox="0 0 64 64"><circle cx="32" cy="19" r="9" /><path d="M13 53c2-12 9-20 19-20s17 8 19 20z" /><path d="M32 41v6" /></svg>;
  if (name === 'truck') return <svg viewBox="0 0 64 64"><path d="M10 20h29v24H10zM39 28h9l6 7v9H39z" /><path d="M16 49h1M47 49h1M17 34h13M17 41h8" /></svg>;
  if (name === 'tools') return <svg viewBox="0 0 64 64"><path d="M13 51 49 15M42 9l13 13M11 22l31 31M16 13l10 10M39 40l10 10" /></svg>;
  if (name === 'document') return <svg viewBox="0 0 64 64"><path d="M18 10h26l8 8v36H18z" /><path d="M43 10v10h9M26 34h14M26 43h8" /></svg>;
  return <svg viewBox="0 0 64 64"><path d="M25 20h-5c-8 0-14 6-14 14s6 14 14 14h10" /><path d="M39 44h5c8 0 14-6 14-14s-6-14-14-14H34" /><path d="M23 34h18" /></svg>;
}
