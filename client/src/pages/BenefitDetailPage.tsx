import { useParams } from 'react-router-dom';
import { benefitA4Layout, benefitDetailTitles } from './benefitA4Layout';

export function BenefitDetailPage() {
  const { slug = '' } = useParams();
  const title = benefitDetailTitles[slug] || '加盟福利';

  return (
    <main className="gray-page legal-page">
      <div className="breadcrumb container">当前位置：首页 › 加盟福利 › {title}</div>
      <section className="benefit-a4-page" style={{
        width: benefitA4Layout.pageSize.width,
        minHeight: benefitA4Layout.pageSize.minHeight,
        padding: `${benefitA4Layout.padding.top} ${benefitA4Layout.padding.right} ${benefitA4Layout.padding.bottom} ${benefitA4Layout.padding.left}`
      }}>
        <h1>{title}</h1>
        <article className="benefit-a4-body" style={{ textIndent: benefitA4Layout.body.textIndent, textAlign: benefitA4Layout.body.textAlign }}>
          <p>{title}富文本内容占位。后续客户提供正式内容后，将在此处替换为完整的福利说明、服务流程、合作细则和补充资料。</p>
          <p>当前页面按 A4 纸张尺寸预留，版心参考每面二十二行、每行二十八字的排版要求，正文自然段首行缩进两个汉字位置，并采用两端对齐方式展示。</p>
        </article>
      </section>
    </main>
  );
}
