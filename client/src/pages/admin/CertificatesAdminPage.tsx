import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { App, Button, Card, Col, Input, InputNumber, Row, Space, Statistic, Switch, Tabs, Tag, Typography } from 'antd';
import { rectSortingStrategy } from '@dnd-kit/sortable';
import { adminCertificates, adminContentSection, deleteCertificate, saveCertificate, saveContentSection } from '../../api/adminApi';
import type { Certificate, ContentSection } from '../../api/publicApi';
import { ConfirmButton, DragHandle, DraggableList, Dropzone, PageHeader } from '../../admin/components';
import { normalizeHomeCertificateImages, type HomeCertificateImage } from '../../utils/homeCertificateImages';

const defaultTitle = '荣誉资质';
type HomeCertificateSectionData = { images?: HomeCertificateImage[] };
type TabKey = 'home' | 'detail';

const compactGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 };

function getActiveTab(value: string | null): TabKey {
  return value === 'detail' ? 'detail' : 'home';
}

export function CertificatesAdminPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = getActiveTab(searchParams.get('tab'));
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [homeCertificateSection, setHomeCertificateSection] = useState<ContentSection<HomeCertificateSectionData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingIds, setSavingIds] = useState<string[]>([]);
  const [dirtyIds, setDirtyIds] = useState<string[]>([]);
  const { message } = App.useApp();

  async function load() {
    setLoading(true);
    try {
      const [certificateRows, homeSection] = await Promise.all([
        adminCertificates(),
        adminContentSection('home', 'certificatePreview').catch(() => null)
      ]);
      setCertificates(certificateRows);
      setHomeCertificateSection(homeSection as ContentSection<HomeCertificateSectionData> | null);
    } catch (err) {
      message.error(err instanceof Error ? err.message : '荣誉资质加载失败');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function onTabChange(key: string) {
    setSearchParams(key === 'detail' ? { tab: 'detail' } : {});
  }

  function markSaving(id: string, saving: boolean) {
    setSavingIds((ids) => saving ? [...new Set([...ids, id])] : ids.filter((item) => item !== id));
  }

  function updateCertificate(id: string, patch: Partial<Certificate>) {
    setCertificates((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item));
    setDirtyIds((ids) => ids.includes(id) ? ids : [...ids, id]);
  }

  function reorderCertificates(next: Certificate[]) {
    const normalized = next.map((item, index) => ({ ...item, sortOrder: index + 1 }));
    setCertificates(normalized);
    setDirtyIds((ids) => [...new Set([...ids, ...normalized.map((item) => item.id)])]);
  }

  async function saveHomeCertificateImages(images: HomeCertificateImage[]) {
    markSaving('home-certificates', true);
    try {
      const saved = await saveContentSection({
        ...(homeCertificateSection || {}),
        pageKey: 'home',
        sectionKey: 'certificatePreview',
        title: homeCertificateSection?.title || '荣誉资质',
        subtitle: '',
        data: { images: images.map((image, index) => ({ ...image, sortOrder: index + 1 })) },
        sortOrder: 0,
        isPublished: true
      });
      setHomeCertificateSection(saved as ContentSection<HomeCertificateSectionData>);
      message.success('首页荣誉资质图片已保存');
    } catch (err) {
      message.error(err instanceof Error ? err.message : '首页荣誉资质图片保存失败');
    } finally {
      markSaving('home-certificates', false);
    }
  }

  async function onHomeImagesUploaded(urls: string[]) {
    if (urls.length === 0) return;
    const current = normalizeHomeCertificateImages(homeCertificateSection?.data.images);
    await saveHomeCertificateImages([
      ...current,
      ...urls.map((url, index) => ({
        id: `home-certificate-${Date.now()}-${index}`,
        imageUrl: url,
        title: defaultTitle,
        sortOrder: current.length + index + 1,
        isPublished: true
      }))
    ]);
  }

  async function onImagesUploaded(urls: string[]) {
    if (urls.length === 0) return;
    markSaving('batch', true);
    try {
      await Promise.all(urls.map((url, index) => saveCertificate({
        title: defaultTitle,
        imageUrl: url,
        category: '',
        description: '',
        issuer: '',
        issueDate: '',
        sortOrder: certificates.length + index + 1,
        isPublished: true
      })));
      message.success(`已上传 ${urls.length} 张荣誉资质图片`);
      await load();
    } catch (err) {
      message.error(err instanceof Error ? err.message : '上传荣誉资质图片失败');
    } finally {
      markSaving('batch', false);
    }
  }

  async function saveOne(certificate: Certificate) {
    markSaving(certificate.id, true);
    try {
      const saved = await saveCertificate({ ...certificate, title: certificate.title || defaultTitle, sortOrder: Number(certificate.sortOrder || 0) });
      setCertificates((items) => items.map((item) => item.id === saved.id ? saved : item));
      setDirtyIds((ids) => ids.filter((id) => id !== saved.id));
      message.success('荣誉资质图片已保存');
    } catch (err) {
      message.error(err instanceof Error ? err.message : '保存荣誉资质图片失败');
    } finally {
      markSaving(certificate.id, false);
    }
  }

  async function saveDirtyCertificates() {
    const dirtyItems = certificates.filter((item) => dirtyIds.includes(item.id));
    if (dirtyItems.length === 0) return;
    markSaving('dirty', true);
    try {
      await Promise.all(dirtyItems.map((item) => saveCertificate({ ...item, sortOrder: Number(item.sortOrder || 0) })));
      setDirtyIds([]);
      message.success('荣誉资质修改已保存');
      await load();
    } catch (err) {
      message.error(err instanceof Error ? err.message : '批量保存失败');
    } finally {
      markSaving('dirty', false);
    }
  }

  async function onDelete(certificate: Certificate) {
    markSaving(certificate.id, true);
    try {
      await deleteCertificate(certificate.id);
      setCertificates((items) => items.filter((item) => item.id !== certificate.id));
      setDirtyIds((ids) => ids.filter((id) => id !== certificate.id));
      message.success('荣誉资质图片已删除');
    } catch (err) {
      message.error(err instanceof Error ? err.message : '删除荣誉资质图片失败');
    } finally {
      markSaving(certificate.id, false);
    }
  }

  const homeCertificateImages = normalizeHomeCertificateImages(homeCertificateSection?.data.images);
  const publishedCount = certificates.filter((item) => item.isPublished).length;

  function renderHomeTab() {
    return (
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Card title="上传首页荣誉图片">
          <Dropzone value="" multiple onChange={() => {}} onMultipleChange={onHomeImagesUploaded} hint="用于首页荣誉资质展示，建议上传横向组合图" />
        </Card>
        {loading && <Card><Typography.Text type="secondary">首页荣誉图片加载中...</Typography.Text></Card>}
        {!loading && homeCertificateImages.length === 0 && <Card><Typography.Text type="secondary">还没有首页荣誉图片，请先上传图片。</Typography.Text></Card>}
        {homeCertificateImages.length > 0 && (
          <Card title="首页荣誉图片列表" loading={savingIds.includes('home-certificates')}>
            <DraggableList
              items={homeCertificateImages}
              getItemId={(image) => image.id}
              onReorder={saveHomeCertificateImages}
              strategy={rectSortingStrategy}
              containerStyle={compactGridStyle}
              renderItem={(image, index, dragHandle) => (
                <Card size="small" bodyStyle={{ padding: 12 }}>
                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Space size={8}>
                        <DragHandle dragHandle={dragHandle} />
                        <Typography.Text strong>首页荣誉图片 #{index + 1}</Typography.Text>
                      </Space>
                      <Switch checked={Boolean(image.isPublished)} onChange={(checked) => saveHomeCertificateImages(homeCertificateImages.map((item) => item.id === image.id ? { ...item, isPublished: checked } : item))} checkedChildren="显示" unCheckedChildren="隐藏" />
                    </Space>
                    <Dropzone value={image.imageUrl} onChange={(url) => saveHomeCertificateImages(homeCertificateImages.map((item) => item.id === image.id ? { ...item, imageUrl: url } : item))} previewMaxHeight={96} previewWidth={220} />
                    <ConfirmButton danger title="确定删除这张首页荣誉图片吗？" onConfirm={() => saveHomeCertificateImages(homeCertificateImages.filter((item) => item.id !== image.id))}>删除</ConfirmButton>
                  </Space>
                </Card>
              )}
            />
          </Card>
        )}
      </Space>
    );
  }

  function renderDetailTab() {
    return (
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}><Card><Statistic title="全部图片" value={certificates.length} /></Card></Col>
          <Col xs={24} md={8}><Card><Statistic title="前台显示" value={publishedCount} /></Card></Col>
          <Col xs={24} md={8}><Card><Statistic title="待保存" value={dirtyIds.length} /></Card></Col>
        </Row>
        <Card title="上传详情页证书图片" loading={savingIds.includes('batch')}><Dropzone value="" multiple onChange={() => {}} onMultipleChange={onImagesUploaded} hint="用于荣誉资质详情页列表，建议上传纵向证书图" /></Card>
        {loading && <Card><Typography.Text type="secondary">资质详情页图片加载中...</Typography.Text></Card>}
        {!loading && certificates.length === 0 && <Card><Typography.Text type="secondary">还没有资质详情页证书图片，请先上传图片。</Typography.Text></Card>}
        {!loading && certificates.length > 0 && (
          <Card title="详情页证书图片列表">
            <DraggableList
              items={certificates}
              getItemId={(certificate) => certificate.id}
              onReorder={reorderCertificates}
              strategy={rectSortingStrategy}
              containerStyle={compactGridStyle}
              renderItem={(certificate, index, dragHandle) => {
                const saving = savingIds.includes(certificate.id);
                const dirty = dirtyIds.includes(certificate.id);
                return (
                  <Card size="small" bodyStyle={{ padding: 12 }}>
                    <Space direction="vertical" size={8} style={{ width: '100%' }}>
                      <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Space size={8}>
                          <DragHandle dragHandle={dragHandle} />
                          <Typography.Text strong>详情页证书 #{index + 1}</Typography.Text>
                        </Space>
                        <Tag color={certificate.isPublished ? 'success' : 'default'}>{certificate.isPublished ? '显示' : '隐藏'}</Tag>
                      </Space>
                      <Dropzone value={certificate.imageUrl} onChange={(url) => updateCertificate(certificate.id, { imageUrl: url })} previewMaxHeight={120} previewWidth={220} />
                      <Input
                        addonBefore="小标题"
                        placeholder="请输入图片下方小标题"
                        value={certificate.title}
                        onChange={(event) => updateCertificate(certificate.id, { title: event.target.value })}
                      />
                      <Space wrap size={8}>
                        <span>排序</span><InputNumber size="small" value={certificate.sortOrder || 0} onChange={(value) => updateCertificate(certificate.id, { sortOrder: Number(value ?? 0) })} />
                        <Switch checked={Boolean(certificate.isPublished)} onChange={(checked) => updateCertificate(certificate.id, { isPublished: checked })} checkedChildren="显示" unCheckedChildren="隐藏" />
                      </Space>
                      <Space wrap size={8}>
                        <Button loading={saving} onClick={() => saveOne(certificate)}>{dirty ? '保存' : '已保存'}</Button>
                        {dirty && <Tag color="warning">待保存</Tag>}
                        <ConfirmButton danger disabled={saving} title="确定删除这张资质详情页证书图片吗？" onConfirm={() => onDelete(certificate)}>删除</ConfirmButton>
                      </Space>
                    </Space>
                  </Card>
                );
              }}
            />
          </Card>
        )}
      </Space>
    );
  }

  return (
    <div>
      <PageHeader
        title="荣誉资质"
        description="分别维护首页荣誉展示图片和荣誉资质详情页图片。"
        extra={activeTab === 'detail' ? <Button type="primary" disabled={dirtyIds.length === 0} loading={savingIds.includes('dirty')} onClick={saveDirtyCertificates}>保存全部修改</Button> : undefined}
      />
      <Tabs
        activeKey={activeTab}
        onChange={onTabChange}
        items={[
          { key: 'home', label: '首页荣誉图片', children: renderHomeTab() },
          { key: 'detail', label: '资质详情页图片', children: renderDetailTab() }
        ]}
      />
    </div>
  );
}
