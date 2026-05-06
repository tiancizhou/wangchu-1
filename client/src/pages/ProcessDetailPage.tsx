import { renderRichText } from '../utils/richText';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getContentSections, type ContentSection } from '../api/publicApi';

type ArticleSection = { heading?: string; paragraphs?: string[] };
type ProcessItem = { title?: string; description?: string; linkUrl?: string; sections?: ArticleSection[] };
type ProcessModuleData = { items?: ProcessItem[] };

const processDetailLinks = ['/process/filling-line', '/process/equipment-management', '/process/equipment', '/process/warehouse'];
const fallbackItems: ProcessItem[] = [
  { title: '灌装线', description: '自动化灌装流程提升生产效率，保障产品包装规格统一、出厂品质稳定。' },
  { title: '设备管理', description: '规范化设备管理保障生产连续性与品质稳定。' },
  { title: '设备', description: '成熟设备体系满足多类油品生产需求。' },
  { title: '仓储', description: '规范仓储管理保障产品交付效率。' }
];

function fallbackLink(index: number) {
  return processDetailLinks[index] || processDetailLinks[0];
}

export function ProcessDetailPage() {
  const { slug = '' } = useParams();
  const [section, setSection] = useState<ContentSection<ProcessModuleData> | null>(null);

  useEffect(() => {
    getContentSections('home').then((sections) => setSection(sections.processModule as ContentSection<ProcessModuleData> | undefined || null)).catch(() => {});
  }, []);

  const items = section?.data.items?.length ? section.data.items : fallbackItems;
  const item = items.find((entry, index) => (entry.linkUrl || fallbackLink(index)) === `/process/${slug}`) || items[0] || fallbackItems[0];
  const title = item.title || '先进的制作工艺';
  const paragraphs = item.sections?.[0]?.paragraphs?.length ? item.sections[0].paragraphs : [item.description || '这里填写先进的制作工艺详情内容，可在后台维护正文内容。'];

  return (
    <main className="gray-page legal-page about-page">
      <div className="breadcrumb container">当前位置：<Link to="/">首页</Link> › <Link to="/#process">先进的制作工艺</Link></div>
      <section className="content-card container legal-content about-content">
        <article className="rich-text-placeholder legal-statement-document about-rich-text">
          <h1>{title}</h1>
          <section className="about-statement-section">
            {paragraphs.map((paragraph) => <p key={paragraph}>{renderRichText(paragraph)}</p>)}
          </section>
        </article>
      </section>
    </main>
  );
}
