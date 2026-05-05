# 后台管理系统 UI 全面改造设计

- 日期：2026-05-05
- 项目：wangchu 官网后台
- 范围：`client/src/pages/admin/*`、`client/src/components/admin/*`、`client/src/components/layout/AdminLayout.tsx`、相关样式

## 一、背景与目标

当前后台 13 个页面存在以下问题：
1. 所有内容不分类型统一使用大卡片编辑，短文本、数字、开关也占用整卡空间。
2. 多模块页面不支持折叠，一屏塞满内容，重点不突出。
3. 大数据列表（咨询记录、产品、分类、证书）缺少搜索、筛选、拖拽排序等能力。
4. 图片上传使用原生 `input[type=file]`，没有拖拽区、没有预览遮罩、没有格式说明。
5. 反馈用散落的 `confirm()`、原生 `alert` 和简单文本提示，体验不一致。
6. 小屏适配靠手工写 media query，覆盖不全。

目标是一次性把后台改成一套统一、专业、响应式、现代浅色风格的管理界面。

## 二、技术选型

- UI 库：`antd@5`
- 图标：`@ant-design/icons`
- 拖拽排序：`@dnd-kit/core` + `@dnd-kit/sortable`
- 语言/本地化：沿用中文，`ConfigProvider` 注入 `zhCN`
- 不改动后端 API、数据模型、登录鉴权

## 三、落地策略

一次性重写（big-bang）。在单个分支内：
1. 建立主题与货架。
2. 建立共用组件。
3. 按既定顺序迁移 13 个页面。
4. 删除旧 `.admin-*` 样式和旧 `ImageUploader` / `MediaUploader` / `HomeVisualEditorPage`。
5. 手动三档宽度走查。

不保留旧后台并存期。过渡期内不部署半成品。

## 四、主题与 Token

- 主色：`#1677ff`（商业蓝）
- 成功 / 警告 / 危险：沿用 antd 默认
- 基准圆角：`10px`
- 基准字号：`14px`
- 阴影三档：Card 轻阴影、Modal 中阴影、Drawer 重阴影
- 主区域背景：`#f6f8fc` → `#eef2f8` 柔渐变
- 侧边栏背景：`#fbfcfe` 浅色
- 在 `client/src/styles/admin-theme.ts` 导出 `themeConfig`，由 `ConfigProvider` 注入
- `client/src/main.tsx` 或独立 `AdminApp.tsx` 用 `ConfigProvider` + `App` 包裹后台路由；前台路由不受 antd 影响

## 五、AdminLayout 货架

替换现有 `client/src/components/layout/AdminLayout.tsx`。

结构：`Layout` > `Sider` + (`Header` + `Content`)

- `Sider`：
  - 宽 240px，可折叠为 80px 图标栏
  - 顶部品牌区：Logo + "官网后台"
  - `Menu` 垂直显示，按以下三组收纳（`Menu.ItemGroup`）：
    - 内容编辑：页面导航、轮播图管理、企业管理模块、生产设计与制作、先进的制作工艺、关于我们、渠道合作、页脚
    - 数据管理：产品细项分类、产品编辑、荣誉资质、咨询记录
    - 系统设置：（占位）
  - 底部"退出登录"按钮
- `Header`：
  - 左侧：汉堡按钮（折叠 Sider）+ `Breadcrumb`
  - 右侧：用户头像下拉（内含"退出登录"，与底部按钮等效）
- `Content`：
  - 内边距 24px，背景渐变
  - 每个页面内部以 `PageHeader` 组件起始

## 六、共用组件

位置：`client/src/admin/components/`

### PageHeader
统一页面标题区。

属性：
- `title: string`
- `description?: string`
- `publicLocation?: string`（前台对应位置链接）
- `extra?: ReactNode`（右侧操作按钮区）

### SectionCard 与 SectionCardGroup
可折叠的大卡片。

`SectionCard` 属性：
- `title: string`
- `description?: string`
- `defaultCollapsed?: boolean`
- `status?: 'active' | 'hidden'`（右上角显示"显示中 / 已隐藏"Tag）
- `extra?: ReactNode`
- `children: ReactNode`

`SectionCardGroup` 包含多张 `SectionCard`，`mode` 可选 `accordion`（手风琴，只展开一项）或 `free`（自由展开）。默认 `accordion`。

### InlineField
短字段的行内编辑器，用于表格单元格或窄行列表。

属性：
- `label?: string`
- `value: any`
- `onChange: (value: any) => void`
- `type: 'text' | 'number' | 'switch' | 'select'`
- `placeholder?: string`
- `options?: { label: string; value: any }[]`（select 类型使用）
- `status?: 'error' | 'warning'`
- `message?: string`

