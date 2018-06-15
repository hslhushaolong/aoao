/**
 * 薪资任务相关
 * */
import is from 'is_js';
import moment from 'moment';
import { message } from 'antd';
import { SalaryTaskTime, SalaryPaymentCricle, KnightTypeWorkProperty } from '../../application/define';

import { fetchSalaryTasks, createSalaryTasks } from './../../services/salary';

export default {

  namespace: 'SalaryTaskModel',
  state: {
    salaryTasks: [],  // 薪资更新任务列表
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location;
        switch (pathname) {
          // 薪资更新任务列表
          case '/Salary/Task':
            dispatch({ type: 'fetchSalaryTasks', payload: { page: 1, limit: 30 } });
            break;
        }
      });
    },
  },

  effects: {

    // 获取薪资更新任务列表
    *fetchSalaryTasks({ payload }, { call, put }) {
      const params = {
        page: payload.page ? payload.page : 1,
        limit: payload.limit ? payload.limit : 30,
      };
      // 平台查询
      if (is.existy(payload.platform) && is.not.empty(payload.platform)) {
        params.platform_code = payload.platform;
      }
      // 城市查询
      if (is.existy(payload.city) && is.not.empty(payload.city)) {
        params.city_spelling_list = payload.city;
      }
      // 商圈查询
      if (is.existy(payload.district) && is.not.empty(payload.district)) {
        params.biz_district_id_list = payload.district;
      }
      // 角色查询
      if (is.existy(payload.position) && is.not.empty(payload.position)) {
        params.position_id_list = payload.position.map(item => Number(item));
      }
      // 职位类型
      if (is.existy(payload.workType) && is.not.empty(payload.workType)) {
        params.work_type = payload.workType;
      }
      // 骑士类型
      if (is.existy(payload.knightType) && is.not.empty(payload.knightType)) {
        params.knight_type_id_list = [payload.knightType];
      }
      // 薪资计算周期
      if (is.existy(payload.paymentCricle) && is.not.empty(payload.paymentCricle)) {
        params.pay_salary_cycle_list = payload.paymentCricle.map(item => Number(item));
      }
      // 薪资计算周期
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state_list = [Number(payload.state)];
      }
      // 日期
      if (is.existy(payload.startDate) && is.not.empty(payload.startDate) && is.existy(payload.endDate) && is.not.empty(payload.endDate)) {
        params.date = [payload.startDate, payload.endDate];
      }
      // 工作性质
      if (is.existy(payload.workProperty) && is.not.empty(payload.workProperty)) {
        params.work_type = Number(payload.workProperty);
      }

      const result = yield call(fetchSalaryTasks, params);

      if (result && is.existy(result.data)) {
        yield put({ type: 'reduceSalaryTasks', payload: result });
      } else {
        message.error('获取列表数据错误', result);
      }
    },

    // 创建薪资更新任务
    *createSalaryTasks({ payload }, { call, put }) {
      const params = {
        platform_code: payload.platform,
        work_type: Number(payload.workProperty),      // 职位类型
        compute_time_slot: Number(payload.taskTime),  // 更新时间段
      };

      // 判断薪资更新时间段类型. 赋值日期参数
      if (payload.taskTime === `${SalaryTaskTime.daily}`) {
        params.compute_date = moment(payload.date).format('YYYY-MM-DD');
      } else {
        params.compute_date = moment(payload.month).format('YYYY-MM-01');
      }

      // 薪资计算周期
      switch (Number(payload.taskTime)) {
        // 按月
        case SalaryTaskTime.month:
          // 判断是否是全职，如果是全职，只显示特定的月份选项
          if (Number(payload.workProperty) === KnightTypeWorkProperty.fulltime) {
            params.pay_salary_cycle = SalaryPaymentCricle.asMonth;
          } else {
            params.pay_salary_cycle = SalaryPaymentCricle.month;
          }
          break;

        // 按半月
        case SalaryTaskTime.earlyMonth:
        case SalaryTaskTime.lastMonth:
          params.pay_salary_cycle = SalaryPaymentCricle.halfMonth;
          break;

        // 按旬
        case SalaryTaskTime.earlyPeriod:
        case SalaryTaskTime.middlePeriod:
        case SalaryTaskTime.lastPeriod:
          params.pay_salary_cycle = SalaryPaymentCricle.period;
          break;

        // 按周
        case SalaryTaskTime.weekOne:
        case SalaryTaskTime.weekTwo:
        case SalaryTaskTime.weekThree:
        case SalaryTaskTime.weekFour:
          params.pay_salary_cycle = SalaryPaymentCricle.week;
          break;

        // 按天
        case SalaryTaskTime.daily:
          params.pay_salary_cycle = SalaryPaymentCricle.daily;
          break;
        default: break;
      }

      // 城市查询
      if (is.existy(payload.city) && is.not.empty(payload.city)) {
        params.city_spelling_list = payload.city;
      }
      // 商圈查询
      if (is.existy(payload.district) && is.not.empty(payload.district)) {
        params.biz_district_id_list = payload.district;
      }
      // 角色查询
      if (is.existy(payload.position) && is.not.empty(payload.position)) {
        params.position_id_list = [Number(payload.position)];
      }
      // 骑士类型
      if (is.existy(payload.knightType) && is.not.empty(payload.knightType)) {
        params.knight_type_id_list = payload.knightType;
      }
      // 供应商
      if (is.existy(payload.supplier_id) && is.not.empty(payload.supplier_id)) {
        params.supplier_id = payload.supplier_id;
      }

      const result = yield call(createSalaryTasks, params);

      if (result) {
        message.success('操作成功');
        yield put({ type: 'fetchSalaryTasks', payload: { page: 1, limit: 30 } });
      } else {
        message.error('创建薪资更新任务失败', result);
      }
    },

  },

  reducers: {
    // 薪资任务列表
    reduceSalaryTasks(state, action) {
      return { ...state, salaryTasks: action.payload };
    },
  },
};
