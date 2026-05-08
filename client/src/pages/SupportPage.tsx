import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getContentSections, type ContentSection } from '../api/publicApi';
import { getSupportPageContent, type SupportPageContent } from './supportPageContent';

export function SupportPage() {
  const [section, setSection] = useState<ContentSection<SupportPageContent> | null>(null);
  const content = getSupportPageContent(section?.data);

  useEffect(() => {
    getContentSections('support').then((sections) => setSection(sections.supportPage as ContentSection<SupportPageContent> | undefined || null)).catch(() => {});
  }, []);

  return (
    <main className="technical-support-page">
      <div className="breadcrumb container">当前位置：<Link to="/">首页</Link> › 技术支持</div>
      <section className="technical-support-sheet container">
        <img className="technical-support-hero" src={content.heroImageUrl} alt="技术支持科技感横幅" />
        <h1>{section?.title || '技术支持'}</h1>

        <div className="support-table support-table-centers">
          {content.centers.map((center, index) => (
            <article key={`center-${index}`}>
              <h2>{center.title}</h2>
              <p>{center.description}</p>
            </article>
          ))}
        </div>

        <div className="support-table support-table-technical">
          {content.technicalColumns.map((column, index) => (
            <article key={`technical-${index}`}>
              <h3>{column.title}</h3>
              <p>{column.description}</p>
            </article>
          ))}
        </div>

        <h1>售后支持</h1>
        <div className="support-service-grid">
          {content.serviceStations.map((station, index) => (
            <article key={`service-${index}`}>
              <h2>{station.station}</h2>
              <dl>
                <div><dt>联系人</dt><dd>{station.contact}</dd></div>
                <div><dt>电话</dt><dd>{station.phone}</dd></div>
                <div><dt>地址</dt><dd>{station.address}</dd></div>
                <div><dt>覆盖区域</dt><dd>{station.areas}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
