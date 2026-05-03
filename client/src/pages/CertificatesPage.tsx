export function CertificatesPage() {
  return (
    <main className="gray-page">
      <div className="breadcrumb container">当前位置：首页 › 荣誉资质</div>
      <div className="content-card container two-column">
        <aside className="cert-side"><h2>荣誉资质</h2><div className="service-photo">客服中心</div><div className="hotline">资讯热线<b>400-000-000</b></div></aside>
        <section className="list-section"><h1>荣誉资质</h1><div className="cert-grid">{Array.from({ length: 6 }).map((_, index) => <figure key={index}><div className="cert-placeholder">证书</div><figcaption>证书名称</figcaption></figure>)}</div><div className="pager">‹　1　2　3　4　...　20　›</div></section>
      </div>
    </main>
  );
}
