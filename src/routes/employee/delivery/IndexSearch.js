/**
 * 工号管理列表页的搜索组件
 */
import React, { Component } from 'react';
import { Select, Input } from 'antd';

import { CoreSearch, CoreContent } from '../../../components/core';
import AllSelect from '../../../components/AllSelect';
import { authorize } from './../../../application';
import { numberType } from './define';
import { Position } from '../../../application/define';

const { Option } = Select;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: undefined,  // 搜索的form
      handleOptions: [],                    // 处理原因选项
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

  // 重置
  onReset = () => {
    // 处理原因重置
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

  // 搜索功能
  render = () => {
    const { platform, city } = this.state.search;
    const items = [
      {
        label: '姓名',
        form: form => (form.getFieldDecorator('name')(
          <Input placeholder="请输入姓名" />,
        )),
      },
      {
        label: '手机号',
        form: form => (form.getFieldDecorator('phone')(
          <Input placeholder="请输入手机号" />,
        )),
      },
      {
        label: '职位',
        form: form => (form.getFieldDecorator('position_id_list')(
          <Select placeholder="请选择职位" mode="multiple">
            <Option value={`${Position.postmanManager}`}>骑士长</Option>
            <Option value={`${Position.postman}`}>骑士</Option>
          </Select>,
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
        label: '运力状态',
        // 50100 正在运力 50200 等待运力
        form: form => (form.getFieldDecorator('transport_state_list')(
          <Select placeholder="请选择运力状态" mode="multiple">
            <Option value={numberType.capaciting.toString()} key="50100">正在运力</Option>
            <Option value={numberType.waitCapacity.toString()} key="50200">等待运力</Option>
          </Select>,
        )),
      },
      {
        label: '工号种类',
        // 50010 运力工号 50020替跑工号 50030正常工号
        form: form => (form.getFieldDecorator('transport_type_list', { initialValue: '50010' })(
          <Select placeholder="请选择工号种类" mode="multiple">
            <Option value={numberType.capacityNumber.toString()} key="50010">运力工号</Option>
            <Option value={numberType.runNumber.toString()} key="50020">替跑工号</Option>
            <Option value={numberType.normalNumber.toString()} key="50030">正常工号</Option>
          </Select>,
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
