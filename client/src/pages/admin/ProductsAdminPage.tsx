import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminProducts, deleteProduct } from '../../api/adminApi';
import type { Product } from '../../api/publicApi';

export function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      setProducts(await adminProducts());
    } catch (err) {
      setError(err instanceof Error ? err.message : '商品加载失败');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onDelete(id: string) {
    if (!confirm('确定删除这个商品吗？')) return;
    setError('');
    try {
      await deleteProduct(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : '商品删除失败');
    }
  }

  const publishedCount = products.filter((product) => product.isPublished).length;

  return (
    <section className="admin-panel products-admin-page">
      <div className="admin-title-block product-admin-title">
        <span className="page-editor-label">产品中心</span>
        <div className="product-admin-title-row">
          <div>
            <h1>产品管理</h1>
            <p>维护产品中心展示的商品信息、图片、分类和发布状态。新增或编辑后，前台产品中心会同步更新。</p>
          </div>
          <Link className="product-primary-action" to="/admin/products/new">新增商品</Link>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="product-admin-stats">
        <article><span>全部商品</span><strong>{products.length}</strong></article>
        <article><span>已发布</span><strong>{publishedCount}</strong></article>
        <article><span>未发布</span><strong>{products.length - publishedCount}</strong></article>
      </div>

      <div className="product-table-card">
        <div className="product-table-head"><h2>商品列表</h2><p>点击编辑可维护商品详情，删除前请确认该商品不再需要展示。</p></div>
        {loading && <p className="page-loading">商品加载中...</p>}
        {!loading && products.length === 0 && <p className="empty-state">还没有商品，请先新增商品。</p>}
        {!loading && products.length > 0 && (
          <table className="admin-table product-admin-table">
            <thead><tr><th>商品</th><th>分类</th><th>排序</th><th>状态</th><th>操作</th></tr></thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="product-cell">
                      {product.coverImageUrl ? <img src={product.coverImageUrl} alt={product.name} /> : <span className="product-image-empty">无图</span>}
                      <div><strong>{product.name}</strong><small>{product.subtitle || product.summary || '暂无简介'}</small></div>
                    </div>
                  </td>
                  <td>{product.categoryRef?.name || product.category || '未分类'}</td>
                  <td>{product.sortOrder}</td>
                  <td><span className={product.isPublished ? 'status-pill active' : 'status-pill'}>{product.isPublished ? '已发布' : '未发布'}</span></td>
                  <td><div className="table-actions"><Link to={`/admin/products/${product.id}/edit`}>编辑</Link><button type="button" onClick={() => onDelete(product.id)}>删除</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
