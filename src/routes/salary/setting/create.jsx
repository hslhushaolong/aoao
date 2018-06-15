/**
 * 薪资模板添加
 */
import is from 'is_js';
import moment from 'moment';
import { withRouter } from 'dva/router';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { Component } from 'react';
import { message, Alert, Input, Button, Select, InputNumber, DatePicker, Form, Row, Col } from 'antd';
import { CoreForm, CoreContent } from '../../../components/core';
import { authorize, system } from './../../../application';
import { SalaryVerifyState, SalaryPaymentCricle, KnightTypeWorkProperty } from './../../../application/define';
import DateSlider from './create/dateSlider';
import SalarySubject from './create/salarySubject';
import AllSelect from '../../../components/AllSelect';

const { TextArea } = Input;
const { Option } = Select;
const { MonthPicker } = DatePicker;

class CreateComponent extends Component {
  constructor(props) {
    super(props);

    // 页面的路由判断，离开页面前的二次确认
    const { router, route } = this.props;
    const removeRouteLeaveHook = router.setRouteLeaveHook(route, () => { return '内容未保存，确定离开页面？'; });
    // 模块的使用模式，编辑 “edit”，创建 “create”，复制 “copy”
    const mode = dot.get(props, 'location.query.mode', 'create');
    // const state = dot.get(props, 'location.query.state', '');
    // console.log('state', state);
    // 操作的数据id
    const editId = dot.get(props, 'location.query.id', '');

    this.state = {
      baseinfo: {             // 基本信息
        position: undefined,  // 职位
        workProperty: [], // 工作类型
        jobCategory: [],  // 职位类型
        platform: [],     // 平台
        city: [],         // 城市
        district: [],     // 商圈
        nightShiftHour: 0,                  // 夜班在岗时常
        necessaryDutyTime: 0,               // 应在岗时长(小时)
        effectiveAttendanceDays: 0,         // 有效出勤
        paymentCricle: `${SalaryPaymentCricle.month}`, // 薪资计算周期
        note: '',   // 备注信息
        state: '',  // 保存新建薪资模板状态：保存or提交
        supplier_id: '',    // 供应商
      },

      subjects: [],     // 保存薪资项目数据
      // 模块的使用模式，编辑 “edit”，创建 “create”，复制 “copy”
      mode,
      // 当前编辑的id
      editId,
      // 是否停止加载详情
      isStopLoadDetail: false,
      specifications: null,  // 薪资指标库
      positionList: dot.get(props, 'salaryModel.positionList', []),   // 职位数据
      supplierList: dot.get(props, 'system.supplierList', []),        // 供应商列表
      areaList: dot.get(props, 'salaryModel.areaList', []),           // 商圈
    };
    this.private = {
      dispatch: props.dispatch,

      // 移除离开页面的钩子
      removeRouteLeaveHook,

      // 是否选则全部的时间
      selectedMaxBelongTime: 31,
    };


    // 获取要编辑的信息的详情数据
    if ((mode === 'edit' || mode === 'copy') && editId && editId !== '') {
      this.props.dispatch({ type: 'salaryModel/fetchSalaryDetail', payload: { id: editId } });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { mode, editId, isStopLoadDetail } = this.state;
    const detail = dot.get(nextProps, 'salaryModel.salarySetupDetail');
    // 薪资指标库
    const specifications = dot.get(nextProps, 'salaryModel.specifications', null);
    // 编辑模式, 复制模式
    if ((mode === 'edit' || mode === 'copy') && editId && editId !== '' && isStopLoadDetail === false) {
      if (Object.values(detail).length > 0) {
        this.onReceiveDetail(detail);
      } else {
        window.location.href = '/#/Salary/Setting';
      }
    }
    // 更新薪资指标库
    if (specifications !== null) {
      this.setState({
        specifications,
      });
    }

    // 判断请求是否成功，如果请求成功，则注销页面跳转提示，直接跳转
    const isSuccess = dot.get(nextProps, 'salaryModel.isUpsertSalarySuccess', false);
    if (isSuccess === true) {
      // 重置状态
      this.props.dispatch({ type: 'salaryModel/resetUpsertSalarySuccess' });

      // 页面的路由判断，离开页面前的二次确认
      if (this.private.removeRouteLeaveHook) {
        this.private.removeRouteLeaveHook();
      }
      window.onbeforeunload = undefined;
      location.href = '/#/Salary/Setting';
    }
    this.setState({
      positionList: dot.get(nextProps, 'salaryModel.positionList', []),   // 职位数据
      supplierList: dot.get(nextProps, 'system.supplierList', []),        // 供应商列表
      areaList: dot.get(nextProps, 'salaryModel.areaList', []),           // 商圈
    });
  }

  componentWillUnmount() {
    // 页面结束的时候，注销刷新
    if (this.private.removeRouteLeaveHook) {
      this.private.removeRouteLeaveHook();
    }
    window.onbeforeunload = undefined;
  }

  // 获取详情信息
  onReceiveDetail = (detail) => {
    // 城市
    const cityList = [];
    dot.get(detail, 'city_list', []).forEach((item) => {
      cityList.push(item.city_spelling);
    });
    // 骑士类型
    const knightList = [];
    dot.get(detail, 'knight_type_list', []).forEach((item) => {
      knightList.push(item._id);
    });
    // 商圈
    const district = [];
    dot.get(detail, 'biz_district_list', []).forEach((item) => {
      // 过滤负责范围内商圈
      if (authorize.districts(cityList).includes(item._id)) {
        district.push(item._id);
      }
    });

    const state = {
      // 基本信息
      baseinfo: {
        position: `${detail.position_id}`,                        // 职位
        jobCategory: knightList,                                  // 骑士类型
        workProperty: `${detail.work_type}`,                      // 工作类型
        paymentCricle: `${detail.pay_salary_cycle}`,              // 薪资计算周期
        platform: [detail.platform_code],                         // 平台
        city: cityList,                                           // 城市
        district,                                                 // 商圈
        nightShiftHour: detail.night_shift_should_be_on_duty,     // 夜班在岗时常
        necessaryDutyTime: detail.necessary_duty_time,            // 应在岗时长(小时)

        effectiveAttendanceDays: detail.valid_attendance,                     // 有效出勤
        note: `${detail.note}`,   // 备注信息
        state: detail.state,      // 薪资模板状态
        supplier_id: dot.get(detail, 'supplier_id', ''),  // 供应商
      },

      subjects: this.onTimes(detail),

      // 停止加载详情信息
      isStopLoadDetail: true,
    };

    this.setState(state, () => {
      // 获取可创建薪资模板商圈
      this.onGetEnableBiz();
    });
  }

  onTimes = (detail) => {
    // 平台
    const platformCode = detail.platform_code;
    // 薪资项目, default为默认项目
    const subjects = [
      { title: '底薪', color: '#72DE00', isDefault: true, subjects: [] },
      { title: '提成', color: '#0083DE', isDefault: true, subjects: [] },
      { title: '奖金', color: '#FF6C00', isDefault: true, subjects: [] },
      { title: '扣罚', color: '#DE0000', isDefault: true, subjects: [] },
    ];

    Object.values(detail.salary_formula_list).forEach((record) => {
      const subItems = [];
      Object.values(record.sub_item).forEach((subject) => {
        // 获取公式数据
        const data = [];
        Object.values(subject.logics).forEach((logic) => {
          const formulas = [];
          Object.values(logic.conditions).forEach((condition) => {
            formulas.push({
              index: condition.specifications,
              formula: condition.logic_symbol,
              options: { x: condition.first, y: condition.end },
            });
          });

          // 公式数据
          data.push({
            randomKey: Math.random(),
            platform: platformCode,
            formulas,
            condition: logic.condition_type,
            calculateFormula: logic.formula,
          });
        });
        // 子项目
        subItems.push({
          title: subject.name,
          times: subject.belong_time,  // 每条子项目时间
          subjects: data,
        });
      });

      // 判断当前的数据是否存在于subject中
      const title = record.formula_name;
      const index = ['底薪', '提成', '奖金', '扣罚'].indexOf(title);
      if (index !== -1) {
        // 存在
        subjects[index].subjects = subItems;
      } else {
        // 不存在，直接填充数据
        subjects.push({ title: record.formula_name, color: '#FFDA00', subjects: subItems });
      }
    });
    return subjects;
  }
  // 更换供应商
  onChangeSupplier = (e) => {
    // const { form } = this.props;
    const { baseinfo } = this.state;

    baseinfo.supplier = e;
    // baseinfo.city = [];
    baseinfo.district = [];
    // baseinfo.jobCategory = [];
    this.setState({ baseinfo });
    // 更新可创建薪资模板商圈
    this.onGetEnableBiz();
    // 清空选项
    // form.setFieldsValue({ city: [] });
    // form.setFieldsValue({ district: [] });
    // form.setFieldsValue({ jobCategory: [] });
  }
  // 更换平台
  onChangePlatform = (e) => {
    const { form } = this.props;
    const { baseinfo } = this.state;

    baseinfo.platform = [e];
    baseinfo.city = [];
    baseinfo.district = [];
    baseinfo.jobCategory = [];
    this.setState({ baseinfo });

    // 清空选项
    form.setFieldsValue({ city: [] });
    form.setFieldsValue({ district: [] });
    form.setFieldsValue({ jobCategory: [] });
  }

  // 更换城市
  onChangeCity = (e) => {
    const { form } = this.props;
    const { baseinfo } = this.state;

    // 保存城市参数
    baseinfo.city = e;
    baseinfo.district = [];
    this.setState({ baseinfo });

    // 获取可创建薪资模板商圈
    this.onGetEnableBiz();
    // 清空选项
    form.setFieldsValue({ district: [] });
  }
  // 更换职位
  onChangePosition = (e) => {
    const { baseinfo } = this.state;
    baseinfo.position = e;
    this.setState({ baseinfo });
    this.onGetEnableBiz();
  }
  // 获取可创建薪资模板商圈
  onGetEnableBiz = () => {
    const { dispatch } = this.private;
    const { baseinfo } = this.state;

    // 必传参数- 供应商、城市、职位
    if (baseinfo.city.length <= 0) {
      return;
    }
    if (baseinfo.position === '' || baseinfo.position === undefined) {
      return;
    }
    if (baseinfo.supplier === '') {
      return;
    }
    // 参数
    const payload = {
      supplier_id: baseinfo.supplier_id,
      city_spelling_list: baseinfo.city,
      position_id: baseinfo.position,
    };
    // 可选参数-骑士类型
    if (baseinfo.jobCategory.length > 0) {
      payload.knight_type_id_list = baseinfo.jobCategory;
    }

    dispatch({
      type: 'salaryModel/getEnableBizE',
      payload,
    });
  }
  // 更换区域
  onChangeDistrict = (e) => {
    const { baseinfo } = this.state;
    baseinfo.district = e;
    this.setState({ baseinfo });
  }

  // 更换职位类型
  onChangeWorkProperty = (e) => {
    const { form } = this.props;
    const { baseinfo } = this.state;

    baseinfo.workProperty = e;
    baseinfo.jobCategory = [];
    baseinfo.district = [];   // 修改工作性质时，清空骑士类型和商圈

    // 判断是否是兼职类型，如果是全职类型，则默认只显示月份
    if (`${e}` === `${KnightTypeWorkProperty.fulltime}`) {
      baseinfo.paymentCricle = `${SalaryPaymentCricle.asMonth}`;
      form.setFieldsValue({ paymentCricle: `${SalaryPaymentCricle.asMonth}`, jobCategory: [] });
    } else {
      baseinfo.paymentCricle = `${SalaryPaymentCricle.month}`;
      form.setFieldsValue({ paymentCricle: `${SalaryPaymentCricle.month}`, jobCategory: [] });
    }
    // 修改工作性质时，制空骑士类型
    this.onGetEnableBiz();
    // 清空选项
    form.setFieldsValue({ district: [] });
    this.setState({ baseinfo });
  }

  // 更换骑士类型
  onChangeKnigntType = (e) => {
    const { baseinfo } = this.state;
    baseinfo.jobCategory = e;
    this.setState({ baseinfo });
    // 更新可建商圈
    this.onGetEnableBiz();
  }

  // 更新subjects数据
  onChangeSubjects = (values) => {
    this.setState({ subjects: values.subjects });
  }
  // 提交 or 保存
  onClick = (state) => {
    this.setState({
      state: Number(state),
    });
  }

  // 提交模版
  onSubmitTemplate = (e) => {
    const { dispatch } = this.private;
    const { editId, mode, baseinfo, subjects, state } = this.state;

    const { city } = baseinfo;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error('操作模版错误', err);
        return;
      }
      // 作用时间必须选择完整的31天-未限制
      // if (selectedMaxBelongTime !== 31) {
      //   message.error('作用时间，请设置完整的31天');
      //   return;
      // }
      const { supplier_id, effectiveAttendanceDays, nightShiftHour, necessaryDutyTime, position, jobCategory, district, paymentCricle, workProperty, note } = values;

      if (is.empty(position) || is.not.existy(position)) {
        message.error('请填写职位信息');
        return;
      }

      // 验证职位类型id
      if (is.empty(jobCategory) || is.not.existy(jobCategory)) {
        message.error('请填写职位类型信息');
        return;
      }

      // 验证商圈参数
      if (is.empty(district) || is.not.existy(district)) {
        message.error('请填写商圈信息');
        return;
      }

      // 验证规则参数
      // const subjects = dot.get(times, '0.subjects');
      // if (is.empty(subjects) || is.not.existy(subjects)) {
      //   message.error('请填写规则信息');
      //   return;
      // }
      const payload = {
        supplier_id,                 // 供应商id
        effectiveAttendanceDays,  // 有效出勤
        nightShiftHour,           // 夜班在岗时常
        necessaryDutyTime,        // 应在岗时长(小时)
        position,         // 职位  只允许操作骑士和骑士长
        workProperty,     // 工作类型
        jobCategory,      // 职位类型
        city,             // 城市
        district,         // 商圈
        paymentCricle,    // 薪资付款周期
        subjects,
        note,             // 备注项
        id: editId,
        state,
      };
      // 编辑模式
      if (mode === 'edit') {
        dispatch({ type: 'salaryModel/updateSalaryModel', payload });
      }
      // 创建和复制模式下，服务器直接创建一条新数据
      if (mode === 'create' || mode === 'copy') {
        payload.state = state;
        dispatch({ type: 'salaryModel/createSalaryModel', payload });
      }
    });
  }

  // 是否禁用平台选择功能
  isDisableKnightTypeSelect = () => {
    const { mode, baseinfo } = this.state;
    const flag = mode === 'edit' && baseinfo.state === SalaryVerifyState.reject;
    // 如果是编辑状态且不通过时，则禁用
    if (flag) {
      return true;
    }
    return false;
  }

  // 渲染使用指南模块
  renderUsageInfo = () => {
    const description = (
      <Row>
        <Col span={12}>一、薪资规则设置前提条件：</Col>
        <Col span={12}>二、薪资规则设置操作步骤：</Col>

        <Col span={12}>1】仔细阅读薪资指标库中每个薪资指标的定义；</Col>
        <Col span={12}>1】设置基础信息（需要注意自定义项设置）；</Col>

        <Col span={12}>2】理解薪资项目之间求和、子项目之间求和、情况之间互斥的关系；</Col>
        <Col span={12}>2】添加子项目（需要设置子项目所使用的时间段）；</Col>

        <Col span={12}>3】薪资单总额为各项目之和；</Col>
        <Col span={12}>3】添加情况（需要了解各指标对应的薪资规则“）；</Col>

        <Col span={12} />
        <Col span={12}>4】填写备注项（系统无法设置的规则备注，做补扣款提交）；</Col>

        <Col span={12} />
        <Col span={12}>5】点击提交审核；</Col>
      </Row>
    );
    const props = {
      message: '提示信息',
      description,
      type: 'warning',
      showIcon: true,
    };
    return (
      <Alert {...props} style={{ marginBottom: '10px' }} />
    );
  }

  // 渲染基本选项
  renderBaseInfo = () => {
    const { isDisableKnightTypeSelect, onChangeKnigntType } = this;
    const { baseinfo } = this.state;
    const { supplier_id, position, jobCategory, platform, city, district, effectiveAttendanceDays, nightShiftHour, necessaryDutyTime, paymentCricle, workProperty } = baseinfo;
    const { getFieldDecorator } = this.props.form;
    // 如果骑士类型是不是全职，如果是全职，默认只显示月份
    const isOnlyShowDefaultPaymentCricle = `${workProperty}` === `${KnightTypeWorkProperty.fulltime}`;

    let paymentList = [];
    if (isOnlyShowDefaultPaymentCricle) {
      paymentList = [
        SalaryPaymentCricle.asMonth,
      ];
    } else {
      paymentList = [
        SalaryPaymentCricle.month,
        SalaryPaymentCricle.halfMonth,
        SalaryPaymentCricle.week,
        SalaryPaymentCricle.daily,
      ];
    }
    const formItems = [
      {
        label: '供应商',
        form: (
          getFieldDecorator('supplier_id', { initialValue: supplier_id })(
            <Select placeholder="请选择供应商" onChange={this.onChangeSupplier} disabled={isDisableKnightTypeSelect()}>
              {
                dot.get(this, 'state.supplierList.data', []).map((item, index) => {
                  const key = item._id + index;
                  return (<Option value={item._id} key={key}>{item.supplier_name}</Option>);
                })
              }
            </Select>,
          )
        ),
      },
      {
        label: '平台',
        form: (
          getFieldDecorator('platform', { initialValue: platform })(
            <Select placeholder="请选择平台" onChange={this.onChangePlatform} disabled={isDisableKnightTypeSelect()}>
              {
                authorize.platform().map((item, index) => {
                  const key = item.id + index;
                  return (<Option value={item.id} key={key}>{item.name}</Option>);
                })
              }
            </Select>,
          )
        ),
      },
      {
        label: '城市',
        form: (
          getFieldDecorator('city', { initialValue: city })(
            <AllSelect showSearch optionFilterProp="children" placeholder="请选择城市" mode="multiple" onChange={this.onChangeCity} disabled={isDisableKnightTypeSelect()}>
              {
                authorize.cities(platform).map((item, index) => {
                  const key = item + index;
                  return (<Option value={item.id} key={key}>{item.description}</Option>);
                })
              }
            </AllSelect>,
          )
        ),
      },
      {
        label: '职位',
        form: (
          getFieldDecorator('position', { initialValue: position })(
            <Select placeholder="请选择职位" disabled={isDisableKnightTypeSelect()} onChange={this.onChangePosition}>
              {this.state.positionList.map((item, index) => {
                return <Option value={`${item.gid}`} key={index}>{item.name}</Option>;
              })}
            </Select>,
          )
        ),
      },
      {
        label: '工作性质',
        form: (
          getFieldDecorator('workProperty', { initialValue: workProperty })(
            <Select placeholder="请选择骑士类型" onChange={this.onChangeWorkProperty} disabled={isDisableKnightTypeSelect()}>
              <Option value={`${KnightTypeWorkProperty.fulltime}`}>{KnightTypeWorkProperty.description(KnightTypeWorkProperty.fulltime)}</Option>
              <Option value={`${KnightTypeWorkProperty.parttime}`}>{KnightTypeWorkProperty.description(KnightTypeWorkProperty.parttime)}</Option>
            </Select>,
          )
        ),
      },
      {
        label: '骑士类型设置',
        form: (
          getFieldDecorator('jobCategory', { initialValue: jobCategory })(
            <Select showSearch optionFilterProp="children" mode="multiple" placeholder="请选择骑士类型" onChange={onChangeKnigntType} disabled={isDisableKnightTypeSelect()}>
              {system.knightTypeByWorkProperty(workProperty).map((item) => {
                return <Option key={item.id} value={`${item.id}`}>{item.name}</Option>;
              })}
            </Select>,
          )
        ),
      },
      {
        label: '计算周期',
        form: (
          getFieldDecorator('paymentCricle', { initialValue: paymentCricle })(
            <Select placeholder="请选择计算周期" onChange={this.onChangePaymentCricle} disabled={isDisableKnightTypeSelect()}>
              {paymentList.map((item) => {
                return <Option key={item} value={`${item}`}>{SalaryPaymentCricle.description(item)}</Option>;
              })}
            </Select>,
          )),
      },
      {
        label: '商圈',
        form: (
          getFieldDecorator('district', { initialValue: district })(
            <Select showSearch optionFilterProp="children" placeholder="请选择商圈" mode="multiple" onChange={this.onChangeDistrict} disabled={isDisableKnightTypeSelect()}>
              {
                // 编辑、复制时过滤不负责商圈
                this.state.areaList.map((item, index) => {
                  // 禁用商圈不可选择:-100
                  if (item.state && item.state === -100) {
                    return <Option key={index} value={item.biz_id} disabled>{item.biz_name}</Option>;
                  }
                  return <Option key={index} value={item.biz_id} >{item.biz_name}</Option>;
                })
              }
            </Select>,
          )),
      },
    ];
    // 后端不支持编辑基本信息，除有效出勤字段
    if (dot.get(platform, '0') === 'elem') {
      formItems.push({
        label: '有效出勤',
        form: (
          <div>
            <span> >= </span>
            {getFieldDecorator('effectiveAttendanceDays', { initialValue: effectiveAttendanceDays })(<InputNumber min={0} />)}单／天
                </div>
        ),
      });
    }

    if (dot.get(platform, '0') === 'baidu') {
      formItems.push({
        label: '夜班应在岗时长',
        form: (
          <div>
            {getFieldDecorator('nightShiftHour', { initialValue: nightShiftHour })(<InputNumber min={0} />)}小时
          </div>
        ),
      });
      formItems.push({
        label: '应在岗时长(小时)',
        form: (
          <div>
            {getFieldDecorator('necessary_duty_time', { initialValue: necessaryDutyTime })(<InputNumber min={0} />)}小时
          </div>
        ),
      });
    }

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <CoreContent title="模版信息设置" style={{ backgroundColor: '#FAFAFA' }}>
        <CoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 渲染薪资项目
  renderSalaryItems = () => {
    const { onChangeSubjects } = this;
    const { baseinfo, subjects, specifications } = this.state;
    const { platform } = baseinfo;

    const salarySubject = {
      value: {
        // id: index,
        subjects,
        platform,
        specifications,   // 薪资指标库
      },
      onChangeSubjects,
    };
    return (
      <div>
        {/* 薪资规则对象 */}
        <SalarySubject {...salarySubject} />
      </div>
    );
  }
  // 渲染时间设置--废弃
  renderSalaryBelongTimes = () => {
    const { onCreateBelongTime, onDeleteBelongTime, onChangeBelongTime, onChangeSubjects } = this;
    const { times, baseinfo } = this.state;
    const { platform, workProperty } = baseinfo;

    // 判断是否是全职，不是全职的不能编辑时间
    const isDisabled = (`${workProperty}` === `${KnightTypeWorkProperty.fulltime}`) === false;
    const content = [];
    times.forEach((record, index) => {
      const { belongTime, subjects } = record;
      const dateSliderProps = {
        value: {
          id: index,
          min: belongTime[0],                       // 最小值
          max: belongTime[1],                       // 最大值
          selected: belongTime[1],                  // 选中数据
          disabled: (index !== times.length - 1) || isDisabled,   // 是否禁用(除最后一条数据不禁用，其余全部禁用)
          canCreate: platform.length > 0,           // 判断是否能够创建
        },
        onChangeSlider: onChangeBelongTime,
        onCreateSlider: onCreateBelongTime,
        onDeleteSlider: onDeleteBelongTime,
      };

      const salarySubject = {
        value: {
          id: index,
          subjects,
          platform,
        },
        onChangeSubjects,
      };
      content.push(
        <CoreContent key={`belongTime-${index}`}>
          {/* 日期选择 */}
          <DateSlider {...dateSliderProps} />

          {/* 薪资规则对象 */}
          <SalarySubject {...salarySubject} />
        </CoreContent>,
      );
    });
    return content;
  }

  // 渲染备注信息
  renderNote = () => {
    const { baseinfo } = this.state;
    const { note } = baseinfo;
    const { getFieldDecorator } = this.props.form;

    const formItems = [
      {
        label: '备注项',
        form: (
          getFieldDecorator('note', { initialValue: note })(
            <TextArea rows={6} />,
          )
        ),
      },
    ];

    const layout = { labelCol: { span: 2 }, wrapperCol: { span: 22 } };
    return (
      <CoreContent style={{ backgroundColor: '#FAFAFA' }}>
        <CoreForm items={formItems} cols={1} layout={layout} />
      </CoreContent>
    );
  }

  render() {
    const { renderUsageInfo, renderBaseInfo, renderSalaryItems, renderNote } = this;
    // 页面刷新的弹窗提示
    window.onbeforeunload = function (event) {
      return '内容未保存，确定离开页面？';
    };
    return (
      <Form layout="horizontal" onSubmit={this.onSubmitTemplate}>
        {/* 使用说明 */}
        {renderUsageInfo()}

        {/* 创建模版的表单 */}
        {renderBaseInfo()}

        {/* 渲染时间列表数据 */}
        {/* { renderSalaryBelongTimes() } */}

        {/* 渲染项目 */}
        {renderSalaryItems()}

        {/* 备注信息 */}
        {renderNote()}
        {/* 表单提交按钮 */}
        <CoreContent style={{ textAlign: 'center' }}>
          <Button onClick={() => window.location.href = '/#/Salary/Setting'}>返回</Button>
          <Button htmlType="submit" style={{ margin: '0 20px' }} onClick={() => this.onClick(SalaryVerifyState.saving)}>保存</Button>
          <Button type="primary" htmlType="submit" onClick={() => this.onClick(SalaryVerifyState.pendding)}>提交</Button>
        </CoreContent>
      </Form>
    );
  }
}

function mapStateToProps({ salaryModel, system }) {
  return { salaryModel, system };
}

export default withRouter(connect(mapStateToProps)(Form.create()(CreateComponent)));
