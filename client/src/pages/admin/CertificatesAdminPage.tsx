import { useEffect, useState } from 'react';
import { App, Button, Card, Col, InputNumber, Row, Space, Statistic, Switch, Tag, Typography } from 'antd';
import { adminCertificates, adminContentSection, deleteCertificate, saveCertificate, saveContentSection } from '../../api/adminApi';
import type { Certificate, ContentSection } from '../../api/publicApi';
import { ConfirmButton, DragHandle, DraggableList, Dropzone, PageHeader } from '../../admin/components';
import { normalizeHomeCertificateImages, type HomeCertificateImage } from '../../utils/homeCertificateImages';

const defaultTitle = '荣誉资质';
type CertificateSidebarData = { imageUrl?: string };
type HomeCertificateSectionData = { images?: HomeCertificateImage[] };

export function CertificatesAdminPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [homeCertificateSection, setHomeCertificateSection] = useState<ContentSection<HomeCertificateSectionData> | null>(null);
  const [sidebar, setSidebar] = useState<ContentSection<CertificateSidebarData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingIds, setSavingIds] = useState<string[]>([]);
  const [dirtyIds, setDirtyIds] = useState<string[]>([]);
  const { message } = App.useApp();

  async function load() {
    setLoading(true);
    try {
      const [certificateRows, homeSection, sidebarSection] = await Promise.all([
        adminCertificates(),
        adminContentSection('home', 'certificatePreview').catch(() => null),
        adminContentSection('certificates', 'sidebar').catch(() => null)
      ]);
      setCertificates(certificateRows);
      setHomeCertificateSection(homeSection as ContentSection<HomeCertificateSectionData> | null);
      setSidebar(sidebarSection as ContentSection<CertificateSidebarData> | null);
    } catch (err) {
      message.error(err instanceof Error ? err.message : '荣誉资质加载失败');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

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
        title: '荣誉资质',
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

  async function saveSidebarImage(imageUrl: string) {
    markSaving('sidebar', true);
    try {
      const saved = await saveContentSection({
        ...(sidebar || {}),
        pageKey: 'certificates',
        sectionKey: 'sidebar',
        title: '荣誉资质左侧图片',
        subtitle: '',
        data: { imageUrl },
        sortOrder: 0,
        isPublished: true
      });
      setSidebar(saved as ContentSection<CertificateSidebarData>);
      message.success('荣誉资质左侧图片已保存');
    } catch (err) {
      message.error(err instanceof Error ? err.message : '左侧图片保存失败');
    } finally {
      markSaving('sidebar', false);
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

  return (
    <div>
      <PageHeader title="荣誉资质" description="上传和维护网站展示的证书、资质和荣誉图片。" extra={<Button type="primary" disabled={dirtyIds.length === 0} loading={savingIds.includes('dirty')} onClick={saveDirtyCertificates}>保存全部修改</Button>} />
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}><Card><Statistic title="全部图片" value={certificates.length} /></Card></Col>
        <Col xs={24} md={8}><Card><Statistic title="前台显示" value={publishedCount} /></Card></Col>
        <Col xs={24} md={8}><Card><Statistic title="待保存" value={dirtyIds.length} /></Card></Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={12}><Card title="首页荣誉资质横向图片"><Dropzone value="" multiple onChange={() => {}} onMultipleChange={onHomeImagesUploaded} hint="用于首页荣誉资质展示，建议上传横向组合图" /></Card></Col>
        <Col xs={24} lg={12}><Card title="资质详情页左侧图片"><Dropzone value={sidebar?.data.imageUrl} onChange={saveSidebarImage} /></Card></Col>
      </Row>
      {homeCertificateImages.length > 0 && (
        <Card title="首页荣誉资质横向图片" style={{ marginBottom: 16 }}>
          <DraggableList
            items={homeCertificateImages}
            getItemId={(image) => image.id}
            onReorder={saveHomeCertificateImages}
            renderItem={(image, index, dragHandle) => (
              <Card size="small">
                <div style={{ display: 'grid', gridTemplateColumns: 'auto minmax(220px, 360px) 1fr auto', gap: 16, alignItems: 'center' }}>
                  <DragHandle dragHandle={dragHandle} />
                  <img src={image.imageUrl} alt={image.title} style={{ width: '100%', maxHeight: 140, objectFit: 'contain', background: '#f8fafc' }} />
                  <Space direction="vertical">
                    <Typography.Text strong>首页荣誉资质 #{index + 1}</Typography.Text>
                    <Switch checked={Boolean(image.isPublished)} onChange={(checked) => saveHomeCertificateImages(homeCertificateImages.map((item) => item.id === image.id ? { ...item, isPublished: checked } : item))} checkedChildren="显示" unCheckedChildren="隐藏" />
                  </Space>
                  <Space>
                    <Dropzone value={image.imageUrl} onChange={(url) => saveHomeCertificateImages(homeCertificateImages.map((item) => item.id === image.id ? { ...item, imageUrl: url } : item))} />
                    <ConfirmButton danger title="确定删除这张首页荣誉资质图片吗？" onConfirm={() => saveHomeCertificateImages(homeCertificateImages.filter((item) => item.id !== image.id))}>删除</ConfirmButton>
                  </Space>
                </div>
              </Card>
            )}
          />
        </Card>
      )}
      <Card title="上传资质详情页证书图片" style={{ marginBottom: 16 }}><Dropzone value="" multiple onChange={() => {}} onMultipleChange={onImagesUploaded} hint="用于荣誉资质详情页列表，建议上传纵向证书图" /></Card>
      {loading && <Card><Typography.Text type="secondary">荣誉资质加载中...</Typography.Text></Card>}
      {!loading && certificates.length === 0 && <Card><Typography.Text type="secondary">还没有荣誉资质图片，请先上传图片。</Typography.Text></Card>}
      {!loading && certificates.length > 0 && (
        <DraggableList
          items={certificates}
          getItemId={(certificate) => certificate.id}
          onReorder={reorderCertificates}
          renderItem={(certificate, index, dragHandle) => {
            const saving = savingIds.includes(certificate.id);
            const dirty = dirtyIds.includes(certificate.id);
            return (
              <Card>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto minmax(140px, 220px) 1fr auto', gap: 16, alignItems: 'center' }}>
                  <DragHandle dragHandle={dragHandle} />
                  <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', background: '#f8fafc', minHeight: 120, display: 'grid', placeItems: 'center' }}>
                    {certificate.imageUrl ? <img src={certificate.imageUrl} alt="荣誉资质" style={{ width: '100%', maxHeight: 160, objectFit: 'cover' }} /> : <Typography.Text type="secondary">暂无图片</Typography.Text>}
                    <Tag color={certificate.isPublished ? 'success' : 'default'} style={{ position: 'absolute', right: 8, top: 8 }}>{certificate.isPublished ? '前台显示' : '暂不显示'}</Tag>
                  </div>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Typography.Text strong>荣誉资质 #{index + 1}</Typography.Text>
                    <Space wrap>
                      <span>排序</span><InputNumber value={certificate.sortOrder || 0} onChange={(value) => updateCertificate(certificate.id, { sortOrder: Number(value ?? 0) })} />
                      <Switch checked={Boolean(certificate.isPublished)} onChange={(checked) => updateCertificate(certificate.id, { isPublished: checked })} checkedChildren="显示" unCheckedChildren="隐藏" />
                      {dirty && <Tag color="warning">待保存</Tag>}
                    </Space>
                    <Dropzone value={certificate.imageUrl} onChange={(url) => updateCertificate(certificate.id, { imageUrl: url })} />
                  </Space>
                  <Space>
                    <Button loading={saving} onClick={() => saveOne(certificate)}>{dirty ? '保存' : '已保存'}</Button>
                    <ConfirmButton danger disabled={saving} title="确定删除这张荣誉资质图片吗？" onConfirm={() => onDelete(certificate)}>删除</ConfirmButton>
                  </Space>
                </div>
              </Card>
            );
          }}
        />
      )}
    </div>
  );
}
