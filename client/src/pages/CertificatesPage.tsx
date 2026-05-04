import { useEffect, useMemo, useState } from 'react';
import { getCertificates, getSiteProfile, type Certificate, type SiteProfile } from '../api/publicApi';

const pageSize = 9;

export function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [profile, setProfile] = useState<SiteProfile | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getCertificates().then(setCertificates).catch(() => {});
    getSiteProfile().then(setProfile).catch(() => {});
  }, []);

  const totalPages = Math.max(1, Math.ceil(certificates.length / pageSize));
  const visibleCertificates = useMemo(() => certificates.slice((page - 1) * pageSize, page * pageSize), [certificates, page]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  function goToPage(nextPage: number) {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <main className="gray-page">
      <div className="breadcrumb container">当前位置：首页 › 荣誉资质</div>
      <div className="content-card container two-column">
        <aside className="cert-side"><h2>荣誉资质</h2><div className="service-photo">客服中心</div><div className="hotline">资讯热线<b>{profile?.hotline || profile?.phone || '0519-68288220'}</b></div></aside>
        <section className="list-section certificates-list-section">
          <div className="cert-list-title"><div><h1>荣誉资质</h1><p>共 {certificates.length} 个资质证书，当前第 {page} / {totalPages} 页</p></div></div>
          <div className="cert-grid">
            {visibleCertificates.map((certificate) => <figure key={certificate.id}>{certificate.imageUrl ? <img src={certificate.imageUrl} alt={certificate.title} /> : <div className="cert-placeholder">证书</div>}<figcaption>{certificate.title}</figcaption></figure>)}
            {certificates.length === 0 && <div className="empty-state">暂无资质证书，请在后台添加。</div>}
          </div>
          {certificates.length > pageSize && (
            <nav className="pager cert-pager" aria-label="荣誉资质分页">
              <button type="button" disabled={page === 1} onClick={() => goToPage(page - 1)}>上一页</button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => <button className={pageNumber === page ? 'active' : ''} type="button" onClick={() => goToPage(pageNumber)} key={pageNumber}>{pageNumber}</button>)}
              <button type="button" disabled={page === totalPages} onClick={() => goToPage(page + 1)}>下一页</button>
            </nav>
          )}
        </section>
      </div>
    </main>
  );
}
