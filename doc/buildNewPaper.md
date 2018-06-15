# 创建新页面

## 页面地址
	路径：src/routes/对应文件夹名

## 切换测试环境，正式环境，后台个人电脑连接的URL路径
	路径：config.js文件
	具体：修改config对象中prod地址（本地、测试、正式）

## 增加新页面的路由
	路径：src/routes/router.js

## 增加link标签选中 高亮特效
	路径：src/utils/createdBreadCumb.js文件
	具体：NavLight类中修改 setKey属性即可

## 添加面包屑
	路径：src/utils/createdBreadCumb.js
	具体：BreadCrumbTool类中修改 data属性即可

## model层位置
	路径：src/models/对应的文件名

## service层（后台数据请求函数封装）
	路径：src/services/对应的文件名

## fetch方法封装地址
	路径：src/application/utils/request.js
