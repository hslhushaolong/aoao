// 薪资发放
import React, { Component } from 'react';
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Table } from 'antd';

import { CoreContent } from '../../../../components/core';
import { SalarySummaryState, SalaryPaymentCricle, KnightTypeWorkProperty, renderReplaceAmount } from '../../../../application/define';
import { authorize } from '../../../../application';

import Search from './search';

class IndexPage extends Component {

  constructor(props) {
    super();
    this.state = {
      dataSource: dot.get(props, 'salaryModel.salarySummary', []),    // 汇总数据
      positionList: dot.get(props, 'salaryModel.positionList', []),   // 职位数据
    };
    this.private = {
      dispatch: props.dispatch,
      searchParams: {},   // 搜索的参数
    };
  }

  componentWillReceiveProps(props) {
    // 更新状态
    this.setState({
      dataSource: dot.get(props, 'salaryModel.salarySummary', []),
      positionList: dot.get(props, 'salaryModel.positionList', []),   // 职位数据
    });
  }

  // 下载文件
  onDownload = (params) => {
    this.private.dispatch({ type: 'salaryModel/createSalaryRecordsDownloadTask', payload: params });
  }

  // 搜索
  onSearch = (params) => {
    // 保存搜索的参数
    this.private.searchParams = params;

    // 调用搜索
    this.private.dispatch({ type: 'salaryModel/fetchSalarySummary', payload: params });
  }

  // 修改分页
  onChangePage = (page) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    this.onSearch(searchParams);
  }

  // 渲染搜索条件
  renderSearch = () => {
    const { onSearch, onDownload } = this;
    const props = {
      positionList: this.state.positionList,
    };
    return (
      <Search onSearch={onSearch} onDownload={onDownload} {...props} />
    );
  }

  // 渲染内容列表
  renderContent = () => {
    const { dataSource } = this.state;

    const columns = [{
      title: '更新时间',
      dataIndex: 'update_time',
      key: 'update_time',
      width: 100,
      fixed: 'left',
      render: (text) => {
        return moment(text).format('YYYY-MM-DD HH:mm');
      },
    }, {
      title: '薪资时间段',
      dataIndex: 'compute_time_slot',
      key: 'compute_time_slot',
      width: 100,
      fixed: 'left',
    }, {
      title: '城市',
      dataIndex: 'city_name_joint',
      key: 'city_name_joint',
      width: 80,
      fixed: 'left',
    }, {
      title: '职位',
      dataIndex: 'position_id',
      key: 'position_id',
      render: (text) => {
        return authorize.poistionNameById(text);
      },
      width: 80,
      fixed: 'left',
    }, {
      title: '工作性质',
      dataIndex: 'work_type',
      key: 'work_type',
      render: (text) => {
        return KnightTypeWorkProperty.description(text);
      },
    }, {
      title: '薪资计算周期',
      dataIndex: 'pay_salary_cycle',
      key: 'pay_salary_cycle',
      render: (text) => {
        return SalaryPaymentCricle.description(text);
      },
    }, {
      title: '人员数量',
      dataIndex: 'staff_count',
      key: 'staff_count',
    }, {
      title: '总单量',
      dataIndex: 'order_count',
      key: 'order_count',
    }, {
      title: '底薪总额／元',
      dataIndex: 'base_salary_total',
      key: 'base_salary_total',
      render: text => renderReplaceAmount(text),
    }, {
      title: '应发总额／元',
      dataIndex: 'real_pay_salary_total',
      key: 'real_pay_salary_total',
      render: text => renderReplaceAmount(text),
    }, {
      title: '人事扣款总额／元',
      dataIndex: 'human_affairs_deduction_total',
      key: 'human_affairs_deduction_total',
      render: text => renderReplaceAmount(text),
    }, {
      title: '实发总额／元',
      dataIndex: 'actual_pay_salary_total',
      key: 'actual_pay_salary_total',
      render: text => renderReplaceAmount(text),
    }, {
      title: '审核状态',
      dataIndex: 'state',
      key: 'state',
      render: (text) => {
        return SalarySummaryState.description(text);
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return (
          <div>
            <a target='_blank' href={`/#/Salary/Search/Records?id=${record._id}&platform=${record.platform_code}&city=${record.city_spelling}&canDelay=1`}>查看</a>
          </div>
        );
      },
    }];

    // 分页
    const pagination = {
      defaultPageSize: 30,                  // 默认数据条数
      onChange: this.onChangePage,          // 切换分页
      total: dot.get(dataSource, '_meta.result_count', 0), // 数据总条数
      showQuickJumper: true,                // 显示快速跳转
    };

    return (
      <CoreContent>
        {/* 数据 */}
        <Table rowKey={record => record._id} dataSource={dataSource.data} columns={columns} pagination={pagination} bordered scroll={{ x: 1000, y: 500 }} />
      </CoreContent>
    );
  }

  render() {
    const { renderSearch, renderContent } = this;
    return (
      <div>
        {/* 渲染搜索框 */}
        {renderSearch()}

        {/* 渲染内容栏目 */}
        {renderContent()}
      </div>
    );
  }
}

function mapStateToProps({ salaryModel }) {
  return { salaryModel };
}

export default connect(mapStateToProps)(Form.create()(IndexPage));
