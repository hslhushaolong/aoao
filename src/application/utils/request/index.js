/* eslint no-underscore-dangle: ["error", { "allow": ["_options"] }]*/

import fetch from 'dva/fetch';
import { message } from 'antd';
import RequestHelper from './helper';
import config from './../../../../config';
import { notification, authorize } from '../../index';

const baseUrl = config.prod;
const refreshTokenUrl = config.refreshToken;
const localInfoNameSpace = config.nameSpace;
const hours = config.hours;

/**
* 解析json
*
* @param  {object} response 返回数据
* @return {object}          解析数据
*/
function parseJSON(response) {
  return response.json();
}

/**
 * 检查网络请求的返回状态
 *
 * @param  {object} response 请求结果数据
 * @return {object}          如果状态成功，返回请求结果数据，失败则返回错误信息
 */
function checkHttpStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  if (response.status >= 400 && response.status < 500) {
    return response;
  }

  // 错误抛出
  const error = new Error(response.statusText);
  error.code = response.status;
  error.message = response.statusText;
  error.response = response;
  error.serverError = true;
  throw error;
}

// 检查服务器返回数据是否有错误
function checkServerError(data) {
  // 处理400错误，判断服务器数据错误
  if (data.err_code !== undefined && data.err_code) {
    const error = new Error(data.err_name);
    error.code = data.err_code;
    error.name = data.err_name;
    error.message = RequestHelper.getErrorMessage(data);
    error.response = data;
    throw error;
  }
  return data;
}

/**
 * 请求服务器
 *
 * @param  {[type]} uri     [description]
 * @param  {[type]} options [description]
 * @param  {[type]} type    [description]
 * @return {[type]}         [description]
 */
function request(uri, options, type) {
  // 默认的请求方式是get方式
  const _options = options || {
    method: 'get',
  };
  _options.headers = {};

  // 刷新缓存，屏蔽，数据没处理好，账户容易出问题
  // const accountInfo = JSON.parse(window.localStorage.getItem(localInfoNameSpace));
  // if (accountInfo != undefined) {
  //   refreshToken();
  // }

  let api;
  if (uri.match('https://(.*)qbox.me')) {
    // 如果是七牛、百度语音api就直接用外部的API
    api = uri;
  } else {
    api = baseUrl + uri;
    // 判断是否需要进行授权，如果需要进行授权，则使用xAuth
    _options.headers = RequestHelper.getHeaderBySign(type ? 'X-AUTH' : 'X-TOKEN');
    if (_options.method !== 'GET') {
      _options.headers['Content-Type'] = 'application/json';
    }
  }

  // 跨域
  Object.assign(_options, {
    mode: 'cors',
  });

  // 请求标识
  const requestKey = RequestHelper.uniqueString();
  if (notification.create) {
    notification.create(requestKey);
  }

  return fetch(api, _options)
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(checkServerError)
    .then((data) => {
      if (notification.success) {
        notification.success(requestKey);
      }
      return data;
    })
    .catch((error) => {
      if (notification.failure) {
        // 网络链接错误
        if (error.code === undefined && error.message === 'Failed to fetch') {
          notification.failure(requestKey, '请检查您的网络链接');
          return;
        }

        // 账户已过期，需要重新登陆
        if (error.code === 415001) {

          // message.info('账户已过期，请重新登录', 2);
          const timer = setTimeout(() => {
            authorize.clear();
            window.location.href = '/#/';
            window.location.reload();
            clearTimeout(timer);
          }, 2000);
          return;
        }

        // 处理错误信息
        let failureMessage = '';
        const code = error.code || '';
        const name = error.name || '';
        if (error.serverError) {
          failureMessage = `服务器错误：${error.message} ${code} ${name} `;
          notification.failure(requestKey, failureMessage);
        } else {
          notification.success(requestKey);
          message.error(`请求错误：${error.message}`, 5);
          console.log(`请求错误：${error.message} ${code} ${name} `);
        }
      }
      return error;
    });
}

// 判断token是否过期
function refreshToken() {
  let timestamp = Date.parse(new Date());
  const head = RequestHelper.getHeaderBySign('X-TOKEN');
  head['Content-Type'] = 'application/json';
  timestamp /= 1000;
  const accountInfo = JSON.parse(window.localStorage.getItem(localInfoNameSpace));
  if (accountInfo != undefined) {
    if (accountInfo.expired_at < timestamp) {
      // message.error('账户过期请重新登录');
      window.localStorage.removeItem(localInfoNameSpace);
      window.location.href = '/#/';
      window.location.reload();
    }
    // 提前一天刷新token
    else if (accountInfo.expired_at - timestamp < 3600 * hours && accountInfo.expired_at - timestamp > 0) {
      fetch(`${baseUrl}${refreshTokenUrl}`,
        {
          method: 'POST',
          headers: head,
          body: JSON.stringify({
            refresh_token: accountInfo.refresh_token,
          }),
        }).then(checkStatus)
        .then(parseJSON)
        .then((data) => {
          if (data.err_code) {
            if (data.err_code == 415001 || data.err_code == 415002) {
              const timer = setTimeout(() => {
                window.localStorage.removeItem('AOAOBOSS');
                window.location.href = '/#/';
                window.location.reload();
                clearTimeout(timer);
              }, 1000);
              return message.error('请重新登录');
            }
          } else {
            const refresh_result = data;
            let accountInfo = JSON.parse(window.localStorage.getItem(localInfoNameSpace));
            accountInfo.expired_at = refresh_result.expired_at;
            accountInfo.access_token = refresh_result.access_token;
            accountInfo.refresh_token = refresh_result.refresh_token;
            accountInfo.account_id = refresh_result.account_id;
            accountInfo = JSON.stringify(accountInfo);
            window.localStorage.setItem(localInfoNameSpace, accountInfo);
          }
        }).catch((err) => {
          return err;
        });
    }
  } else {
    window.localStorage.removeItem(localInfoNameSpace);
  }
}

export default request;
