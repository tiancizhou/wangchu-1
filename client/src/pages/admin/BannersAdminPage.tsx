import { useEffect, useState } from 'react';
import { adminBanners, deleteBanner, saveBanner } from '../../api/adminApi';
import type { Banner } from '../../api/publicApi';
import { ImageUploader } from '../../components/admin/ImageUploader';

const emptyBanner: Partial<Banner> = { title: '', subtitle: '', imageUrl: '', linkUrl: '/', sortOrder: 0, isActive: true };

export function BannersAdminPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [editing, setEditing] = useState<Partial<Banner>>(emptyBanner);

  async function load() { setBanners(await adminBanners()); }
  useEffect(() => { load(); }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    await saveBanner(editing);
    setEditing(emptyBanner);
    await load();
  }

  async function onDelete(id: string) {
    if (!confirm('确定删除这个轮播图吗？')) return;
    await deleteBanner(id);
    await load();
  }

  return <section className="admin-panel"><h1>轮播图管理</h1><form className="admin-form" onSubmit={onSubmit}><label>标题<input value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></label><label>副标题<input value={editing.subtitle || ''} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} /></label><label>链接<input value={editing.linkUrl || ''} onChange={(e) => setEditing({ ...editing, linkUrl: e.target.value })} /></label><label>排序<input type="number" value={editing.sortOrder || 0} onChange={(e) => setEditing({ ...editing, sortOrder: Number(e.target.value) })} /></label><label className="checkbox"><input type="checkbox" checked={Boolean(editing.isActive)} onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })} />启用</label><ImageUploader value={editing.imageUrl} onChange={(url) => setEditing({ ...editing, imageUrl: url })} /><button>保存轮播图</button></form><div className="banner-list">{banners.map((banner) => <article key={banner.id}>{banner.imageUrl && <img src={banner.imageUrl} alt="" />}<h3>{banner.title}</h3><p>{banner.subtitle}</p><button onClick={() => setEditing(banner)}>编辑</button><button onClick={() => onDelete(banner.id)}>删除</button></article>)}</div></section>;
}
