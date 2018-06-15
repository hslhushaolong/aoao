/**
 * 人事扣款，审核，查询
 */
import dot from 'dot-prop';
import is from 'is_js';
import { connect } from 'dva';
import moment from 'moment';
import React, { Component } from 'react';
import { Select, DatePicker, message } from 'antd';

import { CoreSearch, CoreContent } from '../../../../../../components/core';
import { authorize } from '../../../../../../application';
import { SalaryKnightState } from '../../../../../../application/define';

const { MonthPicker } = DatePicker;
const { Option } = Select;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: undefined,         // 搜索的form
      supplierId: '', // 供应商id
      platform: props.platform_code, // 平台code
      cityList: '', // 城市列表
      submitState: props.submit_state,  // 完成状态
      startMonth: '',                   // 扣款月份
      endMonth: '',                     // 扣款月份
    };
  }

  componentWillReceiveProps = () => {
  }

  // 选择供应商
  onChangeSupplier = () => {

  }

  // 选择平台
  onChangePlatform = (e) => {
    this.setState({
      platform: e,
    });
    this.state.form.setFieldsValue({ city_spelling_list: [] });
  }
  // onChangeMonthStart
  onChangeMonthStart = (date, dateString) => {
    this.setState({
      startMonth: dateString,
    });
  }
  // onChangeMonthEnd
  onChangeMonthEnd = (date, dateString) => {
    this.setState({
      endMonth: dateString,
    });
  }
  // 扣款月份限制可选范围6个月-开始时间
  onDisabledStartMouth = (current) => {
    const { endMonth } = this.state;
    if (endMonth !== '') {
      // 开始月份禁选: endMonth -6
      return current && ((current.valueOf() < moment(endMonth).subtract(6, 'M').valueOf()) || (current.valueOf() > moment(endMonth).valueOf()));
    }
  }
  // 结束时间
  onDisabledEndMouth = (current) => {
    const { startMonth } = this.state;
    if (startMonth !== '') {
      // 结束月份禁选: startMonth +6
      return current && ((current.valueOf() > moment(startMonth).add(6, 'M').valueOf()) || (current.valueOf() < moment(startMonth).valueOf()));
    }
  }
  // 重置
  onReset = () => {
    this.setState({
      supplierId: '', // 供应商
      platform: this.props.platform_code,    // 默认平台
      cityList: '', // 城市列表
      submitState: this.props.submit_state,  // 完成状态
      startMonth: '',         // 扣款月份
      endMonth: '',           // 扣款月份
    });
    // 刷新列表
    this.props.searchHandle();
  }

  // 搜索条件
  onSearch = (values) => {
    const params = values;
    const { startMonth, endMonth } = this.state;
    // 两个日期
    let date1 = startMonth;
    let date2 = endMonth;
    // 拆分年月日
    date1 = date1.split('-');
    // 得到月数
    date1 = parseInt(date1[0]) * 12 + parseInt(date1[1]);
    // 拆分年月日
    date2 = date2.split('-');
    // 得到月数
    date2 = parseInt(date2[0]) * 12 + parseInt(date2[1]);

    if (Math.abs(date1 - date2) > 6) {
      message.info('扣款月份最大范围是6个月');
    }
    // 参数
    if (is.existy(values.mouthRangeL)) {
      params.startMonth = startMonth;
    }
    if (is.existy(values.mouthRangeL)) {
      params.endMonth = endMonth;
    }
    this.props.searchHandle(params);
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }
  // 渲染检索条件
  renderSearch = () => {
    const { platform } = this.state;
    const supplier = [];
    // 超管暂无供应商
    const flag = authorize.account.supplierId !== '' && authorize.account.supplierId !== undefined;
    if (flag) {
      supplier.push({ id: authorize.account.supplierId, name: authorize.account.supplierName });
    }
    const items = [
      // 后期会用
      // {
      //   label: '供应商',
      //   form: form => (form.getFieldDecorator('supplier_id', { initialValue: dot.get(supplier, '0.id') })(
      //     <Select showSearch placeholder="请选择供应商" onChange={this.onChangeSupplier}>
      //       {
      //         supplier.map((item, index) => {
      //           const key = item.id + index;
      //           return (<Option value={item.id} key={key}>{item.name}</Option>);
      //         })
      //       }
      //     </Select>,
      //   )),
      // },
      {
        label: '平台',
        form: form => (form.getFieldDecorator('platform_code', { initialValue: platform })(
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
              authorize.cities([platform]).map((item, index) => {
                const key = item.id + index;
                return (<Option value={item.id} key={key}>{item.description}</Option>);
              })
            }
          </Select>,
        )),
      },
      {
        label: '完成状态',
        form: form => (form.getFieldDecorator('submit_state')(
          <Select showSearch placeholder="请选择完成状态" style={{ width: '100%' }} >
            <Option value={`${SalaryKnightState.unfinished}`}>{SalaryKnightState.description(SalaryKnightState.unfinished)}</Option>
            <Option value={`${SalaryKnightState.finished}`}>{SalaryKnightState.description(SalaryKnightState.finished)}</Option>
          </Select>,
        )),
      },
      {
        label: '扣款月份',
        form: form => (form.getFieldDecorator('mouthRangeL')(
          <MonthPicker style={{ width: '100%' }} onChange={this.onChangeMonthStart} disabledDate={this.onDisabledStartMouth} placeholder="请选择扣款开始月份" />,
        )),
      },
      {
        label: '',
        form: form => (form.getFieldDecorator('mouthRangeR')(
          <MonthPicker style={{ width: '100%' }} onChange={this.onChangeMonthEnd} disabledDate={this.onDisabledEndMouth} placeholder="请选择扣款结束月份" />,
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
  }

  render() {
    return (
      <div>
        {/* 渲染检索项 */}
        {this.renderSearch()}
      </div>
    );
  }
}
const mapStateToProps = ({ salaryModel }) => {
  return { salaryModel };
};
export default connect(mapStateToProps)(Search);
