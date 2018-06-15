import request from '../application/utils/request';
import qs from 'qs';

// 系统管理 获取用户列表
export async function getAccountList(params) {
  return request('/account/gain_account_list',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 系统管理 获取用户列表-审批人列表
export async function getApproveList(params) {
  return request('/account/gain_superior_list',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 系统管理 添加账户
export async function addAccount(params) {
  params.gid = Number(params.gid);
  return request('/account/',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 系统管理 修改账户
export async function updateAccount(params) {
  params.gid = Number(params.gid);
  return request('/account/update',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 系统常量
export async function systemConstant(params) {
  return request('/constants/',
    {
      method: 'GET',
    }).then(data => data);
}

// 供应商列表
export async function getSupplierList(params) {
  return request('/supplier/gain_supplier_list',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 编辑供应商
export async function addSupplierAreaS(params) {
  return request('/supplier/',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 编辑供应商
export async function editSupplier(params) {
  return request('/supplier/update',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 供应商详情
export async function getSupplierDetailS(params) {
  return request('/supplier/get_supplier_info',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 获取没有供应商的商圈
export async function getNotSupplierS(params) {
  return request('/supplier/get_not_supplier_district',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 获取三方公司列表
export async function getCompanyList(params) {
  return request(`/third_part/?${params}`).then(data => data);
}
// 编辑三方公司
export async function editCompany(params) {
  return request(`/third_part/${params.third_part_id}`,
    {
      method: 'POST',
      body: JSON.stringify(params.params),
    }).then(data => data);
}
// 添加三方公司
export async function addCompany(params) {
  return request('/third_part/',
    {
      method: 'POST',
      body: JSON.stringify(params.params),
    }).then(data => data);
}
// 添加骑士类型
export async function addKnightType(params) {
  return request('/knight_type/',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 编辑骑士类型
export async function editKnightType(params) {
  return request(`/knight_type/${params.url}`,
    {
      method: 'POST',
      body: JSON.stringify(params.params),
    }).then(data => data);
}
// 获取骑士类型列表
export async function getKnightType(params) {
  return request('/knight_type/list',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 处理异常员工
export async function updateAccountException(params) {
  return request('/staff/handle_error_staff',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 获取未处理异常员工
export async function fetchAccountException(params) {
  return request('/staff/get_unhandled_error_staff',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 获取异常账号列表
export async function getHandleErrStaff(params) {
  return request('/staff/get_error_staff',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 获取下载的任务列表
export async function fetchDownloadRecords(params) {
  return request(`/asyn_task/?${qs.stringify(params)}`).then(data => data);
}
// 获取所有有效账号
export async function getAllAccounts() {
  return request('/account/get_all_account/').then(data => data);
}
// 获取关联账号列表
export async function getAccountsList(params) {
  let url = `page=${params.page}&limit=${params.limit}&state=${params.state}`;

  if (params.account_id) {
    url = `page=${params.page}&limit=${params.limit}&account_id=${params.account_id}`;
  }
  return request(`/whitelist/?${url}`).then(data => data);
}

// 添加关联账号
export async function getAddAccounts(params) {
  // 添加
  return request('/whitelist/',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 白名单编辑
export async function getEditAccounts(params) {
  const values = params;
  const id = params.id;
  delete values.id;
  // 编辑 删除
  return request(`/whitelist/${id}`,
    {
      method: 'POST',
      body: JSON.stringify(values),
    }).then(data => data);
}

// 获取业务分布情况
export async function getBusinessDistributionS(params) {
  // 编辑 删除
  return request('/platform/get_business_distribution',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 获取城市分布情况
export async function getCityDistributionS(params) {
  // 编辑 删除
  return request('/platform/get_city_distribution',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 商圈设置
export async function bizSetUpS(params) {
  // 编辑 删除
  return request('/platform/biz_set_up',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 薪资模板指标
export async function getSalarySpecifications(params) {
  // 编辑 删除
  return request('/salary_set_up/get_salary_specifications',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 更新商圈禁用状态
export async function updateBizDistrict(params) {
  // 编辑 删除
  return request('/platform/update_biz_district',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 移除商圈
export async function removeBizDistrict(params) {
  // 编辑 删除
  return request('/platform/remove_biz_district',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
