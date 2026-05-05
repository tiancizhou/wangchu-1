import { useEffect, useState } from 'react';
import { adminCertificates, adminContentSection, deleteCertificate, saveCertificate, saveContentSection } from '../../api/adminApi';
import type { Certificate, ContentSection } from '../../api/publicApi';
import { ImageUploader } from '../../components/admin/ImageUploader';

const defaultTitle = '荣誉资质';
type CertificateSidebarData = { imageUrl?: string };

export function CertificatesAdminPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [sidebar, setSidebar] = useState<ContentSection<CertificateSidebarData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingIds, setSavingIds] = useState<string[]>([]);
  const [dirtyIds, setDirtyIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const [certificateRows, sidebarSection] = await Promise.all([
        adminCertificates(),
        adminContentSection('certificates', 'sidebar').catch(() => null)
      ]);
      setCertificates(certificateRows);
      setSidebar(sidebarSection as ContentSection<CertificateSidebarData> | null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '荣誉资质加载失败');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function markSaving(id: string, saving: boolean) {
    setSavingIds((ids) => saving ? [...new Set([...ids, id])] : ids.filter((item) => item !== id));
  }

  function updateCertificate(id: string, patch: Partial<Certificate>) {
    setCertificates((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item));
    setDirtyIds((ids) => ids.includes(id) ? ids : [...ids, id]);
    setMessage('');
  }

  async function saveSidebarImage(imageUrl: string) {
    setError('');
    setMessage('');
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
      setMessage('荣誉资质左侧图片已保存');
    } catch (err) {
      setError(err instanceof Error ? err.message : '左侧图片保存失败');
    } finally {
      markSaving('sidebar', false);
    }
  }

  async function onImagesUploaded(urls: string[]) {
    if (urls.length === 0) return;
    setError('');
    setMessage('');
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
      setMessage(`已上传 ${urls.length} 张荣誉资质图片。`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传荣誉资质图片失败');
    } finally {
      markSaving('batch', false);
    }
  }

  async function saveOne(certificate: Certificate) {
    setError('');
    setMessage('');
    markSaving(certificate.id, true);
    try {
      const saved = await saveCertificate({
        ...certificate,
        title: certificate.title || defaultTitle,
        sortOrder: Number(certificate.sortOrder || 0)
      });
      setCertificates((items) => items.map((item) => item.id === saved.id ? saved : item));
      setDirtyIds((ids) => ids.filter((id) => id !== saved.id));
      setMessage('荣誉资质图片已保存');
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存荣誉资质图片失败');
    } finally {
      markSaving(certificate.id, false);
    }
  }

  async function onDelete(certificate: Certificate) {
    if (!confirm('确定删除这张荣誉资质图片吗？')) return;
    setError('');
    setMessage('');
    markSaving(certificate.id, true);
    try {
      await deleteCertificate(certificate.id);
      setCertificates((items) => items.filter((item) => item.id !== certificate.id));
      setDirtyIds((ids) => ids.filter((id) => id !== certificate.id));
      setMessage('荣誉资质图片已删除');
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除荣誉资质图片失败');
    } finally {
      markSaving(certificate.id, false);
    }
  }

  const publishedCount = certificates.filter((item) => item.isPublished).length;

  return (
    <section className="admin-panel certificates-admin-page">
      <div className="admin-title-block">
        <span className="page-editor-label">荣誉资质</span>
        <h1>荣誉资质图片</h1>
        <p>这里只需要上传资质图片。图片会自动显示到首页荣誉资质区域，可简单调整排序和是否显示。</p>
      </div>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <div className="certificate-upload-panel certificate-sidebar-upload">
        <div>
          <h2>左侧展示图片</h2>
          <p>显示在前台荣誉资质页面左侧，参考图中的客服中心图片区域。</p>
        </div>
        <ImageUploader value={sidebar?.data.imageUrl} onChange={saveSidebarImage} />
      </div>

      <div className="certificate-upload-panel certificate-upload-simple">
        <div>
          <h2>上传荣誉资质图片</h2>
          <p>可以一次选择多张图片，上传后会自动生成图片卡片。</p>
        </div>
        <ImageUploader value="" onChange={() => {}} multiple onMultipleChange={onImagesUploaded} />
      </div>

      <div className="certificate-summary-grid certificate-summary-simple">
        <article><span>全部图片</span><strong>{certificates.length}</strong></article>
        <article><span>前台显示</span><strong>{publishedCount}</strong></article>
        <article><span>待保存</span><strong>{dirtyIds.length}</strong></article>
      </div>

      {loading && <p className="page-loading">荣誉资质加载中...</p>}
      {!loading && certificates.length === 0 && <p className="empty-state">还没有荣誉资质图片，请先上传图片。</p>}
      {!loading && certificates.length > 0 && (
        <div className="certificate-admin-grid certificate-simple-grid">
          {certificates.map((certificate, index) => {
            const saving = savingIds.includes(certificate.id);
            const dirty = dirtyIds.includes(certificate.id);
            return (
              <article className={dirty ? 'certificate-admin-card dirty' : 'certificate-admin-card'} key={certificate.id}>
                <div className="certificate-admin-image certificate-simple-image">
                  {certificate.imageUrl ? <img src={certificate.imageUrl} alt="荣誉资质" /> : <div className="upload-placeholder">暂无图片</div>}
                  <span className="certificate-index">#{index + 1}</span>
                  <span className={certificate.isPublished ? 'certificate-status active' : 'certificate-status'}>{certificate.isPublished ? '前台显示' : '暂不显示'}</span>
                  {dirty && <span className="certificate-dirty-badge">待保存</span>}
                </div>

                <div className="certificate-simple-controls">
                  <label>排序<input type="number" value={certificate.sortOrder || 0} onChange={(e) => updateCertificate(certificate.id, { sortOrder: Number(e.target.value) })} /></label>
                  <label className="checkbox"><input type="checkbox" checked={Boolean(certificate.isPublished)} onChange={(e) => updateCertificate(certificate.id, { isPublished: e.target.checked })} />前台显示</label>
                  <ImageUploader value={certificate.imageUrl} onChange={(url) => updateCertificate(certificate.id, { imageUrl: url })} />
                </div>

                <div className="certificate-card-actions">
                  <button className="certificate-save-button" type="button" onClick={() => saveOne(certificate)} disabled={saving}>{saving ? '保存中...' : dirty ? '保存' : '已保存'}</button>
                  <button className="certificate-delete-button" type="button" onClick={() => onDelete(certificate)} disabled={saving}>删除</button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
