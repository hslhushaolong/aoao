import request from '../application/utils/request';

// 获取成本预估
export async function fetchBudgetData(params) {
  return request('/budget_total/get_budget_total',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
