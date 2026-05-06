import { renderRichText } from '../utils/richText';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getContentSections, type ContentSection } from '../api/publicApi';
import { legalStatementContent, type LegalStatementSection } from './legalStatementContent';

type LegalStatementData = { sections?: LegalStatementSection[] };

export function LegalPage() {
  const [section, setSection] = useState<ContentSection<LegalStatementData> | null>(null);

  useEffect(() => {
    let cancelled = false;

    getContentSections('legal')
      .then((sections) => {
        if (!cancelled) setSection(sections.legalStatement as ContentSection<LegalStatementData> | undefined || null);
      })
      .catch(() => {
        if (!cancelled) setSection(null);
      });

    return () => { cancelled = true; };
  }, []);

  const title = legalStatementContent.title;
  const paragraphs = section?.data.sections?.flatMap((item) => item.paragraphs || []).filter(Boolean) || legalStatementContent.sections.flatMap((item) => item.paragraphs || []).filter(Boolean);

  return (
    <main className="gray-page legal-page about-page">
      <div className="breadcrumb container">当前位置：<Link to="/">首页</Link> › 法律声明</div>
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
