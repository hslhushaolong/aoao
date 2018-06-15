.
├── README.md
├── manage                                      骑士扣补款和人事扣款
│   ├── README.md                               骑士扣补款和人事扣款说明文档
│   ├── component                               公用组件
│   │   ├── modal.jsx                           下载模态框
│   │   └── statistic.jsx                       汇总页面
│   ├── humanResources                          模块，人事业务
│   │   └── deduct                              扣款
│   │       ├── detail.jsx                      扣款，详情
│   │       ├── form.jsx                        扣款，创建或编辑
│   │       ├── index.jsx                       扣款，首页
│   │       ├── search.jsx                      扣款，查询
│   │       └── verify                          扣款，审核
│   │           ├── detail                      扣款，审核，详情
│   │           │   ├── index.js                扣款，审核，详情，首页
│   │           │   └── search.js               扣款，审核，详情，查询
│   │           ├── index.js                    扣款，审核，首页
│   │           └── search.js                   扣款，审核，查询
│   └── knight                                  模块，骑士业务
│       ├── deduct                              扣款
│       │   ├── detail.jsx                      扣款，详情
│       │   ├── form.jsx                        扣款，创建或编辑
│       │   ├── index.jsx                       扣款，首页
│       │   ├── search.jsx                      扣款，查询
│       │   └── verify                          扣款，审核
│       │       ├── detail                      扣款，审核，详情
│       │       │   ├── index.js                扣款，审核，详情，首页
│       │       │   └── search.js               扣款，审核，详情，查询
│       │       ├── index.js                    扣款，审核，首页
│       │       └── search.js                   扣款，审核，查询
│       └── supplement                          补款
│           ├── detail.jsx                      补款，详情
│           ├── form.jsx                        补款，创建或编辑
│           ├── index.jsx                       补款，首页
│           ├── search.jsx                      补款，查询
│           └── verify                          补款，审核
│               ├── detail                      补款，审核，详情
│               │   ├── index.js                补款，审核，详情，首页
│               │   └── search.js               补款，审核，详情，查询
│               ├── index.js                    补款，审核，首页
│               └── search.js                   补款，审核，查询
├── search                                      薪资汇总
│   ├── .DS_Store
│   ├── detail.jsx                              薪资查询明细
│   ├── payment
│   │   ├── index.jsx                           薪资缓发|补发明细
│   │   └── search.jsx                          薪资缓发|补发明细查询
│   ├── records
│   │   ├── index.jsx                           薪资汇总-城市薪资明细
│   │   └── search.jsx                          薪资汇总-城市薪资明细查询
│   └── summary                                 薪资汇总
│       ├── index.jsx                   
│       └── search.jsx                          薪资汇总查询
└── setting                                     薪资设置
    ├── .DS_Store
    ├── create
    │   ├── dateSlider.jsx                      日期选择的控件
    │   ├── formula.jsx                         薪资模板设置模块
    │   ├── salary.jsx                          薪资模板设置模块
    │   └── salarySubject.jsx                   日期选择的控件
    ├── create.jsx                              薪资模板添加
    ├── define.jsx                              薪资指标
    ├── detail.jsx                              薪资模板详情
    ├── index.jsx                               薪资模板列表
    └── search.jsx                              薪资模板列表查询