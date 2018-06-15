const accessTokenFunc = function () {
  const aoaoBossToken = JSON.parse(localStorage.getItem('AOAOBOSS')).access_token;
  return aoaoBossToken;
};

const config = {
  // 正式
  // AccessKey: '88b20ffb3cfa92da3c79214a786a7798',
  // SecretKey: '28008338b7bcd990aabe4feb1ff3d9bc',
  // prod: 'https://boss-api.aoaosong.com/1.0',

  // 测试
  AccessKey: 'bbcb289b2d3c406daa84c217f3e580d5',
  SecretKey: 'a68da58fdc82e121ec198b8fba870541',
  // prod: 'https://boss-api-dev.aoaosong.com/1.0',
  prod: 'http://123.124.17.55:8051/1.0',
  // prod: 'http://127.0.0.1:8081/1.0',

  accessToken: accessTokenFunc,
  mock: '/',
  env: 'prod',
  // 刷新 token 地址
  refreshToken: '/token/refresh',
  // 刷新时间
  hours: 24,
  // local 命名空间
  nameSpace: 'AOAOBOSS',
  // 默认导航的高亮
  lightKey: '7',
  // 面包屑数据
  breadCrumbData: [
     ['查询管理', '业务量查询'],
     ['查询管理', '收支查询'],
     ['操作管理', '填写KPI文件'],
     ['员工管理', '查看员工'],
     ['员工管理', '添加员工'],
     ['员工管理', '离职审批'],
     ['我的账户', '我的账户'],
     ['系统管理', '用户管理'],
     ['系统管理', '字段管理'],
     ['系统管理', '指标管理'],
  ],
  // 生产环境相关 key 值
  developConfig: {
    AccessKey: '88b20ffb3cfa92da3c79214a786a7798',
    SecretKey: '28008338b7bcd990aabe4feb1ff3d9bc',
    prod: 'https://boss-api.aoaosong.com/1.0',
  },
  // 测试环境相关 key 值
  releaseConfig: {
    AccessKey: 'bbcb289b2d3c406daa84c217f3e580d5',
    SecretKey: 'a68da58fdc82e121ec198b8fba870541',
    prod: 'https://boss-api-dev.aoaosong.com/1.0',
  },
  // 本地测试相关 key 值
  localConfig: {
    AccessKey: 'e86960f0ac2dd37a8a6241b928ac9125',
    SecretKey: 'c343c6331c98a305425a019bb5128d5c',
    prod: '//192.168.1.108:8080/1.0',
  },
};

module.exports = config;