内部使用 antd `Input` / `InputNumber` / `Switch` / `Select`。

### DraggableList
基于 `@dnd-kit/sortable` 的拖拽排序容器。

属性：
- `items: T[]`
- `getItemId: (item: T) => string`
- `onReorder: (items: T[]) => void`
- `renderItem: (item: T, index: number, dragHandleProps: DragHandleProps) => ReactNode`

每项左侧自带拖拽手柄图标。`onReorder` 回调后由页面自行调用保存 API，并由 `FormFeedback` 弹 Toast。

### SearchableTable
antd `Table` 的轻封装。

属性：
- `columns: ColumnsType<T>`
- `data: T[]`
- `rowKey: string`
- `searchableKeys?: (keyof T)[]`（顶部搜索框模糊匹配的字段）
- `filters?: FilterConfig[]`（顶部筛选条件）
- `pagination?: boolean | PaginationConfig`
- `empty?: ReactNode`

小屏 `<768px` 自动回退到 antd `List` 渲染，每行显示"主字段 + 次要字段折叠"。

### Dropzone 与 MediaDropzone

`Dropzone` 用于图片，`MediaDropzone` 用于图片+视频。

属性：
- `value?: string`
- `onChange: (url: string) => void`
- `multiple?: boolean`
- `onMultipleChange?: (urls: string[]) => void`
- `accept?: string`
- `maxSize?: number`（字节，默认图片 10MB、视频 80MB）

行为：
- 空态：虚线描边 + 图标 + 主文案"拖拽上传或点击选择文件" + 副文案"支持 JPG/PNG/WebP/GIF，单张 ≤ 10MB"
- 拖拽进入：主色边框 + 浅蓝背景
- 上传中：进度条遮罩
- 上传成功：缩略图；鼠标悬浮浮出"替换 / 移除"
- 多图模式：上传后追加到下方网格；每张图可单独移除；顶部按钮"继续上传"
- 超出大小或格式不符：直接 `message.error` 拒绝，不发请求

外壳使用 antd `Upload.Dragger`，内部仍调用现有 `uploadImage` API。

### FormFeedback
统一的反馈层。

导出 hooks：
- `useFormFeedback()` 返回 `{ notifySuccess, notifyError, setDirty, renderStatusBar }`
- `notifySuccess(text)`：`message.success`
- `notifyError(text)`：`message.error`
- `setDirty(flag)`：控制"未保存改动 / 当前内容已保存"状态条
- `renderStatusBar()`：返回挂载在页面底部的状态条 JSX

### ConfirmButton
带二次确认的操作按钮。

属性：
- `onConfirm: () => void | Promise<void>`
- `title?: string`（确认文案，默认"确定执行这个操作吗？"）
- `danger?: boolean`
- `children: ReactNode`

基于 antd `Popconfirm` + `Button`。

## 七、页面布局分配

| 页面 | 主组件 | 说明 |
|---|---|---|
| Dashboard | 三组分组卡片网格 | 按侧边栏三组分类呈现跳转入口 |
| 页面导航 | SearchableTable with draggable rows | 字段：名称、URL、显示状态、排序；行可拖拽重排，顺序即时写回 |
| 轮播图管理 | MediaDropzone 上传区 + DraggableList 网格 | 每张素材：缩略图 + 排序开关 + 显示开关 + 删除 |
| 企业管理模块 | DraggableList of SectionCard | 每张卡片可折叠，展开含标题、说明、图标、跳转链接 |
| 生产设计与制作 | SectionCardGroup（accordion） | 每个 tab 一张卡片，展开含 Dropzone 主图 + Dropzone 多图轮播 + 文字 |
| 先进的制作工艺 | Dropzone（背景图，顶部独立）+ SectionCardGroup | 项目卡片左右分列：左文字、右图 |
| 产品细项分类 | 左 DraggableList（分类列表）+ 右 SectionCard（详情） | 列表支持行内改名、显示开关；详情卡片含封面 Dropzone |
| 关于我们 | 单张 SectionCard | 公司简介长文本 + 展示图片 + 跳转 URL |
| 渠道合作 | SectionCard（顾问信息）+ SearchableTable（行业选项） | 行业选项用表格，支持增删与拖排 |
| 荣誉资质 | Dropzone（侧边图）+ Dropzone 多选（批量上传）+ DraggableList 网格 | 每张证书：缩略图 + 排序 + 显示开关 + 删除 |
| 页脚 | SectionCardGroup（accordion，四张卡片） | 公司信息、联系方式、友链、备案分块 |
| 产品编辑 | 列表页 SearchableTable + 编辑页 SectionCardGroup | 列表含搜索、筛选分类、排序、分页；编辑页分"基础 / 图片 / 规格 / 描述"四卡片 |
| 咨询记录 | SearchableTable + Drawer 处理抽屉 | 点"处理"从右侧滑出 Drawer 编辑状态与备注 |

