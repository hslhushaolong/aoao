import request from '../application/utils/request';
import qs from 'qs';

// 获取验证码
export async function getVerifyCode(params) {
  return request(`/auth/send_verify_code?${qs.stringify(params)}`,
    {
      method: 'GET',
    }, 'X-AUTH').then(data => data);
}

// 登录
export async function login(params) {
  return request('/auth/login',
    {
      method: 'post',
      body: JSON.stringify(params),
    }, 'X-AUTH').then(data => data);
}
// 切换账号
export async function exchangeAccount(params) {
  return request(`/account/exchange_account/?account_id=${params.accountId}`,
    { method: 'GET' })
    .then(data => data);
}
// 注销登录
export async function loginClear(params) {
  return request('/auth/logout',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }, 'X-AUTH').then(data => data);
}

// 更新权限信息
export async function updateSystemPermission(params) {
  return request('/permission/update_permission', { method: 'POST', body: JSON.stringify(params) }).then(data => data);
}

// 创建角色
export async function createSystemRole(params) {
  return request('/permission/create_group', { method: 'POST', body: JSON.stringify(params) }).then(data => data);
}

// 更新角色
export async function updateSystemRole(params) {
  return request('/permission/update_group', { method: 'POST', body: JSON.stringify(params) }).then(data => data);
}

// 获取最新的角色
export async function fetchSystemAuthorize() {
  return request('/permission/current_permission', { method: 'GET' }).then(data => data);
}
