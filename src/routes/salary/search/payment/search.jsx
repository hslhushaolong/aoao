/**
 * 薪资模板列表-补发、缓发明细
 */
import is from 'is_js';
import moment from 'moment';
import React, { Component } from 'react';
import { Select, DatePicker, Button, message } from 'antd';

import { CoreSearch, CoreContent } from '../../../../components/core';
import { authorize } from '../../../../application';
import { SalaryRecordState, SalaryPaymentState } from '../../../../application/define';
import Operate from '../../../../application/define/operate';

const { RangePicker } = DatePicker;
const { Option } = Select;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: undefined,  // 搜索的form
      search: {
        platform: [],     // 平台
        city: [],         // 城市
        district: [],     // 商圈
        position: [],     // 职位
        paymentState: [`${SalaryPaymentState.delayed}`, `${SalaryPaymentState.reissue}`], // 发放状态
        verifyState: [],  // 审核状态
        verifyDate: [],   // 审核时间
        date: [],         // 日期
      },
      onSearch: props.onSearch,       // 搜索回调
      onDownload: props.onDownload,   // 下载文件回调
      positionList: props.positionList, // 职位信息
    };
  }

  // 更换平台
  onChangePlatform = (e) => {
    const { form, search } = this.state;
    if (e.length <= 0) {
      search.platform = [];
      search.city = [];
      search.district = [];
      this.setState({ search });

      // 清空选项
      form.setFieldsValue({ city: [] });
      form.setFieldsValue({ district: [] });
      return;
    }

    // 保存平台参数
    search.platform = e;
    this.setState({ search });
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
    search.district = [e];
    this.setState({ search });
  }

  // 审核时间
  onChangeVerifyDate = (e) => {
    const { search } = this.state;
    search.verifyDate = e;
    this.setState({ search });
  }

  // 日期
  onChangeDate = (e) => {
    const { search } = this.state;
    search.date = e;
    this.setState({ search });
  }

  // 重置
  onReset = () => {
    const { onSearch } = this.state;

    const params = {
      platform: [],     // 平台
      city: [],         // 城市
      district: [],     // 商圈
      positions: [],     // 职位
      paymentState: [`${SalaryPaymentState.delayed}`, `${SalaryPaymentState.reissue}`], // 发放状态
      verifyState: [],  // 审核状态
      verifyDate: [],   // 审核时间
      date: [],         // 日期
    };

    // 重置搜索
    if (onSearch) {
      onSearch(params);
    }

    this.setState({ search: params });
  }

  // 搜索
  onSearch = (values) => {
    const { onSearch, search } = this.state;
    const { platform, city, district, positions, paymentState, verifyState } = values;
    const { verifyDate, date } = search;

    const params = {
      platform,
      city,
      district,
      positions,
      paymentState,
      verifyState,
      page: 1,
      limit: 30,
    };

    // 审核时间
    if (is.existy(verifyDate) && is.not.empty(verifyDate)) {
      params.verifyStartDate = moment(verifyDate[0]).format('YYYY-MM-DD');
      params.verifyEndDate = moment(verifyDate[1]).format('YYYY-MM-DD');
    }

    // 时间
    if (is.existy(date) && is.not.empty(date)) {
      params.startDate = moment(date[0]).format('YYYY-MM-DD');
      params.endDate = moment(date[1]).format('YYYY-MM-DD');
    }

    if (onSearch) {
      onSearch(params);
    }
  }

  // 下载文件
  onClickDownload = () => {
    const { form, onDownload, search } = this.state;
    const { verifyDate, date } = search;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { platform, city, district, positions, paymentState, verifyState } = values;

      const params = {
        platform,
        city,
        district,
        positions,
        verifyState,
        paymentState,
      };

      // 审核时间
      if (is.existy(verifyDate) && is.not.empty(verifyDate)) {
        params.verifyStartDate = moment(verifyDate[0]).format('YYYY-MM-DD');
        params.verifyEndDate = moment(verifyDate[1]).format('YYYY-MM-DD');
      }

      // 时间
      if (is.existy(date) && is.not.empty(date)) {
        params.startDate = moment(date[0]).format('YYYY-MM-DD');
        params.endDate = moment(date[1]).format('YYYY-MM-DD');
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
    const { platform, city, district, paymentState } = this.state.search;
    const items = [
      {
        label: '平台',
        form: form => (form.getFieldDecorator('platform', { initialValue: platform })(
          <Select allowClear placeholder="请选择平台" mode="multiple" onChange={this.onChangePlatform}>
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
          <Select allowClear optionFilterProp="children" placeholder="请选择城市" mode="multiple" onChange={this.onChangeCity}>
            {
              authorize.cities(platform).map((item, index) => {
                const key = item.id + index;
                return (<Option value={item.id} key={key}>{item.description}</Option>);
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
        form: form => (form.getFieldDecorator('positions')(
          <Select allowClear placeholder="请选择职位" mode="multiple">
            {
              this.state.positionList.map((item, index) => {
                const key = item.gid + index;
                return (<Option value={`${item.gid}`} key={`${key}`}>{item.name}</Option>);
              })
            }
          </Select>,
        )),
      },
      {
        label: '薪资发放状态',
        form: form => (form.getFieldDecorator('paymentState', { initialValue: paymentState, rules: [{ required: true, message: '请选择薪资发放状态' }] })(
          <Select mode="multiple" placeholder="请选择薪资发放状态">
            <Option value={`${SalaryPaymentState.delayed}`}>{SalaryPaymentState.description(SalaryPaymentState.delayed)}</Option>
            <Option value={`${SalaryPaymentState.paying}`}>{SalaryPaymentState.description(SalaryPaymentState.paying)}</Option>
            <Option value={`${SalaryPaymentState.reissue}`}>{SalaryPaymentState.description(SalaryPaymentState.reissue)}</Option>
          </Select>,
        )),
      },
      {
        label: '日期',
        form: form => (form.getFieldDecorator('date')(
          <RangePicker onChange={this.onChangeDate} />,
        )),
      },
    ];
    // v5.7.0 隐藏导出功能，后端接口已删除
    // let operations = '';
    // if (Operate.canOperateFinanceSalaryExcelButton()) {
    //   operations = (
    //     <Button onClick={this.onClickDownload}>导出EXCEL</Button>
    //   );
    // }
    const props = {
      items,
      onReset: this.onReset,
      onSearch: this.onSearch,
      onHookForm: this.onHookForm,
      expand: true,
      // operations,
    };

    return (
      <CoreContent style={{ backgroundColor: '#FAFAFA' }}>
        <CoreSearch {...props} />
      </CoreContent>
    );
  };
}

export default Search;
