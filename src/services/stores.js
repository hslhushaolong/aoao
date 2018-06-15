/**
 * 物资 service 层
 */

import request from '../application/utils/request';
import qs from 'qs';

// 获取仓库库存
export async function getStorgeMaterials(params) {
  return request('/material_stock/gain_material_stock',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 查看物资变动明细
export async function getChangeOfMaterials(params) {
  return request('/material_stock/gain_material_stock_detail',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 获取品目明细列表
export async function getMessageOfItemList(params) {
  return request('/material_item/get_material_list',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 添加品目明细
export async function addItemIntoStore(params) {
  return request('/material_item/',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 修改品目
export async function editItemOfStore(params) {
  return request('/material_item/update',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 物资详情
export async function getMaterialsDetail(params) {
  return request('/material_stock/gain_knight_material_detail',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 骑士物资详情
export async function getKnightMaterialsDetail(params) {
  return request('/knight_material/gain_knight_material_detail',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 采购单列表
export async function getPickOrderListS(params) {
  return request('/material_io/gain_material_io_log',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 单子详情
export async function getPickOrderDetailS(params) {
  return request('/material_io/gain_material_io_order',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 单子审核
export async function auditSingleS(params) {
  return request('/material_io/material_io_audit',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 创建单子
export async function createNewOrderS(params) {
  return request('/material_io/create_material_io',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 创建错误单子
export async function editOrderToErrorListS(params) {
  return request('/material_io/report_material_io_error',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 创建分发单子
export async function createDistributeOrderS(params) {
  return request('/material_flow/material_distribute',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 物品分发记录
export async function getDistributeOrderListS(params) {
  return request('/material_flow/gain_material_flow_log',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 分发退货单的审核
export async function editDistributeOrderS(params) {
  return request('/material_flow/material_flow_audit',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 分发退货单详情
export async function getDistributeDetailS(params) {
  return request('/material_flow/gain_material_flow_order',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
