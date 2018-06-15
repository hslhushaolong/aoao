/**
 * 用户登陆model层模块
 **/
import { message } from 'antd';
import { authorize, system } from '../application/';
import { Account } from '../application/object';
import { getVerifyCode, login, loginClear, exchangeAccount } from '../services/login.js';
import accountException from '../application/utils/accountException';
import Operate from '../application/define/operate';
import { Errors } from '../application/define';

import { systemConstant } from './../services/system';

export default {
  namespace: 'login',
  state: {
    verifyCode: '',  // 登陆验证码
  },

  subscriptions: {
    setup({ dispatch, history }) {

    },
  },

  effects: {

    // 获取验证码
    *getVerifyCodeE({ payload }, { call, put }) {
      const result = yield call(getVerifyCode, payload);
      if (result.ok) {
        message.success('验证码发送成功', 2);
      } else if (result.verify_code) {
        // 测试环境，验证码直接填充到输入框中
        message.success(`验证码发送成功 ${result.verify_code}`, 2);
        yield put({ type: 'reduceVerifyCode', payload: result.verify_code });
      }
    },

    // 登录
    *loginE({ payload }, { call, put }) {
      const result = yield call(login, payload);
      if (!result || result.code) {
        message.error('登陆失败', result.code && result.code);
      } else {
        // 存储token,方便调用
        const accountInfo = JSON.stringify(result);
        if (accountInfo != undefined && accountInfo !== '{}') {
          // 存储用户信息
          window.localStorage.setItem('AOAOBOSS', accountInfo);

          // 存储多供应商信息
          authorize.vendors = result.allow_exchange_account;

          if (result.allow_exchange_account.length === 0) {
            // 构造当前账号供应商信息(用户判断是否跳转多账号页面)
            authorize.vendor = { supplierId: result.supplier_id ? result.supplier_id : '', supplierName: result.supplier_name };
          }
          // 登录后存储当前服务商信息
          authorize.setAuthVendor(result.supplier_id, result.supplier_name);
          // 登陆成功后的用户信息，转化成数据对象
          authorize.account = Account.mapper(result);

          // 是否登陆
          if (authorize.isLogin() === false) {
            message.error('登录失败，请重试');
            return;
          }
          // 如果有账户异常需要显示，则跳转
          if (Operate.canOperateSystemCheckAccountException() === true && accountException.isDisplayException()) {
            window.location.href = '/#/System/AccountException/Manage';
            return;
          }

          // 获取系统常量
          const constantJson = yield call(systemConstant, payload);
          const constant = JSON.stringify(constantJson);
          window.localStorage.setItem('AOAOBOSS_CONSTANT', constant);

          // 登陆成功跳转
          message.success('登录成功, 页面跳转中...');

          const accounts = authorize.vendors;
          if (authorize.isLogin() === true && authorize.isAuth() === false) {
            // 多账号时，进入多账号页面
            setTimeout(() => { window.location.href = '/#/authorize/auth'; }, 1000);
          } else {
            // 唯一账号自动跳入
            setTimeout(() => {
              window.location.href = '/#/Account';
              window.location.reload();
            }, 3000);
          }
        }
      }
    },

    // 切换账号
    *exchangeAccountE({ payload }, { call, put }) {
      const accountId = payload.accountId;
      // 判断参数
      if (!accountId || accountId.length !== 24) {
        message.error('服务商ID错误，无法获取账户信息');
        return;
      }
      const result = yield call(exchangeAccount, payload);
      if (!!result && result === undefined) {
        message.error(`切换账号失败 : ${Errors.message(result.err_code)}`);
      }
      if (result !== undefined && result !== '{}') {
        // 更新所有信息
        // 存储token,方便调用
        const accountInfo = JSON.stringify(result);
        window.localStorage.setItem('AOAOBOSS', accountInfo);
        // 登陆成功后的用户信息，转化成数据对象
        authorize.account = Account.mapper(result);
        // 存储多供应商信息
        authorize.vendors = result.allow_exchange_account;
        // 构造当前账号供应商信息
        authorize.vendor = { supplierId: result.supplier_id, supplierName: result.supplier_name };
        // 切换成功，更新账号供应商信息
        authorize.setAuthVendor(result.supplier_id, result.supplier_name);

        // 是否登陆
        if (authorize.isLogin() === false) {
          message.error('登录失败，请重试');
          return;
        }
        // 唯一账号自动跳入
        setTimeout(() => {
          window.location.href = '/#/Account';
          window.location.reload();
        }, 3000);
      }
    },

    // 注销登录
    *loginClear({ payload }, { call, put }) {
      payload = {
        access_token: authorize.account.accessToken, // 注销的用户 token
      };
      // 判断退出时，是否有access_token，有则调用，否则不调用注销,只清除缓冲
      if (payload.access_token) {
        const result = yield call(loginClear, payload);
        if (!result || (result.code && result.code)) {
          message.error(`退出失败 ${result.message}`, 2);
          return;
        }
        console.log('===result===', result);
        message.success('注销成功', 1);
      }

      setTimeout(() => {
        console.log('===隐含bug调试=======');
        console.log('===隐含bug调试=======');
        authorize.clear();
        system.clear();
        // 跳转到首页
        location.href = '/';
      }, 500);
    },
  },

  reducers: {

    // 更新验证码（测试环境下会调用）
    reduceVerifyCode(state, action) {
      return { ...state, verifyCode: action.payload };
    },
  },

};
