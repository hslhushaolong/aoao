import request from '../application/utils/request';

// 提交租房申请
export async function submitRentApplyS(params) {
  return request('/finance/create_house_rent',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
// 提交差旅申请
export async function submitFinanceOrderDetailS(params) {
  return request('/finance/create_finance_order_detail', {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(data => data);
}
// 获取所有财务申请单
export async function getFinanceOrderListS(params) {
  return request('/finance/get_finance_order_list', {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(data => data);
}
// 获取租房财务申请详情
export async function getHouseRentDetailS(params) {
  return request('/finance/get_house_rent_detail', {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(data => data);
}
// 获取其他财务申请详情
export async function getFinanceOrderDetailS(params) {
  return request('/finance/get_finance_order_detail', {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(data => data);
}
// coo 同意财务申请
export async function approveFinanceApplyS(params) {
  return request('/finance/finance_order_check', {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(data => data);
}
