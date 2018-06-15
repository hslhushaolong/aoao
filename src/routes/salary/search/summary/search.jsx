/**
 * 薪资模板列表
 */
import dot from 'dot-prop';
import moment from 'moment';
import React, { Component } from 'react';
import { Select, DatePicker } from 'antd';

import { CoreSearch, CoreContent } from '../../../../components/core';
import { authorize } from '../../../../application';
import { SalaryPaymentCricle, SalarySummaryState, SalarySummaryFlag, KnightTypeWorkProperty } from '../../../../application/define';

const { RangePicker } = DatePicker;
const { Option } = Select;

class Search extends Component {
  constructor(props) {
    super(props);

    // 默认获取当前账户的第一条平台数据
    let platform;
    if (dot.has(authorize.platform(), '0.id')) {
      platform = dot.get(authorize.platform(), '0.id');
    }

    this.state = {
      form: undefined,                 // 搜索的form
      defaultPlatform: platform,      // 默认的平台参数
      search: {
        platform,                     // 平台
        city: [],                     // 城市
        position: [],                 // 职位
        paymentCricle: [],            // 薪资计算周期
        workProperty: undefined,       // 工作性质
        flag: SalarySummaryFlag.finish, // 计算状态
        verifyState: [],              // 审核状态（生成薪资单的审核状态）
        dateRange: [],                // 申请创建日期
        updateRange: [],              // 更新时间
      },
      onSearch: props.onSearch,          // 搜索回调
      positionList: props.positionList,  // 职位信息
    };
  }
  // 更换平台
  onChangePlatform = (e) => {
    const { form, search } = this.state;
    search.platform = e;
    search.city = [];
    this.setState({ search });

    // 清空选项
    form.setFieldsValue({ city: [] });
  }

  // 重置
  onReset = () => {
    const { onSearch, defaultPlatform } = this.state;
    const params = {
      platform: defaultPlatform,  // 平台
      city: [],         // 城市
      position: [],     // 职位
      paymentCricle: [], // 薪资计算周期
      workProperty: undefined, // 工作类型
      flag: SalarySummaryFlag.finish, // 计算状态
      verifyState: [],  // 审核状态（生成薪资单的审核状态）
      dateRange: [],    // 薪资时间段
      updateRange: [],  // 更新时间
    };
    // 重置数据
    this.setState({ search: params });

    // 重置搜索
    if (onSearch) {
      params.platform = defaultPlatform;
      onSearch(params);
    }
  }

  // 搜索
  onSearch = (values) => {
    const { onSearch } = this.state;
    const { platform, city, position, paymentCricle, flag, verifyState, dateRange, updateRange, workProperty } = values;
    const params = {
      platform,
      city,
      position,
      paymentCricle,
      flag,
      verifyState,
      workProperty,
      page: 1,
      limit: 30,
    };

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

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }
  // 更换工作类型
  onChangeWorkProperty = (e) => {
    const { search } = this.state;
    search.workProperty = Number(e);
    this.setState({ search });
  }
  // 更换计算状态
  onChangeFlag = (e) => {
    const { search } = this.state;
    search.flag = e;
    this.setState({ search });
  }
  // 搜索功能
  render = () => {
    const { platform, city, position, paymentCricle, verifyState, dateRange, updateRange, workProperty } = this.state.search;
    const { positionList } = this.state;
    const items = [
      {
        label: '平台',
        form: form => (form.getFieldDecorator('platform', { initialValue: platform })(
          <Select placeholder="请选择平台" onChange={this.onChangePlatform}>
            {
              authorize.platform().map((item, index) => {
                const key = item.id + index;
                return (<Option value={`${item.id}`} key={key}>{item.name}</Option>);
              })
            }
          </Select>,
        )),
      },
      {
        label: '城市',
        form: form => (form.getFieldDecorator('city', { initialValue: city })(
          <Select
            allowClear
            placeholder="请选择城市"
            mode="multiple"
            // showSearch
            optionFilterProp="children"
          // filterOption={false}
          >
            {
              authorize.cities([platform]).map((item, index) => {
                const key = item + index;
                return (<Option value={`${item.id}`} key={key}>{item.description}</Option>);
              })
            }
          </Select>,
        )),
      },
      {
        label: '职位',
        form: form => (form.getFieldDecorator('position', { initialValue: position })(
          <Select allowClear placeholder="请选择职位" mode="multiple">
            {
              // positionList.filter(item => item.operable).map((item, index) => {
              positionList.map((item, index) => {
                const key = item.gid + index;
                return (<Option value={`${item.gid}`} key={key}>{item.name}</Option>);
              })
            }
          </Select>,
        )),
      },
      {
        label: '薪资计算周期',
        form: form => (form.getFieldDecorator('paymentCricle', { initialValue: paymentCricle })(
          <Select allowClear placeholder="请选择薪资计算周期" mode="multiple">
            <Option value={`${SalaryPaymentCricle.month}`}>{SalaryPaymentCricle.description(SalaryPaymentCricle.month)}</Option>
            <Option value={`${SalaryPaymentCricle.halfMonth}`}>{SalaryPaymentCricle.description(SalaryPaymentCricle.halfMonth)}</Option>
            <Option value={`${SalaryPaymentCricle.week}`}>{SalaryPaymentCricle.description(SalaryPaymentCricle.week)}</Option>
            <Option value={`${SalaryPaymentCricle.daily}`}>{SalaryPaymentCricle.description(SalaryPaymentCricle.daily)}</Option>
            <Option value={`${SalaryPaymentCricle.period}`}>{SalaryPaymentCricle.description(SalaryPaymentCricle.period)}</Option>
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
        label: '计算状态',
        form: form => (form.getFieldDecorator('flag', { initialValue: `${SalarySummaryFlag.finish}` })(
          <Select placeholder="请选择计算状态" onSelect={this.onChangeFlag} >
            <Option value={`${SalarySummaryFlag.finish}`}>{SalarySummaryFlag.description(SalarySummaryFlag.finish)}</Option>
            <Option value={`${SalarySummaryFlag.process}`}>{SalarySummaryFlag.description(SalarySummaryFlag.process)}</Option>
          </Select>,
        )),
      },
      {
        label: '审核状态',
        tips: '薪资单汇总的审核状态',
        form: form => (form.getFieldDecorator('verifyState', { initialValue: verifyState })(
          <Select allowClear placeholder="请选择审核状态" mode="multiple">
            <Option value={`${SalarySummaryState.waiting}`}>{SalarySummaryState.description(SalarySummaryState.waiting)}</Option>
            <Option value={`${SalarySummaryState.pendding}`}>{SalarySummaryState.description(SalarySummaryState.pendding)}</Option>
            <Option value={`${SalarySummaryState.success}`}>{SalarySummaryState.description(SalarySummaryState.success)}</Option>
            <Option value={`${SalarySummaryState.failure}`}>{SalarySummaryState.description(SalarySummaryState.failure)}</Option>
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
