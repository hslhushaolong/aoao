#项目配置文件
基本配置文件目录 ~/src/application/define/
  ├── index.jsx       (全局使用的基础类型定义，枚举定义)
  ├── modules.js      (功能模块定义)
  ├── navigation.js   (导航结构定义)
  ├── permissions.js  (权限定义，角色-页面访问权限)
  └── rules.js        (权限定义，角色-页面内功能使用权限)

#项目模块定义
modules中定义的模块类型有两种

1. 一种是菜单栏目。（没有具体地址）
  命名规则:
  MenuXXX, XXX代表自定义名称。
  具体实例:
  MenuXXX: new Module({ title: '菜单栏名称（自定义）', path: 'MenuXXX（与定义名称一致）', icon: '菜单栏icon（自定义）' })

2. 一种是页面模块。（有访问地址）
  命名规则:
  ModuleXXX, XXX代表自定义名称。
  具体实例:
  ModuleXXX: new Module({ title: '模块名称（自定义）', path: 'Module/XXX(模块在路由中设置的访问地址 )' })

#项目模块开发

如何设置新菜单:
1. 根据上述规则，在modules.js中定义菜单栏目。如，添加菜单为 MenuXXX。
2. 将 Module.MenuXXX 定义，添加到 navigation.js  最上层结构中。（菜单为最上层第一级，模块为菜单下一级）
3. 将 Module.MenuXXX 定义，添加到 permissions.js 对应的角色下。（必须设置权限才能访问）
4. 正常使用

如何新开发模块：
1. 根据上述规则，在modules.js中定义新的模块。如，添加菜单为 ModuleXXX
2. 将 Module.ModuleXXX 定义，添加到 navigation.js  菜单下层结构中。（菜单为最上层第一级，模块为菜单下一级）
3. 将 Module.ModuleXXX 定义，添加到 permissions.js 对应的角色下。（必须设置权限才能访问）
4. 正常使用
