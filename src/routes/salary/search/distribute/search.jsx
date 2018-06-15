/**
 * 薪资发放
 */
import dot from 'dot-prop';
import moment from 'moment';
import React, { Component } from 'react';
import { Select, DatePicker, Button, message, Popconfirm } from 'antd';

import { CoreSearch, CoreContent } from '../../../../components/core';
import { authorize } from '../../../../application';
import { SalaryPaymentCricle, SalarySummaryState, KnightTypeWorkProperty } from '../../../../application/define';
import Operate from '../../../../application/define/operate';

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
      form: undefined,              // 搜索的form
      defaultPlatform: platform,    // 默认的平台参数
      search: {
        platform,           // 平台
        city: [],           // 城市
        position: [],       // 职位
        paymentCricle: [],  // 薪资计算周期
        dateRange: [],      // 薪资时间段
        updateRange: [],    // 更新时间
        work_type: '',      // 工作性质
      },
      onSearch: props.onSearch,       // 搜索回调
      onDownload: props.onDownload,   // 下载文件回调
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
      city: [],                   // 城市
      position: [],               // 职位
      paymentCricle: [],          // 薪资计算周期
      verifyState: [SalarySummaryState.success],  // 审核状态
      dateRange: [],      // 薪资时间段
      updateRange: [],    // 更新时间
      work_type: '',      // 工作性质
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
    const { platform, city, position, paymentCricle, dateRange, updateRange, work_type } = values;
    const params = {
      platform,
      city,
      position,
      paymentCricle,
      work_type,
      verifyState: [SalarySummaryState.success],
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

  // 下载文件
  onClickDownload = () => {
    const { form, onDownload } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const { platform, city, position, knightType, paymentCricle, produceState, dateRange, updateRange, work_type } = values;

      const params = {
        platform,
        city,
        position,
        knightType,
        paymentCricle,
        verifyState: [SalarySummaryState.success],
        produceState,
        work_type,
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

      if (onDownload) {
        onDownload(params);
      }
    });
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 搜索功能
  render = () => {
    const { platform, city, position, paymentCricle, dateRange, updateRange } = this.state.search;
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
          <Select allowClear showSearch optionFilterProp="children" placeholder="请选择城市" mode="multiple">
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
        form: form => (form.getFieldDecorator('work_type')(
          <Select allowClear placeholder="请选择工作性质" >
            <Option value={`${KnightTypeWorkProperty.fulltime}`}>{KnightTypeWorkProperty.description(KnightTypeWorkProperty.fulltime)}</Option>
            <Option value={`${KnightTypeWorkProperty.parttime}`}>{KnightTypeWorkProperty.description(KnightTypeWorkProperty.parttime)}</Option>
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
        label: '更新时间',
        form: form => (form.getFieldDecorator('updateRange', { initialValue: updateRange })(
          <RangePicker />,
        )),
      },
      {
        label: '薪资时间段',
        form: form => (form.getFieldDecorator('dateRange', { initialValue: dateRange })(
          <RangePicker />,
        )),
      },
    ];

    // 薪资发放，下载薪资单
    let operations = '';
    if (Operate.canOperateSalaryDistributeDownload()) {
      operations = (
        <Popconfirm title="创建下载任务？" onConfirm={this.onClickDownload} okText="确认" cancelText="取消">
          <Button>下载薪资单</Button>
        </Popconfirm>
      );
    }

    const props = {
      items,
      onReset: this.onReset,
      onSearch: this.onSearch,
      onHookForm: this.onHookForm,
      expand: true,
      operations,
    };
    return (
      <CoreContent style={{ backgroundColor: '#FAFAFA' }}>
        <CoreSearch {...props} />
      </CoreContent>
    );
  };
}

export default Search;
