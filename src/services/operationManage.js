import request from '../application/utils/request';
import qs from 'qs';

// 获取上传文件记录
export async function getUploadList(params) {
  return request(`/kpi/get_upload_record?${qs.stringify(params)}`, { method: 'GET' }).then(data => data);
}
// 获取七牛的token
export async function getUploadToken(params) {
  return request(`/upload/get_token?file_name=${params.name}`, { method: 'GET' }).then(data => data);
}

// 文件上传七牛
export async function postFileToQINIU(params) {
  return request('https://upload-z1.qbox.me', {
    method: 'POST',
    body: params,
  }).then(data => data);
}

// 上传文件到服务器------11.1
export async function postCheckFileDetail(params) {
  return request('/kpi/import_kpi_data', {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(data => data);
}
// 生成上传kpi模版
export async function createUploadKpi(params) {
  return request('/kpi/create_upload_kpi_template', {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(data => data);
}
// 获取上传kpi模版
export async function getUploadKpi(params) {
  return request('/kpi/get_upload_kpi_template', {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(data => data);
}
// kpi信息列表
export async function kpiTemplateList(params) {
  return request('/kpi_template/gain_kpi_template_list', {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(data => data);
}
// kpi模版详情
export async function kpiTemplateDetail(params) {
  return request('/kpi_template/kpi_template_detail', {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(data => data);
}
// kpi模版信息
export async function kpiTemplateInfo(params) {
  return request('/kpi_template/kpi_template_info', {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(data => data);
}
// 创建kpi模版
export async function createKpiTemplate(params) {
  return request('/kpi_template/create_kpi_template', {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(data => data);
}
// 编辑kpi模版
export async function editKpiTemplate(params) {
  return request('/kpi_template/edit_kpi_template', {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(data => data);
}
