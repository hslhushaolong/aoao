// 大查询功能
import request from '../application/utils/request';

/**
 * 业务查询
 */
export async function getSearchListS(params) {
  return request('/query_base/find',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 账单信息
 */
export async function getBillInfoS(params) {
  return request('/query_base/get_order_date',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

export async function getDistrictLevelS(params) {
  return request('/query_base/get_district_level',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
