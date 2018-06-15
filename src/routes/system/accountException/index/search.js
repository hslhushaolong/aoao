/**
 * 搜索组件
 */

import React, { Component } from 'react';
import { Select, DatePicker, Input } from 'antd';
import moment from 'moment';

import { CoreSearch, CoreContent } from '../../../../components/core';
import { Position } from '../../../../application/define';
import { authorize } from '../../../../application';

const { RangePicker } = DatePicker;
const { Option } = Select;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: undefined,                // 搜索的form

      remindDate: this.props.remindDate, // 提醒时间
      handleOptions: [],             // 处理原因选项
      platform: props.platform,      // 平台
      cityList: [],                  // 城市
    };
  }

  // 改变异常职位原因
  onChangeErrReason=(value) => {
    this.state.form.resetFields(['handling']);
    if (value == 408001) {  // 所属平台骑士状态不符
      this.setState({
        handleOptions: [
          { value: 40010, name: '骑士实际已入职，立即补充入职流程' },
          { value: 40020, name: '骑士实际已离职，稍后关闭所属平台账号' },
          { value: 40030, name: '骑士实际已离职，平台账号标记运力工号' },
          { value: 40040, name: '骑士实际已离职，关闭系统账号' },
          { value: 40090, name: '其他原因暂时无法处理' },
        ],
      });
    } else if (value == 408002) {  // 不活跃账号
      this.setState({
        handleOptions: [
          { value: 40050, name: '骑士实际离职，BOSS系统状态转为离职，稍后关闭所属平台账号' },
          { value: 40060, name: '骑士实际离职，BOSS系统状态转为离职，账号划分为运力工号' },
          { value: 40070, name: '骑士请假中，BOSS系统状态不变，账号暂时划分为运力工号' },
          { value: 40080, name: '骑士请假中，BOSS系统状态和账号无操作' },
          { value: 40090, name: '其他原因暂时无法处理' },
        ],
      });
    } else {
      this.setState({
        handleOptions: [
          { value: 40010, name: '骑士实际已入职，立即补充入职流程' },
          { value: 40090, name: '其他原因暂时无法处理' },
        ],
      });
    }
    this.setState({
      error_reason: value,
    });
  }

  // 切换供应商
  onChangeSupplier = (e) => {

  }
  // 切换平台
  onChangePlatform = (e) => {
    this.setState({
      platform: [e],
    });
  }
  // 切换城市
  onChangeCity = (e) => {
    this.setState({
      cityList: e,
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

  // 搜索功能
  render = () => {
    const { platform, cityList } = this.state;

    const supplier = [];
    // 超管暂无供应商
    const flag = authorize.account.supplierId !== '' && authorize.account.supplierId !== undefined;
    if (flag) {
      supplier.push({ id: authorize.account.supplierId, name: authorize.account.supplierName });
    }

    const items = [
      {
        label: '供应商',
        form: form => (form.getFieldDecorator('supplier_id')(
          <Select allowClear showSearch placeholder="全部" onChange={this.onChangeSupplier}>
            {
              supplier.map((item, index) => {
                const key = item.id + index;
                return (<Option value={item.id} key={key}>{item.name}</Option>);
              })
            }
          </Select>,
        )),
      },
      {
        label: '平台',
        form: form => (form.getFieldDecorator('platform_code')(
          <Select showSearch placeholder="请选择平台" onChange={this.onChangePlatform}>
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
        form: form => (form.getFieldDecorator('city_spelling_list')(
          <Select allowClear showSearch optionFilterProp="children" placeholder="全部" mode="multiple" onChange={this.onChangeCity} >
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
        form: form => (form.getFieldDecorator('biz_district_list')(
          <Select allowClear showSearch optionFilterProp="children" placeholder="全部" mode="multiple" >
            {
              authorize.districts(cityList).length > 0 && authorize.districts(cityList).map((item, index) => {
                const key = item.id + index;
                return (<Option value={item.id} key={key}>{item.name}</Option>);
              })
            }
          </Select>,
        )),
      },
      {
        label: '提醒时间',
        form: form => (form.getFieldDecorator('remind_date', { initialValue: [moment(this.state.remindDate, 'YYYY-MM-DD'), moment(this.state.remindDate, 'YYYY-MM-DD')] })(
          <RangePicker />,
        )),
      },
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
        label: '职位',
        form: form => (form.getFieldDecorator('position_id')(
          <Select allowClear placeholder="请选择职位" mode="multiple" onChange={this.onChangePosition}>
            <Option value={`${Position.postmanManager}`}>骑士长</Option>
            <Option value={`${Position.postman}`}>骑士</Option>
          </Select>,
        )),
      },
      {
        label: '异常原因',
        form: form => (form.getFieldDecorator('error_reason')(
          <Select allowClear placeholder="请选择异常原因" onChange={this.onChangeErrReason}>
            <Option value={408001} key="408001">所属平台骑士状态不符</Option>
            <Option value={408002} key="408002">不活跃账号</Option>
            <Option value={408003} key="408003">不存在账号</Option>
          </Select>,
        )),
      },
      {
        label: '处理方式',
        form: form => (form.getFieldDecorator('handling')(
          <Select allowClear placeholder="请选择处理方式" mode="multiple">
            {this.state.handleOptions.map(item => (
              <Option value={item.value} key={item.value}>{item.name}</Option>
            ))}
          </Select>,
        )),
      },
      {
        label: '处理完成时间',
        form: form => (form.getFieldDecorator('handle_date')(
          <RangePicker />,
        )),
      },
      {
        label: '处理状态',
        form: form => (form.getFieldDecorator('handle_state')(
          <Select allowClear placeholder="请选择异常原因" mode="multiple">
            <Option value={1} key="1">未处理</Option>
            <Option value={2} key="2">已标记待处理</Option>
            <Option value={3} key="3">已标记未处理</Option>
            <Option value={4} key="4">已处理</Option>
          </Select>,
        )),
      },
    ];
    const props = {
      items,
      onReset: this.onReset,
      onSearch: this.onSearch,
      onHookForm: this.onHookForm,
    };
    return (
      <CoreContent style={{ backgroundColor: '#FAFAFA' }}>
        <CoreSearch {...props} />
      </CoreContent>
    );
  };
}

export default Search;
