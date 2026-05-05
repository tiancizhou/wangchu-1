export const benefitDetailTitles: Record<string, string> = {
  'dedicated-manager': '专属经理对接',
  'sample-delivery': '按需邮寄样品',
  'design-training': '免费设计培训',
  'display-support': '免费设计培训',
  'implementation-plan': '共建实施方案',
  'long-term-service': '建立长效机制'
};

export const benefitA4Layout = {
  pageSize: {
    width: '210mm',
    minHeight: '297mm'
  },
  padding: {
    top: '37mm',
    right: '26mm',
    bottom: '35mm',
    left: '28mm'
  },
  body: {
    lineCount: 22,
    charactersPerLine: 28,
    textIndent: '2em',
    textAlign: 'justify'
  }
} as const;