### 折叠策略
- 多模块页面（企业管理模块、生产设计与制作、先进的制作工艺、页脚）：默认手风琴全折叠，只展开当前选中项。
- 大量同类卡片页面（荣誉资质、轮播图、产品细项分类）：不折叠。
- 关于我们等单模块页面：不折叠。

## 八、响应式

断点沿用 antd 默认（`xs < 576`、`sm 576`、`md 768`、`lg 992`、`xl 1200`、`xxl 1600`）。

| 宽度 | Sider | 页面布局 | 表格 | Dropzone |
|---|---|---|---|---|
| ≥1200px | 常驻 240px 展开 | 两栏并排 | 全列 | 全高 |
| 768–1199px | 自动折叠图标栏，可点开为抽屉 | 上下堆叠 | 横向滚动 | 压缩高度 |
| <768px | 隐藏，汉堡菜单打开 Drawer | 全纵向 | 回退为 `List` | 以点击为主，保留拖拽区 |

## 九、交互细节

### 上传
- 所有 Dropzone 三态清晰：空态 / 拖拽悬停 / 已上传。
- 格式 / 大小提示直接写在空态文案下方。
- 前端拦截超限文件，不发请求。
- 多图场景上传后立即追加并弹 `message.success('已上传 N 张')`。

### 校验
- 所有编辑表单改用 antd `Form`，`rules` 声明必填、URL、长度。
- 字段级错误即时显示在输入框下方。
- 保存按钮在 `dirty` 时主色 `type="primary"`，否则 `type="default"`。

### 反馈
- 成功：`message.success` + 底部状态条"当前内容已保存"。
- 失败：`message.error` + 字段级高亮；网络错误附重试按钮。
- 删除：`Popconfirm` 二次确认 + 成功 `message.success`。
- 全局 `message` 通过 antd `App` 组件挂载，保证在 `ConfigProvider` 内。

### 按钮层级
- 主操作（保存、新建）：`type="primary"`。
- 次级操作（取消、重置、查看）：`type="default"`。
- 危险操作（删除、清空）：`danger`。
- 图标按钮（拖拽手柄、折叠箭头）：`type="text"`。

## 十、开发顺序

1. 安装依赖；配置 `ConfigProvider`、`App`、主题 token。
2. 清理 `globals.css` 中 `.admin-*` 样式。
3. 新 `AdminLayout`（Sider / Header / Breadcrumb / Menu 分组）。
4. 共用组件依次实现：`PageHeader` → `SectionCard` + `SectionCardGroup` → `Dropzone` + `MediaDropzone` → `InlineField` → `DraggableList` → `SearchableTable` → `FormFeedback` + `ConfirmButton`。
5. 页面迁移顺序：Dashboard → 页面导航 → 轮播图 → 荣誉资质 → 分类 → 咨询记录 → 产品列表 + 编辑 → 企业管理 + 生产设计 + 工艺 + 关于我们 → 渠道合作 → 页脚。
6. 删除旧文件：旧 `client/src/components/admin/ImageUploader.tsx`、旧 `client/src/components/admin/MediaUploader.tsx`、`client/src/pages/admin/HomeVisualEditorPage.tsx`、其在 `App.tsx` 的路由注册、`globals.css` 中所有 `.admin-*` / `.content-*` / `.banner-*` / `.certificate-*` / `.category-*` / `.dashboard-*` / `.page-*` / `.section-*` / `.simple-*` / `.image-uploader` / `.upload-placeholder` / `.inline-editor` 相关样式块。
7. 手动走查：1440、900、390 三档宽度，过 13 个页面。

## 十一、范围边界

不做：
- 后端 API / 数据模型改动。
- 国际化切换。
- 暗色模式。
- 前端路由级权限控制。
- 可视化同页编辑（`HomeVisualEditorPage` 直接删除）。

## 十二、验收

- 13 个页面在桌面、平板、手机三档宽度下均可用。
- 所有图片上传区支持拖拽并提供文案提示。
- 多模块页面默认折叠，单击展开。
- 列表页支持搜索（咨询记录、产品、页面导航）。
- 拖拽排序生效（轮播图、荣誉资质、分类、页面导航、企业管理卡片）。
- 所有删除操作改用 `Popconfirm` 二次确认。
- 所有保存/失败反馈通过 `message` 全局呈现。
- 无 `confirm()` / `alert()` 原生弹窗残留。
