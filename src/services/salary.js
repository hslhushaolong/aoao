/**
 * 薪资 service 层
 */

import request from '../application/utils/request';

// NOTE: ------- 薪资汇总页面 -----------
// 薪资汇总信息
export async function fetchSalarySummary(params) {
  return request('/salary_collect/get_salary_collect',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 薪资汇总审核接口
export async function updateSalarySummaryState(params) {
  return request('/salary_collect/salary_collect_audit',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 薪资汇总下载
export async function createSalaryRecordsDownloadTask(params) {
  return request('/salary_collect/download_salary_collect',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 查询薪资提示状态
export async function fetchSalarySummaryTipsState(params) {
  return request('/salary_collect/salary_point_out',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 获取薪资提示的状态
export async function fetchSalarySummaryNotice() {
  return request('/salary_collect/check_salary_point_out',
    {
      method: 'POST',
      body: JSON.stringify(),
    }).then(data => data);
}

// 不显示薪资提示
export async function disableSalarySummaryNotice() {
  return request('/salary_collect/salary_point_out',
    {
      method: 'POST',
      body: JSON.stringify({ state: false }),
    }).then(data => data);
}

// NOTE: ------- 薪资计算任务 -----------
// 薪资任务列表
export async function fetchSalaryTasks(params) {
  return request('/salary_task/gain_salary_task',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 创建薪资计算任务
export async function createSalaryTasks(params) {
  return request('/salary_task/create_salary_task',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// NOTE: ------- 薪资查询页面 -----------

// 获取薪资列表
export async function fetchSalaryRecords(params) {
  return request('/salary_inquiries/gain_salary_list',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 薪资审批
export async function updateSalaryRecordState(params) {
  return request('/salary_inquiries/salary_audit',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 骑士/人事扣补款审批
export async function updateSalaryRecordExamine(params) {
  return request('/knight_deduction_and_payment/examine',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 薪资记录下载
export async function downloadSalaryRecords(params) {
  return request('/salary_inquiries/download_knight_salary_detail',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 薪资查询页面, 汇总信息
export async function fetchSalaryRecordsInfo(params) {
  return request('/salary_inquiries/gain_salary_total',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// NOTE: ------- 薪资详情页面 -----------

// 薪资明细
export async function fetchSalaryRecordDetail(params) {
  return request('/salary_inquiries/gain_salary_detail',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// NOTE: -------骑士扣补款页面 -----------

// 扣补款单列表
export async function getFillingMoneyListS(params) {
  return request('/deduction_and_payment/deduction_and_payment_list',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 扣补款单审核
export async function approveOfKnightSalaryS(params) {
  return request('/deduction_and_payment/deduction_and_payment_audit',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 扣补款单详情
export async function getFillingMoneyDetailS(params) {
  return request('/deduction_and_payment/deduction_and_payment_detail',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 扣款列表删除
export async function getFillingMoneyDetailRemove(params) {
  return request('/knight_deduction_and_payment/remove',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 扣款列表撤回
export async function getFillingMoneyDetailWithdraw(params) {
  return request('/knight_deduction_and_payment/withdraw',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 扣款列表提交
export async function getFillingMoneyDetailSumbit(params) {
  return request('/knight_deduction_and_payment/sumbit',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 扣补款单新建
export async function createMoneyOrderOfKnightS(params) {
  return request('/deduction_and_payment/create_deduction_and_payment',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// NOTE: -------薪资模版设置页面 -----------

// 薪资设置审核
export async function requestVerifySetupS(params) {
  return request('/salary_set_up/salary_set_up_audit',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 创建薪资模版
export async function createSalaryModelS(params) {
  return request('/salary_set_up/create_salary_model',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 编辑薪资模版
export async function updateSalaryModelS(params) {
  return request('/salary_set_up/edit_salary_model',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 获取薪资设置列表
export async function fetchSalarySetupListS(params) {
  return request('/salary_set_up/salary_set_up_list',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 获取薪资模版详情
export async function fetchSalaryModelDetailS(params) {
  return request('/salary_set_up/salary_set_up_detail',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 下载骑士excel列表
export async function downloadStaffListS(params) {
  return request('/deduction_and_payment/download_knight_list',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 下载骑士excel列表
export async function removeOrderList(params) {
  return request('/knight_deduction_and_payment/remove_order',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 骑士扣款（汇总审核）
export async function knightCharge(params) {
  return request('/deduction_and_payment/deduction_and_payment_detail',
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
export async function getEnableBizS(params) {
  return request('/salary_set_up/get_enable_biz',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
