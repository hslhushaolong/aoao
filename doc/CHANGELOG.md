# 更新日志

# [2.0.0](https://github.com/o3cloud/aoao-boss-app/v2.0.0) - 2017-09-20 by dave

### Added 

* 物资管理模块--库存量管理
* 物资管理模块--库存信息中的变更明细
* 物资管理模块--采购模板的品目信息
* 物资管理模块--骑士物资的管理
* 物资管理模块--采购报废记录
* 物资管理模块--采购单的新建
* 物资管理模块--报错单的新建
* 物资管理模块--报废单的新建
* 物资管理模块--分发采购记录
* 物资管理模块--分发单的新建
* 物资管理模块--采购、报废、分发、退货单的审批
* 角色权限管理模块--新加采购角色

### Delete 

* 移除部分超管权限

# [1.1.2](https://github.com/o3cloud/aoao-boss-app/v1.1.2) - 2017-09-05 by dave

### Added 

* 供应商分配商圈缓存bundle

### Fixed 

* 修复params中role_id类型为字符串的错误,将其改为int

# [1.1.1](https://github.com/o3cloud/aoao-boss-app/v1.1.1) - 2017-08-29 by dave

### Added 

* 供应商管理模块
* 商圈根据供应商纬度划分
* 员工信息中添加供应商信息
* 用户信息中添加供应商信息
* 用户信息中添加供应商信息

## [1.1.0](https://github.com/o3cloud/aoao-boss-app/tree/v1.1.0) - 2017-08-17 by dave

### Added 

* 用户添加及角色权限
* 根据不同的角色提供不同的路由模块
* 根据不同的角色可提供不同的操作限制
* 用户编辑功能
* 下载kpi文件功能
* 员工的添加、详情、编辑、离职及查询列表
* 个人离职的申请及离职审批

## [1.0.5](https://github.com/o3cloud/aoao-boss-app/tree/v1.0.5) - 2017-06-23 by dave
 
### Fixed

* change kpi tip text

## [1.0.4](https://github.com/o3cloud/aoao-boss-app/tree/v1.0.4) - 2017-06-21 by dave
 
### Fixed

* change tabs/field and add no-cache
* change kpi tip text

## [1.0.3](https://github.com/o3cloud/aoao-boss-app/tree/v1.0.3) - 2017-06-19 by dave
 
### Fixed

* fixed kpi/gain_business_volume_gather request field

## [1.0.2](https://github.com/o3cloud/aoao-boss-app/tree/v1.0.2) - 2017-06-19 by dave
 
### Added

* 查询管理增加商圈类型查询（自营、外包）
* 查询管理增加按照账期查询
* 业务量查询账单列表新增同城排名及商圈类型字段
* 收支查询模块账单列表增加基础配送费字段
* 上传kpi文件模块增加 城市匹配列数

### Deleted

* 收支查询模块账单列表去除kpi得分字段
* 删除kpi上传文件的奖罚设置

### Changed

* 查询管理模块tab: 数据 > 商圈
* 业务查询模块: 运单总收入 > 基础配送费 
* 业务查询模块: kpi收入 > 手工账单（含kpi收入） 
* 业务查询模块: kpi收入 > 手工账单（含kpi收入） 
* business model change some request


## [1.0.1](https://github.com/o3cloud/aoao-boss-app/tree/v1.0.1) - 2017-05-12 by dave
 
### Changed 

* 短信验证码改用嗷嗷签名
* 趣活logo换为嗷嗷logo
* 统一所有提示信息方式

## [1.0.0](https://github.com/o3cloud/aoao-boss-app/tree/v1.0.0) - 2017-05-08 by dave

### Added

* 系统公共模块

	- 项目App初始化
  - Model层构建
  - Service层构建
  - View构建
  - 按需加载路由功能
  - 打包发布资源功能
  - layout构建
  - 工具类函数
  - 全局错误拦截
   
* 登录模块

	- 用户验证码获取功能
  - 用户的登录与注销功能
  - 用户信息的存储
  - 登录账号权限限制功能
  - 用户信息过期强制重新登录功能
  - 频繁获取验证码限制功能
  - 过期Token刷新功能

* 查询模块
	
	- 业务量查询按照数据查询账单数据功能
  - 业务量查询按照城市查询账单数据功能
  - 业务量查询按照数据查询KPI汇总信息功能
  - 业务量查询按照城市查询KPI汇总信息功能
  - 收支查询按照数据查询账单数据功能
  - 收支查询按照城市查询账单数据功能
  - 收支查询按照数据查询KPI汇总信息功能
  - 收支查询按照城市查询KPI汇总信息功能
  - 查询模块公共搜索组件
  - 查询模块公共table展示组件
  - KPI汇总信息展示UI模板
  - 查询模块分页功能

* 操作管理模块

	- 查询KPI上传记录功能
  - 上传KPI文件到七牛功能 
  - 指定校验KPI文件内容规则功能 
  - 确认文件内容是否按照指定规则解析出数据功能 
  - 数据校验loding动画
  - 分页功能
  
* 用户信息模块
	
	- 用户姓名及手机号的展示
	
* 系统管理模块
 
  - 用户列表查询功能
  - 添加用户功能
  - 字段管理UI
  - 指标管理UI
  
### Fixed 
  
  - 用户登录失败错误提示信息完善
  - 页面小分辨率适配
  - 浮点数据做保留两位小数处理
  - 数据做sort排序



