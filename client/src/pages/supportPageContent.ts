const heroSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="500" viewBox="0 0 1200 500"><defs><linearGradient id="bg" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#f7fbfd"/><stop offset="0.5" stop-color="#e7f7fb"/><stop offset="1" stop-color="#f7fbfd"/></linearGradient><pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="2" fill="#71c8df" opacity="0.7"/></pattern></defs><rect width="1200" height="500" fill="url(#bg)"/><rect x="430" y="30" width="340" height="340" fill="url(#dots)"/><g fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="600" cy="230" r="122" stroke="#0b6f9e" stroke-width="28"/><circle cx="600" cy="230" r="78" stroke="#0f2f58" stroke-width="34"/><circle cx="600" cy="230" r="156" stroke="#f5a900" stroke-width="3"/><path d="M70 170h180l44 42h145M1130 170H950l-44 42H761M90 310h150l54-54h128M1110 310H960l-54-54H778" stroke="#68bfdb" stroke-width="3"/><path d="M260 250h225M715 250h225M600 55v115M600 290v115" stroke="#0b6f9e" stroke-width="5"/><path d="M530 70l35 110M670 70l-35 110M530 390l35-110M670 390l-35-110" stroke="#f5a900" stroke-width="4"/><path d="M365 120l-30 24 30 24M835 120l30 24-30 24M315 335l-34-24 34-24M885 335l34-24-34-24" stroke="#444" stroke-width="8"/><g stroke="#0b6f9e" stroke-width="2" opacity="0.75"><path d="M0 210h210M990 210h210M0 265h260M940 265h260"/><circle cx="255" cy="210" r="5"/><circle cx="945" cy="210" r="5"/><circle cx="300" cy="265" r="5"/><circle cx="900" cy="265" r="5"/></g></g><g fill="#0b6f9e" opacity="0.9"><circle cx="385" cy="120" r="9"/><circle cx="815" cy="120" r="9"/><circle cx="385" cy="340" r="9"/><circle cx="815" cy="340" r="9"/></g></svg>`;

export const heroImageUrl = `data:image/svg+xml;utf8,${encodeURIComponent(heroSvg)}`;

export type SupportCenter = { title: string; description: string };
export type TechnicalColumn = { title: string; description: string };
export type ServiceStation = { station: string; contact: string; phone: string; address: string; areas: string };
export type SupportPageContent = {
  heroImageUrl?: string;
  centers?: Partial<SupportCenter>[];
  technicalColumns?: Partial<TechnicalColumn>[];
  serviceStations?: Partial<ServiceStation>[];
};

export const supportCenters: SupportCenter[] = [
  {
    title: '研发中心',
    description: '研发中心围绕润滑油产品应用场景，持续开展配方研究、性能验证和工艺优化，为客户提供从产品选型到技术应用的系统支持，帮助产品在不同设备和工况下保持稳定表现。'
  },
  {
    title: '质量中心',
    description: '质量中心建立覆盖原料、生产过程和成品交付的检测体系，通过标准化检验流程、数据记录和结果复核，持续保障产品质量稳定，为客户使用与售后服务提供可靠依据。'
  }
];

export const technicalColumns: TechnicalColumn[] = [
  { title: '辅料化验', description: '针对基础油、添加剂及相关辅料开展入厂化验，核对关键指标与适用范围，确保进入生产环节的原辅料满足配方和质量要求。' },
  { title: '结构解析', description: '结合产品性能目标与应用环境，分析配方结构、材料匹配和性能表现，为研发调整、产品升级和客户技术沟通提供依据。' },
  { title: '调和工艺', description: '根据不同产品类型制定调和温度、时间、顺序和过程控制要求，提升生产一致性，保障产品性能稳定释放并便于过程复核。' },
  { title: '标准制定', description: '围绕企业标准、检测规范和交付要求建立统一文件体系，使研发、生产、检测和售后环节具备清晰可执行的质量依据。' },
  { title: '产品封装', description: '对产品包装、标识、批次和入库流程进行规范管理，确保交付形象统一、信息准确，并便于后续追踪、复盘与服务。' },
  { title: '三方原则', description: '坚持客户需求、技术标准和质量验证三方协同，重要问题以数据和记录为依据，保证沟通透明、执行可追溯和复核。' }
];

export const serviceStations: ServiceStation[] = [
  { station: '华北服务站', contact: '王皓', phone: '0519-88865190', address: '北京市大兴区科创五街38号院305', areas: '北京、天津、河北、山西、内蒙古' },
  { station: '东北服务站', contact: '王皓', phone: '0519-88865190', address: '北京市大兴区科创五街38号院305', areas: '辽宁、吉林、黑龙江' },
  { station: '华东服务站', contact: '王皓', phone: '0519-88865190', address: '北京市大兴区科创五街38号院305', areas: '上海、江苏、浙江、安徽、福建、江西、山东' },
  { station: '华中服务站', contact: '王皓', phone: '0519-88865190', address: '北京市大兴区科创五街38号院305', areas: '河南、湖北、湖南' },
  { station: '华南服务站', contact: '王皓', phone: '0519-88865190', address: '北京市大兴区科创五街38号院305', areas: '广东、广西、海南' },
  { station: '西南服务站', contact: '王皓', phone: '0519-88865190', address: '北京市大兴区科创五街38号院305', areas: '重庆、四川、贵州、云南、西藏' },
  { station: '西北服务站', contact: '王皓', phone: '0519-88865190', address: '北京市大兴区科创五街38号院305', areas: '陕西、甘肃、青海、宁夏、新疆' }
];

export function getSupportPageContent(data?: SupportPageContent) {
  return {
    heroImageUrl: data?.heroImageUrl || heroImageUrl,
    centers: supportCenters.map((fallback, index) => ({ ...fallback, ...(data?.centers?.[index] || {}) })),
    technicalColumns: technicalColumns.map((fallback, index) => ({ ...fallback, ...(data?.technicalColumns?.[index] || {}) })),
    serviceStations: serviceStations.map((fallback, index) => ({ ...fallback, ...(data?.serviceStations?.[index] || {}) }))
  };
}
