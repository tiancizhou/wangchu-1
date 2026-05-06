import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getContentSections, type ContentSection } from '../api/publicApi';

type ContactInfoItem = { label?: string; value?: string };
type ContactInfoData = { body?: string; mapImageUrl?: string; items?: ContactInfoItem[] };

const defaultContactItems: ContactInfoItem[] = [
  { label: '公司名称', value: '桔尔润（北京）润滑油有限公司' },
  { label: '公司地址', value: '北京市大兴区科创五街38号院' },
  { label: '联系电话', value: '0519-68288220' },
  { label: '服务热线', value: '0519-68288220' },
  { label: '电子邮箱', value: 'service@example.com' }
];

function normalizeContactItems(items?: ContactInfoItem[]) {
  return defaultContactItems.map((fallback, index) => ({
    label: items?.[index]?.label || fallback.label,
    value: items?.[index]?.value || fallback.value
  }));
}

export function ContactPage() {
  const [section, setSection] = useState<ContentSection<ContactInfoData> | null>(null);

  useEffect(() => {
    let cancelled = false;

    getContentSections('contact')
      .then((sections) => {
        if (!cancelled) setSection(sections.contactInfo as ContentSection<ContactInfoData> | undefined || null);
      })
      .catch(() => {
        if (!cancelled) setSection(null);
      });

    return () => { cancelled = true; };
  }, []);

  const contactItems = normalizeContactItems(section?.data.items);
  const mapImageUrl = section?.data.mapImageUrl || '';

  return (
    <main className="gray-page contact-page">
      <div className="breadcrumb contact-container">当前位置：<Link to="/">首页</Link> › 联系我们</div>
      <section className="contact-container contact-card">
        <div className="contact-info-list">
          {contactItems.map((item, index) => (
            <div className="contact-info-bar" key={`${item.label}-${index}`}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
        <div className="contact-map">
          {mapImageUrl ? <img src={mapImageUrl} alt="公司位置地图" /> : <div className="contact-map-placeholder">地图图片</div>}
        </div>
      </section>
    </main>
  );
}
