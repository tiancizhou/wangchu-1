import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminProduct, saveProduct } from '../../api/adminApi';
import type { Product } from '../../api/publicApi';
import { ImageUploader } from '../../components/admin/ImageUploader';

const emptyProduct: Partial<Product> = { name: '', slug: '', category: '工业油品', summary: '', description: '', coverImageUrl: '', galleryImageUrls: [], sortOrder: 0, isPublished: true };

export function ProductEditPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Partial<Product>>(emptyProduct);
  const navigate = useNavigate();

  useEffect(() => { if (id) adminProduct(id).then(setProduct); }, [id]);

  function setField<K extends keyof Product>(key: K, value: Product[K]) {
    setProduct((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    await saveProduct(product);
    navigate('/admin/products');
  }

  return <section className="admin-panel"><h1>{id ? '编辑商品' : '新增商品'}</h1><form className="admin-form" onSubmit={onSubmit}><label>商品名称<input value={product.name || ''} onChange={(e) => setField('name', e.target.value)} /></label><label>链接标识<input value={product.slug || ''} onChange={(e) => setField('slug', e.target.value)} placeholder="api-ci-4" /></label><label>分类<input value={product.category || ''} onChange={(e) => setField('category', e.target.value)} /></label><label>排序<input type="number" value={product.sortOrder || 0} onChange={(e) => setField('sortOrder', Number(e.target.value))} /></label><label>摘要<textarea value={product.summary || ''} onChange={(e) => setField('summary', e.target.value)} /></label><label>详情<textarea value={product.description || ''} onChange={(e) => setField('description', e.target.value)} /></label><label className="checkbox"><input type="checkbox" checked={Boolean(product.isPublished)} onChange={(e) => setField('isPublished', e.target.checked)} />发布商品</label><ImageUploader value={product.coverImageUrl} onChange={(url) => setField('coverImageUrl', url)} /><button>保存商品</button></form></section>;
}
