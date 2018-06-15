import request from '../application/utils/request';
import qs from 'qs';

// 编辑员工
export async function editEmployeeS(params) {
  return request('/staff/update_staff_info',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 员工详情
export async function getEmployeeDetailS(params) {
  return request('/staff/get_staff_info',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 员工列表
export async function getEmployeeListS(params) {
  return request('/staff/gain_staff_list',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 添加员工
export async function AddEmployeeS(params) {
  return request('/staff/',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 导出员工
export async function exportEmployeeS(params) {
  return request('/staff/download_staff_list',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 合同归属列表
export async function getContractBelongS(params) {
  return request(`/third_part?${qs.stringify(params)}`,
    {
      method: 'GET',
    }).then(data => data);
}

// 员工历史工作记录
export async function getEmployeeHistoryDetailS(params) {
  return request('/staff/gain_staff_history_work_list',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 骑士类型
export async function getKnightTypeListS(params) {
  return request('/knight_type/list',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 添加站长，重新获取平台、城市、商圈
export async function gainNoMasterDistrictListS(params) {
  return request('/staff/gain_no_master_district_list',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 工号管理
// 获取运力工号骑士
export async function gainDeliveryKnight(params) {
  return request('/staff/gain_transport_knight',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 运力工号骑士启用停用
export async function deliveryStop(params) {
  return request('/staff/transport_knight',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 替跑详情
export async function deliveryDetail(params) {
  return request('/staff/gain_transport_record',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 编辑替跑记录
export async function deliveryEdit(params) {
  return request('/staff/update_transport_record',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 新建替跑记录
export async function deliveryBuild(params) {
  return request('/staff/transport_record',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 查询替跑骑士
export async function deliveryFind(params) {
  return request('/staff/gain_actual_transport_knight',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 批量上传骑士
export async function batchUploadingKnightS(params) {
  return request('/staff/knight_batch_upload',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 验证银行卡接口
export async function getBankId(params) {
  return request('/owned_bank/gain_owned_bank',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 获取待入职员工列表数据
export async function getWaitEntryStaffS(params) {
  return request('/staff/get_wait_entry_staff',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 获取待入职员工列表数据
export async function getWaitEntryStaffDetailS(params) {
  return request('/staff/get_wait_entry_staff_detail',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 删除待入职员工
export async function deleteWaitEntryStaffS(params) {
  return request('/staff/wait_entry_staff',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 新增待入职员工
export async function addWaitEntryStaffS(params) {
  return request('/staff/create_wait_entry_staff',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 可操作职位
export async function getPositionInfoS(params) {
  return request('/permission/current_position',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
