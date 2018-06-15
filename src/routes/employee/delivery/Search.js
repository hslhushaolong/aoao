/**
 * 工号管理列编辑页的搜索组件
 */
import { connect } from 'dva';
import moment from 'moment';
import React, { Component } from 'react';
import { Select, DatePicker, Input } from 'antd';

import { CoreSearch, CoreContent } from '../../../components/core';
import AllSelect from '../../../components/AllSelect';
import { authorize } from './../../../application';
import { Position, JobCategory } from './../../../application/define';
import dot from 'dot-prop';

const { RangePicker } = DatePicker;
const { Option } = Select;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: undefined,  // 搜索的form
      handleOptions: [],                    // 处理原因选项
      isDetail: dot.get(props, 'isDetail', false),   // 是否是详情页
      search: {
        position: [],     // 职位
        jobCategory: [],  // 职位类型
        platform: [],     // 平台
        city: [],         // 城市
        district: [],     // 商圈
        dateRange: [],    // 申请创建日期
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isDetail: dot.get(nextProps, 'isDetail', false),
    });
  }

  // 重置
  onReset = () => {
    this.state.form.resetFields(['handling_reason']);
  }

  // 搜索
  onSearch = (values) => {
    this.props.searchHandle(values);
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 改变平台
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
    form.setFieldsValue({ city: [] });
    form.setFieldsValue({ district: [] });
    // 保存平台参数
    search.platform = e;
    this.setState({ search });
  }

  // 改变城市
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
    form.setFieldsValue({ district: [] });
    // 保存城市参数
    search.city = e;
    this.setState({ search });
  }

  // 改变商圈
  onChangeDistrict = (e) => {
    const { search } = this.state;
    search.district = [e];
    this.setState({ search });
  }

  // 详情页时间不可选
  disabledDate = (current) => {
    if (this.state.isDetail) {
      return false;
    }
    if (current.month() !== moment().month()) {
      return true;
    }
  }

  // 搜索功能
  render = () => {
    const { platform, city, dateRange } = this.state.search;
    const items = [
      {
        label: '姓名',
        form: form => (form.getFieldDecorator('name')(
          <Input placeholder="请输入姓名" onChange={this.onChangeName} />,
        )),
      },
      {
        label: '手机号',
        form: form => (form.getFieldDecorator('phone')(
          <Input placeholder="请输入手机号" onChange={this.onChangePhone} />,
        )),
      },
      {
        label: '平台',
        form: form => (form.getFieldDecorator('platform')(
          <Select placeholder="请选择平台" mode="multiple" onChange={this.onChangePlatform}>
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
        form: form => (form.getFieldDecorator('city')(
          <AllSelect placeholder="请选择城市" mode="multiple" onChange={this.onChangeCity}>
            {
              authorize.cities(platform).map((item, index) => {
                const key = item + index;
                return (<Option value={item.id} key={key}>{item.description}</Option>);
              })
            }
          </AllSelect>,
        )),
      },
      {
        label: '商圈',
        form: form => (form.getFieldDecorator('district')(
          <AllSelect placeholder="商圈" mode="multiple" onChange={this.onChangeDistrict}>
            {
              authorize.districts(city).map((item, index) => {
                return <Option key={index} value={item.id}>{item.name}</Option>;
              })
            }
          </AllSelect>,
        )),
      },
      {
        label: '申请创建日期',
        form: form => (form.getFieldDecorator('dateRange', { initialValue: dateRange })(
          <RangePicker disabledDate={this.disabledDate} />,
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
