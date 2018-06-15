# 项目路由配置使用sop

> 题目: 路由配置标准操作规程

> 作者: 乔亚军 (dave-qiao)

> 日期: 2017/10/20

> 目的: 规范前端开发人员快速开发路由配置

> 背景知识: React-router（按需加载配置）、dva(Router组件)

> 原理: HTML5 history api

> 内容: 整理如下
## 1.根据需求整理好路由结构（是否需要增设新的路由结构）

* 现有路由结构
  * login模块（一级路由）
  * layout模块（一级路由）
    * 查询管理模块 （子路由）
    * 员工管理  （子路由）
    * ...等等  （子路由）

## 2.按照之前的路由结构配置路由(前提是有对应的模块文件可加载，不然会报错)

* 新增模块为一级路由下的子路由[本地链接](./../src/routes/router.js)
  * 需要配置路由为layout子路由（与Search/Business路由同级,同为layout子路由）
  * example(如下)
  ```
  childRoutes: [
		// 业务查询
		{
			path: 'Search/Business',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./queryManage/business'));
				});
			}
		},
        // 新增模块注释（注释语义化、与业务相匹配）
        {
			path: '需要添加的路由（小驼峰写法）',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('需要加载的模块（相对路径）'));
				});
			}
		}
  ]
  ```

## 3.增设新的路由结构

* 新增的模块需要在layout子路由基础上增设子路由[本地链接](./../src/routes/router.js)
  * example
  ```
    {
        path: '新的结构路由命名空间（小驼峰写法）',
        getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
                    cb(null, require('新的模块路由组件'));
                });
        },

        getIndexRoute(nextState, cb) {
            require.ensure([], function (require) {
                cb(null, {
                    component: require("新模块中默认加载的子路由"),
                })
            })
        },

        childRoutes: [
            // 新增模块
            {
                path: '具体的模块（小驼峰）',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('新模块中的子路由'));
                    });
                }
            },
        ],
    }
  ```

## 4.如果还有较为复杂的路由结构（参照以上两套方案结合使用方可解决） 

* 结合路由的嵌套法则以及按需加载写法设计方案以及组织代码 （参照官网）