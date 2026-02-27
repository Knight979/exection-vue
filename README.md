# 信贷催收案件管理系统

## 项目概述

信贷催收案件管理系统是一个面向催收团队的企业级Web应用前端项目,帮助催收人员高效管理案件、跟进客户、记录沟通过程,并为管理层提供数据分析和决策支持。

## 技术栈

- **前端框架**: Vue 3 (Composition API + `<script setup>`)
- **开发语言**: TypeScript
- **构建工具**: Vite
- **UI组件库**: Element Plus (主题色: #3A8EE6)
- **状态管理**: Pinia
- **路由管理**: Vue Router 4
- **HTTP客户端**: Axios
- **图表库**: ECharts
- **日期处理**: Day.js
- **表格处理**: SheetJS (xlsx)

## 项目结构

```
src/
├── api/                    # API接口层
│   ├── request.ts         # Axios配置
│   ├── auth.ts           # 认证API
│   ├── dashboard.ts      # 首页统计API
│   ├── case.ts           # 案件API
│   ├── workOrder.ts      # 工单API
│   └── checkApply.ts     # 对账申请API
├── assets/                # 资源文件
│   └── styles/           # 全局样式
├── components/            # 组件
│   ├── common/           # 通用组件
│   └── business/         # 业务组件
├── composables/           # 组合式函数
├── directives/            # 自定义指令
├── layouts/               # 布局组件
│   └── DefaultLayout.vue # 默认布局
├── router/                # 路由配置
│   ├── index.ts          # 路由实例
│   ├── routes.ts         # 路由配置
│   └── types.ts          # 路由类型
├── stores/                # Pinia状态管理
│   ├── user.ts           # 用户状态
│   ├── app.ts            # 应用状态
│   └── dashboard.ts      # 看板状态
├── types/                 # TypeScript类型定义(16个类型文件)
├── utils/                 # 工具函数
│   ├── format.ts         # 格式化工具
│   ├── validate.ts       # 验证工具
│   ├── storage.ts        # 存储工具
│   └── auth.ts           # 认证工具
├── views/                 # 页面视图
│   ├── login/            # 登录页
│   ├── home/             # 首页看板
│   ├── dashboard/        # 数据看板
│   ├── case/             # 案件管理
│   │   ├── index.vue    # 案件列表
│   │   └── detail.vue   # 案件详情
│   ├── workOrder/        # 工单管理
│   │   ├── index.vue    # 工单列表
│   │   └── detail.vue   # 工单详情
│   ├── checkApply/       # 对账申请
│   │   ├── index.vue    # 对账列表
│   │   └── detail.vue   # 对账详情
│   └── error/            # 错误页面
├── App.vue               # 根组件
└── main.ts               # 应用入口

```

## 已完成功能

### ✅ 核心架构
- [x] 项目基础架构搭建
- [x] 完整的TypeScript类型系统(16个类型文件)
- [x] API接口层封装(10个API文件)
- [x] Pinia状态管理
- [x] Vue Router路由配置
- [x] 工具函数库(格式化、验证、存储、认证)

### ✅ 页面功能
- [x] 登录页面(含验证码)
- [x] 首页看板(5个核心统计指标 + 月度趋势图)
- [x] 数据看板(统计卡片 + 4个图表 + 待处理案件列表)
- [x] 案件管理
  - [x] 案件列表(搜索、筛选、分页)
  - [x] 案件详情(基本信息、借款合同、债务人、仲裁、执行、触达记录)
- [x] 工单管理
  - [x] 工单列表(搜索、筛选、分页)
  - [x] 工单详情(基本信息、关联案件、流转记录)
- [x] 对账申请
  - [x] 对账列表(搜索、筛选、分页)
  - [x] 对账详情(申请信息、审批流程)

### ✅ 布局与样式
- [x] 响应式布局
- [x] 统一的UI设计风格
- [x] Element Plus主题定制(#3A8EE6)

## 安装与运行

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

### 代码检查
```bash
npm run lint
```

## 开发说明

### 路由结构

- `/login` - 登录页
- `/home` - 首页看板
- `/dashboard` - 数据看板
- `/case/list` - 案件列表
- `/case/detail/:id` - 案件详情
- `/workOrder/list` - 工单列表
- `/workOrder/detail/:id` - 工单详情
- `/checkApply/list` - 对账列表
- `/checkApply/detail/:id` - 对账详情

### Mock数据

当前所有页面使用Mock数据进行展示,待后端API就绪后,只需在对应的API文件中实现真实接口调用即可。

### 数据类型

项目包含完整的TypeScript类型定义:

- `Case` - 案件类型
- `CaseDetail` - 案件详情类型
- `ContactRecord` - 触达记录类型
- `LoanContract` - 借款合同类型
- `Respondent` - 债务人类型
- `ArbitrationInfo` - 仲裁信息类型
- `ExecutionInfo` - 执行信息类型
- `WorkOrder` - 工单类型
- `CheckApply` - 对账申请类型
- 以及更多...

## 待开发功能

以下功能框架已搭建,待具体实现:

1. 用户管理模块
2. 角色权限管理模块
3. 案件分配功能
4. 触达记录表单
5. 工单处理表单
6. 对账申请表单
7. 数据导入导出
8. 报表生成
9. 催收策略配置
10. 通知管理

## 注意事项

1. 项目使用了最新的Vue 3 Composition API和`<script setup>`语法
2. 所有组件都使用TypeScript编写,确保类型安全
3. 使用Element Plus作为UI组件库,主题色为#3A8EE6
4. 使用ECharts进行数据可视化
5. 项目采用前后端分离架构,后端API需单独开发

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## License

MIT

## 开发团队

信贷催收案件管理系统开发团队
