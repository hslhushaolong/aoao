// 费用管理
import request from '../application/utils/request';

// 获取科目名称
export async function getSubjectNameS(params) {
  return request('/oa_catalog/find_name',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 新建科目
export async function buildSubjectS(params) {
  return request('/oa_catalog/',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 编辑科目
export async function editSubjectS(params) {
  return request('/oa_catalog/update',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 科目列表
export async function getSubjectListS(params) {
  return request('/oa_catalog/find_list',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 审批流--------------

// 审批流列表
export async function getExamineListS(params) {
  return request('/oa_examineflow/find_list',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 编辑审批流
export async function editExamineS(params) {
  return request('/oa_examineflow/update',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 获取审批人名称
export async function getExamineNameS(params) {
  return request('/oa_examineflow/find_account',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 新建审批流
export async function buildExamineS(params) {
  return request('/oa_examineflow/',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 审批流详情
export async function getExamineDetailS(params) {
  return request('/oa_examineflow/get_detail',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 费用类型-------------
// 费用类型列表
export async function getTypeListS(params) {
  return request('/oa_costclass/find_list',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 编辑费用类型
export async function editTypeS(params) {
  return request('/oa_costclass/update',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 新建费用类型
export async function buildTypeS(params) {
  return request('/oa_costclass/',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 费用类型详情
export async function getTypeDetailS(params) {
  return request('/oa_costclass/get_detail',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// ---------费用管理----------
// 费用申请租房生成唯一房屋编号
export async function getUniqueHouseNumS(params) {
  return request('/oa_apply_order/create_house_num',
    {
      method: 'GET',
    }).then(data => data);
}
// 费用申请获得费用类型名称
export async function getTypeNameListS(params) {
  return request('/oa_costclass/find_name',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 费用申请提交费用申请单
export async function submitTypeApplyS(params) {
  return request('/oa_apply_order/create_apply_order',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 费用申请记录列表
export async function typeApplyListS(params) {
  return request('/oa_apply_order/find_list',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 费用申请费用申请单详情
export async function typeApplyDetailS(params) {
  return request('/oa_apply_order/find_apply_order',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 费用申请费用申请单编辑
export async function typeApplyEditS(params) {
  return request('/oa_apply_order/edit_apply_order',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 费用申请费用申请单删除
export async function typeApplyDeleteS(params) {
  return request('/oa_apply_order/delete_apply_order',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 费用申请 提交费用申请单审批
export async function submitTypeApplyGroupS(params) {
  return request('/oa_examine/examine_submit',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 费用申请 审批流名称接口
export async function getTypeNameSimpleS(params) {
  return request('/oa_examine/find_costclass_name',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 费用申请 审批流名称接口
export async function getExamineSimpleNameListS(params) {
  return request('/oa_examine/find_costclass_name',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 费用申请 审批流名称接口
export async function getExamineSimpleNameS(params) {
  return request('/oa_examineflow/find_name',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 费用申请 审批单详情接口
export async function getExamineSimpleDetailS(params) {
  return request('/oa_examine/find_examine_order_detail',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// -------费用审核记录---------
// 审批单列表
export async function getApprovalListS(params) {
  return request('/oa_examine/examine_list',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 审批单进度
export async function getApprovalProcessS(params) {
  return request('/oa_examine/examine_process',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 审批
export async function approvalEditS(params) {
  return request('/oa_examine/examine',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// -------记录明细---------
// 记录明细列表
export async function getRecordListS(params) {
  return request('/oa_examine/examine_detail',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 续租/断租/续签/退租
export async function recordEditS(params) {
  return request('/oa_apply_order/change_house_status',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
