/**
 * 账户异常处理
 **/
import is from 'is_js';
import { message } from 'antd';

import { updateAccountException, fetchAccountException } from './../services/system';
import { authorize } from '../application';
import accountException from '../application/utils/accountException';
import Operate from '../application/define/operate';

export default {

  namespace: 'AccountException',
  state: {

    // 账户列表
    accountExceptionData: {
      flag: false,
      _meta: {
        result_count: 0,
        has_more: true,
      },
      result: [],
    },

  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location;
        // 如果账号处于未登录，不进行处理
        if (authorize.isLogin() === false) {
          return;
        }
        // 超管不调用异常账号处理;
        if (authorize.account.role.id === 1000) {
          return;
        }
        // 检查状态，判断是否有权限查看异常的账号
        if (Operate.canOperateSystemCheckAccountException() === false) {
          return;
        }
        // 如果已经在异常页面，则获取新的数据
        if (pathname === '/System/AccountException/Manage') {
          dispatch({ type: 'fetchAccountExceptionData', payload: { account_id: authorize.account.id } });
        }

        // 判断是否显示异常页面
        if (accountException.isDisplayException() === true) {
          window.location.href = '/#/System/AccountException/Manage';
          return;
        }

        // 判断是否检测账户异常
        if (accountException.isCheckException() === true) {
          dispatch({ type: 'checkAccountExcepition', payload: { account_id: authorize.account.id } });
        }
      });
    },
  },

  effects: {

    // 获取异常员工列表
    * fetchAccountExceptionData({ payload }, { call, put }) {
      const result = yield call(fetchAccountException, payload);
      if (result === undefined) {
        // 如果断网就跳到异常管理页
        window.location.href = '/#/System/AccountException';
        return;
      }
      if (result.flag) {
        // 更新数据
        yield put({ type: 'fetchAccountExceptionR', payload: result });
      } else {
        // 如果数据被其他账户处理，则跳回异常记录管理页
        accountException.exceptionChecked(false);
        window.location.href = '/#/System/AccountException';
        window.location.reload();
      }
    },

    // 检查是否有异常员工数据
    * checkAccountExcepition({ payload }, { call }) {
      const result = yield call(fetchAccountException, payload);
      if (result === undefined) {
        return;
      }

      if (result.flag !== true) {
        // 记录当前请求的时间戳
        accountException.exceptionChecked(false);
        return;
      }

      // 记录当前请求的时间戳
      accountException.exceptionChecked(true);

      // 是否跳转到异常界面
      if (accountException.isDisplayException() === true) {
        window.location.href = '/#/System/AccountException/Manage';
      }
    },

    // 处理异常员工
    *updateAccountExceptionData({ payload }, { call }) {
      const { list } = payload;
      const records = [];
      // 保存处理方式
      const handlingList = [];
      // 处理需要提交的数据格式
      list.forEach((item) => {
        // 基础数据格式
        const record = {
          _id: item._id,
          boss_state: Number(item.boss_state),
          error_reason: Number(item.error_reason),
          name: item.name,
          phone: item.phone,
          platform_state: Number(item.platform_state),
          position_id: Number(item.position_id),
          handling: Number(item.handling),
          staff_id: item.staff_id,
        };

        // 判断用户自定义的描述
        if (is.existy(item.desc) && is.not.empty(item.desc)) {
          record.desc = item.desc;
        }
        handlingList.push(item.handling);
        records.push(record);
      });

      // 提交后台的参数
      const params = {
        account_id: authorize.account.id,
        all_error_staff_list: records,
      };
      
      const result = yield call(updateAccountException, params);
      if (result.ok) {
        // 异常处理完成
        accountException.hideException();
        if (result.handle_flag) {
        // 判断是否处理过
          message.warning('异常账号已被其他管理员处理');
        } else {
          message.success('异常账号提交成功');
        }

        // 循环所有错误处理结果，有要入职的处理结果就直接跳转到入职页
        let hasNewEmployee = false;
        for (let i = 0; i < records.length; i += 1) {
          // 员工未入职，马上操作入职
          if (records[i].handling === 40010) {
            hasNewEmployee = true;
          }
        }

        // 判断是否有新员工，跳转到异常账号管理界面
        if (hasNewEmployee === false) {
          window.location.href = '/#/System/AccountException';
        }

        // 判断处理方式是否有立即补充入职流程,有则跳转到【今日待入职员工页面】
        if (handlingList.includes('40010')) {
          // 跳转到待入职页面
          message.success('您有新入职的骑士需要处理, 页面跳转中..',2);
          setTimeout(() => {
            window.location.href = '/#/Employee/TodayEntry';
          }, 3000);
        }
        
      }
    },
  },

  reducers: {
    // 账户列表
    fetchAccountExceptionR(state, action) {
      return {
        ...state,
        accountExceptionData: action.payload,
      };
    },
  },
};
