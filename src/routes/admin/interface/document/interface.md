#业务组件开发。根目录为 src/routes

组件目录结构为 (举例)
account                   (菜单目录 ，如：超级管理，查询管理，操作管理)
  ├── managent            (功能目录，如：账户管理，授权验证，)
  │   ├── components     （managent 功能目录下，功能页面的拆分或公用模块）
  │   │   ├── avatar.jsx （功能页面拆分模块，如：头像，信息，列表等具体的。）
  │   │   └── info.jsx   （功能页面拆分模块，如：头像，信息，列表等具体的。）
  │   ├── create.jsx     （功能页面，如：登陆，创建，详情，列表，二级，三级具体页面）
  │   ├── detail.jsx     （功能页面，如：登陆，创建，详情，列表，二级，三级具体页面）
  │   ├── index.jsx      （功能页面，如：登陆，创建，详情，列表，二级，三级具体页面）
  │   └── update.jsx     （功能页面，如：登陆，创建，详情，列表，二级，三级具体页面）
  ├── authorize           (功能目录)
  │   ├── auth.jsx        (功能页面)
  │   └── index.jsx       (功能页面, 默认的authorize模块首页)
  └── components          (account 菜单目录下，managent，authorize 的公用模块)
      └── common.jsx      (公用模块)

#抽象组件开发。根目录为 src/compontens/core

components/
└── core
    ├── index.jsx     所有模块的引用封装
    ├── style.less    样式
    ├── content.jsx   内容盒子模块
    ├── form.jsx      表单，字段排版显示模块
    ├── search.jsx    搜索模块
    └── upload.jsx    上传模块

1. 页面统一样式，模块内容封装统一使用CoreContent。
2. 页面搜索模块，使用CoreSearch。
3. 页面字段排版，数据展示，使用CoreForm。
4. 功能组件，使用Ant.Design。
5. 业务组件，根据业务组件开发标准，进行模块查分开发。
