OA模块目录组织
OA模块目录组织
├── components
│   ├── mySearch.js         搜索组件
│   ├── style.less
│   └── test.js
├── examine
│   ├── edit.js             编辑页
│   ├── index.jsx           列表页
│   ├── myTransfor.js       穿梭框组件
│   ├── create.js           新建页面
│   ├── new.less            新建页面样式
│   └── search.jsx          搜索组件
├── manage                  费用管理核心业务
│   ├── audit               费用申请/审核记录
│   │   ├── index.jsx       费用申请/审核记录 列表页
│   │   └── search.jsx      费用申请/审核记录 搜索组件
│   ├── create.jsx          新建费用申请
│   ├── records             记录明细
│   │   ├── detail.jsx      记录明细，单条流水的详情页面
│   │   ├── form
│   │   │   └── index.jsx   记录明细，单条流水的操作入口（续租，断租，退租，续签）
│   │   ├── index.jsx       记录明细 列表页
│   │   ├── search.jsx      记录明细 搜索组件
│   │   └── summary         
│   │       └── create.jsx  记录明细 汇总记录的操作入口（续租，断租，退租，续签）
│   ├── summary             汇总记录
│   │   ├── detail.jsx      汇总记录的详情入口
│   │   ├── detail          
│   │   │   ├── modal.jsx   审核流程的弹窗
│   │   │   ├── refund.jsx  汇总记录的详情，报销
│   │   │   ├── rent.jsx    汇总记录的详情，租房
│   │   │   └── salary.jsx  汇总记录的详情，薪资
│   │   ├── create.jsx      汇总记录的创建入口
│   │   └── form
│   │       ├── refund.jsx  汇总记录的创建，报销
│   │       ├── rent.jsx    汇总记录的创建，租房
│   │       └── salary.jsx  汇总记录的创建，薪资
│   └── template            模版页面（费用业务相关的）
│       ├── common          公用模块
│       │   ├── expense.jsx 费用相关模块（成本中心，成本归属）
│       │   ├── items.jsx   费用相关模块（平台，供应商，城市，商圈，分摊金额）
│       │   ├── subject.jsx 科目信息模块（一级，二级，三级）
│       │   └── upload.jsx  上传文件模块
│       ├── create          创建模版
│       │   ├── refund.jsx  创建模版，报销
│       │   └── rent.jsx    创建模版，租房
│       ├── create.jsx      创建模版，入口
│       ├── detail          详情模版
│       │   ├── refund.jsx  详情模版，报销
│       │   └── rent.jsx    详情模版，租房
│       ├── detail.jsx      详情模版，入口
│       ├── records         记录明细模版
│       │   ├── detail            记录明细，详情模版
│       │   │   ├── break.jsx     记录明细，详情模版，断租
│       │   │   ├── cancel.jsx    记录明细，详情模版，退租
│       │   │   ├── continue.jsx  记录明细，详情模版，续租
│       │   │   └── sign.jsx      记录明细，详情模版，续签
│       │   └── form              记录明细，表单模版
│       │   │   ├── break.jsx     记录明细，表单模版，断租
│       │   │   ├── cancel.jsx    记录明细，表单模版，退租
│       │   │   ├── continue.jsx  记录明细，表单模版，续租
│       │   │   └── sign.jsx      记录明细，表单模版，续签
│       ├── update          更新模版
│       │   ├── refund.jsx  更新模版，报销
│       │   └── rent.jsx    更新模版，租房
│       └── update.jsx      更新模版，入口
├── subject
│   ├── EditModel.js   编辑科目弹窗
│   ├── index.jsx      科目列表
│   ├── myModal.js     新增科目弹窗
│   └── search.jsx     列表搜索组件
├── transInt.js        枚举值转换
└── type             
    ├── create.js      创建新模版类型
    ├── edit.js        编辑模版类型
    ├── index.jsx      模版类型列表页
    └── search.jsx     列表页搜索组件

21 directories, 60 files
