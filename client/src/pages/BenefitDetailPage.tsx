import { Link, useParams } from 'react-router-dom';
import { benefitDetailTitles, benefitRichTextLayout } from './benefitA4Layout';

export function BenefitDetailPage() {
  const { slug = '' } = useParams();
  const title = benefitDetailTitles[slug] || '加盟福利';

  return (
    <main className="gray-page legal-page about-page">
      <div className="breadcrumb container">当前位置：<Link to="/">首页</Link> › <Link to="/products">加盟福利</Link> › {title}</div>
      <section className={benefitRichTextLayout.containerClassName}>
        <article className={benefitRichTextLayout.articleClassName}>
          <h1>{title}</h1>
          <section className={benefitRichTextLayout.bodyClassName}>
            <p>{title}富文本内容占位。后续客户提供正式内容后，将在此处替换为完整的福利说明、服务流程、合作细则和补充资料。</p>
            <p>当前页面使用与首页模块一致的内容宽度展示，标题居中，正文自然段首行缩进两个汉字位置，并采用两端对齐方式展示。</p>
          </section>
        </article>
      </section>
    </main>
  );
}
