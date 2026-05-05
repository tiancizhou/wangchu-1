import { Link, useParams } from 'react-router-dom';
import { ContentSectionsAdminPage, type ContentSectionEditorConfig } from './ContentSectionsAdminPage';

type PageTool = { title: string; description: string; to: string; action: string };
type PageEditorConfig = {
  title: string;
  publicLocation: string;
  description: string;
  tools: PageTool[];
  contentConfig?: ContentSectionEditorConfig;
};

const pageConfigs: Record<string, PageEditorConfig> = {
  home: {
    title: '首页',
    publicLocation: '/',
    description: '管理网站首页的轮播图、服务优势、产品细项分类、荣誉资质、生产设计、制作工艺和关于我们预览内容。',
    tools: [
      { title: '首页轮播图', description: '上传和排序首页顶部的大图轮播。', to: '/admin/banners', action: '进入轮播图管理' },
      { title: '产品细项分类', description: '首页产品细项分类读取产品分类；在这里维护分类名称、图片、说明和排序。', to: '/admin/categories', action: '进入分类管理' },
      { title: '荣誉资质', description: '首页荣誉资质读取证书数据；在这里上传资质图片、标题和排序。', to: '/admin/certificates', action: '进入荣誉资质' },
      { title: '基础信息', description: '维护公司名称、Logo、联系电话和页脚信息。', to: '/admin/site', action: '进入基础信息' }
    ],
    contentConfig: {
      pageKey: 'home',
      title: '首页内容模块',
      description: '选择首页上的一个模块进行文字、图片和显示状态编辑。',
      editableKeys: ['featureCards', 'supportModule', 'processModule', 'aboutPreview'],
      moduleHelp: {
        featureCards: '显示在首页顶部服务优势区域，建议保持 4 个卡片。产品细项分类请点击上方“产品细项分类”进入分类管理；荣誉资质请点击上方“荣誉资质”进入证书管理。',
        supportModule: '显示在“生产设计与制作”区域，用于介绍生产、检测、检验能力。',
        processModule: '显示在首页深色工艺区域，用于介绍制作工艺和设备能力。',
        aboutPreview: '显示在首页“关于我们”区域，用于展示公司简介和图片。'
      },
      saveSuccessText: '首页内容已保存',
      saveButtonText: '保存首页内容'
    }
  },
  enterprise: {
    title: '企业管理模块',
    publicLocation: '/',
    description: '编辑首页企业管理模块中的 4 张卡片，填写标题和说明即可。',
    tools: [],
    contentConfig: {
      pageKey: 'home',
      title: '企业管理模块',
      description: '每张卡片只需要填写标题和说明，保存后会同步到首页。',
      editableKeys: ['featureCards'],
      moduleHelp: {
        featureCards: '显示在首页企业管理模块区域，建议保持 4 个卡片。'
      },
      loadingText: '企业管理模块加载中...',
      saveSuccessText: '企业管理模块已保存',
      saveButtonText: '保存企业管理模块',
      hideModuleSelector: true,
      hidePublishSwitch: true,
      hideBaseSettings: true,
      featureCardsEditorMode: 'simpleEnterprise'
    }
  },
  products: {
    title: '产品中心',
    publicLocation: '/products',
    description: '管理产品分类、产品列表，以及产品中心页面上的加盟优势和福利内容。',
    tools: [
      { title: '产品管理', description: '新增、编辑和隐藏网站展示的产品。', to: '/admin/products', action: '进入产品管理' },
      { title: '产品分类', description: '维护产品中心左侧分类和分类图片。', to: '/admin/categories', action: '进入分类管理' }
    ],
    contentConfig: {
      pageKey: 'products',
      title: '产品中心页面内容',
      description: '编辑产品中心页面中的合作优势和加盟福利内容。',
      editableKeys: ['advantages', 'benefits'],
      moduleHelp: {
        advantages: '显示在产品中心的加盟优势区域。',
        benefits: '显示在产品中心的加盟福利区域。'
      },
      loadingText: '产品中心内容加载中...',
      emptyText: '还没有产品中心内容模块，请先运行初始化数据。',
      saveSuccessText: '产品中心内容已保存',
      saveButtonText: '保存产品中心内容'
    }
  },
  support: {
    title: '生产设计与制作',
    publicLocation: '/#support',
    description: '编辑首页“生产设计与制作”模块中的栏目、主图、说明和底部轮播图片。',
    tools: [],
    contentConfig: {
      pageKey: 'home',
      title: '生产设计与制作',
      description: '编辑首页“生产设计与制作”模块中的栏目、主图、说明和底部轮播图片。',
      editableKeys: ['supportModule'],
      moduleHelp: {
        supportModule: '显示在“生产设计与制作”区域，用于介绍生产、检测、检验能力。'
      },
      loadingText: '生产设计与制作加载中...',
      saveSuccessText: '生产设计与制作已保存',
      saveButtonText: '保存生产设计与制作'
    }
  },
  process: {
    title: '先进的制作工艺',
    publicLocation: '/#process',
    description: '编辑首页先进的制作工艺区域的背景图、工艺项目和说明文字。',
    tools: [],
    contentConfig: {
      pageKey: 'home',
      title: '先进的制作工艺',
      description: '编辑首页先进的制作工艺模块中的背景图、项目图片、标题和说明。',
      editableKeys: ['processModule'],
      moduleHelp: {
        processModule: '显示在首页“先进的制作工艺”区域，用于介绍制作工艺和设备能力。'
      },
      loadingText: '先进的制作工艺加载中...',
      saveSuccessText: '先进的制作工艺已保存',
      saveButtonText: '保存先进的制作工艺'
    }
  },
  consult: {
    title: '渠道合作',
    publicLocation: '/consult',
    description: '管理渠道合作咨询页的顾问信息、行业选项，并查看客户提交的咨询记录。',
    tools: [
      { title: '咨询记录', description: '查看客户提交的合作咨询，并记录跟进状态。', to: '/admin/consultations', action: '进入咨询记录' }
    ],
    contentConfig: {
      pageKey: 'consult',
      title: '渠道合作页面内容',
      description: '编辑渠道合作页中引导客户咨询的顾问信息和行业选项。',
      editableKeys: ['contactPanel'],
      moduleHelp: {
        contactPanel: '显示在渠道合作咨询页的顾问信息区域，并配置“所处行业”下拉选项。'
      },
      loadingText: '渠道合作内容加载中...',
      emptyText: '还没有渠道合作内容模块，请先运行初始化数据。',
      saveSuccessText: '渠道合作内容已保存',
      saveButtonText: '保存渠道合作内容'
    }
  },
  about: {
    title: '关于我们',
    publicLocation: '/#about、/certificates',
    description: '管理首页关于我们简介、公司基础信息和荣誉资质内容。',
    tools: [
      { title: '荣誉资质', description: '上传和维护网站展示的证书、资质和荣誉图片。', to: '/admin/certificates', action: '进入荣誉资质' },
      { title: '基础信息', description: '维护公司名称、Logo、联系方式和页脚文案。', to: '/admin/site', action: '进入基础信息' }
    ],
    contentConfig: {
      pageKey: 'home',
      title: '关于我们',
      description: '编辑首页“关于我们”区域的公司简介和展示图片。',
      editableKeys: ['aboutPreview'],
      moduleHelp: {
        aboutPreview: '显示在首页“关于我们”区域，用于展示公司简介和图片。'
      },
      loadingText: '关于我们内容加载中...',
      saveSuccessText: '关于我们内容已保存',
      saveButtonText: '保存关于我们内容'
    }
  }
};

export function PageEditorAdminPage() {
  const { page = 'home' } = useParams();
  const config = pageConfigs[page] || pageConfigs.home;

  return (
    <div className="admin-page-editor">
      <section className="admin-panel page-editor-hero">
        <div className="admin-title-block">
          <span className="page-editor-label">网站页面</span>
          <h1>{config.title}</h1>
          <p>{config.description}</p>
          <small>前台位置：{config.publicLocation}</small>
        </div>
      </section>

      {config.tools.length > 0 && (
        <section className="page-tool-grid">
          {config.tools.map((tool) => <article className="page-tool-card" key={tool.to}><h2>{tool.title}</h2><p>{tool.description}</p><Link to={tool.to}>{tool.action}</Link></article>)}
        </section>
      )}

      {config.contentConfig && <ContentSectionsAdminPage config={config.contentConfig} />}
    </div>
  );
}
