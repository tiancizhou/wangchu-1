import { useEffect, useState } from 'react';
import { adminCategories, deleteCategory, saveCategory } from '../../api/adminApi';
import type { ProductCategory } from '../../api/publicApi';
import { ImageUploader } from '../../components/admin/ImageUploader';

const emptyCategory: Partial<ProductCategory> = { name: '', slug: '', description: '', coverImageUrl: '', iconImageUrl: '', sortOrder: 0, isPublished: true };

export function CategoriesAdminPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [editing, setEditing] = useState<Partial<ProductCategory>>(emptyCategory);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      setCategories(await adminCategories());
    } catch (err) {
      setError(err instanceof Error ? err.message : '分类加载失败');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const saved = await saveCategory(editing);
      setEditing(saved);
      setMessage('分类已保存');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : '分类保存失败');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(category: ProductCategory) {
    if (!confirm(`确定删除“${category.name}”这个分类吗？`)) return;
    setError('');
    try {
      await deleteCategory(category.id);
      if (editing.id === category.id) setEditing({ ...emptyCategory });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : '分类删除失败');
    }
  }

  function startCreate() {
    setEditing({ ...emptyCategory });
    setMessage('');
    setError('');
  }

  function selectCategory(category: ProductCategory) {
    setEditing(category);
    setMessage('');
    setError('');
  }

  const isEditingExisting = Boolean(editing.id);
  const publishedCount = categories.filter((category) => category.isPublished).length;

  return (
    <section className="admin-panel categories-admin-page category-workspace-page">
      <div className="admin-title-block category-admin-title">
        <span className="page-editor-label">产品中心</span>
        <div className="category-title-row">
          <div>
            <h1>分类管理</h1>
            <p>维护产品中心的分类入口、排序、封面图和发布状态。客户会通过这些分类浏览对应产品。</p>
          </div>
          <button className="product-primary-action" type="button" onClick={startCreate}>新建分类</button>
        </div>
      </div>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <div className="category-summary-grid">
        <article><span>全部分类</span><strong>{categories.length}</strong></article>
        <article><span>前台显示</span><strong>{publishedCount}</strong></article>
        <article><span>暂不显示</span><strong>{categories.length - publishedCount}</strong></article>
      </div>

      <div className="category-workspace">
        <aside className="category-selector-panel">
          <div className="category-selector-head"><h2>选择分类</h2><p>点击分类后，在右侧编辑详细内容。</p></div>
          {loading && <p className="page-loading">分类加载中...</p>}
          {!loading && categories.length === 0 && <p className="empty-state">还没有分类，请先在右侧新建。</p>}
          {!loading && categories.length > 0 && (
            <div className="category-selector-list">
              {categories.map((category, index) => (
                <button className={editing.id === category.id ? 'category-selector-item active' : 'category-selector-item'} type="button" onClick={() => selectCategory(category)} key={category.id}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div><strong>{category.name}</strong><small>{category.slug || '未填写链接标识'}</small></div>
                  <em>{category.isPublished ? '显示' : '隐藏'}</em>
                </button>
              ))}
            </div>
          )}
        </aside>

        <form className="admin-form category-detail-panel" onSubmit={onSubmit}>
          <div className="category-detail-head">
            <div><span>{isEditingExisting ? '正在编辑' : '新建分类'}</span><h2>{editing.name || '产品分类'}</h2><p>{isEditingExisting ? '修改后点击底部保存，前台产品中心会同步更新。' : '填写分类信息并保存后，会出现在左侧分类列表。'}</p></div>
            <label className="content-publish-switch category-publish-switch"><input type="checkbox" checked={Boolean(editing.isPublished)} onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })} /><span />前台显示</label>
          </div>

          <div className="category-form-grid">
            <div className="category-form-main">
              <div className="admin-subsection category-form-section">
                <h3>基础信息</h3>
                <div className="category-field-grid">
                  <label>分类名称<input placeholder="例如 汽油机油" value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></label>
                  <label>链接标识<input placeholder="例如 gasoline-oil" value={editing.slug || ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></label>
                </div>
                <label>分类描述<textarea placeholder="简要说明这个分类下包含哪些产品" value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></label>
                <label>显示排序<input type="number" value={editing.sortOrder || 0} onChange={(e) => setEditing({ ...editing, sortOrder: Number(e.target.value) })} /></label>
              </div>
            </div>

            <aside className="category-preview-side">
              <div className="category-image-panel">
                <div><h3>分类封面图</h3><p>建议使用产品或应用场景横图，前台分类展示时会使用。</p></div>
                <ImageUploader value={editing.coverImageUrl} onChange={(url) => setEditing({ ...editing, coverImageUrl: url })} />
              </div>
              <div className="category-preview-card">
                <span>前台预览</span>
                {editing.coverImageUrl ? <img src={editing.coverImageUrl} alt={editing.name || '分类封面'} /> : <div className="category-preview-empty">分类封面</div>}
                <strong>{editing.name || '分类名称'}</strong>
                <p>{editing.description || '分类描述会显示在这里，帮助客户理解这个分类。'}</p>
                <small>{editing.isPublished ? '当前设置为前台显示' : '当前设置为前台隐藏'}</small>
              </div>
            </aside>
          </div>

          <div className="category-save-bar">
            {isEditingExisting && <button className="category-delete-inline" type="button" onClick={() => onDelete(editing as ProductCategory)}>删除当前分类</button>}
            <button disabled={saving}>{saving ? '保存中...' : (isEditingExisting ? '保存分类修改' : '新增分类')}</button>
          </div>
        </form>
      </div>
    </section>
  );
}
