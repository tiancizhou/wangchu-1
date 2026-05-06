import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCertificates, getContentSections, getSiteProfile, type Certificate, type ContentSection, type SiteProfile } from '../api/publicApi';

const pageSize = 6;

export function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [profile, setProfile] = useState<SiteProfile | null>(null);
  const [sidebar, setSidebar] = useState<ContentSection<{ imageUrl?: string }> | null>(null);
  const [page, setPage] = useState(1);
  const [previewCertificate, setPreviewCertificate] = useState<Certificate | null>(null);

  useEffect(() => {
    getCertificates().then(setCertificates).catch(() => {});
    getSiteProfile().then(setProfile).catch(() => {});
    getContentSections('certificates').then((sections) => setSidebar((sections.sidebar as ContentSection<{ imageUrl?: string }> | undefined) || null)).catch(() => {});
  }, []);

  const totalPages = Math.max(1, Math.ceil(certificates.length / pageSize));
  const visibleCertificates = useMemo(() => certificates.slice((page - 1) * pageSize, page * pageSize), [certificates, page]);
  const pageNumbers = totalPages <= 5 ? Array.from({ length: totalPages }, (_, index) => index + 1) : [1, 2, 3, 4, totalPages];

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  function goToPage(nextPage: number) {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <main className="gray-page certificates-detail-page">
      <div className="breadcrumb container">当前位置：<Link to="/">首页</Link> › 荣誉资质</div>
      <div className="content-card container two-column">
        <aside className="cert-side"><h2>荣誉资质</h2><div className="service-photo">{sidebar?.data.imageUrl ? <img src={sidebar.data.imageUrl} alt="荣誉资质客服" /> : '客服中心'}</div><div className="hotline"><span>资讯热线</span><b>{profile?.hotline || profile?.phone || '0519-68288220'}</b></div></aside>
        <section className="list-section certificates-list-section">
          <div className="cert-list-title"><h1>荣誉资质</h1></div>
          <div className="cert-grid">
            {visibleCertificates.map((certificate) => (
              <figure className="cert-card" key={certificate.id}>
                {certificate.imageUrl ? (
                  <button className="cert-image-button" type="button" onClick={() => setPreviewCertificate(certificate)} aria-label={`查看${certificate.title}原图`}>
                    <img src={certificate.imageUrl} alt={certificate.title} />
                  </button>
                ) : <div className="cert-placeholder">证书</div>}
                <figcaption>{certificate.title}</figcaption>
              </figure>
            ))}
            {certificates.length === 0 && <div className="empty-state">暂无资质证书，请在后台添加。</div>}
          </div>
          {certificates.length > 0 && (
            <nav className="pager cert-pager" aria-label="荣誉资质分页">
              <button type="button" disabled={page === 1} onClick={() => goToPage(page - 1)}>‹</button>
              {pageNumbers.map((pageNumber, index) => <span className="cert-page-item" key={pageNumber}>{index > 0 && pageNumber - pageNumbers[index - 1] > 1 && <em>...</em>}<button className={pageNumber === page ? 'active' : ''} type="button" onClick={() => goToPage(pageNumber)}>{pageNumber}</button></span>)}
              <button type="button" disabled={page === totalPages} onClick={() => goToPage(page + 1)}>›</button>
            </nav>
          )}
        </section>
      </div>
      {previewCertificate?.imageUrl && (
        <button className="cert-preview-overlay" type="button" onClick={() => setPreviewCertificate(null)} aria-label="关闭证书原图预览">
          <span className="cert-preview-dialog">
            <img src={previewCertificate.imageUrl} alt={previewCertificate.title} />
            <strong>{previewCertificate.title}</strong>
            <em>点击任意位置关闭</em>
          </span>
        </button>
      )}
    </main>
  );
}
