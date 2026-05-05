import { useParams } from 'react-router-dom';

const benefitPlaceholders: Record<string, string> = {
  'dedicated-manager': '专属经理对接',
  'sample-delivery': '按需邮寄样品',
  'design-training': '免费设计培训',
  'display-support': '免费设计培训',
  'implementation-plan': '共建实施方案',
  'long-term-service': '建立长效机制'
};

export function BenefitDetailPage() {
  const { slug = '' } = useParams();
  const title = benefitPlaceholders[slug] || '加盟福利';

  return (
    <main className="gray-page legal-page">
      <div className="breadcrumb container">当前位置：首页 › 加盟福利 › {title}</div>
      <section className="content-card container legal-content">
        <h1>{title}</h1>
        <div className="rich-text-placeholder">
          <p>{title}富文本内容占位。</p>
          <p>客户提供正式内容后，可在此处替换为完整的福利说明、服务流程、合作细则和补充资料。</p>
        </div>
      </section>
    </main>
  );
}
