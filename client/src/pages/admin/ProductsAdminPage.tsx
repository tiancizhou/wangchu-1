import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminProducts, deleteProduct } from '../../api/adminApi';
import type { Product } from '../../api/publicApi';

export function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);

  async function load() {
    setProducts(await adminProducts());
  }

  useEffect(() => { load(); }, []);

  async function onDelete(id: string) {
    if (!confirm('确定删除这个商品吗？')) return;
    await deleteProduct(id);
    await load();
  }

  return <section className="admin-panel"><div className="admin-title"><h1>商品管理</h1><Link to="/admin/products/new">新增商品</Link></div><table className="admin-table"><thead><tr><th>图片</th><th>名称</th><th>分类</th><th>发布</th><th>操作</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td>{product.coverImageUrl && <img src={product.coverImageUrl} alt="" />}</td><td>{product.name}</td><td>{product.category}</td><td>{product.isPublished ? '已发布' : '未发布'}</td><td><Link to={`/admin/products/${product.id}/edit`}>编辑</Link><button onClick={() => onDelete(product.id)}>删除</button></td></tr>)}</tbody></table></section>;
}
