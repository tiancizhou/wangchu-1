import { useEffect, useState } from 'react';
import { adminBanners, deleteBanner, saveBanner } from '../../api/adminApi';
import type { Banner } from '../../api/publicApi';
import { MediaUploader } from '../../components/admin/MediaUploader';

const videoPattern = /\.(mp4|webm|mov)$/i;

export function BannersAdminPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setBanners(await adminBanners());
  }

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : '轮播图加载失败'));
  }, []);

  async function onImagesUploaded(urls: string[]) {
    if (urls.length === 0) return;

    setError('');
    setSaving(true);
    try {
      await Promise.all(urls.map((url, index) => saveBanner({
        title: '轮播图',
        subtitle: '',
        imageUrl: url,
        linkUrl: '',
        sortOrder: banners.length + index,
        isActive: true
      })));
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : '轮播图保存失败');
    } finally {
      setSaving(false);
    }
  }

  async function updateBanner(banner: Banner) {
    setError('');
    setSaving(true);
    try {
      await saveBanner({
        ...banner,
        title: banner.title || '轮播图',
        subtitle: '',
        linkUrl: ''
      });
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
    <section className="admin-panel banners-admin-page">
      <div className="admin-title-block banner-admin-title">
        <span className="page-editor-label">轮播图管理</span>
        <h1>轮播图管理</h1>
        <p>上传首页顶部展示的图片、动图或视频。建议使用清晰横版素材，视频文件控制在 80MB 以内。</p>
      </div>

      <div className="banner-upload-panel">
        <div>
          <h2>上传轮播素材</h2>
          <p>支持 jpg、png、webp、gif 动图，以及 mp4、webm、mov 视频。上传后会自动加入轮播列表。</p>
        </div>
        {error && <p className="error">{error}</p>}
        <MediaUploader value="" multiple onChange={() => {}} onMultipleChange={onImagesUploaded} />
        {saving && <span className="banner-saving">保存中...</span>}
      </div>

      <div className="banner-list-header">
        <div><h2>轮播素材列表</h2><p>调整显示顺序和启用状态后，点击对应卡片的保存按钮。</p></div>
        <span>{banners.length} 个素材</span>
      </div>

      <div className="banner-list">
        {banners.map((banner, index) => (
          <article className="banner-card" key={banner.id}>
            <div className="banner-media-frame">
              <span className="banner-index">#{index + 1}</span>
              {banner.imageUrl && (videoPattern.test(banner.imageUrl) ? <video src={banner.imageUrl} controls muted playsInline /> : <img src={banner.imageUrl} alt="轮播图" />)}
              <span className={banner.isActive ? 'banner-status active' : 'banner-status'}>{banner.isActive ? '正在显示' : '已隐藏'}</span>
            </div>
            <div className="banner-card-controls">
              <label>
                显示顺序
                <input
                  type="number"
                  value={banner.sortOrder}
                  onChange={(event) => setBanners((items) => items.map((item) => item.id === banner.id ? { ...item, sortOrder: Number(event.target.value) } : item))}
                />
              </label>
              <label className="banner-switch">
                <input
                  type="checkbox"
                  checked={banner.isActive}
                  onChange={(event) => setBanners((items) => items.map((item) => item.id === banner.id ? { ...item, isActive: event.target.checked } : item))}
                />
                <span />
                在首页显示
              </label>
            </div>
            <div className="banner-card-actions">
              <button className="banner-save-button" disabled={saving} onClick={() => updateBanner(banner)}>保存修改</button>
              <button className="banner-delete-button" onClick={() => onDelete(banner.id)}>删除素材</button>
            </div>
          </article>
        ))}
        {banners.length === 0 && <p className="empty-state">还没有轮播素材，请先上传图片、动图或视频。</p>}
      </div>
    </section>
  );
}
