import { useEffect, useState, type FormEvent } from 'react';
import { adminBanners, deleteBanner, saveBanner } from '../../api/adminApi';
import type { Banner } from '../../api/publicApi';
import { ImageUploader } from '../../components/admin/ImageUploader';

const emptyBanner: Partial<Banner> = {
  title: '',
  subtitle: '',
  imageUrl: '',
  linkUrl: '/',
  sortOrder: 0,
  isActive: true
};

export function BannersAdminPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [editing, setEditing] = useState<Partial<Banner>>(emptyBanner);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setBanners(await adminBanners());
  }

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : '轮播图加载失败'));
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    if (!editing.title?.trim()) {
      setError('请填写轮播图标题');
      return;
    }

    if (!editing.imageUrl?.trim()) {
      setError('请先上传轮播图图片');
      return;
    }

    setSaving(true);
    try {
      await saveBanner({
        ...editing,
        title: editing.title.trim(),
        imageUrl: editing.imageUrl.trim(),
        linkUrl: editing.linkUrl?.trim() || '/'
      });
      setEditing({ ...emptyBanner });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : '轮播图保存失败');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm('确定删除这个轮播图吗？')) return;
    setError('');
    try {
      await deleteBanner(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : '轮播图删除失败');
    }
  }

  return (
    <section className="admin-panel">
      <h1>轮播图管理</h1>
      <form className="admin-form" onSubmit={onSubmit}>
        {error && <p className="error">{error}</p>}
        <label>
          标题
          <input value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
        </label>
        <label>
          副标题
          <input value={editing.subtitle || ''} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} />
        </label>
        <label>
          链接
          <input value={editing.linkUrl || ''} onChange={(e) => setEditing({ ...editing, linkUrl: e.target.value })} />
        </label>
        <label>
          排序
          <input type="number" value={editing.sortOrder || 0} onChange={(e) => setEditing({ ...editing, sortOrder: Number(e.target.value) })} />
        </label>
        <label className="checkbox">
          <input type="checkbox" checked={Boolean(editing.isActive)} onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })} />
          启用
        </label>
        <ImageUploader value={editing.imageUrl} onChange={(url) => setEditing({ ...editing, imageUrl: url })} />
        <button disabled={saving}>{saving ? '保存中...' : '保存轮播图'}</button>
      </form>
      <div className="banner-list">
        {banners.map((banner) => (
          <article key={banner.id}>
            {banner.imageUrl && <img src={banner.imageUrl} alt="" />}
            <h3>{banner.title}</h3>
            <p>{banner.subtitle}</p>
            <button onClick={() => setEditing(banner)}>编辑</button>
            <button onClick={() => onDelete(banner.id)}>删除</button>
          </article>
        ))}
      </div>
    </section>
  );
}
