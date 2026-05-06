import { useEffect, useState } from 'react';
import { App, Button, Card, InputNumber, Space, Switch, Tag, Typography } from 'antd';
import { adminBanners, deleteBanner, saveBanner } from '../../api/adminApi';
import type { Banner } from '../../api/publicApi';
import { ConfirmButton, DragHandle, DraggableList, MediaDropzone, PageHeader } from '../../admin/components';

const videoPattern = /\.(mp4|webm|mov)$/i;

export function BannersAdminPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [saving, setSaving] = useState(false);
  const { message } = App.useApp();

  async function load() {
    setBanners(await adminBanners());
  }

  useEffect(() => {
    load().catch((err) => message.error(err instanceof Error ? err.message : '轮播图加载失败'));
  }, [message]);

  async function onMediaUploaded(urls: string[]) {
    if (urls.length === 0) return;
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
      message.success(`已上传 ${urls.length} 个轮播素材`);
      await load();
    } catch (err) {
      message.error(err instanceof Error ? err.message : '轮播图保存失败');
    } finally {
      setSaving(false);
    }
  }

  function updateLocal(id: string, patch: Partial<Banner>) {
    setBanners((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item));
  }

  function reorderBanners(next: Banner[]) {
    setBanners(next.map((item, index) => ({ ...item, sortOrder: index })));
  }

  async function updateBanner(banner: Banner) {
    setSaving(true);
    try {
      await saveBanner({ ...banner, title: banner.title || '轮播图', subtitle: '', linkUrl: '' });
      message.success('轮播素材已保存');
      await load();
    } catch (err) {
      message.error(err instanceof Error ? err.message : '轮播图保存失败');
    } finally {
      setSaving(false);
    }
  }

  async function saveOrder() {
    setSaving(true);
    try {
      await Promise.all(banners.map((banner) => saveBanner(banner)));
      message.success('轮播顺序已保存');
      await load();
    } catch (err) {
      message.error(err instanceof Error ? err.message : '轮播顺序保存失败');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    try {
      await deleteBanner(id);
      message.success('轮播素材已删除');
      await load();
    } catch (err) {
      message.error(err instanceof Error ? err.message : '轮播图删除失败');
    }
  }

  return (
    <div>
      <PageHeader title="轮播图管理" description="上传首页顶部展示的图片、动图或视频。图片上传前裁剪为 1920×936；视频和 GIF 请提前制作为对应比例，视频文件控制在 80MB 以内，视频时长控制在 1 分钟以内。" extra={<Button type="primary" loading={saving} onClick={saveOrder}>保存排序</Button>} />
      <Card title="上传轮播素材" style={{ marginBottom: 16 }}>
        <MediaDropzone value="" multiple cropPreset="homepageHero" maxVideoDurationSeconds={60} onChange={() => {}} onMultipleChange={onMediaUploaded} />
      </Card>
      <DraggableList
        items={banners}
        getItemId={(banner) => banner.id}
        onReorder={reorderBanners}
        renderItem={(banner, index, dragHandle) => (
          <Card>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto minmax(180px, 280px) 1fr auto', gap: 16, alignItems: 'center' }}>
              <DragHandle dragHandle={dragHandle} />
              <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', background: '#f8fafc', minHeight: 120, display: 'grid', placeItems: 'center' }}>
                {banner.imageUrl && (videoPattern.test(banner.imageUrl) ? <video src={banner.imageUrl} controls muted playsInline style={{ width: '100%', maxHeight: 180 }} /> : <img src={banner.imageUrl} alt="轮播图" style={{ width: '100%', maxHeight: 180, objectFit: 'cover' }} />)}
                <Tag color={banner.isActive ? 'success' : 'default'} style={{ position: 'absolute', right: 8, top: 8 }}>{banner.isActive ? '正在显示' : '已隐藏'}</Tag>
              </div>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Typography.Text strong>轮播素材 #{index + 1}</Typography.Text>
                <Space wrap>
                  <span>排序</span><InputNumber value={banner.sortOrder} onChange={(value) => updateLocal(banner.id, { sortOrder: Number(value ?? 0) })} />
                  <Switch checked={banner.isActive} onChange={(checked) => updateLocal(banner.id, { isActive: checked })} checkedChildren="显示" unCheckedChildren="隐藏" />
                </Space>
              </Space>
              <Space>
                <Button loading={saving} onClick={() => updateBanner(banner)}>保存</Button>
                <ConfirmButton danger title="确定删除这个轮播素材吗？" onConfirm={() => onDelete(banner.id)}>删除</ConfirmButton>
              </Space>
            </div>
          </Card>
        )}
      />
      {banners.length === 0 && <Card><Typography.Text type="secondary">还没有轮播素材，请先上传图片、动图或视频。</Typography.Text></Card>}
    </div>
  );
}
