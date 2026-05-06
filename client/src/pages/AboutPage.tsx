import { renderRichText } from '../utils/richText';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHomeData, type ContentSection, type HomeData } from '../api/publicApi';

type AboutData = { imageUrl?: string; body?: string };

const fallbackBody = '桔尔润（北京）润滑油有限公司专注润滑油产品研发、生产与渠道服务。公司围绕汽车润滑、工业润滑和特种油品场景，为客户提供稳定可靠的产品和合作支持。';

function splitParagraphs(value: string) {
  return value.split(/\n+/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

export function AboutPage() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);

  useEffect(() => {
    getHomeData().then(setHomeData).catch(() => {});
  }, []);

  const section = homeData?.sections.aboutPreview as ContentSection<AboutData> | undefined;
  const data = section?.data;
  const title = section?.title || '关于我们';
  const paragraphs = splitParagraphs(data?.body || fallbackBody);

  return (
    <main className="gray-page legal-page about-page">
      <div className="breadcrumb container">当前位置：<Link to="/">首页</Link> › {title}</div>
      <section className="content-card container legal-content about-content">
        <article className="rich-text-placeholder legal-statement-document about-rich-text">
          <h1>{title}</h1>
          {data?.imageUrl && <img className="about-page-image" src={data.imageUrl} alt={title} />}
          <section className="about-statement-section">
            {paragraphs.map((paragraph) => <p key={paragraph}>{renderRichText(paragraph)}</p>)}
          </section>
        </article>
      </section>
    </main>
  );
}
