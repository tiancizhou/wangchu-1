import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Typography } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '../../admin/components';
import { ContentSectionsAdminPage, type ContentSectionEditorConfig } from './ContentSectionsAdminPage';

type PageTool = { title: string; description: string; to: string; action: string };
type PageEditorConfig = {
  title: string;
  publicLocation: string;
  description: string;
  tools: PageTool[];
  contentConfig?: ContentSectionEditorConfig;
  hideHeroDetails?: boolean;
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
      editableKeys: ['featureCards', 'supportModule', 'processModule', 'aboutPreview', 'certificatePreview'],
      moduleHelp: {
        featureCards: '显示在首页顶部服务优势区域，建议保持 4 个卡片。产品细项分类请点击上方”产品细项分类”进入分类管理；荣誉资质请点击上方”荣誉资质”进入证书管理。',
        supportModule: '显示在”生产设计与制作”区域，用于介绍生产、检测、检验能力。',
        processModule: '显示在首页深色工艺区域，用于介绍制作工艺和设备能力。',
        aboutPreview: '显示在首页”关于我们”区域，用于展示公司简介和图片。',
        certificatePreview: '显示在首页”荣誉资质”区域。荣誉资质图片请在”荣誉资质”管理中上传。'
      },
      saveSuccessText: '首页内容已保存',
      saveButtonText: '保存首页内容'
    }
  },
  enterprise: {
    title: '企业管理模块',
    publicLocation: '/',
    description: '',
    tools: [],
    hideHeroDetails: true,
    contentConfig: {
      pageKey: 'home',
      title: '企业管理模块',
      description: '',
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
      hidePageChrome: true,
      hideEditorHeader: true,
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
    description: '',
    tools: [],
    hideHeroDetails: true,
    contentConfig: {
      pageKey: 'home',
      title: '生产设计与制作',
      description: '',
      editableKeys: ['supportModule'],
      moduleHelp: {
        supportModule: '显示在“生产设计与制作”区域，用于介绍生产、检测、检验能力，并在每个栏目内维护立即查看详情正文。'
      },
      loadingText: '生产设计与制作加载中...',
      saveSuccessText: '生产设计与制作已保存',
      saveButtonText: '保存生产设计与制作',
      hideModuleSelector: true,
      hidePublishSwitch: true,
      hideBaseSettings: false,
      hidePageChrome: true,
      hideEditorHeader: true
    }
  },
  'support-secondary': {
    title: '技术支持二级页面',
    publicLocation: '/support',
    description: '',
    tools: [],
    hideHeroDetails: true,
    contentConfig: {
      pageKey: 'support',
      title: '技术支持二级页面',
      description: '',
      editableKeys: ['supportPage'],
      moduleHelp: {
        supportPage: '显示在前台“技术支持”二级页面，用于维护顶部图、技术支持表格和售后服务站。'
      },
      loadingText: '技术支持二级页面加载中...',
      emptyText: '还没有技术支持二级页面内容，请先运行初始化数据。',
      saveSuccessText: '技术支持二级页面已保存',
      saveButtonText: '保存技术支持二级页面',
      hideModuleSelector: true,
      hidePublishSwitch: true,
      hideBaseSettings: false,
      hidePageChrome: true,
      hideEditorHeader: true
    }
  },
  process: {
    title: '先进的制作工艺',
    publicLocation: '/#process',
    description: '',
    tools: [],
    hideHeroDetails: true,
    contentConfig: {
      pageKey: 'home',
      title: '先进的制作工艺',
      description: '',
      editableKeys: ['processModule'],
      moduleHelp: {
        processModule: '显示在首页“先进的制作工艺”区域，用于介绍制作工艺和设备能力。'
      },
      loadingText: '先进的制作工艺加载中...',
      saveSuccessText: '先进的制作工艺已保存',
      saveButtonText: '保存先进的制作工艺',
      hideModuleSelector: true,
      hidePublishSwitch: true,
      hideBaseSettings: false,
      hidePageChrome: true,
      hideEditorHeader: true
    }
  },
  consult: {
    title: '渠道合作',
    publicLocation: '/consult',
    description: '管理渠道合作咨询页的顾问信息、按钮文案、行业选项，并查看客户提交的咨询记录。',
    tools: [],
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
      saveButtonText: '保存渠道合作内容',
      hideModuleSelector: true,
      hideBaseSettings: true,
      hideEditorHeader: true,
      hidePageChrome: true
    }
  },
  legal: {
    title: '法律声明',
    publicLocation: '/legal',
    description: '管理法律声明页面正文内容，前台保持法律文档固定版式。',
    tools: [],
    contentConfig: {
      pageKey: 'legal',
      title: '法律声明页面内容',
      description: '编辑法律声明页面正文内容。',
      editableKeys: ['legalStatement'],
      moduleHelp: {
        legalStatement: '显示在法律声明页面正文区域。'
      },
      loadingText: '法律声明内容加载中...',
      emptyText: '还没有法律声明内容模块，请先运行初始化数据。',
      saveSuccessText: '法律声明内容已保存',
      saveButtonText: '保存法律声明内容',
      hideModuleSelector: true,
      hideBaseSettings: true,
      hideEditorHeader: true,
      hidePageChrome: true
    }
  },
  contact: {
    title: '联系我们',
    publicLocation: '/contact',
    description: '管理联系我们页面的地图图片、地址、电话、邮箱等联系信息。',
    tools: [],
    contentConfig: {
      pageKey: 'contact',
      title: '联系我们页面内容',
      description: '编辑联系我们页面左侧联系信息和右侧地图图片。',
      editableKeys: ['contactInfo'],
      moduleHelp: {
        contactInfo: '显示在联系我们页面的公司名称、地址、电话、邮箱和地图图片。'
      },
      loadingText: '联系我们内容加载中...',
      emptyText: '还没有联系我们内容模块，请先运行初始化数据。',
      saveSuccessText: '联系我们内容已保存',
      saveButtonText: '保存联系我们内容',
      hideModuleSelector: true,
      hideBaseSettings: true,
      hideEditorHeader: true,
      hidePageChrome: true
    }
  },
  about: {
    title: '关于我们',
    publicLocation: '/#about、/certificates',
    description: '',
    tools: [],
    hideHeroDetails: true,
    contentConfig: {
      pageKey: 'home',
      title: '关于我们',
      description: '',
      editableKeys: ['aboutPreview'],
      moduleHelp: {
        aboutPreview: '显示在首页“关于我们”区域，用于展示公司简介和图片。'
      },
      loadingText: '关于我们内容加载中...',
      saveSuccessText: '关于我们内容已保存',
      saveButtonText: '保存关于我们内容',
      hideModuleSelector: true,
      hidePublishSwitch: true,
      hideBaseSettings: true,
      hidePageChrome: true,
      hideEditorHeader: true
    }
  }
};

export function PageEditorAdminPage() {
  const { page = 'home' } = useParams();
  const config = pageConfigs[page] || pageConfigs.home;

  return (
    <div>
      <PageHeader title={config.title} description={config.hideHeroDetails ? undefined : config.description} publicLocation={config.hideHeroDetails ? undefined : config.publicLocation} />
      {config.tools.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          {config.tools.map((tool) => (
            <Col xs={24} md={12} xl={6} key={tool.to}>
              <Card hoverable style={{ height: '100%' }}>
                <Space direction="vertical" size={12} style={{ height: '100%', justifyContent: 'space-between' }}>
                  <div>
                    <Typography.Title level={5} style={{ marginTop: 0 }}>{tool.title}</Typography.Title>
                    <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>{tool.description}</Typography.Paragraph>
                  </div>
                  <Link to={tool.to}><Button type="primary" icon={<ArrowRightOutlined />}>{tool.action}</Button></Link>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      {config.contentConfig && <ContentSectionsAdminPage config={config.contentConfig} />}
    </div>
  );
}
