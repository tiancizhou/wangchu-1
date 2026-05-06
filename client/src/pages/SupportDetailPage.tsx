import { renderRichText } from '../utils/richText';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getContentSections, type ContentSection } from '../api/publicApi';

type ArticleSection = { paragraphs?: string[] };
type SupportTab = { title?: string; heading?: string; description?: string; linkUrl?: string; sections?: ArticleSection[] };
type SupportModuleData = { tabs?: SupportTab[] };

type SupportDetailConfig = { title: string; fallbackText: string };

const supportDetailConfigs: Record<string, SupportDetailConfig> = {
  'production-blending': {
    title: '生产调和',
    fallbackText: '围绕不同油品应用场景，建立标准化调和流程，为客户提供稳定可靠的产品生产支持。'
  },
  'lab-testing': {
    title: '锅炉百科',
    fallbackText: '围绕润滑油研发、生产检测与品质管理，建立标准化实验流程和技术服务体系。'
  },
  'quality-inspection': {
    title: '品质检验',
    fallbackText: '通过规范化检测标准，对产品性能、稳定性和适用性进行持续检验。'
  }
};

const fallbackTabs: SupportTab[] = [
  { title: '调和', heading: '生产调和', description: supportDetailConfigs['production-blending'].fallbackText },
  { title: '检测', heading: '锅炉百科', description: supportDetailConfigs['lab-testing'].fallbackText },
  { title: '检验', heading: '品质检验', description: supportDetailConfigs['quality-inspection'].fallbackText }
];

function fallbackLink(index: number) {
  return ['/support/production-blending', '/support/lab-testing', '/support/quality-inspection'][index] || '/support/production-blending';
}

export function SupportDetailPage() {
  const { slug = '' } = useParams();
  const [section, setSection] = useState<ContentSection<SupportModuleData> | null>(null);

  useEffect(() => {
    getContentSections('home').then((sections) => setSection(sections.supportModule as ContentSection<SupportModuleData> | undefined || null)).catch(() => {});
  }, []);

  const tabs = section?.data.tabs?.length ? section.data.tabs : fallbackTabs;
  const tab = tabs.find((entry, index) => (entry.linkUrl || fallbackLink(index)) === `/support/${slug}`) || tabs[0] || fallbackTabs[0];
  const config = supportDetailConfigs[slug];
  const title = tab.heading || tab.title || config?.title || '生产设计与制作';
  const paragraphs = tab.sections?.[0]?.paragraphs?.length ? tab.sections[0].paragraphs : [tab.description || config?.fallbackText || '这里填写生产设计与制作详情内容，可在后台维护正文内容。'];

  return (
    <main className="gray-page legal-page about-page">
      <div className="breadcrumb container">当前位置：<Link to="/">首页</Link> › <Link to="/#support">生产设计与制作</Link> › {title}</div>
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
