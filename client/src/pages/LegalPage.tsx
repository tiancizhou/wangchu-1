import { legalStatementContent } from './legalStatementContent';

export function LegalPage() {
  return (
    <main className="gray-page legal-page">
      <div className="breadcrumb container">当前位置：首页 › 法律声明</div>
      <section className="content-card container legal-content">
        <h1>{legalStatementContent.title}</h1>
        <article className="rich-text-placeholder legal-statement-document">
          {legalStatementContent.sections.map((section) => (
            <section className="legal-statement-section" key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
        </article>
      </section>
    </main>
  );
}
