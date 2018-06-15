/**
 * 分析报表功能
 */
import { connect } from 'dva';
import dot from 'dot-prop';
import React, { Component } from 'react';
import { Table, DatePicker } from 'antd';
import moment from 'moment';
import { CoreContent } from '../../../components/core';
import { renderReplaceAmount } from '../../../application/define';

const { MonthPicker } = DatePicker;

class Index extends Component {
  constructor(props) {
    super();
    this.state = {
      list: dot.get(props, 'analysis.budgetData', {}),
    };
    this.private = {
      searchParams: {
        page: 1,
        date: Number(moment().format('YYYYMM')),
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      list: dot.get(nextProps, 'analysis.budgetData', {}),
    });
  }

  // 修改分页
  onChangePage = (page) => {
    const { dispatch } = this.props;
    const { searchParams } = this.private;
    searchParams.page = page;
    dispatch({ type: 'analysis/fetchBudgetData', payload: searchParams });
  }
  // 商圈预估利润
  onChangeSalaryIndex = (month) => {
    const { dispatch } = this.props;
    const { searchParams } = this.private;
    // 后端参数如此
    if (month) {
      searchParams.date = Number(moment(month).format('YYYYMM'));
    }
    searchParams.page = 1;
    dispatch({ type: 'analysis/fetchBudgetData', payload: searchParams });
    this.setState({
      searchParams,
    });
  }
  // 禁选
  disabledDate = (current) => {
    return current && current.valueOf() > moment().valueOf();
  }

  // 渲染列表
  renderContent = () => {
    const { list } = this.state;
    const dataSource = dot.get(list, 'data', []);

    const columns = [{
      title: '平台',
      dataIndex: 'platform_name',
      key: 'platform_name',
    }, {
      title: '供应商',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
    }, {
      title: '城市',
      dataIndex: 'city_name_joint',
      key: 'city_name_joint',
    }, {
      title: '商圈',
      dataIndex: 'biz_district_name',
      key: 'biz_district_name',
    }, {
      title: '预估收入（元）',
      dataIndex: 'forecast_income_amount',
      key: 'forecast_income_amount',
      render: (text) => { return renderReplaceAmount(text); },
    }, {
      title: '预估工资成本（元）',
      dataIndex: 'forecast_salary_amount',
      key: 'forecast_salary_amount',
      render: (text) => { return renderReplaceAmount(text); },
    }, {
      title: '预估费用成本（元）',
      dataIndex: 'forecast_cost_amount',
      key: 'forecast_cost_amount',
      render: (text) => { return renderReplaceAmount(text); },
    }, {
      title: '预估利润（元）',
      dataIndex: 'forecast_profit_amount',
      key: 'forecast_profit_amount',
      render: (text) => { return renderReplaceAmount(text); },
    }];

    // 分页
    const pagination = {
      current: this.private.searchParams.page,
      defaultPageSize: 30,          // 默认数据条数
      onChange: this.onChangePage,  // 切换分页
      showTotal: (total) => { return `总共 ${total} 条，30条/页 `; },
      total: dot.get(list, '_meta.result_count', 0),  // 数据总条数
      showQuickJumper: true,        // 显示快速跳转
    };
    // 扩展的标题插件（用于选择月份）
    const titleExt = (
      <MonthPicker defaultValue={moment()} disabledDate={this.disabledDate} format="YYYY-MM" onChange={this.onChangeSalaryIndex} placeholder="请选择月份" />
    );
    return (
      <CoreContent style={{ backgroundColor: '#FAFAFA' }} title="商圈预估利润表" titleExt={titleExt}>
        <Table rowKey={(record, index) => { return index; }} dataSource={dataSource} columns={columns} pagination={pagination} bordered />
      </CoreContent>
    );
  }

  render() {
    const { renderContent } = this;
    return (
      <div>
        {renderContent()}
      </div>);
  }
}

const mapStateToProps = ({ analysis }) => {
  return { analysis };
};

export default connect(mapStateToProps)(Index);
