/**
 * 薪资模板列表
 */
import is from 'is_js';
import moment from 'moment';
import React, { Component } from 'react';
import { Select, DatePicker } from 'antd';

import { CoreSearch, CoreContent } from '../../../components/core';
import { authorize, system } from './../../../application';
import { SalaryPaymentCricle, KnightTypeWorkProperty, SalaryVerifyState } from './../../../application/define';

const { RangePicker } = DatePicker;
const { Option } = Select;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: undefined,  // 搜索的form
      search: {
        platform: '',       // 平台
        city: [],           // 城市
        district: [],       // 商圈
        paymentCricle: '',  // 薪资计算周期
        knightType: '',     // 职位类型
        position: '',       // 职位
        verifyState: '',    // 审核状态
        dateRange: [],      // 申请创建日期
        workProperty: '',  // 工作性质
      },
      positionList: props.positionList,  // 职位信息
    };
  }

  // 更换平台
  onChangePlatform = (e) => {
    const { form, search } = this.state;

    search.platform = e;
    search.city = [];
    search.district = [];
    search.knightType = '';
    this.setState({ search });

    // 清空选项
    form.setFieldsValue({ city: [] });
    form.setFieldsValue({ district: [] });
    form.setFieldsValue({ knightType: '' });
  }

  // 更换城市
  onChangeCity = (e) => {
    const { form, search } = this.state;
    if (e.length <= 0) {
      search.city = [];
      search.district = [];
      this.setState({ search });

      // 清空选项
      form.setFieldsValue({ district: [] });
      return;
    }
    // 保存城市参数
    search.city = e;
    this.setState({ search });
  }

  // 更换区域
  onChangeDistrict = (e) => {
    const { search } = this.state;
    search.district = e;
    this.setState({ search });
  }

  // 更换职位
  onChangePosition = (e) => {
    const { search } = this.state;
    search.position = e;
    this.setState({ search });
  }

  // 更换职位类型
  onChangeKnightType = (e) => {
    const { form, search } = this.state;
    search.knightType = e;
    // 判断是否是兼职类型，如果不是兼职类型，则重置数据
    if (system.knightTypeById(e).includes('兼职') === false) {
      search.paymentCricle = '';
      form.setFieldsValue({ paymentCricle: '' });
    }
    this.setState({ search });
  }

  // 更换工作性质
  onChangeWorkProperty = (e) => {
    const { search, form } = this.state;
    search.knightType = '';
    search.workProperty = Number(e);
    form.setFieldsValue({ knightType: '' });
    this.setState({ search });
  }

  // 更新薪资计算周期
  onChangePaymentCricle = (e) => {
    const { search } = this.state;
    search.paymentCricle = Number(e);
    this.setState({ search });
  }

  // 更新审核状态
  onChangeVerifyState = (e) => {
    const { search } = this.state;
    search.verifyState = Number(e);
    this.setState({ search });
  }

  // 重置
  onReset = () => {
    this.setState({
      search: {
        platform: '',     // 平台
        city: [],         // 城市
        district: [],     // 商圈
        knightType: [],   // 职位类型
        paymentCricle: '', // 薪资计算周期
        position: '',     // 职位
        verifyState: '',    // 审核状态
        dateRange: [],    // 申请创建日期
        workProperty: '',  // 工作性质
      },
    });

    // 刷新列表
    this.props.searchHandle();
  }

  // 搜索
  onSearch = (values) => {
    const { platform, position, district } = this.state.search;

    const params = values;
    params.district = district;
    params.position = position;
    params.platform = platform;
    params.page = 1;
    params.limit = 30;
    if (is.existy(values.dateRange)) {
      params.startDate = values.dateRange[0] ? moment(values.dateRange[0]).format('YYYY-MM-DD') : '';
      params.endDate = values.dateRange[1] ? moment(values.dateRange[1]).format('YYYY-MM-DD') : '';
    }
    this.props.searchHandle(params);
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 搜索功能
  render = () => {
    const { platform, city, district, knightType, paymentCricle, position, dateRange, workProperty, verifyState } = this.state.search;

    // 如果骑士类型不是兼职，则停止使用该选项
    const isDisabledPaymentCricle = (system.knightTypeById(knightType).includes('兼职') === false);

    const items = [
      {
        label: '平台',
        form: form => (form.getFieldDecorator('platform', { initialValue: platform })(
          <Select allowClear placeholder="请选择平台" onChange={this.onChangePlatform}>
            {
              authorize.platform().map((item, index) => {
                const key = item.id + index;
                return (<Option value={item.id} key={key}>{item.name}</Option>);
              })
            }
          </Select>,
        )),
      },
      {
        label: '城市',
        form: form => (form.getFieldDecorator('city', { initialValue: city })(
          <Select allowClear showSearch optionFilterProp="children" placeholder="请选择城市" mode="multiple" onChange={this.onChangeCity}>
            {
              authorize.cities([platform]).map((item, index) => {
                const key = item + index;
                return (<Option value={item.id} key={key}>{item.description}</Option>);
              })
            }
          </Select>,
        )),
      },
      {
        label: '商圈',
        form: form => (form.getFieldDecorator('district', { initialValue: district })(
          <Select allowClear showSearch optionFilterProp="children" placeholder="商圈" mode="multiple" onChange={this.onChangeDistrict}>
            {
              authorize.districts(city).map((item, index) => {
                return <Option key={index} value={item.id}>{item.name}</Option>;
              })
            }
          </Select>,
        )),
      },
      {
        label: '工作性质',
        form: form => (form.getFieldDecorator('workProperty', { initialValue: workProperty })(
          <Select allowClear placeholder="请选择工作性质" onChange={this.onChangeWorkProperty}>
            <Option value={`${KnightTypeWorkProperty.fulltime}`}>{KnightTypeWorkProperty.description(KnightTypeWorkProperty.fulltime)}</Option>
            <Option value={`${KnightTypeWorkProperty.parttime}`}>{KnightTypeWorkProperty.description(KnightTypeWorkProperty.parttime)}</Option>
          </Select>,
        )),
      },
      {
        label: '骑士类型',
        form: form => (form.getFieldDecorator('knightType', { initialValue: knightType })(
          <Select allowClear showSearch optionFilterProp="children" placeholder="请选择骑士类型" onChange={this.onChangeKnightType}>
            {system.knightTypeByWorkProperty(workProperty).map((item, index) => {
              return (<Option value={`${item.id}`} key={index}>{item.name}</Option>);
            })}
          </Select>,
        )),
      },
      {
        label: '薪资计算周期',
        form: form => (form.getFieldDecorator('paymentCricle', { initialValue: paymentCricle })(
          <Select allowClear placeholder="请选择薪资计算周期" onChange={this.onChangePaymentCricle} disabled={isDisabledPaymentCricle}>
            <Option value={`${SalaryPaymentCricle.month}`}>{SalaryPaymentCricle.description(SalaryPaymentCricle.month)}</Option>
            <Option value={`${SalaryPaymentCricle.halfMonth}`}>{SalaryPaymentCricle.description(SalaryPaymentCricle.halfMonth)}</Option>
            <Option value={`${SalaryPaymentCricle.week}`}>{SalaryPaymentCricle.description(SalaryPaymentCricle.week)}</Option>
            <Option value={`${SalaryPaymentCricle.daily}`}>{SalaryPaymentCricle.description(SalaryPaymentCricle.daily)}</Option>
          </Select>,
        )),
      },
      {
        label: '职位',
        form: form => (form.getFieldDecorator('position', { initialValue: position })(
          <Select allowClear placeholder="请选择职位" onChange={this.onChangePosition}>
            {this.state.positionList.map((item, index) => {
              const key = item.gid + index;
              return <Option value={`${item.gid}`} key={key}>{item.name}</Option>;
            })}
          </Select>,
        )),
      },
      {
        label: '审核状态',
        form: form => (form.getFieldDecorator('verifyState', { initialValue: verifyState })(
          <Select allowClear placeholder="请选择审核状态" onChange={this.onChangeVerifyState}>
            <Option value={`${SalaryVerifyState.pendding}`}>{SalaryVerifyState.description(SalaryVerifyState.pendding)}</Option>
            <Option value={`${SalaryVerifyState.reject}`}>{SalaryVerifyState.description(SalaryVerifyState.reject)}</Option>
            <Option value={`${SalaryVerifyState.working}`}>{SalaryVerifyState.description(SalaryVerifyState.working)}</Option>
            <Option value={`${SalaryVerifyState.stoping}`}>{SalaryVerifyState.description(SalaryVerifyState.stoping)}</Option>
            <Option value={`${SalaryVerifyState.saving}`}>{SalaryVerifyState.description(SalaryVerifyState.saving)}</Option>
          </Select>,
        )),
      },
      {
        label: '申请创建日期',
        form: form => (form.getFieldDecorator('dateRange', { initialValue: dateRange })(
          <RangePicker />,
        )),
      },
    ];
    const props = {
      items,
      onReset: this.onReset,
      onSearch: this.onSearch,
      onHookForm: this.onHookForm,
      expand: true,
    };
    return (
      <CoreContent style={{ backgroundColor: '#FAFAFA' }}>
        <CoreSearch {...props} />
      </CoreContent>
    );
  };
}

export default Search;
