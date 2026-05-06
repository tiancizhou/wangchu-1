import { renderRichText } from '../utils/richText';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getContentSections, type ContentSection } from '../api/publicApi';

type ArticleSection = { heading?: string; paragraphs?: string[] };
type FeatureItem = { title?: string; description?: string; linkUrl?: string; sections?: ArticleSection[] };

type FeatureDetailConfig = { title: string };

const featureDetailConfigs: Record<string, FeatureDetailConfig> = {
  'brand-customization': { title: '品牌定制' },
  'additional-services': { title: '附加服务' },
  'natural-assurance': { title: '天然保障' },
  'factory-direct': { title: '工厂直供' }
};

const fallbackParagraphs = ['这里填写服务优势详情内容，可在后台“企业管理模块”的对应卡片中维护正文内容。'];

export function FeatureDetailPage() {
  const { slug = '' } = useParams();
  const config = featureDetailConfigs[slug];
  const [featureCards, setFeatureCards] = useState<FeatureItem[]>([]);

  useEffect(() => {
    getContentSections('home').then((data) => {
      const featureSection = data.featureCards as ContentSection<{ items?: FeatureItem[] }> | undefined;
      setFeatureCards(featureSection?.data.items || []);
    }).catch(() => {});
  }, []);

  const detailPath = `/features/${slug}`;
  const featureItem = config ? featureCards.find((item) => item.linkUrl === detailPath) || featureCards.find((item) => item.title === config.title) : undefined;
  const title = featureItem?.title || config?.title || '服务优势';
  const paragraphs = featureItem?.sections?.flatMap((section) => section.paragraphs || []).filter(Boolean) || fallbackParagraphs;

  return (
    <main className="gray-page legal-page about-page">
      <div className="breadcrumb container">当前位置：<Link to="/">首页</Link> › <Link to="/#support">服务优势</Link> › {title}</div>
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
