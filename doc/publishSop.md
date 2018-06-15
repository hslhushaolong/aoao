# 项目打包上线sop

> 题目: 项目打包上线标准操作规程

> 作者: 乔亚军 (dave-qiao)

> 日期: 2017/10/26

> 目的: 规范打包上线流程

> 背景知识: node、webpack、gulp、git

> 内容: 整理如下

## 1.确保上线打包的代码经过测试，并且可以发版
*  1.1 检查当前代码是否包含了上一版开发完毕的稳定功能（不包括新加需求及更改需求）
*  1.2 查看是否有开发完成的功能feature分支未合并（未合并则合并分支）
*  1.3 确保develop分支为最新的稳定代码

## 2.发布测试版
*  2.1 从develop分支打出最新的release版本，release分支名为待发布的版本号
*  2.2 更改配置文件config中的AccessKey、SecretKey、prod接口地址为测试配置，以及package.json中的version版本号
*  2.3 在项目目录下执行npm run build开始打包文件
*  2.4 git添加提交后，将release分支推到GitHub，告知运维部署服务器

## 3.发布生产版 
*  2.1 确保测试版测试没有问题，以及存在的bug都已修复
*  2.2 更改配置文件config中的AccessKey、SecretKey、prod接口地址生产配置
*  2.3 在项目目录下执行npm run build开始打包文件
*  2.4 git添加提交后，finish掉当前的release分支，自动合并到develop及master分支，过程中会让你添加Tag（如熟悉流程，详见git flow工作流及相关用法）
*  2.5 将master分支代码发布到Github,告知运维部署服务器



