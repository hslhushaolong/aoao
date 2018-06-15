import request from '../application/utils/request';
import qs from 'qs';

// 业务量查询 汇总信心详情
export async function getBusinessDetail(params) {
  return request('/kpi/gain_business_volume_gather',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 根据（平台、城市、商圈）查询 KPI 数据
export async function getPlatformList(params) {
  return request('/kpi/gain_business_volume',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// 获取平台及平台下的城市
export async function getPlatformAndCityList(params) {
  return request('/platform/get_platform_and_city',
    {
      method: 'GET',
    }).then(data => data);
}

// 根据平台及城市 获取商圈
export async function getAreas(params) {
  return request('/platform/get_biz_district',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}
