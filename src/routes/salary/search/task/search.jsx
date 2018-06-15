/**
 * 薪资更新任务
 */
import dot from 'dot-prop';
import moment from 'moment';
import React, { Component } from 'react';
import { Select, DatePicker } from 'antd';

import { CoreSearch, CoreContent } from '../../../../components/core';
import { authorize, system } from '../../../../application';
import { SalaryPaymentCricle, SalaryTaskState, KnightTypeWorkProperty } from '../../../../application/define';

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
      form: undefined,  // 搜索的form
      defaultPlatform: platform,  // 默认的平台参数
      search: {
        platform,           // 平台
        city: [],           // 城市
        district: [],     // 商圈
        position: [],       // 职位
        knightType: [],     // 骑士类型
        paymentCricle: [],  // 薪资计算周期
        state: [],          // 更新状态
        dateRange: [],      // 申请创建日期
        workProperty: undefined,   // 工作性质
      },
      onSearch: props.onSearch,       // 搜索回调
      onDownload: props.onDownload,   // 下载文件回调
      positionList: props.positionList,  // 职位list
    };
  }
  // update
  componentWillReceiveProps(props) {
    this.setState({
      positionList: props.positionList,  // 职位list
    });
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

  // 重置
  onReset = () => {
    const { onSearch, defaultPlatform } = this.state;
    const params = {
      platform: defaultPlatform,  // 平台
      city: [],         // 城市
      district: [],     // 商圈
      position: [],     // 职位
      knightType: [],   // 骑士类型
      paymentCricle: [], // 薪资计算周期
      state: [],          // 更新状态
      dateRange: [],    // 申请创建日期
      workProperty: undefined, // 工作性质
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
    const { platform, city, district, position, knightType, paymentCricle, state, dateRange, workProperty } = values;
    const params = {
      platform,
      city,
      district,
      position,
      knightType,
      paymentCricle,
      workProperty,
      state,
      page: 1,
      limit: 30,
      startDate: dot.has(dateRange, '0') ? moment(values.dateRange[0]).format('YYYY-MM-DD') : '',
      endDate: dot.has(dateRange, '1') ? moment(values.dateRange[1]).format('YYYY-MM-DD') : '',
    };
    if (onSearch) {
      onSearch(params);
    }
  }

  // 更换工作性质
  onChangeWorkProperty = (e) => {
    const { search, form } = this.state;
    search.knightType = undefined;
    search.workProperty = Number(e);
    form.setFieldsValue({ knightType: undefined });
    this.setState({ search });
  }

  // 骑士类型
  onChangeKnightType = (e) => {
    const { form, search } = this.state;
    search.knightType = e;
    // 判断是否是兼职类型，如果不是兼职类型，则重置数据
    if (system.knightTypeById(e).includes('兼职') === false) {
      search.paymentCricle = [];
      form.setFieldsValue({ paymentCricle: [] });
    }

    // 判断是否是全职类型，如果不是全职类型，则重置数据
    if (system.knightTypeById(e).includes('全职') === false) {
      search.produceState = [];
      form.setFieldsValue({ produceState: [] });
    }

    this.setState({ search });
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 搜索功能
  render = () => {
    const { platform, city, district, position, knightType, paymentCricle, state, dateRange, workProperty } = this.state.search;
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
          <Select allowClear optionFilterProp="children" placeholder="请选择城市" mode="multiple" onChange={this.onChangeCity}>
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
        label: '商圈',
        form: form => (form.getFieldDecorator('district', { initialValue: district })(
          <Select allowClear optionFilterProp="children" placeholder="商圈" mode="multiple" onChange={this.onChangeDistrict}>
            {
              authorize.districts(city).map((item, index) => {
                return <Option key={index} value={item.id}>{item.name}</Option>;
              })
            }
          </Select>,
        )),
      },
      {
        label: '职位',
        form: form => (form.getFieldDecorator('position', { initialValue: position })(
          <Select allowClear optionFilterProp="children" placeholder="请选择职位" mode="multiple">
            {
              this.state.positionList.map((item, index) => {
                const key = item.gid + index;
                return (<Option value={`${item.gid}`} key={key}>{item.name}</Option>);
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
        label: '更新状态',
        form: form => (form.getFieldDecorator('state', { initialValue: state })(
          <Select allowClear placeholder="请选择更新状态">
            <Option value={`${SalaryTaskState.waiting}`}>{SalaryTaskState.description(SalaryTaskState.waiting)}</Option>
            <Option value={`${SalaryTaskState.working}`}>{SalaryTaskState.description(SalaryTaskState.working)}</Option>
            <Option value={`${SalaryTaskState.finish}`}>{SalaryTaskState.description(SalaryTaskState.finish)}</Option>
          </Select>,
        )),
      },
      {
        label: '创建日期',
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
