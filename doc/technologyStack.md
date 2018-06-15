# aoaoBoss 技术栈(2017/09/27)

## UI层

* antd.js (需要了解常用组件的用法)

## 组件

* React.js (会写组件即可)
  * 基本组件写法
  * 组件化划分抽离
* React-dom.js
  * 引入即可（需绑定根目录，目前不用关心如何绑定，项目中通过dva绑定渲染，最终还是由React-dom渲染）

## 路由 (后续路由直接配置即可)

* React-router.js
  * 需要了解嵌套路由配置
  * 需要了解按需加载路由配置（目前使用按需加载，通过dva封装的router

## model层 (参照dva用法)

* dva.js
  * 基于redux封装
  * 需要了解其基本用法[快速开始](https://github.com/sorrycc/blog/issues/18)
* Redux-saga.js
* Redux（需要了解 store action reducers dispatcher）

## service层(原生fetch)

* fetch
* qs（数据处理辅助工具）

## 打包工具 (用法参照package.json-script)

* roadhogrc.js
* webpack.js(了解热更新、及切片打包)
* gulp.js

## 编译工具(已配置好，如有新的babel依赖需配置)

* babel.js

## 测试框架

* karma.js
* mocha.js
* chai.js

## 版本控制 (需要掌握基本用法)

* git
* git flow

## js版本要求(es6常用语法需要会)

* 开发版本es6、es7
* 生产版本es5

## 以上详细依赖请参照package.json
