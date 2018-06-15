/**
 * 薪资列表
 */
import React, { Component } from 'react';
import is from 'is_js';
import { Select, Input, DatePicker } from 'antd';
import moment from 'moment';

import { CoreSearch, CoreContent } from '../../../../components/core';
import { authorize, system } from '../../../../application';
import { DutyState, SalaryPaymentState, KnightTypeWorkProperty } from '../../../../application/define';

const { Option } = Select;
const { RangePicker } = DatePicker;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: undefined,          // 搜索的form
      recordId: props.recordId, // 数据id
      search: {
        platform: props.platform ? [props.platform] : [],   // 平台
        city: props.city ? props.city.split(',') : [],                 // 城市
        district: [],     // 商圈
        name: [],         // 姓名
        dutyState: [],    // 在职状态
        paymentState: [], // 工资发放状态
        knightType: [],   // 骑士类型
        workProperty: undefined, // 工作类型
        dateRange: [],    // 申请创建日期
        updateRange: [],  // 更新时间
      },
      onSearch: props.onSearch,       // 搜索回调
      onDownload: props.onDownload,   // 下载文件回调
    };
  }

  // 重置
  onReset = () => {
    const { onSearch, recordId, search } = this.state;

    const params = {
      recordId,                   // 数据id
      platform: search.platform,  // 平台
      city: search.city, // 城市
      district: [],     // 商圈
      name: [],         // 姓名
      dutyState: [],    // 在职状态
      paymentState: [], // 工资发放状态
      knightType: [],   // 骑士类型
      workProperty: undefined, // 工作类型
      dateRange: [],    // 申请创建日期
      updateRange: [],  // 更新时间
    };

    // 重置搜索
    if (onSearch) {
      onSearch(params);
    }

    this.setState({ search: params });
  }

  // 搜索
  onSearch = (values) => {
    const { onSearch, recordId } = this.state;
    const { platform, city, district, name, dutyState, paymentState, knightType, workProperty, dateRange, updateRange } = values;
    const params = {
      recordId,
      platform,
      city,
      district,
      name,
      dutyState,
      paymentState,
      workProperty,
      page: 1,
      limit: 30,
    };

    // 判断如果工作状态选项选择，但是骑士类型没有选择，则默认设置数据为全部类型
    if (is.existy(workProperty) && is.not.empty(workProperty) && (is.empty(knightType) || is.not.existy(knightType))) {
      params.knightType = system.knightTypeByWorkProperty(workProperty).map((item) => { return item.id; });
    } else if (is.existy(knightType) && is.not.empty(knightType)) {
      params.knightType = [knightType];
    }

    // 判断薪资时间段
    if (dateRange && dateRange.length === 2) {
      params.dateRange = [
        moment(values.dateRange[0]).format('YYYY-MM-DD'),
        moment(values.dateRange[1]).format('YYYY-MM-DD'),
      ];
    }

    // 判断更新时间
    if (updateRange && updateRange.length === 2) {
      params.updateRange = [
        moment(values.updateRange[0]).format('YYYY-MM-DD'),
        moment(values.updateRange[1]).format('YYYY-MM-DD'),
      ];
    }

    if (onSearch) {
      onSearch(params);
    }
  }

  // 更换工作类型
  onChangeWorkProperty = (e) => {
    const { search, form } = this.state;
    search.knightType = undefined;
    search.workProperty = Number(e);
    form.setFieldsValue({ knightType: undefined });
    this.setState({ search });
  }

  // 骑士类型
  onChangeKnightType = (e) => {
    const { search } = this.state;
    search.knightType = e;
    this.setState({ search });
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 搜索功能
  render = () => {
    const { platform, city, district, name, dateRange, updateRange, dutyState, paymentState, workProperty, knightType } = this.state.search;
    // 城市
    const cityName = [];
    authorize.cities(platform).map((item) => {
      // 判断city是否是组数
      if (city instanceof Array) {
        city.forEach((cityId) => {
          if (item.id === cityId || item.id === city) {
            cityName.push(item.description);
          }
        });
      } else {
        if (item.id === city) {
          cityName.push(item.description);
        }
      }
    });
    const items = [
      {
        label: '平台',
        form: () => (authorize.platformNameById(platform)),
      },
      {
        label: '城市',
        form: form => (form.getFieldDecorator('city')(
          <div>{cityName.join('，')}</div>,
        )),
      },
      {
        label: '商圈',
        form: form => (form.getFieldDecorator('district', { initialValue: district })(
          <Select allowClear mode="multiple" showSearch optionFilterProp="children" placeholder="商圈" onChange={this.onChangeDistrict}>
            {
              authorize.districts(city).map((item, index) => {
                return <Option key={index} value={item.id}>{item.name}</Option>;
              })
            }
          </Select>,
        )),
      },
      {
        label: '姓名',
        form: form => (form.getFieldDecorator('name', { initialValue: name })(
          <Input placeholder="请填写姓名" />,
        )),
      },
      {
        label: '在职状态',
        form: form => (form.getFieldDecorator('dutyState', { initialValue: dutyState })(
          <Select allowClear placeholder="请选择在职状态">
            <Option value={`${DutyState.onDuty}`}>{DutyState.description(DutyState.onDuty)}</Option>
            <Option value={`${DutyState.onResignToApprove}`}>{DutyState.description(DutyState.onResignToApprove)}</Option>
            <Option value={`${DutyState.onResign}`}>{DutyState.description(DutyState.onResign)}</Option>
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
        label: '薪资发放状态',
        form: form => (form.getFieldDecorator('paymentState', { initialValue: paymentState })(
          <Select allowClear placeholder="请选择薪资发放状态" mode="multiple">
            <Option value={`${SalaryPaymentState.normal}`}>{SalaryPaymentState.description(SalaryPaymentState.normal)}</Option>
            <Option value={`${SalaryPaymentState.delayed}`}>{SalaryPaymentState.description(SalaryPaymentState.delayed)}</Option>
            <Option value={`${SalaryPaymentState.reissue}`}>{SalaryPaymentState.description(SalaryPaymentState.reissue)}</Option>
            <Option value={`${SalaryPaymentState.notPay}`}>{SalaryPaymentState.description(SalaryPaymentState.notPay)}</Option>
          </Select>,
        )),
      },
      {
        label: '薪资时间段',
        form: form => (form.getFieldDecorator('dateRange', { initialValue: dateRange })(
          <RangePicker />,
        )),
      },
      {
        label: '更新日期',
        form: form => (form.getFieldDecorator('updateRange', { initialValue: updateRange })(
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
