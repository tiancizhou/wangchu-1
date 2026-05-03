import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts, type Product } from '../api/publicApi';

const categories = ['汽油机油', '柴油机油', '工业油品', '导热油', '润滑油', '特种油品研发'];

export function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const active = params.get('category') || '柴油机油';
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts(`?category=${encodeURIComponent(active)}&pageSize=12`).then((data) => setProducts(data.items));
  }, [active]);

  return (
    <main className="gray-page">
      <div className="breadcrumb container">当前位置：首页 › 产品分类</div>
      <div className="content-card container two-column">
        <CategorySide title="产品分类" active={active} onSelect={(category) => setParams({ category })} />
        <section className="list-section">
          <h1>产品列表</h1>
          <div className="list-grid">
            {products.map((product) => <Link className="list-product" to={`/products/${product.slug}`} key={product.id}>{product.coverImageUrl ? <img src={product.coverImageUrl} alt={product.name} /> : <div className="product-fallback">K</div>}<span>{product.name}</span></Link>)}
            {products.length === 0 && Array.from({ length: 6 }).map((_, index) => <div className="list-product" key={index}><div className="product-fallback">K</div><span>{active}产品</span></div>)}
          </div>
          <div className="pager">‹　1　2　3　4　...　20　›</div>
        </section>
      </div>
      <AdvantageSections />
    </main>
  );
}

export function CategorySide({ title, active, onSelect }: { title: string; active: string; onSelect?: (category: string) => void }) {
  return <aside className="category-side"><h2>{title}</h2>{categories.map((category) => <button className={category === active ? 'active' : ''} onClick={() => onSelect?.(category)} key={category}>{category}<span>›</span></button>)}<div className="hotline">资讯热线<b>0519-68288220</b></div></aside>;
}

function AdvantageSections() {
  return (
    <section className="section container">
      <div className="section-title"><h2>加盟优势</h2><p>稼尔润（北京）润滑油有限公司</p></div>
      <div className="advantage-row">{['产品优势', '价格优势', '品质保障', '技术优势'].map((item, index) => <article key={item}><div className={index === 1 ? 'circle red' : 'circle'}>{index === 1 ? '◇' : '♢'}</div><h3>{item}</h3><p>成熟的产品体系和服务流程，为渠道伙伴提供长期稳定的合作支持。</p></article>)}</div>
      <div className="section-title"><h2>加盟福利</h2><p>稼尔润（北京）润滑油有限公司</p></div>
      <div className="benefit-grid">{['专属经理对接', '按需邮寄样品', '免费设计培训', '共建实施方案', '建立长效机制', '售后支持'].map((item, index) => <article className={index === 1 ? 'active' : ''} key={item}><b>▧</b><h3>{item}</h3><p>根据客户需求配置产品、资料和渠道支持。</p></article>)}</div>
    </section>
  );
}
